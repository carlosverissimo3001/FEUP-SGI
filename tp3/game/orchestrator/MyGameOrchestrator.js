import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MyAnimator } from "../MyAnimator.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { MyBoard } from "../board-elements/MyBoard.js";
import { MyGameState } from "./game-state/MyGameState.js";
import { MyChecker } from "../board-elements/MyChecker.js";
import { MyTile } from "../board-elements/MyTile.js";
import { MyGameStateTurn } from "./game-state/MyGameStateTurn.js";
/* import { MyMenu } from "./MyMenu.js"; */

export class MyGameOrchestrator {
  constructor(scene) {
    this.scene = scene;

    this.gameSequence = new MyGameSequence(this.scene);
    this.animator = new MyAnimator(scene, this, this.gameSequence);
    this.board = new MyBoard(scene, 8);
    /* this.menu = new MyMenu(scene); */

    // Scene graph
    this.theme = null;
    this.hasLoaded = false;

    // Automatic camera rotation
    this.autoRotate = false;

    // Game state
    this.gameState = new MyGameStateTurn(scene, this, this.board);

    this.turn = "Player 1";

    this.players = {
      "Player 1": {
        score: 0,
        color: "red",
      },
      "Player 2": {
        score: 0,
        color: "blue",
      },
    };

    // Checkers eaten by each player
    this.player1Eat = [];
    this.player2Eat = [];

    // Copy of set of tiles that are avaliable to move to
    this.lastAvailableTiles = [];

    this.eatenChecker = null;
  }

  /** Initializes the scene graph
   * @param {MySceneGraph} sceneGraph
   */
  init(sceneGraph) {
    this.theme = sceneGraph;
    this.hasLoaded = true;

    // Set the cameras
    this.player1Camera = "Player 1 View";
    this.player2Camera = "Player 2 View";
  }

  update(time) {
    /* this.animator.update(time); */
    this.gameState.update(time);
  }

  displayEatenCheckers() {
    for (let i = 0; i < this.player1Eat.length; i++) {
      this.player1Eat[i].display();
    }
    for (let i = 0; i < this.player2Eat.length; i++) {
      this.player2Eat[i].display();
    }
  }

  display() {
    // Manage picking
    this.managePick();

    this.scene.clearPickRegistration();

    this.scene.clearPickRegistration();

    // Display the scene graph
    this.theme.displayScene();

    // Display the menu
    // this.menu.display();

    // Display the board
    this.board.display();

    // Display the eaten checkers
    this.displayEatenCheckers();
  }

  /** Changes the game state
   * @param {MyGameState} state - The new game state
   */
  changeState(state) {
    this.gameState = state;
  }

  changePlayerTurn() {
    if (this.turn == "Player 1") {
      this.turn = "Player 2";
    } else {
      this.turn = "Player 1";
    }

    // Change the camera
    if (this.autoRotate) {
      if (this.scene.cameraID == this.player1Camera)
        this.scene.updateCamera(this.player2Camera);

      else if (this.scene.cameraID == this.player2Camera)
        this.scene.updateCamera(this.player1Camera);
    }
  }

  orchestrate() {
    var availableTiles = [];

    // Get the available checkers
    var availableCheckers = this.board.getCheckers(
      this.players[this.turn].color
    );

    // Sets the available checkers, with a light color
    this.setAvailable(availableCheckers);

    if (this.gameState.checker != null) {
      // If a checker is selected, get the available tiles for it
      availableTiles = this.board.validCheckerPosition(
        this.gameState.checker,
        this.players[this.turn].color
      );

      // If no tiles are available, the checker cannot move
      if (availableTiles.length == 0) {
        alert("This checker cannot move");
        this.gameState.checker = null;
        return;
      }

      if (this.gameState.isNewChecker) {
        // Unsets the last available tiles -> the checker has changed
        this.unsetAvailable(this.lastAvailableTiles);

        // Sets the new avaliable tiles, with a light color
        this.setAvailable(availableTiles);
      }

      // Creates a copy of the available tiles
      this.lastAvailableTiles = availableTiles;

      // Sets the selected checker, with a green hue
      this.gameState.checker.setSelected();
    }

    if (this.gameState.destinationTile != null) {
      // If a tile has been picked, check if it is valid
      if (availableTiles.includes(this.gameState.destinationTile)) {
        // Check if this move involves eating a checker
        this.eatCheckers();

        // Move the checker to the tile
        this.gameState.moveChecker(this.eatenChecker);

        // Unset the avaliable tiles and checkers
        this.unsetAvailable(availableCheckers);
        this.unsetAvailable(availableTiles);

        // Change the player turn
        this.changePlayerTurn();
      }
      // If the tile is not valid, alert the player
      else {
        alert("This tile is not available");
        this.gameState.destinationTile = null;
        return;
      }
    }
  }

  chooseScene() {
    this.menu.checkScene();
  }

  eatCheckers() {
    console.log("Player 1 has eaten " + this.player1Eat.length + " checkers");
    console.log("Player 2 has eaten " + this.player2Eat.length + " checkers");

    this.board.player1MarkerNumber = this.player1Eat.length;
    if (this.player1Eat.length > 0) {
      for (let i = 0; i < this.player1Eat.length; i++) {
        if (!this.player1Eat[i].wasEaten) {
          this.player1Eat[i].y_eat += 0.17 * i;
          this.player1Eat[i].tile.remove();
          this.player1Eat[i].wasEaten = true;
          this.eatenChecker = this.player1Eat[i];
        }
        this.player1Eat[i].display();
      }
    }
    this.board.player2MarkerNumber = this.player2Eat.length;
    if (this.player2Eat.length > 0) {
      for (let i = 0; i < this.player2Eat.length; i++) {
        if (!this.player2Eat[i].wasEaten) {
          this.player2Eat[i].y_eat += 0.17 * i;
          this.player2Eat[i].tile.remove();
          this.player2Eat[i].wasEaten = true;
          this.eatenChecker = this.player2Eat[i];
        }
        this.player2Eat[i].display();
      }
    }
  }

  managePick() {
    var debug = false;

    if (!debug) {
      if (this.scene.pickMode == false) {
        if (
          this.scene.pickResults != null &&
          this.scene.pickResults.length > 0
        ) {
          // if there are pick results
          for (var i = 0; i < this.scene.pickResults.length; i++) {
            // for each pick result
            var obj = this.scene.pickResults[i][0]; // get the nth pick result

            if (obj) {
              // is this a valid pick?
              if (obj instanceof MyTile && obj.row != 0 && obj.col != 0) {
                if (this.gameState.checker != null) {
                  this.gameState.checkPick(obj, this.turn);
                } else {
                  alert(this.turn + ", please select a checker first");
                }
              } else if (obj instanceof MyChecker) {
                this.gameState.checkPick(obj, this.turn);
              }
            }
          }
          this.scene.pickResults.splice(0, this.scene.pickResults.length); // clear the pick results
        }
      }
    }
  }

  undo() {
    // Prompt a confirmation message
    if (this.gameSequence.moves.length <= 0) {
      alert("There are no moves to undo");
      return;
    }

    var confirmation = confirm(
      "Are you sure you want to undo the last move? This action cannot be undone"
    );
    if (!confirmation) return;

    // Get the last move's board
    var lastMove = this.gameSequence.undo();

    // If a checker was selected, unset it
    if (this.gameState.checker != null) this.gameState.checker.unsetSelected();

    // Unset tiles that were available
    this.unsetAvailable(this.lastAvailableTiles);

    // Unset the avaliable checkers
    this.unsetAvailable(this.board.getCheckers(this.players[this.turn].color));

    // Move the checker back to the old tile
    this.gameState.forceMove(
      lastMove.checker,
      lastMove.oldTile,
      lastMove.newTile
    );

    // Check if a checker was eaten in the last move
    if (lastMove.eatenChecker != null) {
      // Set its tile to have a checker
      lastMove.eatenChecker.tile.set(lastMove.eatenChecker);

      // Set it to not have been eaten
      lastMove.eatenChecker.wasEaten = false;

      if (lastMove.eatenChecker.color == "blue") {
        // Update the scoreboard
        this.board.player1MarkerNumber =
          lastMove.oldBoard.player1MarkerNumber - 1;

        // Remove the checker from the eaten checkers array
        this.player1Eat.pop();
      } else if (lastMove.eatenChecker.color == "red") {
        // Update the scoreboard
        this.board.player2MarkerNumber = lastMove.oldBoard.player2MarkerNumber;

        // Remove the checker from the eaten checkers array
        this.player2Eat.pop();
      }
    }

    // Change the player turn
    this.changePlayerTurn();
  }

  unsetAvailable(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].unsetAvailable();
    }
  }

  setAvailable(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAvailable();
    }
  }

  restart() {
    // Prompt a confirmation message
    var confirmation = confirm(
      "Are you sure you want to restart the game? This action cannot be undone"
    );
    if (!confirmation) return;

    // Reset the board
    this.board = new MyBoard(this.scene, this.players, this.gameState);

    // Reset the game sequence
    this.gameSequence = new MyGameSequence();

    // Reset the eaten checkers
    this.player1Eat = [];
    this.player2Eat = [];

    // Reset the scoreboard
    this.board.player1MarkerNumber = 0;
    this.board.player2MarkerNumber = 0;

    // Reset the turn
    this.turn = "Player 1";
  }

  movie() {
    var confirmation = confirm ("Are you sure you want to watch the movie of the game? The state of the game will be preserved");
    if (!confirmation) return;
  }
}
