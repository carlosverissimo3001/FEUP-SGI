import { CGFscene } from "../../lib/CGF.js";

export class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        this.startTime;
        this.endTime;

        this.totalTime = 0;

        // Animation matix
        this.animation = mat4.create();
    }

    /**
    * Update (override by subclasses)
    * @param {integer} t - elapsed time
    */
    update(t) {

    }
}