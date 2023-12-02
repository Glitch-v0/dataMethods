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
        // console.log(
        //   `Node found. Returning node ${node.data} and parent ${parent.data}`
        // );
        return { node, parent };
      }
    }
    // If the node is null, the search query was not found in the tree
    return null;
  }

  delete(dataToDelete) {
    //console.log(`Running delete for value ${dataToDelete}`);

    // Base case: the data to delete is the root
    if (dataToDelete == this.root.data) {
      console.log("Trying to delete the root!");
      // If it only has one child, set that child as new root
      if (this.nodeHasOneChild(this.root)) {
        this.root = this.root.left ? this.root.left : this.root.right;
        return true;
        // If it has two children, find the successor and update references
      } else if (this.nodeHasTwoChildren(this.root)) {
        this.findSuccessorAndCleanup(this.root);
        return true;
      } else {
        // If it has no children, root is set to null.
        this.root = null;
        return true;
      }
    }

    // Find where the node is to delete
    let results = this.findNode(dataToDelete);

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
    } else if (this.nodeHasOneChild(foundNode)) {
      let singleChild =
        foundNode.left !== null ? foundNode.left : foundNode.right;
      this.replaceParentReference(foundNode, nodeParent, singleChild);
      return true;

      // Node has two children
    } else if (this.nodeHasTwoChildren(foundNode)) {
      this.findSuccessorAndCleanup(foundNode, nodeParent);
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
      return true;
    }
    //console.log("False! Does not have two children.");
    return false;
  }

  deleteParentReference(node, parent) {
    // Delete reference if node is parent's left child
    if (parent.left !== null && parent.left !== undefined) {
      if (parent.left.data === node.data) {
        parent.left = null;
        return true;
      }
    }
    // Delete reference if node is parent's right child
    if (parent.right !== null && parent.left !== undefined) {
      if (parent.right.data === node.data) {
        parent.right = null;
        return true;
      }
    }
    // The parent's children do not equal the node- reference cannot be deleted
    return false;
  }

  replaceParentReference(node, parent, child) {
    // console.log(`Running replaceParentReference...`)
    // console.log({node, parent, child})
    // Can't replace parent of root
    if (node.data === this.root){
      console.log('Cant replace root.')
      return false
    }
    if (parent.left.data === node.data || parent.right.data === node.data) {
      parent[parent.left.data === node.data ? "left" : "right"] = child;
      return true;
    } else {
      return false;
    }
  }

  findSuccessor(node) {
    // The in-order successor is the leftmost node in the right subtree
    let previousNode = null;
    let nodeToCheck = node.right;
    const nodeSearchArray = [node];
    

    let parent = node;

    while (nodeToCheck !== null) {
      nodeSearchArray.push(nodeToCheck);
      previousNode = nodeToCheck;
      nodeToCheck = nodeToCheck.left;
    }

    parent = nodeSearchArray[(nodeSearchArray.length-2)];
    return {successor: previousNode, parent: parent};
  }

  findSuccessorAndCleanup(node, parent){
    //Save successor node + parent
    let successorResults = this.findSuccessor(node);
    let successorNode = this.copyNode(successorResults.successor);
    let successorRightChild = this.copyNode(successorNode.right);
    let successorParent = successorResults.parent;
    //console.log({successorResults, successorNode, successorParent})

    //this.deleteParentReference(successorNode, successorParent);

    // Restructure hole where successor node is removed
    if (successorParent.left === null) {
      successorParent.left = successorNode.right;
    }


    // Connect original node's parent reference to successorNode
    if(parent !== undefined){
      this.replaceParentReference(node, parent, successorNode);}
    
     /*if Successor node has right child,
    set corresponding parent child equal to successor child*/
    this.replaceParentReference(successorNode, successorParent, successorRightChild)

    // In case the node is a root
    if(node === this.root){
      this.root = successorNode;
    }
    this.copyChildren(node, successorNode);

    if (successorRightChild !==null){
      console.log('Successor has a right child!')
      if(successorParent.left.value === successorNode.value){
        successorParent.left = successorRightChild;
      } else if (successorParent.right.value === successorNode.value){
        successorParent.right = successorRightChild;
      }
    }
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

  reConnectSuccessorReferences(successorNode, successorParent){
    if(successorParent.left === successorNode){}
    if(successorParent.right === successorNode){}
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

  traverseTreeByLevel(queue = [this.root], callback = null) {
    
    const nextQueue = [];
    queue.forEach(node => {
      callback(node);
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
    return this.traverseTreeByLevel(nextQueue, callback)
  }

  inOrder(node, results, callback){
    //PURPOSE: Visits nodes in ascending order
    //METHOD: Traverse left sub-tree, root, right sub-tree

    if (results === undefined){
      var results = []; //To store the values during traversal
    }
    
    // Base case- there is no child to check
    if (!node){
      return
    }
    
    this.inOrder(node.left, results);
    results.push(node);
    this.inOrder(node.right, results);

    // Returns the results if no callback is specified
    if(callback === undefined || callback === null){
      return results
    } else {
      results.forEach(result => {
        callback(result);
      })
      return results
    }
  }
  preOrder(node, results, callback){
    //PURPOSE: Create a copy of a tree
    /*Traverse root, left sub-tree, right sub-tree */

    if (results === undefined){
      var results = []; //To store the values during traversal
    }
    
    // Base case- there is no child to check
    if (!node){
      return
    }

    results.push(node);
    this.preOrder(node.left, results);
    this.preOrder(node.right, results);

    // Returns the results if no callback is specified
    if(callback === undefined || callback === null){
      return results
    } else {
      results.forEach(result => {
        console.log(result.data)
        callback(result);
      })
      return results
    }
  }
  postOrder(node, results, callback){
    //PURPOSE: Delete a tree
    /*Visit left sub-tree, right sub-tree, root  */

    if (results === undefined){
      var results = []; //To store the values during traversal
    }
    
    // Base case- there is no child to check
    if (!node){
      return
    }

    this.postOrder(node.left, results);
    this.postOrder(node.right, results);
    results.push(node);

    // Returns the results if no callback is specified
    if(callback === undefined || callback === null){
      return results
    } else {
      results.forEach(result => {
        console.log(result.data)
        callback(result);
      })
      return results
    }
  }

  depth(node){
    let comparisonNode = this.copyNode(this.root);
    //# of edges from root to a node
    let currentDepth = 0;
    if (node === null || node === undefined){
      return false
    }
    while (node.data !== comparisonNode.data){
      if (node.data > comparisonNode.data){
        currentDepth++;
        comparisonNode = comparisonNode.right;
      } else if (node.data < comparisonNode.data){
        currentDepth++;
        comparisonNode = comparisonNode.left;
      } else {
        return currentDepth
      }
    }
    return currentDepth
  }

  height(node){
    //# of edges from node to a leaf

    function rootHeight (node){
      if (node === null){
        return -1
      } else {
        // Compute height of each subtree
        var leftDepth = rootHeight(node.left);
        var rightDepth = rootHeight(node.right);
  
        // Use the larger one
        if (leftDepth > rightDepth){
          return (leftDepth + 1);
        }
        else {
          return (rightDepth + 1);
        }
      }
    }

    //GET HEIGHT OF ROOT, then DEPTH OF NODE, then  SUBTRACT
    let treeHeight = rootHeight(this.root);
    let nodeDepth = this.depth(node);
    let nodeHeight = treeHeight-nodeDepth;
    console.log({treeHeight, nodeDepth, nodeHeight})
    return nodeHeight;
    }
  
  isBalanced(node = this.root){
    if (node === null){
      return [true, 0]
    } else if (node !== null){
      let left = this.isBalanced(node.left);
      let right = this.isBalanced(node.right);
      let balance = (left[0] && right[0] && 
      Math.abs(left[1]-right[1]) <= 1);
      return [balance, 1 + Math.max(left[1], right[1])]
    }
    return this.isBalanced(node)[0]
  }

  rebalance(){
    //Get values in order traversal
    let treeNodesInOrder = this.inOrder(this.root);
    let valuesOfNodes = [];
    treeNodesInOrder.forEach(node => {
      valuesOfNodes.push(node.data);
    });
    console.log(valuesOfNodes)
    this.root = this.buildSortedTree(valuesOfNodes);
    console.log(`NEW ROOT = ${this.root}`)
  }
}


let numberArray = [];
for (let i = 0; i < 5; i++) {
  numberArray.push(Math.floor(Math.random() * 101));
}
let newTree = new BinarySearchTree(numberArray);

for (let i = 0; i < 10; i++) {
  newTree.insert(Math.floor(Math.random() * 101));
}
newTree.prettyPrint(newTree.root);
console.log(newTree.isBalanced())
newTree.rebalance();
newTree.prettyPrint(newTree.root);