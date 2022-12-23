import { MyGameOrchestrator } from "./orchestrator/MyGameOrchestrator.js";
import { MyGameSequence } from "./orchestrator/game-sequence/MyGameSequence.js";

export class MyAnimator {
  constructor(scene, gameOrchestrator, gameSequence) {
    this.scene = scene;

    // Pointer to the game orchestrator
    this.gameOrchestrator = gameOrchestrator;

    // Pointer to the game sequence
    this.gameSequence = gameSequence;
  }

  start() {}

  reset() {}

  update(time) {}
}
