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
  .get('/head/:next_id', jsonBodyParser, async (req, res, next) => {
    try {
      const { next_id } = req.params;

      
      const nextWord = await LanguageService.getNextInfo(
        req.app.get('db'),
        next_id
      );
      

      console.log(nextWord);
      res
        .status(200)
        .json(nextWord);

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
