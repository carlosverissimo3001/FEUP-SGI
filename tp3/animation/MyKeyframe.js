/**
 * MyKeyframe
 * @constructor
 * @param {integer} instant - initial instant of the keyframe
 * @param {Array} translation - array with the translation
 * @param {Array} rotation - array with the rotation
 * @param {Array} scale - array with the scale
 */

export class MyKeyframe {
    constructor(instant, translation, rotation, scale) {

        // Instant of the keyframe
        this.instant = instant;

        // Translation array [x, y, z]
        this.translation = translation;

        // Rotation array [anglex, angley, anglez]
        this.rotation = rotation;

        // Scale array [x, y, z]
        this.scale = scale;
    }
}