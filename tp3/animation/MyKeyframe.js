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

        this.instant = instant;

        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
}