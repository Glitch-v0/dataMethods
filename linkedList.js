class NodeFactory {
    constructor(value=null, nextNode=null) {
        this.value = value;
        this.nextNode = nextNode;
    }
}


class LinkedList {
    constructor(value, nextNode) {
        this.lastNode = null;
        this.newNode = new NodeFactory(value, nextNode);
        this.head = this.newNode
    }
    append(value) {
        this.lastNode = this.newNode;
        this.newNode = new NodeFactory(value);
        this.lastNode.nextNode = this.newNode;
    }
    prepend(value) {
        this.oldHead = this.head
        this.head = new NodeFactory(value, this.oldHead);
    }
    //size() {return this.size}
    size() {
        let size = 0;
        let lastNode = this.head;
     
        if (lastNode.value !== null) {
            size += 1
        }
        while (lastNode.nextNode !== null) {
            lastNode = lastNode.nextNode;
            size += 1
        }
        return size
    }
    getHead() {return this.head }
    getTail() {return this.lastNode }
    at(index) {
        let nodeToReturn = this.head;
        for (let i = 0; i < index; i++) {
            nodeToReturn = nodeToReturn.nextNode;
        }
        return nodeToReturn
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
        return deletedNode
    }
    contains(value) {
        // Starts at beginning of list
        let currentNode = this.head;

        //Traverses through entire list, until there is no nextNode
        while (currentNode.value !== value && currentNode.nextNode !== null) {
            currentNode = currentNode.nextNode;
        }
        if (currentNode.value === value) {
            return true
        } else {
            return false
        }
    }
    find(value) {
        let currentIndex = 0;
        // Starts at beginning of list
        let currentNode = this.head;

        //Traverses through entire list, until there is no nextNode
        while (currentNode.value !== value && currentNode.nextNode !== null) {
            currentNode = currentNode.nextNode;
            currentIndex += 1;
        }
        if (currentNode.value === value) {
            return currentIndex
        } else {
            return false
        }
    }
    toString() {
        // Starts at beginning of list
        let currentNode = this.head;
        let stringOfNodes = this.head.value.toString();

        //Traverses through entire list, until there is no nextNode
        while (currentNode.nextNode !== null) {
            currentNode = currentNode.nextNode;
            stringOfNodes += ' -> '
            stringOfNodes += currentNode.value.toString()
        }
        return stringOfNodes
    }
    insertAt(value, index) {

        // If item is placed outside the current indexes of node, just turn it into an append function.
        if (index > newLinkedList.size()) {
            return newLinkedList.append(value)
        } else if (index === 0) {
            return newLinkedList.prepend(value)
        } else {
            //Save currentNode value
            let nodeToReplace = this.at(index);
            let previous = this.at(index - 1);
            
            let nodeToInsert = new NodeFactory(value);
            //Set previousNode's nextnode to nodeToInsert
            previous.nextNode = nodeToInsert;
            
            //Set inserted node's next node if applicable
            nodeToInsert.nextNode = nodeToReplace;
            return newLinkedList.toString();
            }
        }
    removeAt(index) {
        let currentSize = this.size()
        if (index >= currentSize || index < 0) {
            return `Error- must use index between range 0 and list size (${currentSize-1})`
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

let newLinkedList = new LinkedList(0);
for (let i = 1; i < 25; i++) {
    newLinkedList.append(i)
}

newLinkedList.insertAt(30, 10)
newLinkedList.insertAt(31, 5)
newLinkedList.insertAt(34, 3)
console.log(newLinkedList.toString())
newLinkedList.removeAt(3);
newLinkedList.removeAt(5);
newLinkedList.removeAt(10);
console.log(newLinkedList.toString())