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
    //console.log("Running findNode...");
    // Checks if node is empty or a match
    if (node === null) {
      return null;
    } else if (node.data === searchQuery) {
      return { node, parent };
    }
    // Iterates through the tree using a while loop
    while (node !== null) {
      //console.log(`Iterating through while loop: current node value is ${node.data}`);
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
        console.log(
          `Node found. Returning node ${node.data} and parent ${parent.data}`
        );
        return { node, parent };
      }
    }
    // If the node is null, the search query was not found in the tree
    return null;
  }

  delete(dataToDelete) {
    console.log(`Running delete for value ${dataToDelete}`);

    // Base case: the data to delete is the root
    if (dataToDelete == this.root.data) {
      console.log("Trying to delete the root!");
      // If it only has one child, set that child as new root
      if (this.nodeHasOneChild(this.root)) {
        this.root = this.root.left ? this.root.left : this.root.right;
        return true;
        // If it has two children, find the successor and update references
      } else if (this.nodeHasTwoChildren(this.root)) {
        //Save current root children
        let copyOfRoot = this.copyNode(this.root);
        let successorResults = this.findSuccessor(this.root);
        let successorNode = this.copyNode(successorResults.successor);
        let successorParent = successorResults.parent;
        console.log({successorResults, successorNode, successorParent})
        this.deleteParentReference(successorNode, successorParent);
        // Restructure hole where successor node is removed
        if (successorNode.right !== null) {
          successorParent.left = successorNode.right;
        }
        this.root = successorNode;
        this.copyChildren(copyOfRoot, this.root);
        console.log(this.root);
        console.log({copyOfRoot});
        return true;
      } else {
        // If it has no children, root is set to null.
        this.root = null;
        return true;
      }
    }

    // Find where the node is to delete
    let results = this.findNode(dataToDelete);
    console.log({ results });

    // The node was not found and cannot be deleted
    if (results === null) {
      return false;
    }

    // The node was found, a reference to it and its parent are stored.
    var foundNode = results.node;
    var nodeParent = results.parent;

    /* Conditions for if the node has no children, one child, or two children */

    // Node has no children
    if (foundNode.left === null && foundNode.right === null) {
      this.deleteParentReference(foundNode, nodeParent);
      return true;

      // Node has one child
    } else if ((foundNode.left !== null) ^ (foundNode.right !== null)) {
      // Node has one child
      let singleChild =
        foundNode.left !== null ? foundNode.left : foundNode.right;
      this.replaceParentReference(foundNode, nodeParent, singleChild);
      return true;

      // Node has two children
    } else if (foundNode.left !== null && foundNode.right !== null) {
      let successorResults = this.findSuccessor(foundNode);
      let successorNode = this.copyNode(successorResults.successor);
      let successorParent = successorResults.parent;
      this.replaceParentReference(foundNode, nodeParent, successorNode);
      this.copyChildren(foundNode, successorNode)
      return true;
    } else {
      return false;
    }
  }

  copyNode(node) {
    if (node === null) {
      return null;
    }

    return new Node(node.data, node.left, node.right, node.parent);
  }
  
  copyChildren(oldNode, newNode) {
  if (oldNode === null || newNode === null) {
    return;
  }

  // Check if the left child of newNode needs to be copied
  if (newNode.left === null || newNode.left !== oldNode.left) {
    newNode.left = oldNode.left;
  }

  // Check if the right child of newNode needs to be copied
  if (newNode.right === null || newNode.right !== oldNode.right) {
    newNode.right = oldNode.right;
  }
}



  replaceChildReferences(oldNode, replacementNode) {
    let OldLeftChild = oldNode.left;
    let OldRightChild = oldNode.right;
    replacementNode.left = oldNode;
  }

  nodeHasOneChild(node) {
    if ((node.left !== null) ^ (node.right !== null)) {
      return true;
    }
    return false;
  }

  nodeHasTwoChildren(node) {
    if (node.left !== null && node.right !== null) {
      console.log("True! Has two children");
      return true;
    }
    console.log("False! Does not have two children.");
    return false;
  }

  deleteParentReference(node, parent) {
    console.log("Running deleteParentReference...");
    console.log(`Node: ${node.data}, Parent: ${parent.data}`);
    // Delete reference if node is parent's left child
    if (parent.left !== null) {
      if (parent.left.data === node.data) {
        parent.left = null;
        return true;
      }
    }
    // Delete reference if node is parent's right child
    if (parent.right !== null) {
      if (parent.right.data === node.data) {
        parent.right = null;
        return true;
      }
    }
    // The parent's children do not equal the node- reference cannot be deleted
    return false;
  }

  replaceParentReference(node, parent, child) {
    //console.log("Running replaceParentReference...");
    //console.log({ node, parent, child });
    if (parent.left === node || parent.right === node) {
      parent[parent.left === node ? "left" : "right"] = child;
      return true;
    } else {
      return false;
    }
  }

  findSuccessor(node) {
    // The in-order successor is the leftmost node in the right subtree
    let previousNode = null;
    let nodeToCheck = node.right;
    const nodeSearchArray = [node.data];
    
    // If there's not a node to the right, find  predecessor instead of successor.
    if (nodeToCheck === null) {
      return this.findPredecessor(node)
    }

    let parent = node;

    while (nodeToCheck !== null) {
      nodeSearchArray.push(nodeToCheck);
      previousNode = nodeToCheck;
      nodeToCheck = nodeToCheck.left;
    }

    parent = nodeSearchArray[(nodeSearchArray.length-2)];
    console.log(`Returning successor ${previousNode.data} and parent ${parent.data}`);
    return {successor: previousNode, parent: parent};
  }

  findPredecessor(node) {
    // The in-order successor is the rightmost node in the left subtree
    let nodeToCheck = node.left;
    if (nodeToCheck === null) {
      return node;
    }
    while (nodeToCheck !== null) {
      nodeToCheck = nodeToCheck.right;
    }
    console.log(`Returning predecessor ${nodeToCheck}`);
    return nodeToCheck;
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

  traverseTreeByLevel(queue = [this.root]) {
    
    const nextQueue = [];
    queue.forEach(node => {
      console.log(node.data)
      if (node.left !== null) {
        nextQueue.push(node.left)
      }
      if (node.right !== null) {
        nextQueue.push(node.right);
      }
    });
    //There are no more children, end the recursion
    if (nextQueue.length === 0) {
      return
    }
    // Use all children found in the next level search
    return this.traverseTreeByLevel(nextQueue)
  }
}

let numberArray = [];
for (let i = 0; i < 20; i++) {
  numberArray.push(Math.floor(Math.random() * 101));
}

let newTree = new BinarySearchTree(numberArray);

newTree.prettyPrint(newTree.root);
for (let i = 0; i < 1; i++) {
  let currentNum = numberArray[i];
  console.log(`Attempting to delete ${currentNum}`);
  newTree.delete(currentNum);
}
newTree.prettyPrint(newTree.root);
