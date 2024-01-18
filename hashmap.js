class Hashmap {
  constructor(size, loadFactor = 0.75) {
    this.buckets = new Array(size);
    this.loadFactor = loadFactor;
  }

  hash(stringValue) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < stringValue.length; i++) {
      hashCode = primeNumber * hashCode + stringValue.charCodeAt(i);
    }

    return hashCode;
  }
  set(key, value) {
    // if load factor is too high, double the buckets and reassign data before adding new entry
    const currentNumOfBuckets = this.buckets.length;
    const currentLoadFactor = this.length() / currentNumOfBuckets;
    let allEntries = [];
    if (currentLoadFactor > this.loadFactor) {
      allEntries = this.entries();
      this.clear();
      this.buckets = new Array(currentNumOfBuckets * 2);
      allEntries.forEach((data) => {
        this.set(data.key, data.value);
      });
    }

    // adds new entrye
    const hashedKey = this.hash(key);
    const bucketIndex = hashedKey % this.buckets.length;

    // artificially limiting the array for thought purposes
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    if (!this.buckets[bucketIndex]) {
      // If the bucket is empty, create a new linked list
      this.buckets[bucketIndex] = new LinkedList({ key, value });
    } else {
      // Append to the existing linked list (whether it was just created or already existed)
      this.buckets[bucketIndex].append({ key, value });
    }
  }

  get(key) {
    //returns the value assigned to the key. if key not found, return null
    const hashedKey = this.hash(key);
    const bucketIndex = hashedKey % this.buckets.length;

    // artificially limiting the array for thought purposes
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    if (this.buckets[bucketIndex].find(key) !== false) {
      const position = this.buckets[bucketIndex].find(key);
      return this.buckets[bucketIndex].at(position);
    }
    return null;
  }

  has(key) {
    //returns true or false based on whether key is in hash map
    const hashedKey = this.hash(key);
    const bucketIndex = hashedKey % this.buckets.length;

    // artificially limiting the array for thought purposes
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }

    const position = this.buckets[bucketIndex].find(key);
    if (this.buckets[bucketIndex].at(position)) {
      return true;
    }
    return false;
  }

  remove(key) {
    //if key in hash map, remove entry with that key and return true. else, return false
    const hashedKey = this.hash(key);
    const bucketIndex = hashedKey % this.buckets.length;

    // artificially limiting the array for thought purposes
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }

    const currentBucket = this.buckets[bucketIndex];
    const foundIndex = currentBucket.find(key);
    if (foundIndex !== false) {
      currentBucket.removeAt(foundIndex);
      return true;
    }
    return false;
  }

  length() {
    //return # of stored keys in has map
    let totalLength = 0;
    this.buckets.forEach((bucket) => {
      totalLength += bucket.size();
    });
    return totalLength;
  }

  clear() {
    //remove all entries in hash map
    this.buckets.forEach((bucket) => {
      const itemsToRemove = bucket.size();
      for (let i = itemsToRemove; i > 0; i--) {
        bucket.removeAt(i - 1);
      }
    });
  }

  keys() {
    //returns an array containing all keys in hash map
    let arrayOfKeys = [];
    this.buckets.forEach((bucket) => {
      for (let i = 0; i < bucket.size(); i++) {
        arrayOfKeys.push(bucket.at(i).value.key);
      }
    });
    return arrayOfKeys;
  }

  values() {
    //returns an array containing all the values
    let arrayOfValues = [];
    this.buckets.forEach((bucket) => {
      for (let i = 0; i < bucket.size(); i++) {
        arrayOfValues.push(bucket.at(i).value.value);
      }
    });
    return arrayOfValues;
  }

  entries() {
    //returns an array that contains each key, value pair
    let arrayOfEntries = [];
    this.buckets.forEach((bucket) => {
      for (let i = 0; i < bucket.size(); i++) {
        arrayOfEntries.push(bucket.at(i).value);
      }
    });
    return arrayOfEntries;
  }
}

class NodeFactory {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}

class LinkedList {
  constructor(value, nextNode) {
    this.lastNode = null;
    this.newNode = new NodeFactory(value, nextNode);
    this.head = this.newNode;
  }
  append(value) {
    this.lastNode = this.newNode;
    this.newNode = new NodeFactory(value);
    this.lastNode.nextNode = this.newNode;
  }
  prepend(value) {
    this.oldHead = this.head;
    this.head = new NodeFactory(value, this.oldHead);
  }

  size() {
    let size = 0;
    let lastNode = this.head;

    if (lastNode.value !== null) {
      size += 1;
    }
    while (lastNode.nextNode !== null) {
      lastNode = lastNode.nextNode;
      size += 1;
    }
    return size;
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.lastNode;
  }
  at(index) {
    let nodeToReturn = this.head;
    for (let i = 0; i < index; i++) {
      nodeToReturn = nodeToReturn.nextNode;
    }
    return nodeToReturn;
  }
  pop() {
    // Starts at beginning of list
    let currentNode = this.head;
    let nodeBeforeLast;
    let deletedNode;

    //Traverses through entire list, until there is no nextNode
    while (currentNode.nextNode !== null) {
      nodeBeforeLast = currentNode;
      currentNode = currentNode.nextNode;
    }

    // Removes memory reference to last node
    deletedNode = nodeBeforeLast.nextNode;
    nodeBeforeLast.nextNode = null;
    currentNode.value = null;
    currentNode.nextNode = null;

    // Sets last node property to the now new last node
    this.lastNode = nodeBeforeLast;
    return deletedNode;
  }
  contains(value) {
    // Starts at beginning of list
    let currentNode = this.head;

    //Traverses through entire list, until there is no nextNode
    while (currentNode.value !== value && currentNode.nextNode !== null) {
      currentNode = currentNode.nextNode;
    }
    if (currentNode.value === value) {
      return true;
    } else {
      return false;
    }
  }
  find(value) {
    let currentIndex = 0;
    // Starts at beginning of list
    let currentNode = this.head;

    //Traverses through entire list, until there is no nextNode
    while (currentNode.value.key !== value && currentNode.nextNode !== null) {
      currentNode = currentNode.nextNode;
      currentIndex += 1;
    }
    if (currentNode.value.key === value) {
      return currentIndex;
    } else {
      return false;
    }
  }
  toString() {
    // Starts at beginning of list
    let currentNode = this.head;
    let stringOfNodes = this.head.value.toString();

    //Traverses through entire list, until there is no nextNode
    while (currentNode.nextNode !== null) {
      currentNode = currentNode.nextNode;
      stringOfNodes += " -> ";
      stringOfNodes += currentNode.value.toString();
    }
    return stringOfNodes;
  }
  insertAt(value, index) {
    // If item is placed outside the current indexes of node, just turn it into an append function.
    if (index > this.size()) {
      return this.append(value);
    } else if (index === 0) {
      return this.prepend(value);
    } else {
      //Save currentNode value
      let nodeToReplace = this.at(index);
      let previous = this.at(index - 1);

      let nodeToInsert = new NodeFactory(value);
      //Set previousNode's nextnode to nodeToInsert
      previous.nextNode = nodeToInsert;

      //Set inserted node's next node if applicable
      nodeToInsert.nextNode = nodeToReplace;
      return this.toString();
    }
  }
  removeAt(index) {
    let currentSize = this.size();
    if (index >= currentSize || index < 0) {
      return `Error- must use index between range 0 and list size (${
        currentSize - 1
      })`;
    } else if (index === 0) {
      let nodeToRemove = this.at(index);
      nodeToRemove.value = null;
      nodeToRemove.nextNode = null;
      this.head = this.at(index);
    } else {
      let nodeToRemove = this.at(index);
      let previousNode = this.at(index - 1);
      let successorNode = this.at(index + 1);
      nodeToRemove.value = null;
      nodeToRemove.nextNode = null;
      previousNode.nextNode = successorNode;
    }
  }
}

const newHashMap = new Hashmap(16);

const dataToAdd = [
  ["numOfCars", "123"],
  ["numOfFreeLunches", "456"],
  ["numOfStudents", "789"],
  ["dataValue1", "1001"],
  ["dataValue2", "0110"],
  ["phoneNum", "111-1111-1111"],
  ["likeABoss", "epicPassword"],
  ["hurpDurp", "somethingStupid"],
  ["Powerful Quote", "Treat others the way you want to be treated"],
  ["securityMaster", "epicPassword"],
  ["Favorite Car", "Ford Focus"],
  ["spice", "isNotNice"],
  ["coolio", "just look at this value!"],
  ["help!", "sorry mate"],
  ["well then", "hang in there"],
];

dataToAdd.forEach((datum) => {
  newHashMap.set(datum[0], datum[1]);
});
