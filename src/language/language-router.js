const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

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
      console.log(req.language);
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
      const { next_id } = req.body;

      const nextWord = await LanguageService.getNextInfo(
        req.app.get('db'),
        next_id
      );

      const wordObj = {
        nextWord: nextWord.original,
        totalScore: nextWord.lang.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
      };

      res
        .status(200)
        .json(wordObj);

      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!');
  });

module.exports = languageRouter;
