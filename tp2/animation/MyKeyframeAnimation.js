import { CGFscene } from "../../lib/CGF.js";
import {MyAnimation} from "./MyAnimation.js"
import {MyKeyframe} from "./MyKeyframe.js"


export class MyKeyframeAnimation extends MyAnimation {
    constructor(scene) {
        super(scene);

        this.frames = [];
        this.frameIndex = 0;

        // Is animation active?
        this.active = false;
    }

    /**
     * Updates the start time of the animation based on the first keyframe //
     * Updates the end time of the animation based on the last keyframe
     */
    update_order(){
        this.startTime = this.frames[0].instant;
        this.endTime = this.frames[this.frames.length - 1].instant
    }

    /**
     * Adds a keyframe to the animation keyframe array. Sorts the array by ascending start instant
     * @param {MyKeyframe} keyframe
     */
    addKeyframe(keyframe) {
        // Append the keyframe to the end of the array
        this.frames.push(keyframe);

        // Sort the vector by ascending instant
        this.frames.sort((a,b) => a.instant - b.instant);
    }

    update(elasped){
        //console.log("updating animation ??")
    }

}