import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { MyBoard } from "../board-elements/MyBoard.js";
import { MyGameState } from "./game-state/MyGameState.js";
import { MyChecker } from "../board-elements/MyChecker.js";
import { MyTile } from "../board-elements/MyTile.js";
import { MyGameStateTurn } from "./game-state/MyGameStateTurn.js";

export class MyGameOrchestrator {
  constructor(scene) {
    this.scene = scene;

    this.gameSequence = new MyGameSequence(this.scene);

    // Set the board
    this.board = new MyBoard(scene, 8);

    // Scene graph
    this.theme = null;
    this.hasLoaded = false;

    // Automatic camera rotation
    this.autoRotate = false;

    // Audio
    this.audio = new Audio("sounds/select.mp3");
    this.audio.volume = 1;
    this.audioActive = false;

    this.pieceAnimationDuration = 1

    // Game state
    this.gameState = new MyGameStateTurn(scene, this, this.board);

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

    // Player that starts the game
    this.turn = "Player 1";

    // Checkers eaten by each player
    this.player1Eat = [];
    this.player2Eat = [];

    // Copy of set of tiles that are avaliable to move to
    this.lastAvailableTiles = [];

    this.availableTiles = [];

    this.eatenChecker = null;

    this.movingCheckers = [];

    this.hasEatenCheckerFinished = false;

    this.ongoingAnimation = false;
  }

  /** Initializes the scene graph
   * @param {MySceneGraph} sceneGraph
   */
  init(sceneGraph) {
    // Set the scene graph
    this.theme = sceneGraph;

    // Finish loading
    this.hasLoaded = true;

    // Set the cameras
    this.player1Camera = "Player 1";
    this.player2Camera = "Player 2";

    for (var i = 0; i < this.board.checkers.length; i++) {
      this.board.checkers[i].setOrchestrator(this);
    }
  }

  /**
   * Updates the game
   * @param {Number} time - Current time
   */
  update(time) {
    /* Update all ongoing checkers animations, includes normal animation, and deposit animation*/
    for (let i = 0; i < this.board.checkers.length; i++) {
      if (this.board.checkers[i].animation != null) {
        // If this checker is not in the moving checkers array, add it
        if (!this.movingCheckers.includes(this.board.checkers[i]))
          this.movingCheckers.push(this.board.checkers[i]);

        this.board.checkers[i].animation.update(time);
      }
    }
  }

  /** Displays the moving checkers
   * @param {MyChecker} checker - The checker to be displayed
   */
  displayMovingChecker(checker) {
    checker.display();
  }

  display(time) {
    // Manage picking
    this.managePick();

    this.scene.clearPickRegistration();

    // Display the scene graph
    /* this.theme.displayScene(); */

    // Display the board
    this.board.display();

    for (let i = 0; i < this.movingCheckers.length; i++) {
      // If the checker is moving, display it
      if (this.movingCheckers[i].moving) {
        this.displayMovingChecker(this.movingCheckers[i]);
      }
      // If the checker has finished moving, check some conditions
      else {
        // If the moving checker is not an eaten checker, we need to set its tile so that it can be displayed
        if (!this.movingCheckers[i].wasEaten) {
          this.movingCheckers[i].tile.set(this.movingCheckers[i]);
          this.movingCheckers[i].updatePos();

          // If no checker was eaten, turn the lights back on after the attacking animation has finished
          // OTHERWISE, the lights will be turned on when the eaten checker has finished moving
          if (!this.eatenChecker) {
            // Turn the lights back on
            this.turnOnLights();

            // Delete the spotlight
            this.deleteSpotlight();
          }

          // Remove the checker from the moving checkers array
          this.movingCheckers.splice(i, 1);
          /* i--; */
        }

        // If the moving checker was an eaten checker, the orchestrator is the one responsible for displaying it
        else {
          // Only turn the lights back on when the eaten checker has finished moving
          if (!this.hasEatenCheckerFinished && !this.movingCheckers[i].isMoving_eat) {
            this.hasEatenCheckerFinished = true;

            // Unset the eaten checker
            this.eatenChecker = null;

            // Delete the spotlight
            this.deleteSpotlight();

            // Turn the lights back on
            this.turnOnLights();
          }

          //! This is a hotfix that fixes the bug when a checker would be displayed in the deposit, but would return to the board, in the next turn
          if (this.eatenChecker)
            this.eatenChecker = null;

          this.movingCheckers[i].display();
        }
      }
    }

  }

  /**
   * Changes the player turn
   */
  changePlayerTurn() {

    this.turn == "Player 1"
      ? (this.turn = "Player 2")
      : (this.turn = "Player 1");

    // Change the camera, if auto rotate is on
    if (this.autoRotate) {
      // If current camera is player 1, change to player 2
      if (this.scene.cameraID == this.player1Camera)
        this.scene.updateCamera(this.player2Camera);
      // If current camera is player 2, change to player 1
      else if (this.scene.cameraID == this.player2Camera)
        this.scene.updateCamera(this.player1Camera);
      // If current camera is not player 1 or 2, change the next player's camera
      else {
        if (this.turn == "Player 1")
          this.scene.updateCamera(this.player1Camera);
        else
          this.scene.updateCamera(this.player2Camera);
      }
    }

    /*  */
  }

  clearPicked() {
    // If a checker had been picked, unset it
    if (this.gameState.checker != null) this.gameState.checker.unsetSelected();

    this.gameState.checker = null;
    this.gameState.destinationTile = null;

    // Unsets the available tiles
    this.unsetAvailable(this.lastAvailableTiles);
  }

  orchestrate() {
    this.availableTiles = [];

    var availableCheckers = this.board.getCheckers(
      this.players[this.turn].color
    );

    /* if (this.gameState.checker != null && this.gameState.checker.selected)
      console.log(availableCheckers) */

    // Sets the available checkers, with a light color
    this.setAvailable(availableCheckers);

    if (this.gameState.checker != null) {
      // If a checker is selected, get the available tiles for it
      this.availableTiles = this.board.validCheckerPosition(
        this.gameState.checker,
        this.players[this.turn].color
      );

      // If no tiles are available, the checker cannot move
      if (this.availableTiles.length == 0) {
        alert("This checker cannot move");
        this.gameState.checker = null;
        return;
      }

      if (this.gameState.isNewChecker) {
        // Unsets the last available tiles -> the checker has changed
        this.unsetAvailable(this.lastAvailableTiles);

        // Sets the new avaliable tiles, with a light color
        this.setAvailable(this.availableTiles);
      }

      // Assume a double click in the same checker as an unselect
      else {
        this.gameState.checker.unsetSelected();
        this.gameState.checker = null;
        this.unsetAvailable(this.availableTiles);
        return;
      }

      // Creates a copy of the available tiles
      this.lastAvailableTiles = this.availableTiles;

      // Sets the selected checker, with a green hue
      this.gameState.checker.setSelected();
    }

    if (this.gameState.destinationTile != null) {
      // If a tile has been picked, check if it is valid
      if (this.availableTiles.includes(this.gameState.destinationTile)) {
        // Check if this move involves eating a checker
        this.eatCheckers();

        // Move the checker to the tile
        this.gameState.moveChecker(this.eatenChecker);

        // Get the lights that were turned on
        this.getTurnedOnLights();

        // Turn off the lights
        this.turnOffLights();

        // Unset the avaliable tiles and checkers
        this.unsetAvailable(this.board.checkers);
        this.unsetAvailable(this.availableTiles);

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

  eatCheckers() {
    /* console.log("Player 1 has eaten " + this.player1Eat.length + " checkers");
    console.log("Player 2 has eaten " + this.player2Eat.length + " checkers");
 */
    this.board.player1MarkerNumber = this.player1Eat.length;
    if (this.player1Eat.length > 0) {
      for (let i = 0; i < this.player1Eat.length; i++) {
        if (!this.player1Eat[i].wasEaten) {
          this.player1Eat[i].depositLocation[1] += 0.165 * i;
          // The tile no longer has a checker. The display method will be called by the orchestrator
          this.player1Eat[i].tile.remove();

          // The checker has been eaten
          this.player1Eat[i].wasEaten = true;

          // The checker that was eaten
          this.eatenChecker = this.player1Eat[i];
        }
      }
    }
    this.board.player2MarkerNumber = this.player2Eat.length;
    if (this.player2Eat.length > 0) {
      for (let i = 0; i < this.player2Eat.length; i++) {
        if (!this.player2Eat[i].wasEaten) {
          this.player2Eat[i].depositLocation[1] += 0.17 * i;
          this.player2Eat[i].tile.remove();
          this.player2Eat[i].wasEaten = true;
          this.eatenChecker = this.player2Eat[i];
        }
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
            var objid = this.scene.pickResults[i][1]; // get the id of the nth pick result

            if (obj) {
              // is this a valid pick?
              if (obj instanceof MyTile) {
                if (this.gameState.checker != null) {
                  this.gameState.checkPick(obj, this.turn);
                } else {
                  alert(this.turn + ", please select a checker first");
                }
              } else if (obj instanceof MyChecker && !obj.wasEaten) {
                // play a sound
                this.audio.play();

                this.gameState.checkPick(obj, this.turn);
              }
            } else {
              console.log("Clicked on nothing");
              this.clearPicked();
            }
          }
          this.scene.pickResults.splice(0, this.scene.pickResults.length); // clear the pick results
        }
      }
    }
  }

  undo() {
    if (this.eatenChecker != null && this.eatenChecker.isMoving_eat) {
      alert("Please wait for the checker to finish moving");
      return;
    }

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
    if (this.gameState.checker != null)
      this.gameState.checker.unsetSelected();

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
        this.board.player1MarkerNumber = lastMove.oldBoard.player1MarkerNumber - 1;

        // Remove the checker from the eaten checkers array
        this.player1Eat.pop();
      } else if (lastMove.eatenChecker.color == "red") {
        // Update the scoreboard
        this.board.player2MarkerNumber = lastMove.oldBoard.player2MarkerNumber - 1;

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

    this.board.initialized = false;

    // Reset the board
    this.board = new MyBoard(this.scene, 8);

    // Reset the game sequence
    this.gameSequence = new MyGameSequence();

    // Reset the eaten checkers
    this.player1Eat = [];
    this.player2Eat = [];

    // Reset the turn
    this.turn = "Player 1";

    // Reset the game state
    this.gameState = new MyGameStateTurn(this.scene, this, this.board);

    // Available tiles
    this.lastAvailableTiles = [];
  }

  movie() {
    var confirmation = confirm(
      "Are you sure you want to watch the movie of the game? The state of the game will be preserved"
    );
    if (!confirmation) return;
  }

  /**
   * Get the lights that are turned on at the moment
   */
  getTurnedOnLights() {
    this.turnedOnLights = [];
    var lightNames = this.scene.lightsVal;

    for (var key in lightNames) {
      if (lightNames.hasOwnProperty(key)) {
        if (lightNames[key]) this.turnedOnLights.push(key);
      }
    }
  }

  /**
   * Called after the movement of a checker. Turns on the lights that were on before the movement
   */
  turnOnLights() {
    var lights = this.scene.lights;
    var i = 0;

    for (var key in this.turnedOnLights) {
      // If the light was on before the movement
      if (this.turnedOnLights.hasOwnProperty(key)) {
        // Turn it on
        lights[i].enable();

        // Check the checkbox
        this.scene.lightsVal[this.turnedOnLights[key]] = true;

        lights[i].update();
        i++;
      }
    }


  }

  /**
   * Called before the movement of a checker. Turns off all the lights
   */
  turnOffLights() {
    var lightNames = this.scene.lightsVal;
    var lights = this.scene.lights;
    var i = 0;

    // For each light
    for (var key in lightNames) {
      if (lightNames.hasOwnProperty(key)) {
        // Turn it off
        lights[i].disable();

        // Uncheck the checkbox
        lightNames[key] = false;

        lights[i].update();
        i++;
      }
    }
  }

  /**
   * Adds a light to the scene
   * @param {Array} target The target position of the light
   */
  addSpotlight(target) {
    // Get the number of lights
    var i = this.scene.lightsVal.length;

    var xPos = target[0] - 1;
    var yPos = target[1]
    var zPos = target[2] - 1;

    // Position of the light
    this.scene.lights[i].setPosition(
      xPos,
      1, // It positions the light above the checker
      zPos,
      1
    );

    // Set the light ambient, diffuse and specular
    this.scene.lights[i].setAmbient(0, 0, 0, 1);
    this.scene.lights[i].setDiffuse(1, 1, 1, 1);
    this.scene.lights[i].setSpecular(1, 1, 1, 1);

    // Set the light cutoff and exponent
    this.scene.lights[i].setSpotCutOff(0);
    this.scene.lights[i].setSpotExponent(1);

    // Set the target of the light -> board
    this.scene.lights[i].setSpotDirection(xPos, 0, zPos);

    // Enable the light
    this.scene.lights[i].enable();

    // Update the light
    this.scene.lights[i].update();

  }

  deleteSpotlight() {
    // Get the number of lights
    var i = this.scene.lightsVal.length;

    // Disable the light
    this.scene.lights[i].disable();

    // No need to remove, as the next created light will overwrite the last one

    // Update the light
    this.scene.lights[i].update();
  }

  updateCheckerAnimationDuration(duration) {
    for (var i = 0; i < this.board.checkers.length; i++) {
      this.board.checkers[i].updateAnimationDuration(duration);
    }
  }
}
