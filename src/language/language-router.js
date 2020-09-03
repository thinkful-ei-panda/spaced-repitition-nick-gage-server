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
      const word = await LanguageService.getNextWord(
        req.app.get('db'),
        req.user.id
      );

      const resObj = {
        nextWord: word.original,
        totalScore: word.total_score,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
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
    const { guess } = req.body;
    let language = req.language;

    if (!guess) {
      return res
        .status(400).json({ error: 'Missing \'guess\' in request body' });
    }

    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        language.id
      );

      const ll = await LanguageService.populateLinkedList(words);

      let isCorrect;
      let prevHead = ll.head.value;
      let newNode = prevHead;

      if (newNode.translation === guess) {
        isCorrect = true;
        language.total_score++;
        newNode.correct_count++;

        let mem_val = newNode.memory_value * 2;
        newNode.memory_value = Math.min(mem_val, words.length);
      } else {
        isCorrect = false;
        newNode.incorrect_count++;
        newNode.memory_value = 1;
      }

      ll.remove(prevHead);
      ll.insertAt(newNode.memory_value, newNode);

      language.head = ll.head.value.id;

      await LanguageService.updateDb(
        req.app.get('db'),
        language,
        ll,
        req.user.id
      );

      let nextWord = await LanguageService.getNextWord(
        req.app.get('db'),
        req.user.id
      );

      const resObj = {
        nextWord: nextWord.original,
        totalScore: nextWord.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        answer: prevHead.translation,
        isCorrect
      };

      res.json(resObj);
    } catch (e) {
      next(e);
    }
  });

module.exports = languageRouter;
