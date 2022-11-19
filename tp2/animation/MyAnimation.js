import { CGFscene } from "../../lib/CGF.js";

export class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        this.startTime;
        this.endTime;
        this.animationId;

        this.totalTime = 0;

        // Animation matix
        this.animation = mat4.create();
    }

    /**
    * @param {integer} t - elapsed time since last call
    */
    update(t) {
        //
    }
}