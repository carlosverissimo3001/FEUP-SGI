import { MyGameMove } from "./MyGameMove.js";

export class MyGameSequence {
    constructor(scene) {
        this.scene = scene;

        this.moves = [];
    }

    /**
     * Add a move to the sequence
     * @param {MyGameMove} move
     */
    addMove(move) {
        this.moves.push(move);
    }

    undo() {
        if (this.moves.length == 0) {
            console.error("No moves to undo");
        }

        this.moves.pop();
    }
}
