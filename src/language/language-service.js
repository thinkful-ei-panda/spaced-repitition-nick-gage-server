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
  populateLinkedList(db , language_id){
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({language_id});
  },
  ifIsCorrect(db,bool,id){
    if(bool){
      return db
        .from('word')
        .increment('correct_count')
        .where({id});
    }
    else {
      return db
        .from('word')
        .increment('incorrect_count')
        .where({id}); 
    }

  }
};

module.exports = LanguageService;
