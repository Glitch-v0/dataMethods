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
    constructor(){
        this.startingPoint;
        this.slotReferences = [];
    }

    createBoard(){
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.slotReferences.push(new chessBoardSlot([x, y], null, null, null, null));
            }
    }
    this.startingPoint = this.slotReferences[0];
}

    findSlotByCoordinate(x, y){
        // Use the find method to return the first slot that matches the coordinates
        return this.slotReferences.find(slot => slot.coordinate[0] === x && slot.coordinate[1] === y);
    }

    assignUpDirection(currentSlot, referenceSlotX, referenceSlotY){
        currentSlot.up = this.findSlotByCoordinate(referenceSlotX,referenceSlotY);
    }
    assignDownDirection(currentSlot, referenceSlotX, referenceSlotY){
        currentSlot.down = this.findSlotByCoordinate(referenceSlotX,referenceSlotY);
    }
    assignLeftDirection(currentSlot, referenceSlotX, referenceSlotY){
        currentSlot.left = this.findSlotByCoordinate(referenceSlotX,referenceSlotY);
    }
    assignRightDirection(currentSlot, referenceSlotX, referenceSlotY){
        currentSlot.right = this.findSlotByCoordinate(referenceSlotX,referenceSlotY);
    }

    assignAllReferences(){
        for (let slot of this.slotReferences) {
            // Just easier to read variables
            let xCoordinate = slot.coordinate[0];
            let yCoordinate = slot.coordinate[1];
            if (xCoordinate < 7){
                /* Assigns each slot's right direction to the slot one column to the right,
                unless it's in the last column */
                this.assignRightDirection(slot, xCoordinate + 1, yCoordinate);
            }
            if (xCoordinate > 0){
                /* Assigns each slot's left direction to the slot one column to the left,
                unless it's in the first column */
                this.assignLeftDirection(slot, xCoordinate - 1, yCoordinate);
            }
            if (yCoordinate > 0){
                /* Assigns each slot's down direction to the slot one row below it,
                unless it's in the bottom row */
                this.assignDownDirection(slot, xCoordinate, yCoordinate - 1);
            }
            if (yCoordinate < 7){
                /* Assigns each slot's up direction to the slot one row above it,
                unless it's in the top row */
                this.assignUpDirection(slot, xCoordinate, yCoordinate + 1);
            }
        }
    }

    printAllSlots(){
        for (let slot of this.slotReferences) {
            console.log(
                `\nSlot coordinate: ${slot.coordinate}
            `);
            if (slot.up !== null){
                console.log(`Up reference: ${slot.up.coordinate}\n`);
            }
            if (slot.down !== null){
                console.log(`Down reference: ${slot.down.coordinate}\n`);
            }
            if (slot.left !== null){
                console.log(`Left reference: ${slot.left.coordinate}\n`);
            }
            if (slot.right !== null){
                console.log(`Right reference: ${slot.right.coordinate}\n`);
            }
        }
    }

    printSnakePattern(){
        let tempSlot = this.startingPoint;
        console.log(tempSlot.coordinate);
        for (let i = 0; i < 4; i++) {
            while (tempSlot.right !== null){
                tempSlot = tempSlot.right;
                console.log(tempSlot.coordinate);
            }
            tempSlot = tempSlot.up;
            console.log(tempSlot.coordinate);
            while (tempSlot.left !== null){
                tempSlot = tempSlot.left;
                console.log(tempSlot.coordinate);
            }
            if (tempSlot.up !== null){
                tempSlot = tempSlot.up;
                console.log(tempSlot.coordinate);
            }
        }
    }

    printKnightMoves(startingSlot){
        function twoThenOne(slot, firstDirection, secondDirection){
            let finalMove = slot;
            //Two moves first direction, if possible
            for (let i = 0; i < 2; i++) {
                if (finalMove[firstDirection] !== null){
                    finalMove = finalMove[firstDirection];
                } else {
                    return
                }
            }
            //One move second direction, if possible
            if (finalMove[secondDirection] !== null){
                finalMove = finalMove[secondDirection];
            } else {
                return
            }
            //Only makes it here if the 3 moves were valid
            console.log(`Moving ${firstDirection}x2, ${secondDirection}x1: ${finalMove.coordinate}`);
            return finalMove
        }
        console.log(`Knight at ${startingSlot.coordinate} can make the following moves:`)
        twoThenOne(startingSlot, "right", "up");
        twoThenOne(startingSlot, "right", "down");
        twoThenOne(startingSlot, "left", "up");
        twoThenOne(startingSlot, "left", "down");
        twoThenOne(startingSlot, "up", "left");
        twoThenOne(startingSlot, "up", "right");
        twoThenOne(startingSlot, "down", "left");
        twoThenOne(startingSlot, "down", "right");
    }
    
}

let newChessBoard = new chessBoard();
newChessBoard.createBoard();
newChessBoard.assignAllReferences();
newChessBoard.printKnightMoves(newChessBoard.startingPoint);