const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'in_row',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },
  getNextInfo(db, next) {
    return db
      .select(
        'word.*',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'total_score', language.total_score
            )
          ) AS lang`
        ),
      )
      .from('word')
      .where('word.id', next)
      .leftJoin('language', 'word.language_id', 'language.id')
      .groupBy('language.id', 'word.id')
      .first();
  },
};

module.exports = LanguageService;
