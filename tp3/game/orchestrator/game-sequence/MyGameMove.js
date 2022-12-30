/**
 * MyGameMove
 * @constructor
 * @param {MySceneGraph} scene - Reference to MyGameOrchestrator object
 * @param {MyChecker} checker - Checker that is being moved
 * @param {MyTile} oldTile - Tile where the checker is being moved from
 * @param {MyTile} newTile - Tile where the checker is being moved to
 * @param {MyBoard} oldBoard - Board before the move
 * @param {MyChecker} eatenChecker - Checker that was eaten, can be null
 */
export class MyGameMove {
    constructor(scene, checker, oldTile, newTile, oldBoard, eatenChecker) {
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

        // Checker that was eaten, can be null
        this.eatenChecker = eatenChecker;
    }

    animate() {

    }
}
