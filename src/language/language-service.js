const LinkedList = require('../middleware/linkedList');


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
  async populateLinkedList(db, language_id,head) {
    let wordArr = await db
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
      .where({ language_id });
      
    const linkedList = new LinkedList; 

    let walk = wordArr.find(word => word.id === head);
    
    while(walk){
      linkedList.insertLast(walk);
      walk = wordArr.find(word => word.id === walk.next);
    } 

    return linkedList;

  },
  async updateWithLinkedList(db,linkedList){
    //go tough linked list, for  each id, update that of to that id, in db. to updated next to match the next in the linkedList
    
    let pointer = linkedList.head;

    while(pointer){
      await db
        .from('word')
        .update({
          'next' : pointer.next.id
        })
        .where({'id' : pointer.id});

      pointer = pointer.next;
    }
  },
  updateCorrect(db, id, correct_count){
    return db
      .from('word')
      .where({id})
      .update({correct_count});
  },
  updateIncorrect(db, id, incorrect_count){
    return db
      .from('word')
      .where({id})
      .update({incorrect_count});
  },
  updateTotalScore(db, id, total_score){
    return db
      .from('language')
      .where({id})
      .update({total_score});
  },
  updateHead(db, id, head){
    return db
      .from('language')
      .where({id})
      .update({head});
  },

};

module.exports = LanguageService;
