export class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        // Animation start time
        this.startTime;

        // Animation end time
        this.endTime;

        // Total elapsed time since the animation started
        this.totalTime = 0;

        // Animation matix
        this.animation = mat4.create();
    }

    /**
    * @param {integer} t - elapsed time since last call
    */
    update(t) {
        // Implement by child classes
    }
}