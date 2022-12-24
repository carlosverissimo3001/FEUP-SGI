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
     */
    undo() {
        if (this.moves.length == 0) {
            console.error("No moves to undo");
        }

        this.moves.pop();
    }
}
