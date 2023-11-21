class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(arr) {
    this.root = this.buildSortedTree(arr);
    // arr.forEach((num) => this.insert(num));
  }

  insert(data) {
    var newNode = new Node(data);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      this.insertHelper(node, newNode, "left");
    } else if (newNode.data > node.data) {
      this.insertHelper(node, newNode, "right");
    } else {
      return "Error! Duplicate data detected.";
    }
  }

  insertHelper(node, newNode, direction) {
    // if the child in the given direction is null, assign newNode to it
    if (node[direction] === null) {
      node[direction] = newNode;
    } else {
      // if the child in the given direction is not null, recur with it
      this.insertNode(node[direction], newNode);
    }
  }

  find(data, node = this.root) {
    if (node === null) {
      return null;
    } else if (node.data === data) {
      return node;
    }
    let leftResult = this.find(data, node.left);
    if (leftResult !== null) {
      return leftResult;
    }
    let rightResult = this.find(data, node.right);
    if (rightResult !== null) {
      return rightResult;
    }
    return null;
  }

  /* Must consider the base case, if node is a leaf (no children), node with one child, and node with two children */
  delete(dataToDelete, node = this.root) {
    if (dataToDelete < node.data) {
      this.deleteHelper(node, dataToDelete, "left");
    } else if (dataToDelete > node.data) {
      this.deleteHelper(node, dataToDelete, "right");
    } else {
      return "Error! Duplicate data detected.";
    }
  }

  deleteHelper(node, newNode, direction) {
    // if the child in the given direction is null, assign newNode to it
    if (node[direction] === null) {
      node[direction] = newNode;
    } else {
      // if the child in the given direction is not null, recur with it
      this.insertNode(node[direction], newNode);
    }
  }

  buildSortedTree(arr, start, end) {
    //Initial Operation
    if (typeof start === "undefined" && typeof end === "undefined") {
      // Used to sort an array of integers
      function compareNumbers(a, b) {
        return a - b;
      }
      var sortedArray = Array.from(new Set(arr)).sort(compareNumbers);
      var start = 0;
      var end = sortedArray.length - 1;
    } else {
      var sortedArray = arr;
    }

    //Base case
    if (start > end) return null;

    // Splitting the tree
    let middle = Math.floor((start + end) / 2);
    let node = new Node(sortedArray[middle]);
    node.left = this.buildSortedTree(sortedArray, start, middle - 1);
    node.right = this.buildSortedTree(sortedArray, middle + 1, end);
    return node;
  }

  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

let numberArray = [];
for (let i = 0; i < 10; i++) {
  numberArray.push(Math.floor(Math.random() * 1001));
}

let newTree = new BinarySearchTree(numberArray);

for (let i = 0; i < 1; i++) {
  newTree.insert(Math.floor(Math.random() * 1001));
}

console.log(newTree.prettyPrint(newTree.root));
console.log(newTree.find(numberArray[0]));
