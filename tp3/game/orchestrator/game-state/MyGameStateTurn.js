import { MyChecker } from "../../board-elements/MyChecker.js";
import { MyTile } from "../../board-elements/MyTile.js";
import { MyGameState } from "./MyGameState.js";

/**
 * MyGameStateTurn
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyOrchestrator} orchestrator - Reference to MyOrchestrator object
 * @param {MyBoard} board - Reference to MyBoard object
 */
export class MyGameStateTurn extends MyGameState {
  constructor(scene, orchestrator, board) {
    super(scene, orchestrator, board);

    // Checker to be moved
    this.checker = null;

    // Origin tile
    this.originTile = null;

    // Destination tile
    this.destinationTile = null;

    // Has the checker been validated?
    this.isCheckerValidated = false;
  }

  update(time) {}

  /**
   * Manages the picking
   * @param {Object} obj - Object picked
   * @param {String} turn - Current turn
   */
  checkPick(obj, turn) {
    if (obj instanceof MyTile) {
      this.destinationTile = obj;
    } else if (obj instanceof MyChecker) {
      // If a checker has already been picked, unset its material. The second condition is to avoid a glitch where the checker would be unset when the player clicked on the same checker twice
      if (this.checker != null && this.checker != obj) {
        this.checker.unsetSelected();
      }
      if (this.validChecker(obj, turn)) {
        this.checker = obj;
        this.originTile = obj.tile;
        // Change the checker's material to the selected one
      }
    }
  }

  /** */
  validChecker(checker, turn) {
    // Checker color
    var checkerColor = turn == "Player 1" ? "white" : "black";

    // Check if the checker belongs to the player
    if (checker.color == checkerColor) {
      return true;
    } else {
      alert(turn + ", please pick a " + checkerColor + " checker");
      return false;
    }
  }

  moveChecker() {
    // Remove selected material from the checker
    this.checker.unsetSelected();

    // NOTE: There's no need to update the checker position, since, by setting the checker to the destination tile, the checker's "position" is updated automatically

    // Update the checker's tile
    this.checker.tile = this.destinationTile;
    this.checker.row = this.destinationTile.row;
    this.checker.col = this.destinationTile.col;
    this.checker.id = this.destinationTile.id;

    console.log(this.checker);

    // Add the checker to the destination tile
    this.destinationTile.set(this.checker);

    // Remove the checker from the origin tile
    this.originTile.remove();

    this.reset();
  }

  reset() {
    this.checker = null;
    this.originTile = null;
    this.destinationTile = null;
    this.isCheckerValidated = false;
  }
}
