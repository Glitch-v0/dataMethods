class Node {
  constructor(data, left = null, right = null, parent = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(arr) {
    this.root = this.buildSortedTree(arr);
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

  findNode(searchQuery, node = this.root, parent = null) {
    // Checks if node is empty or a match
    if (node === null) {
      console.log('Node is empty')
      return null;
    } else if (node.data === searchQuery) {
      console.log("Found the node!");
      return { node, parent };
    }
    console.log(
      `\nNode: ${node.data}. Parent: ${parent ? parent.data : "null"}`
    );
    //Recursively crawls down the tree to the left
    console.log('Crawling down the left side of the tree...')
    let leftResult = this.findNode(searchQuery, node.left, node);
    if (leftResult !== null) {
      console.log("Found the node! It has a parent.");
      return leftResult;
    }

    //Recursively crawls down the tree to the right
    console.log("Crawling down the right side of the tree...");
    let rightResult = this.findNode(searchQuery, node.right, node);
    if (rightResult !== null) {
      return rightResult;
    }
    return null;
  }

  delete(dataToDelete) {
    let results = this.findNode(dataToDelete);
    console.log({results})
    
    // The node was not found and cannot be deleted
    if (results === null) {
      return false;

    // The node was found, a reference to it and its parent are stored.
    } else {
      var foundNode = results.node;
      if (results.parent !== null) {
        var nodeParent = results.parent;
      }
    }
    // Check if node is root before deleting (NOT FINISHED!!!)
    if (nodeParent === null && dataToDelete === this.root) {
    }

    /* Conditions for if the node has no children, one child, or two children */
    
    // Node has no children
    if (foundNode.left === null && foundNode.right === null) {
      this.deleteParentReference(foundNode, nodeParent)
      return true;

      // Node has one child
    } else if ((foundNode.left !== null) ^ (foundNode.right !== null)) {
      let singleChild =
        foundNode.left !== null ? foundNode.left : foundNode.right;
      this.replaceParentReference(foundNode, nodeParent, singleChild);
      return true

      // Node has two children
    } else if (foundNode.left !== null && foundNode.right !== null) {
      let successorNode = this.findSuccessor(foundNode.right);
      this.replaceParentReference(foundNode, nodeParent, successorNode);
      this.delete(successorNode);
      return true
    } else {
      return false
    }
  }

  deleteParentReference(node, parent) {
    if (parent.left === node || parent.right === node) {
      parent[parent.left === node ? 'left' : 'right'] = null;
      return true;
    } else {
      return false;
    }
  }

  replaceParentReference(node, parent, child) {
    if (parent.left === node || parent.right === node) {
      parent[parent.left === node ? "left" : "right"] = child;
      return true;
    } else {
      return false;
    }
  }

  findSuccessor(node) {
    // The in-order successor is the leftmost node in the right subtree
    while (node.left !== null) {
      node = node.left;
    }
    return node;
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
for (let i = 0; i < 25; i++) {
  numberArray.push(Math.floor(Math.random() * 1001));
}

let newTree = new BinarySearchTree(numberArray);

newTree.prettyPrint(newTree.root);
console.log(newTree.findNode([numberArray[2]]));
console.log(numberArray[2]);