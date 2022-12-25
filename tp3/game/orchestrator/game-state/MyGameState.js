/**
 * MyGameState
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyOrchestrator} orchestrator - Reference to MyOrchestrator object
 * @param {MyBoard} board - Reference to MyBoard object
 */
export class MyGameState{
    constructor(scene, orchestrator, board){
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.board = board;
    }
}