/** Problems to solve:
 * -Properly connect each slot to those adjacent (up, down, left, right)
 * -Make a function for a knight to move two slots in one direction,
 * and one slot left or right from there.
 * -Make it impossible to move outside of the grid (if .right null, return)
 * -Recursively map out possibilities of which knight-moves go to another slot
 * -Make the logic to pick the shortest path (considering there are multiple ways)
 * -Handle the case where there are two (or more?) equal # of moves to get to a position
 */

class chessBoardSlot {
  constructor(coordinate, up = null, left = null, right = null, down = null) {
    this.coordinate = coordinate;
    this.up = up;
    this.left = left;
    this.right = right;
    this.down = down;
  }
}

class chessBoard {
  constructor() {
    this.startingPoint;
    this.slotReferences = [];
    this.createBoard();
    this.assignAllReferences();
    this.knightPaths = []; // Keeps up with the paths outside of knight method
  }

  copyBoardSlot(slot) {
    if (slot !== null || slot !== undefined) {
      return new chessBoardSlot(
        slot.coordinate,
        slot.up,
        slot.left,
        slot.right,
        slot.down
      );
    } else {
      return null;
    }
  }

  createBoard() {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        this.slotReferences.push(
          new chessBoardSlot([x, y], null, null, null, null)
        );
      }
    }
    this.startingPoint = this.slotReferences[0];
  }

  findSlotByCoordinate(x, y) {
    // Use the find method to return the first slot that matches the coordinates
    return this.slotReferences.find(
      (slot) => slot.coordinate[0] === x && slot.coordinate[1] === y
    );
  }

  assignUpDirection(currentSlot, referenceSlotX, referenceSlotY) {
    currentSlot.up = this.findSlotByCoordinate(referenceSlotX, referenceSlotY);
  }
  assignDownDirection(currentSlot, referenceSlotX, referenceSlotY) {
    currentSlot.down = this.findSlotByCoordinate(
      referenceSlotX,
      referenceSlotY
    );
  }
  assignLeftDirection(currentSlot, referenceSlotX, referenceSlotY) {
    currentSlot.left = this.findSlotByCoordinate(
      referenceSlotX,
      referenceSlotY
    );
  }
  assignRightDirection(currentSlot, referenceSlotX, referenceSlotY) {
    currentSlot.right = this.findSlotByCoordinate(
      referenceSlotX,
      referenceSlotY
    );
  }

  assignAllReferences() {
    for (let slot of this.slotReferences) {
      // Just easier to read variables
      let xCoordinate = slot.coordinate[0];
      let yCoordinate = slot.coordinate[1];
      if (xCoordinate < 7) {
        /* Assigns each slot's right direction to the slot one column to the right,
                        unless it's in the last column */
        this.assignRightDirection(slot, xCoordinate + 1, yCoordinate);
      }
      if (xCoordinate > 0) {
        /* Assigns each slot's left direction to the slot one column to the left,
                        unless it's in the first column */
        this.assignLeftDirection(slot, xCoordinate - 1, yCoordinate);
      }
      if (yCoordinate > 0) {
        /* Assigns each slot's down direction to the slot one row below it,
                        unless it's in the bottom row */
        this.assignDownDirection(slot, xCoordinate, yCoordinate - 1);
      }
      if (yCoordinate < 7) {
        /* Assigns each slot's up direction to the slot one row above it,
                        unless it's in the top row */
        this.assignUpDirection(slot, xCoordinate, yCoordinate + 1);
      }
    }
  }

  printAllSlots() {
    if (this.slotReferences.length > 0) {
      for (let slot of this.slotReferences) {
        console.log(
          `\nSlot coordinate: ${slot.coordinate[0]}, ${slot.coordinate[1]}
            `
        );
        if (slot.up !== null) {
          console.log(`Up reference: ${slot.up.coordinate}\n`);
        }
        if (slot.down !== null) {
          console.log(`Down reference: ${slot.down.coordinate}\n`);
        }
        if (slot.left !== null) {
          console.log(`Left reference: ${slot.left.coordinate}\n`);
        }
        if (slot.right !== null) {
          console.log(`Right reference: ${slot.right.coordinate}\n`);
        }
      }
    } else {
      return false;
    }
  }

  printSlotsInArray(arrayOfSlots) {
    console.log("Printing slots for current array:");
    arrayOfSlots.forEach((slot) => {
        console.log(slot);
    })
    }
    
    printKnightPaths() {
        if (this.knightPaths.length === 0) {
            console.log('You are already there!')
            return
        }
      let shortestPathCount = 8;
      console.log("Running printKnightPaths...");
        console.log(`\n# of Paths = ${this.knightPaths.length}`);
        //Finds the smallest path(s)
      this.knightPaths.forEach((path) => {
        if (path.length < shortestPathCount) {
          shortestPathCount = path.length;
        }
        });
      // Filter arrays with the smallest length
      let smallestLengthPaths = this.knightPaths.filter(
        (path) => path.length === shortestPathCount
      );
        console.log(`\nNumber of Moves for Quickest Path: ${shortestPathCount-1}`);
        console.log("\nThe Paths:");
        smallestLengthPaths.forEach((path, index) => {
          console.log(`\nPath ${index + 1}:\n`);
          path.forEach((point) => {
            console.log(point);
          });
        });
        this.knightPaths = []; //reset after finishing
    }

  slotIsInArray(slotCoordinateToCheck, arrayOfSlots) {
    // console.log(
    //   `Checking if move: ${slotCoordinateToCheck} is already in array... `
    // );
    if (slotCoordinateToCheck === null) {
      return null;
    } else if (slotCoordinateToCheck === undefined) {
      return undefined;
    }
    let result = false;
    for (let i = 0; i < arrayOfSlots.length; i++) {
      // Get the current array slot
      let arraySlot = arrayOfSlots[i];
      //   console.log(
      //     `Comparing ${slotCoordinateToCheck} with array slot ${arraySlot}`
      //   );
      if (
        // Check if the slot matches the coordinate
        arraySlot == slotCoordinateToCheck
      ) {
        //console.log("Slot is INDEED in the array! Returning TRUE");
        // Set the result to true and break the loop
        result = true;
        break;
      }
    }
    //console.log('Slot is NOT in the array! Returning FALSE')
    return result;
  }

  slotMatchesTarget(slotCoordinate, targetCoordinate) {
    //console.log({slotCoordinate, targetCoordinate})
    if (
      slotCoordinate[0] === targetCoordinate[0] &&
      slotCoordinate[1] === targetCoordinate[1]
    ) {
      return true;
    }
    return false;
  }

  calculateKnightMoves(
    startingCoordinate,
    targetCoordinate,
    alreadyVisitedMoves = [startingCoordinate]
  ) {
    //console.log(`Searching for ${targetCoordinate}. Current Move: ${startingCoordinate}`)
    if (
      // Base case- the target coordinate is the same as the starting slot
      this.slotMatchesTarget(startingCoordinate, targetCoordinate)
    ) {
      return;
    }

    function twoThenOne(slot, firstDirection, secondDirection) {
      //Two moves first direction, if possible
      for (let i = 0; i < 2; i++) {
        if (slot[firstDirection] !== null) {
          slot = slot[firstDirection];
        } else {
          return null; //Don't continue if the move is null
        }
      }
      //One move second direction, if possible
      if (slot[secondDirection] !== null) {
        slot = slot[secondDirection];
      } else {
        return null; //Don't continue if the move is null
      }

      return slot;
    }

    let moveDirections = [
      ["right", "up"],
      ["right", "down"],
      ["left", "up"],
      ["left", "down"],
      ["up", "left"],
      ["up", "right"],
      ["down", "left"],
      ["down", "right"],
    ];

    for (let i = 0; i < moveDirections.length; i++) {
      //console.log(`Trying current direction ${moveDirections[i][0]}, ${moveDirections[i][1]}`)
      let coordinateToSlotObject = this.findSlotByCoordinate(
        startingCoordinate[0],
        startingCoordinate[1]
      );
      //console.log({coordinateToSlotObject})

      // Makes a copy so as not to overwrite any references
      let copyOfSlot = this.copyBoardSlot(coordinateToSlotObject);
      let currentMove = twoThenOne(
        copyOfSlot,
        moveDirections[i][0],
        moveDirections[i][1]
      );

      // If Current Move isn't valid, proceed to next part of loop
      if (currentMove === null || currentMove === undefined) {
        continue;
      }
      //Rewrites Current Move to the actual existing slot instead of the copy
      currentMove = this.findSlotByCoordinate(
        currentMove.coordinate[0],
        currentMove.coordinate[1]
      );

        // Make sure move hasn't already occured- and that you are under 7 moves
        // A knight can get anywhere in 6 moves. Because the array includes the starting position, we check for under 7.
      if (
        this.slotIsInArray(currentMove.coordinate, alreadyVisitedMoves) ===
          false &&
        alreadyVisitedMoves.length < 7
      ) {
        alreadyVisitedMoves.push(currentMove.coordinate);
        if (
          // Check if it's the final move
          this.slotMatchesTarget(currentMove.coordinate, targetCoordinate)
        ) {
          //console.log(`Found the valid moveset!`);
          this.knightPaths.push(alreadyVisitedMoves);
          break; //Found a set of moves- other directions won't yield the right
        } else {
          // Not the final move, more recursion needed
          //console.log({alreadyVisitedMoves})
          this.calculateKnightMoves(
            currentMove.coordinate,
            targetCoordinate,
            alreadyVisitedMoves.slice()
          );

          // If this attempt wasn't the final move, remove it for the next part of the loop
          alreadyVisitedMoves.pop();
        }
      } else {
        //console.log('Move is already in the Array.');
        continue;
      }
    }
  }
}
let newChessBoard = new chessBoard();
// for (let x = 0; x < 8; x++) {
//     for (let y = 0; y < 8; y++) {
//         console.log(`Calculating moves from 0,0 to ${x},${y}`)
//         newChessBoard.calculateKnightMoves([0, 0], [x, y]);
//         newChessBoard.printKnightPaths();
//     }
// }

newChessBoard.calculateKnightMoves([0, 0], [7, 7]);
newChessBoard.printKnightPaths();

