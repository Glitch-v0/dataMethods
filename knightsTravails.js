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
    constructor(coordinate, up=null, left=null, right=null, down=null){
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

    printKnightPaths() {
        let counter = 1;
        console.log('Running printKnightPaths...')
        console.log(`# of Paths = ${this.knightPaths.length}`)
        this.knightPaths.forEach(path => {
            console.log(`Path ${1}:\n`)
            counter++;
            path.forEach(move => {
                console.log(move.coordinate)
            });
        });
    }

    calculateKnightMoves(startingSlot, targetCoordinateArray, alreadyVisitedMoves = [startingSlot]) {
        console.log(`Searching for ${targetCoordinateArray}`)
        if ( // Base case- the target coordinate is the same as the starting slot
            //Can't directly compare two arrays- values are separated out
            startingSlot.coordinate[0] === targetCoordinateArray[0] &&
            startingSlot.coordinate[1] === targetCoordinateArray[1]
        ) {
            return;
        }

        function twoThenOne(slot, firstDirection, secondDirection) {
            let nextMove = slot;
            //Two moves first direction, if possible
            for (let i = 0; i < 2; i++) {
                if (nextMove[firstDirection] !== null) {
                    nextMove = nextMove[firstDirection];
                } else {
                    return null; //Don't continue if the move is null
                }
            }
            //One move second direction, if possible
            if (nextMove[secondDirection] !== null) {
                nextMove = nextMove[secondDirection];
            } else {
                return null; //Don't continue if the move is null
            }

            return nextMove;
            
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
            let currentMove = twoThenOne(
                startingSlot,
                moveDirections[i][0],
                moveDirections[i][1]
            );
            if (currentMove !== null) {
                if (
                    // If it's a valid move, then check if it's the final move
                    currentMove.coordinate[0] === targetCoordinateArray[0] &&
                    currentMove.coordinate[1] === targetCoordinateArray[1]
                ) {
                    alreadyVisitedMoves.push(currentMove);
                    console.log(`Found the valid moveset!`);
                    this.knightPaths.push(alreadyVisitedMoves);
                    return; //Found a set of moves
                } else {
                    if (!alreadyVisitedMoves.includes(currentMove)) {
                        console.log(currentMove.coordinate);
                        alreadyVisitedMoves.push(currentMove);
                        this.calculateKnightMoves(
                            currentMove,
                            targetCoordinateArray,
                            alreadyVisitedMoves
                        );
                        let currentMoveIndex = alreadyVisitedMoves.indexOf(currentMove);
                        alreadyVisitedMoves.splice(currentMoveIndex, 1);
                    }
                    return
                }
            }
        }
    }
}
let newChessBoard = new chessBoard();
newChessBoard.calculateKnightMoves(newChessBoard.startingPoint, [5, 5]);
newChessBoard.printKnightPaths();