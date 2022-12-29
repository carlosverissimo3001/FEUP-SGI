import { MyGameMove } from "./MyGameMove.js";

export class MyGameSequence {
    constructor(scene) {
        this.scene = scene;

        this.moves = [];
    }

    /**
     * Add a move to the sequence
     * @param {MyGameMove} move - Move to be added
     */
    addMove(move) {
        this.moves.push(move);
    }

    /**
     * Undo the last move
     * @throws {Error} - If there are no moves to undo
     * @returns {MyGameMove} - The move that was undone
     */
    undo() {
        if (this.moves.length == 0) {
           alert("No moves to undo");
        }

        return this.moves.pop();
    }
}
