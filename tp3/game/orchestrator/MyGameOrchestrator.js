import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MyAnimator } from "../MyAnimator.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { MyBoard } from "../board-elements/MyBoard.js";
import { MyGameState } from "./game-state/MyGameState.js";
import { MyChecker } from "../board-elements/MyChecker.js";
import { MyTile } from "../board-elements/MyTile.js";
import { MyGameStateTurn } from "./game-state/MyGameStateTurn.js";
import { MyMenu } from "./MyMenu.js";

export class MyGameOrchestrator {
  constructor(scene) {
    this.scene = scene;

    this.gameSequence = new MyGameSequence();
    this.animator = new MyAnimator(scene, this, this.gameSequence);
    this.board = new MyBoard(scene, 8);
    this.menu = new MyMenu(scene);

    // Scene graph
    this.theme = null;
    this.hasLoaded = false;

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
    }

    this.player1Eat = [];

    this.player2Eat = [];
  }

  /** Initializes the scene graph
   * @param {MySceneGraph} sceneGraph
   */
  init(sceneGraph) {
    this.theme = sceneGraph;
    this.hasLoaded = true;

    // Set the camera´s
    this.player1Camera = "Player 1 View";
    this.player2Camera = "Player 2 View";
  }

  update(time) {
    /* this.animator.update(time); */
    this.gameState.update(time);
  }

  display() {
    // Manage picking
    this.managePick();

    this.scene.clearPickRegistration();

    this.scene.clearPickRegistration();

    // Display the scene graph
    this.theme.displayScene();

    // // Display the menu
    // this.menu.display();

    // Display the board
    this.board.display();

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
    if (this.scene.cameraID == this.player1Camera) {
      this.scene.updateCamera(this.player2Camera)
    } else if (this.scene.cameraID == this.player2Camera) {
      this.scene.updateCamera(this.player1Camera)
    }
  }

  orchestrate() {
    // Check if a checker has been picked
    var availableTiles = [];
    var availableCheckers = this.board.getCheckers(this.players[this.turn].color);

    // Sets the available checkers, with a light green hue
    for (var i = 0; i < availableCheckers.length; i++) {
      availableCheckers[i].setAvaliable();
    }


    if (this.gameState.checker != null) {
        availableTiles = this.board.validCheckerPosition(this.gameState.checker, this.players[this.turn].color);
        if (availableTiles.length == 0) {
          alert("This checker cannot move");
          this.gameState.checker = null;
          return;
        }

        for (var i = 0; i < availableTiles.length; i++) {
          // Set available tiles, with a white hue
          availableTiles[i].setAvailable();
        }
        // Sets the selected checker, with a green hue
        this.gameState.checker.setSelected();
      }
      if (this.gameState.destinationTile != null){
        // Check is the destination tile is available
        if (availableTiles.includes(this.gameState.destinationTile)) {
          this.gameState.moveChecker();
          for (var i = 0; i < availableCheckers.length; i++) {
            availableCheckers[i].unsetAvaliable();
          }
          for (var i = 0; i < availableTiles.length; i++) {
            availableTiles[i].unsetAvailable();
          }
          this.eatCheckers();
          this.changePlayerTurn();
        }
        else{
          alert("This tile is not available");
          this.gameState.destinationTile = null;
          return
        }
      }
  }

  chooseScene() {
    this.menu.checkScene();
  }

  eatCheckers() {
    this.board.player1MarkerNumber = this.player1Eat.length;
    if (this.player1Eat.length > 0) {
      for (let i = 0; i < this.player1Eat.length; i++) {
        this.player1Eat[i].x_eat = 7 - this.player1Eat[i].row;
        this.player1Eat[i].y_eat = 0.2+i;
        this.player1Eat[i].z_eat = 7 - this.player1Eat[i].col;
        this.player1Eat[i].tile.checker = null;
        this.player1Eat[i].tile.hasChecker = false;
      }
    }
    this.board.player2MarkerNumber = this.player2Eat.length;
    if (this.player2Eat.length > 0) {
      for (let i = 0; i < this.player2Eat.length; i++) {
        this.player2Eat[i].x_eat = -7 + this.player2Eat[i].row;
        this.player2Eat[i].y_eat = 0.2+i;
        this.player2Eat[i].z_eat = -7 + this.player2Eat[i].col;
        this.player2Eat[i].tile.checker = null;
        this.player2Eat[i].tile.hasChecker = false;
        this.player2Eat[i].display();
      }
    }
  }


  managePick() {
    var debug = false;

    if (!debug)
    {
      if (this.scene.pickMode == false) {
      if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
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
}
