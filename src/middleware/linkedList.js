/* eslint-disable no-console */

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}



/*
          ____________            ____________________________________          _________________________________________                        ______________
          |----------|            |----------------------|           |          | -----------------------|               |                       |------------ |
          |   null   |            |----  content    -----|  pointer  |   ===>   | ------- content -------|   pointer     |     ... ===>          |--- Null --- |
          |----------|            |----------------------|           |          | -----------------------|               |                       |------------ |
          |__________|            ------------------------------------          ------------------------------------------                       |_____________|
  
          ^HEAD^
          having null before it so we can tell where the beginning is
  
  
  */

class LinkedList {

  constructor() {
    this.head = null;
  }
  /*to make a new item it's call insertion */
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  insertBefore(key, item) {

    if (typeof key === 'object') {
      key = key.value;
    }

    if (this.head === key || this.head === null) {
      this.insertFirst(item);
    }
    else {
      let currNode = this.find(key);

      if (currNode === null) {
        return null;
      }

      const newItem = new _Node(item, currNode);
      let before = this.head;
      while (currNode !== before.next) {
        if (before === null) {
          return null;
        }
        before = before.next;
      }
      before.next = newItem;
      return;
    }
  }
  insertAfter(key, item) {

    if (this.head === null) {
      this.insertFirst(item);
    }
    else {
      //first find the item we want to insert after
      let currNode = this.find(key);
      /* set a marker to count to, that it's val can be that of
         of the val of the new item's next */
      let after = this.head;
      //run loop
      while (after !== currNode.next) {
        if (after === null) {
          return null;
        }
        after = after.next;
      }
      /*making new item with next content being that of
        the key item */
      const newItem = new _Node(item, after);
      //reset curr items next val to be that of new time
      currNode.next = newItem;
      return;
    }
  }
  insertAt(index, item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {

      let nodeByIndex = this.head;
      let i = 0;
      while (index !== i) {
        if (nodeByIndex === null) {
          return null;
        }
        nodeByIndex = nodeByIndex.next;
        i++;
      }
      this.insertBefore(nodeByIndex, item);
    }
  }
  find(item) {
    //start at the head
    let currNode = this.head;
    //If the list is empty
    if (!this.head) {
      return null;
    }
    // check for the item
    while (currNode.value !== item) {
      /* Return null if it's the end of the list
            and the item is not on the list */
      if (currNode.next === null) {
        return null;
      }
      else {
        // Otherwise, keep looking
        currNode = currNode.next;
      }
    }
    //found it
    return currNode;
  }
  remove(item) {
    //If the list is empty
    if (!this.head) {
      return null;
    }
    // If the node to vbe removed is head, make the next node head
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    //Start at the head
    let currNode = this.head;
    //Keep track of previous
    let previousNode = this.head;

    while ((currNode !== null) && (currNode !== item)) {
      //Save the previous node
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }

}

module.exports = LinkedList;
