import { MyGameState } from "./MyGameState";

/**
 * MyGameStateTurn
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyOrchestrator} orchestrator - Reference to MyOrchestrator object
 * @param {MyBoard} board - Reference to MyBoard object
 */
export class MyGameStateTurn extends MyGameState{
    constructor(scene, orchestrator, board){
        super(scene, orchestrator, board);
    }
}