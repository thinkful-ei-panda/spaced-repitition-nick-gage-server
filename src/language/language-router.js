const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('../middleware/linkedList');

const jsonBodyParser = express.json();
const languageRouter = express.Router();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      );

      if (!language)
        return res.status(404).json({
          error: 'You don\'t have any languages',
        });

      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );

      res.json({
        language: req.language,
        words,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/head', jsonBodyParser, async (req, res, next) => {
    try {      
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      );
      const firstWord = words[0];

      const resObj = {
        nextWord : firstWord.next ,
        totalScore : 0,
        wordCorrectCount : 0,
        wordIncorrectCount : 0,
      };


      console.log(resObj);
      res
        .status(200)
        .json(resObj);

      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', jsonBodyParser ,async  (req, res, next) => {
    try{
      
      const {guess} = req.body;
      
      const linkedList = new LinkedList;
      
      const wordsList = await LanguageService.populateLinkedList(
        req.app.get('db'),
        req.language.id,
      );

      wordsList.map(word => linkedList.insertLast(word));  

      console.log( linkedList.head.value);
      
      

      await LanguageService.ifIsCorrect(
        req.app.get('db'),
        (linkedList.head.value.translation === guess),
        linkedList.head.value.id
      );



      /**
       * {
       * "nextWord": "test-next-word-from-generic-guess",
       * "wordCorrectCount": 777,
       * "wordIncorrectCount": 777,
       * "totalScore": 777,
       * "answer": "test-answer-from-generic-guess",
       * "isCorrect": true
      *}
       */

      res.status(200).json(linkedList);

      next();
    }catch (e){
      next(e);
    }
  });

module.exports = languageRouter;
