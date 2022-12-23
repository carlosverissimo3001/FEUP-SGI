import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MyAnimator } from "../MyAnimator.js";
import { MySceneGraph } from "../../MySceneGraph.js";
/* import { MyBoard } from "../board-elements/MyBoard.js"; */

export class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator();
        /* this.theme = new MySceneGraph(); */
       /*  this.board = new MyBoard(); */
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        /* this.theme.display();
        this.board.display();
        this.animator.display(); */
    }

    orchestrate() {

    }

    managePick(){

    }
}


