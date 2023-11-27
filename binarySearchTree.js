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
    console.log("Running findNode...");
    console.log({ searchQuery, node, parent });
    // Checks if node is empty or a match
    if (node === null) {
      return null;
    } else if (node.data === searchQuery) {
      return { node, parent };
    }
    // Iterates through the tree using a while loop
    while (node !== null) {
      console.log("Iterating through while loop...");
      // If the search query is smaller than the node data, go to the left subtree
      if (searchQuery < node.data) {
        parent = node;
        node = node.left;
        // If the search query is larger than the node data, go to the right subtree
      } else if (searchQuery > node.data) {
        parent = node;
        node = node.right;
        // If the search query is equal to the node data, return the node and its parent
      } else {
        return { node, parent };
      }
    }
    // If the node is null, the search query was not found in the tree
    return null;
  }

  delete(dataToDelete) {
    console.log("Running delete...");
    let results = this.findNode(dataToDelete);

    // The node was not found and cannot be deleted
    console.log({ results });
    if (results === null) {
      return false;
      // The node was found, a reference to it and its parent are stored.
    } else {
      var foundNode = results.node;
      if (results.parent !== null) {
        var nodeParent = results.parent;
      }
    }

    /* Conditions for if the node has no children, one child, or two children */

    // Node has no children
    if (foundNode.left === null && foundNode.right === null) {
      this.deleteParentReference(foundNode, nodeParent);
      return true;

      // Node has one child
    } else if ((foundNode.left !== null) ^ (foundNode.right !== null)) {
      let singleChild =
        foundNode.left !== null ? foundNode.left : foundNode.right;
      this.replaceParentReference(foundNode, nodeParent, singleChild);
      return true;

      // Node has two children
    } else if (foundNode.left !== null && foundNode.right !== null) {
      var successorNode = this.findSuccessor(foundNode.right);
      successorNode.left = foundNode.left;
      successorNode.right = foundNode.right;
      if (dataToDelete !== this.root.data) {
        // If not root, attempt to replace the parent.
        this.replaceParentReference(foundNode, nodeParent, successorNode);
      }
      this.delete(successorNode.data);
      return true;
    } else {
      return false;
    }
  }

  deleteParentReference(node, parent) {
    console.log("Running deleteParentReference...");
    if (parent.left === node || parent.right === node) {
      parent[parent.left === node ? "left" : "right"] = null;
      return true;
    } else {
      return false;
    }
  }

  replaceParentReference(node, parent, child) {
    console.log("Running replaceParentReference...");
    console.log({ node, parent, child });
    if (parent.left === node || parent.right === node) {
      parent[parent.left === node ? "left" : "right"] = child;
      return true;
    } else {
      return false;
    }
  }

  findSuccessor(node) {
    console.log("Running findSuccessor...");
    // The in-order successor is the leftmost node in the right subtree
    while (node.left !== null) {
      node = node.left;
      console.log(`Node = ${node.data}`);
      console.log(`Node.left = ${node.left.data}`);
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
for (let i = 0; i < 32; i++) {
  numberArray.push(Math.floor(Math.random() * 1001));
}

let newTree = new BinarySearchTree(numberArray);

newTree.prettyPrint(newTree.root);
for (let i = 0; i < 1; i++) {
  let currentNum = numberArray[i];
  console.log(`Attempting to delete ${currentNum}`);
  newTree.delete(currentNum);
}
newTree.prettyPrint(newTree.root);
