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
        this.startingPoint = new chessBoardSlot([0, 0]);
        this.slotReferences = [];
    }

    createBoard(){
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.slotReferences.push(new chessBoardSlot([x, y], null, null, null, null));
            }
    }}

    findSlotByCoordinate(x, y){
        this.slotReferences.forEach(slot => {
            if ((slot.coordinate[0]=== x) && (slot.coordinate[1] === y)){
                // Slot matches x and y coordinates
                return slot
            };
        })
        // No slot matches the coordinates
        return null
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
            if (slot.coordinate[0] < 7){
                /* Assigns each slot's up direction to the slot one row above it,
                unless it's in the top row */
                this.assignUpDirection(slot, slot.coordinate[0]+1, slot.coordinate[1])
            }
        }
    }

}

let newChessBoard = new chessBoard();
newChessBoard.createBoard();
// for (const slot of chessBoardSlots) {
//     console.log({slot})
//     switch (slot) {
//         case slot.coordinate[0] < 7:
//             slot.up = slot.coordinate
//     }
// }
