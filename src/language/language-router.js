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
      console.log(words);
      res
        .status(200)
        .json(firstWord);

      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', jsonBodyParser ,async  (req, res, next) => {
  

    res.status(202).send('implement me!');
  });

module.exports = languageRouter;
