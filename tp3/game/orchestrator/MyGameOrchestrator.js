import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MyAnimator } from "../MyAnimator.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { MyBoard } from "../board-elements/MyBoard.js";
import { MyGameState } from "./game-state/MyGameState.js";
import { MyChecker } from "../board-elements/MyChecker.js";
import { MyTile } from "../board-elements/MyTile.js";

export class MyGameOrchestrator {
  constructor(scene) {
    this.scene = scene;

    this.gameSequence = new MyGameSequence();
    this.animator = new MyAnimator(scene, this, this.gameSequence);
    this.board = new MyBoard(scene, 8);

    // Scene graph
    this.theme = null;
    this.hasLoaded = false;
  }

  /** Initializes the scene graph
   * @param {MySceneGraph} sceneGraph
   */
  init(sceneGraph) {
    this.theme = sceneGraph;
    this.hasLoaded = true;

    // Get the camera from the scene graph
    this.player1Camera = this.theme.views["Player 1 View"];
    this.player2Camera = this.theme.views["Player 2 View"];
  }

  update(time) {
    /* this.animator.update(time); */
  }

  display() {
    // Manage picking
    this.managePick();

    // Display the scene graph
    this.theme.displayScene();

    // Display the board
    this.board.display();
  }

  orchestrate() {}

  managePick() {
    if (this.scene.pickMode == false) {
      if (this.scene.pickResults != null && this.scene.pickResults.length > 0) { // if there are pick results
        for (var i = 0; i < this.scene.pickResults.length; i++) {   // for each pick result
          var obj = this.scene.pickResults[i][0];   // get the nth pick result
          if (obj) {    // is this a valid pick?
            if (obj instanceof MyTile) {
              console.log("You picked a tile, with id: " + obj.id);
            }
            else if (obj instanceof MyChecker) {
              console.log("You picked a " + obj.color + " checker, with id: " + obj.id);
            }
          }
        }
        this.scene.pickResults.splice(0, this.scene.pickResults.length); // clear the pick results
      }
    }
  }
}
