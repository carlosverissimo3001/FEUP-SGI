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

  /**
   * Update
   * @param {Number} time - Current time
   */
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

  /**
   * Given a checker, and its destination tile, checks if the move involves eating another checker
   * @param {MyChecker} checker - Checker to be moved
   * @param {MyTile} destination - Destination tile
   * @param {Array} eaten - Array of eaten checkers
   * @param {String} player - Current player
   * @param {String} color - Color of the checker to be moved
   */
  checkEatenCheckers(checker, destination, eaten, player, color) {
    // Get the diagonal tiles of the origin checker
    var diagonalTiles = this.board.getDiagonalTiles(checker.row, checker.col, color);

    // Is the atacker checker a king?
    if (!checker.isKing){
      if (diagonalTiles["left"] == destination || diagonalTiles["right"] == destination) {
        if (player == "Player 1") {
          for (let i = 0; i < eaten.length; i++) {
            this.orchestrator.player1Eat.push(eaten[i]);
          }
        }
        else {
          for (let i = 0; i < eaten.length; i++) {
            this.orchestrator.player2Eat.push(eaten[i]);
          }
        }
        return true;
      }

      else {
        if (diagonalTiles["left"] && diagonalTiles["left"].hasChecker && diagonalTiles["left"].checker.color != color) {
          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["left"].checker.row, diagonalTiles["left"].checker.col, color);

          if(diagonalTiles["left"].checker.isKing){
            if ((nextDiagonal["down left"] && !nextDiagonal["down left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["left"].checker);
              return this.checkEatenCheckers(diagonalTiles["left"].checker, destination, eat, player, color);
            }
          }

          else{
            if ((nextDiagonal["left"] && !nextDiagonal["left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["left"].checker);
              return this.checkEatenCheckers(diagonalTiles["left"].checker, destination, eat, player, color);
            }
          }
        }
        if (diagonalTiles["right"] && diagonalTiles["right"].hasChecker && diagonalTiles["right"].checker.color != color) {
          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["right"].checker.row, diagonalTiles["right"].checker.col, color);

          if(diagonalTiles["right"].checker.isKing){
            if ((nextDiagonal["down right"] && !nextDiagonal["down right"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["right"].checker);
              return this.checkEatenCheckers(diagonalTiles["right"].checker, destination, eat, player, color);
            }
          }
          else{
            if ((nextDiagonal["right"] && !nextDiagonal["right"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["right"].checker);
              return this.checkEatenCheckers(diagonalTiles["right"].checker, destination, eat, player, color);
            }
          }
        }
      }
    }

    else {
      if (diagonalTiles["up left"] == destination || diagonalTiles["up right"] == destination || diagonalTiles["down left"] == destination || diagonalTiles["down right"] == destination) {
        if (player == "Player 1") {
          for (let i = 0; i < eaten.length; i++) {
            this.orchestrator.player1Eat.push(eaten[i]);
          }
        }
        else {
          for (let i = 0; i < eaten.length; i++) {
            this.orchestrator.player2Eat.push(eaten[i]);
          }
        }
        return true;
      }

      else {
        // DOWN LEFT
        if (diagonalTiles["down left"] && diagonalTiles["down left"].hasChecker && diagonalTiles["down left"].checker.color != color) {
          var deltaZ = diagonalTiles["down left"].row - checker.row
          var color = (deltaZ < 0) ? "red" : "blue"

          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["down left"].checker.row, diagonalTiles["down left"].checker.col, color);

          if (diagonalTiles["down left"].checker.isKing) {
           if((nextDiagonal["down left"] && !nextDiagonal["down left"].hasChecker) || (nextDiagonal["up right"] && !nextDiagonal["up right"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["down left"].checker);
              return this.checkEatenCheckers(diagonalTiles["down left"].checker, destination, eat, player, color);
            }
          }

          else{
            if ((nextDiagonal["left"] && !nextDiagonal["left"].hasChecker) || (nextDiagonal["right"] && !nextDiagonal["right"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["down left"].checker);
              return this.checkEatenCheckers(diagonalTiles["down left"].checker, destination, eat, player, color);
            }
          }
        }

        // DOWN RIGHT
        if (diagonalTiles["down right"] && diagonalTiles["down right"].hasChecker && diagonalTiles["down right"].checker.color != color) {
          var deltaZ = diagonalTiles["down right"].row - checker.row
          var color = (deltaZ < 0) ? "red" : "blue"

          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["down right"].checker.row, diagonalTiles["down right"].checker.col, color);

          if (diagonalTiles["down right"].checker.isKing) {
            if((nextDiagonal["down right"] && !nextDiagonal["down right"].hasChecker) || (nextDiagonal["up left"] && !nextDiagonal["up left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["down right"].checker);
              return this.checkEatenCheckers(diagonalTiles["down right"].checker, destination, eat, player, color);
            }
          }

          else{
            if ((nextDiagonal["right"] && !nextDiagonal["right"].hasChecker) || (nextDiagonal["left"] && !nextDiagonal["left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["down right"].checker);
              return this.checkEatenCheckers(diagonalTiles["down right"].checker, destination, eat, player, color);
            }
          }
        }

        // UP LEFT
        if (diagonalTiles["up left"] && diagonalTiles["up left"].hasChecker && diagonalTiles["up left"].checker.color != color) {
          var deltaZ = diagonalTiles["up left"].row - checker.row
          var color = (deltaZ < 0) ? "red" : "blue"
          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["up left"].checker.row, diagonalTiles["up left"].checker.col, color);

          if (diagonalTiles["up left"].checker.isKing) {
            if((nextDiagonal["up left"] && !nextDiagonal["up left"].hasChecker) || (nextDiagonal["up right"] && !nextDiagonal["up right"].hasChecker)){
              let eat = eaten;
              eat.push(diagonalTiles["up left"].checker);
              return this.checkEatenCheckers(diagonalTiles["up left"].checker, destination, eat, player, color);
            }
          }
          else{
            if ((nextDiagonal["left"] && !nextDiagonal["left"].hasChecker) || (nextDiagonal["right"] && !nextDiagonal["right"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["up left"].checker);
              return this.checkEatenCheckers(diagonalTiles["up left"].checker, destination, eat, player, color);
            }
          }
        }

        // UP RIGHT
        if (diagonalTiles["up right"] && diagonalTiles["up right"].hasChecker && diagonalTiles["up right"].checker.color != color) {
          var deltaZ = diagonalTiles["up right"].row - checker.row
          var color = (deltaZ < 0) ? "red" : "blue"

          var nextDiagonal = this.board.getDiagonalTiles(diagonalTiles["up right"].checker.row, diagonalTiles["up right"].checker.col, color);

          if (diagonalTiles["up right"].checker.isKing) {
            if((nextDiagonal["up right"] && !nextDiagonal["up right"].hasChecker) || (nextDiagonal["up left"] && !nextDiagonal["up left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["up right"].checker);
              return this.checkEatenCheckers(diagonalTiles["up right"].checker, destination, eat, player, color);
            }
          }

          else{
            if ((nextDiagonal["right"] && !nextDiagonal["right"].hasChecker) || (nextDiagonal["left"] && !nextDiagonal["left"].hasChecker)) {
              let eat = eaten;
              eat.push(diagonalTiles["up right"].checker);
              return this.checkEatenCheckers(diagonalTiles["up right"].checker, destination, eat, player, color);
            }
          }
        }
      }
    }
  }

  /**
   * Given a checker and a turn, checks if the checker belongs to the player
   * @param {MyChecker} checker - Checker to be checked
   * @param {String} turn - Player 1 or Player 2
  */
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

  /**
   * Move a checker to a destination tile
   * @param {MyChecker} eatenChecker - Was a checker eaten?
   */
  moveChecker(eatenChecker) {
    // Remove selected material from the checker
    this.checker.unsetSelected();

    // Create the move
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


  /**
   * @param {MyChecker} checker
   * @param {MyTile} originTile
   * @param {MyTile} destinationTile
  */
  forceMove(checker, originTile, destinationTile) {
    // Remove selected material from the checker
    checker.unsetSelected();

    // NOTE: There's no need to update the checker position, since, by setting the checker to the destination tile, the checker's "position" is updated automatically

    // If the move is undo

    checker.tile = originTile;
    checker.row = originTile.row;
    checker.col = originTile.col;
    checker.id = originTile.id;

    // Add the checker to the destination tile
    originTile.set(checker);

    // Update the checker's position
    checker.updatePos();

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
