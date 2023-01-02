import { MyAnimation } from "./MyAnimation.js";
import { MyKeyframe } from "./MyKeyframe.js";

var DEGREE_TO_RAD = Math.PI / 180;
var XAXIS = [1, 0, 0];
var YAXIS = [0, 1, 0];
var ZAXIS = [0, 0, 1];
var IDENTITY = [0, 0, 0];

export class MyKeyframeAnimation extends MyAnimation {
  constructor(scene, id) {
    super(scene);

    // Animation ID
    this.animationId = id;

    // Array of keyframes (MyKeyframes)
    this.frames = [];

    // Current keyframe instant
    this.currInstant = 0;

    // Whether the animation is active
    this.active = false;

    this.finished = false;

    this.trannslationMatrix = []
  }

  /**
   * Adds a keyframe to the animation keyframe array.
   * @param {MyKeyframe} keyframe
   */
  addKeyframe(keyframe) {
    // Append the keyframe to the end of the array
    this.frames.push(keyframe);
  }

  /**
   * Updates the start time of the animation based on the first keyframe //
   * Updates the end time of the animation based on the last keyframe
   */
  update_order() {
    // Sort the vector by ascending instant
    this.frames.sort((a, b) => a.instant - b.instant);

    /* Update start and end time */
    this.startTime = this.frames[0].instant;
    this.endTime = this.frames[this.frames.length - 1].instant;
  }

  /**
   * Overrides MyAnimation update method
   * Update the animation matrix
   * @param {integer} t - time since last call
   */
  update(t) {
    this.totalTime += t;

    /* Check if the animation is active */
    this.active = this.startTime < this.totalTime;

    /* If inactive, return */
    if (!this.active) return;

    // After the animation has finished, the object should stay at its last position
    if (this.totalTime > this.endTime) {
      this.finished = true;
      this.animation = this.computeFinalTransformationMatrix();
    } else {
      /* Check whether or not this is the last keyframe */
      var lastInstant = this.currInstant + 1 == this.frames.length;

      /* If it is, don't interpolate and break */
      if (!lastInstant) {
        // Update current instant if needed (if totalTime has passed the next frame instant)
        if (this.totalTime > this.frames[this.currInstant + 1].instant)
          this.currInstant++;

        // Get the last frame
        var lastFrame = this.frames[this.currInstant];

        // Get the next frame
        var nextFrame = this.frames[this.currInstant + 1];

        // Percentage of time passed
        var timepercentage =
          (this.totalTime - lastFrame.instant) /
          (nextFrame.instant - lastFrame.instant);

        /* Build the animation matrix */
        this.animation = this.interpolate(lastFrame, nextFrame, timepercentage);
      }
    }
  }

  /**
   * Get the animation matrix
   * @return {mat4} matrix - animation matrix
   */
  getMatrix() {
    return this.animation;
  }

  /**
   * Get the translation matrix
   * @return {mat4} matrix - translation matrix
   */
  getTranslationMatrix() {
    return this.translationMatrix
  }

  /**
   * apply animation matrix to scene
   */
  apply() {
    if (this.frames.length == 0 || this.finished) return 0;

    this.scene.multMatrix(this.animation);
  }

  /**
   * Interpolation between two keyframes
   * @param {MyKeyframe} lastFrame - previous keyframe
   * @param {MyKeyframe} nextFrame - next keyframe
   * @param {integer} timepercentage  - time percentage (0 - 1) of the current frame
   * @return {mat4} matrix - Interpolated matrix
   */
  interpolate(lastFrame, nextFrame, timepercentage) {
    var transfMatrix = mat4.create();

    var translation = IDENTITY;
    var rotation = IDENTITY;
    var scale = IDENTITY;

    // Interpolation between translation transformation of previous and next keyframes
    var lastTranslation = [
      lastFrame.translation[0],
      lastFrame.translation[1],
      lastFrame.translation[2],
    ];
    var nextTranslation = [
      nextFrame.translation[0],
      nextFrame.translation[1],
      nextFrame.translation[2],
    ];
    vec3.lerp(translation, lastTranslation, nextTranslation, timepercentage);

    var deltaX = Math.abs((nextFrame.translation[0] - lastFrame.translation[0]) * timepercentage)
    var deltaZ = Math.abs((nextFrame.translation[2] - lastFrame.translation[2]) * timepercentage)
    this.translationMatrix = [deltaX, 0, deltaZ]


    // Apply the interpolated translation to the transformation matrix
    mat4.translate(transfMatrix, transfMatrix, translation);


    // Interpolation between rotation transformation of previous and next keyframes
    // This should read: rotation angle in x, rotation angle in y, rotation angle in z
    var lastRotation = [
      lastFrame.rotation[0],
      lastFrame.rotation[1],
      lastFrame.rotation[2],
    ];
    var nextRotation = [
      nextFrame.rotation[0],
      nextFrame.rotation[1],
      nextFrame.rotation[2],
    ];
    vec3.lerp(rotation, lastRotation, nextRotation, timepercentage);

    // Apply the interpolated rotation to the transformation matrix
    mat4.rotate(transfMatrix, transfMatrix, rotation[0] * DEGREE_TO_RAD, XAXIS);
    mat4.rotate(transfMatrix, transfMatrix, rotation[1] * DEGREE_TO_RAD, YAXIS);
    mat4.rotate(transfMatrix, transfMatrix, rotation[2] * DEGREE_TO_RAD, ZAXIS);

    // Interpolation between scale transformation of previous and next keyframes
    var lastScale = [
      lastFrame.scale[0],
      lastFrame.scale[1],
      lastFrame.scale[2],
    ];
    var nextScale = [
      nextFrame.scale[0],
      nextFrame.scale[1],
      nextFrame.scale[2],
    ];
    vec3.lerp(scale, lastScale, nextScale, timepercentage);

    // Apply the interpolated translation to the transformation matrix
    mat4.scale(transfMatrix, transfMatrix, scale);

    return transfMatrix;
  }

  /**
   * Computes the final transformation matrix
   */
  computeFinalTransformationMatrix() {
    // Create the transformation matrix
    var transfMatrix = mat4.create();

    // Get the last keyframe
    var lastFrame = this.frames[this.frames.length - 1];

    // Get the last keyframe translation vector
    var lastFrameTranslation = [
      lastFrame.translation[0],
      lastFrame.translation[1],
      lastFrame.translation[2],
    ];

    mat4.translate(transfMatrix, transfMatrix, lastFrameTranslation);

    // Get the last keyframe rotation vector
    var lastFrameRotation = [
      lastFrame.rotation[0],
      lastFrame.rotation[1],
      lastFrame.rotation[2],
    ];

    mat4.rotate(
      transfMatrix,
      transfMatrix,
      lastFrameRotation[0] * DEGREE_TO_RAD,
      XAXIS
    );
    mat4.rotate(
      transfMatrix,
      transfMatrix,
      lastFrameRotation[1] * DEGREE_TO_RAD,
      YAXIS
    );
    mat4.rotate(
      transfMatrix,
      transfMatrix,
      lastFrameRotation[2] * DEGREE_TO_RAD,
      ZAXIS
    );

    var lastFrameScale = [
      lastFrame.scale[0],
      lastFrame.scale[1],
      lastFrame.scale[2],
    ];
    mat4.scale(transfMatrix, transfMatrix, lastFrameScale);

    return transfMatrix;
  }
}
