import { MyChecker } from "../../board-elements/MyChecker.js";
import { MyTile } from "../../board-elements/MyTile.js";

export class MyGameMove {
    constructor(scene, checker, oldTile, newTile, oldBoard) {
        this.scene = scene;

        // Pointer to the checker that is being moved
        this.checker = checker;

        // Pointer to the tile where the checker is being moved from
        this.oldTile = oldTile;

        // Pointer to the tile where the checker is being moved to
        this.newTile = newTile;

        // Pointer to the board before the move
        this.oldBoard = oldBoard;

        this.animation = null;
    }

    animate() {

    }
}
