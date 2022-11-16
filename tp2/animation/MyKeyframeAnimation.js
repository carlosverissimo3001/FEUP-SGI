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

    sort_by_instant(frame1, frame2){
        return frame1.instant > frame2.instant
    }

    // After inserting a new keyframe, and sorting the array by instant, update start time
    update_after_insert(){
        this.startTime = this.frames[0].instant;
        this.endTime = this.frames[this.frames.length - 1].instant
    }

    addKeyframe(keyframe) {
        // Append the keyframe to the end of the array
        this.frames.push(keyframe);

        // Sort the vector by ascending instant
        this.frames.sort(sort_by_instant);
    }
}