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
        nextWord: firstWord.original,
        totalScore: 0,
        wordCorrectCount: 0,
        wordIncorrectCount: 0,
      };


      res
        .status(200)
        .json(resObj);

      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {

    try {
      
      /**
       * 1:) getting the content from the database
       * 
       * 2:) find out what the correct head is
       * 
       * 3:) -----get the guess into-----
       * 
       * 4:) -----error check _guess_ to see if(!guess)-----
       * 
       * 5:) -----compare _guess_ to the translated word of the current head.value-----
       * 
       * 6:) if correct ++ _correctCount_ && _totalScore_
       *        else
       *        ++ _incorrectCount_ 
       * 
       * 7:) head = head.next (how)
       *   
       * 8:) build response object 
       * 
       * 9:) then send?
       * 
       */

      const { guess } = req.body;

      if (!guess) {
        return res
          .status(400).json({ error: 'Missing \'guess\' in request body' });
      }

      
      const wordsList = await LanguageService.populateLinkedList(
        req.app.get('db'),
        req.language.id,
        req.language.head
      );        

      if( wordsList.head.value.translation.toLowerCase() === guess.toLowerCase() ){
        req.language.total_score++;
        wordsList.head.value.correct_count++;
        wordsList.head.value.memory_value *= 2; 
        LanguageService.updateCorrect(
          req.app.get('db'),
          wordsList.head.value.id,
          wordsList.head.value.correct_count
        );
      }
      else{
        wordsList.head.value.incorrect_count++;
        wordsList.head.value.memory_value = 1;
        LanguageService.updateIncorrect(
          req.app.get('db'),
          wordsList.head.value.id,
          wordsList.head.value.incorrect_count
        );
      }

      const movingBack = wordsList.head.value;

      wordsList.head = wordsList.head.next;

      wordsList.insertAt(movingBack.memory_value - 1, movingBack);

      if(wordsList.head.value !== null){
        req.language.head = wordsList.head.value.id; 
      }
      else{
        req.language.head = 1;
      }

      LanguageService.updateHead(
        req.app.get('db'),
        req.language.id,
        req.language.head
      );

      LanguageService.updateWithLinkedList(
        req.app.get('db'),
        wordsList
      );
      
      const resObj = {
        nextWord:  wordsList.head.value.original,
        wordCorrectCount:  wordsList.head.value.correct_count,
        wordIncorrectCount: wordsList.head.value.incorrect_count ,
        totalScore: req.language.total_score,
        answer: wordsList.head.value.translation ,
        isCorrect: (wordsList.head.value.translation === guess),
      };

      res.status(200).json(resObj);

      next();

    } catch (e) {
      next(e);
    }
  });

module.exports = languageRouter;
