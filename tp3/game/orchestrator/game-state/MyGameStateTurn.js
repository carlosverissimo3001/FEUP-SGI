import { MyChecker } from "../../board-elements/MyChecker.js";
import { MyTile } from "../../board-elements/MyTile.js";
import { MyGameMove } from "../game-sequence/MyGameMove.js";
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

    this.board = board;

    // Was this checker picked after another one
    this.isNewChecker = false;

    this.orchestrator = orchestrator;
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
      this.checkEatenCheckers(
        this.checker,
        this.destinationTile,
        [],
        turn,
        turn == "Player 1" ? "red" : "blue"
      );
    } else if (obj instanceof MyChecker) {
      // If a checker has already been picked, unset its material. The second condition is to avoid a glitch where the checker would be unset when the player clicked on the same checker twice
      if (this.checker != null && this.checker != obj) {
        this.checker.unsetSelected();
      }
      if (this.validChecker(obj, turn)) {
        // If the checker is different from the previous one, set the new checker as the selected one
        if (this.checker != obj) {
          this.isNewChecker = true;
        } else {
          this.isNewChecker = false;
        }
        this.checker = obj;
        this.originTile = obj.tile;
        // Change the checker's material to the selected one
      }
    }
  }

  checkEatenCheckers(checker, destination, eaten, player, color) {
    var diagonalTiles = this.board.getDiagonalTiles(
      checker.row,
      checker.col,
      color
    );
    if (
      diagonalTiles["left"] == destination ||
      diagonalTiles["right"] == destination
    ) {
      if (player == "Player 1") {
        for (let i = 0; i < eaten.length; i++) {
          this.orchestrator.player1Eat.push(eaten[i]);
        }
      } else {
        for (let i = 0; i < eaten.length; i++) {
          this.orchestrator.player2Eat.push(eaten[i]);
        }
      }
      return true;
    } else {
      if (
        diagonalTiles["left"] &&
        diagonalTiles["left"].hasChecker &&
        diagonalTiles["left"].checker.color != color
      ) {
        var nextDiagonal = this.board.getDiagonalTiles(
          diagonalTiles["left"].checker.row,
          diagonalTiles["left"].checker.col,
          color
        );
        if (
          (nextDiagonal["left"] && !nextDiagonal["left"].hasChecker) ||
          (nextDiagonal["right"] && !nextDiagonal["right"].hasChecker)
        ) {
          let eat = eaten;
          eat.push(diagonalTiles["left"].checker);
          return this.checkEatenCheckers(
            diagonalTiles["left"].checker,
            destination,
            eat,
            player,
            color
          );
        }
      } else if (
        diagonalTiles["right"] &&
        diagonalTiles["right"].hasChecker &&
        diagonalTiles["right"].checker.color != color
      ) {
        var nextDiagonal = this.board.getDiagonalTiles(
          diagonalTiles["right"].checker.row,
          diagonalTiles["right"].checker.col,
          color
        );
        if (
          (nextDiagonal["right"] && !nextDiagonal["right"].hasChecker) ||
          (nextDiagonal["left"] && !nextDiagonal["left"].hasChecker)
        ) {
          let eat = eaten;
          eat.push(diagonalTiles["right"].checker);
          return this.checkEatenCheckers(
            diagonalTiles["right"].checker,
            destination,
            eat,
            player,
            color
          );
        }
      }
    }
  }

  /** */
  validChecker(checker, turn) {
    // Checker color
    var checkerColor = turn == "Player 1" ? "red" : "blue";

    // Check if the checker belongs to the player
    if (checker.color == checkerColor) {
      return true;
    } else {
      alert(turn + ", please pick a " + checkerColor + " checker");
      return false;
    }
  }

  moveChecker(eatenChecker) {
    // Remove selected material from the checker
    this.checker.unsetSelected();

    var move = new MyGameMove(
      this.scene,
      this.checker,
      this.originTile,
      this.destinationTile,
      this.orchestrator.board,
      eatenChecker
    );

    // Add the move to the game sequence
    this.orchestrator.gameSequence.addMove(move);

    // If a checker was eaten, animate it, in an arc-like movement, to the eaten checkers' stack
    if (eatenChecker){
      eatenChecker.startEatAnimation();
    }

    // Animate the checker. If eaten checker is not null, then the checker ate another one
    this.checker.startAnimation(this.destinationTile, eatenChecker != null);

    // NOTE: There's no need to update the checker position, since, by setting the checker to the destination tile, the checker's "position" is updated automatically

    // Check if the checker became a king
    if (this.checker.color == "red" && this.destinationTile.row == 0) {
      this.checker.setKing();
    } else if (this.checker.color == "blue" && this.destinationTile.row == 7) {
      this.checker.setKing();
    }

    // Update the checker's tile
    this.checker.tile = this.destinationTile;
    this.checker.row = this.destinationTile.row;
    this.checker.col = this.destinationTile.col;
    this.checker.id = this.destinationTile.id;

    // Remove the checker from the origin tile
    this.originTile.remove();

    this.reset();
  }

  forceMove(checker, originTile, destinationTile) {
    // Remove selected material from the checker
    checker.unsetSelected();

    // NOTE: There's no need to update the checker position, since, by setting the checker to the destination tile, the checker's "position" is updated automatically

    // Update the checker's tile
    checker.tile = originTile;
    checker.row = originTile.row;
    checker.col = originTile.col;
    checker.id = originTile.id;

    // Add the checker to the destination tile
    originTile.set(checker);

    // Remove the checker from the origin tile
    destinationTile.remove();

    this.reset();
  }

  reset() {
    this.checker = null;
    this.originTile = null;
    this.destinationTile = null;
  }
}
