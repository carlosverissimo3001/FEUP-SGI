import { MyGameOrchestrator } from "./orchestrator/MyGameOrchestrator.js";
import { MyGameSequence } from "./orchestrator/game-sequence/MyGameSequence.js";

export class MyAnimator {
  constructor(scene) {
    this.scene = scene;

    this.gameOrchestrator = null;
    this.gameSequence = null;
  }

  start() {}

  reset() {}

  update(time) {}
}
