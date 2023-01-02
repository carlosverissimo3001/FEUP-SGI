import { CGFcamera } from "../../lib/CGF.js";
/**
 * MyViewAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {CGFcamera} initialView - Initial view
 * @param {CGFcamera} finalView - Final view
 * @param {integer} duration - Duration of the animation
 **/
export class MyViewAnimation {
    constructor(scene, initialView, finalView, duration){
        this.scene = scene;

        // Initial and final views
        this.initialView = initialView;
        this.finalView = finalView;

        // Duration of the animation
        this.duration = duration;

        // Current time
        this.currTime = 0;

        // Is the animation active?
        this.active = true;

        // Initial View Parameters
        this.initialViewTarget = initialView.target;
        this.initialViewFOV = initialView.fov;
        this.initialViewPosition = initialView.position;
        this.initialViewNear = initialView.near;
        this.initialViewFar = initialView.far;

        // Final View Parameters
        this.finalViewTarget = finalView.target;
        this.finalViewFOV = finalView.fov;
        this.finalViewPosition = finalView.position;
        this.finalViewNear = finalView.near;
        this.finalViewFar = finalView.far;

        // Current camera is the initial view, in the beginning
        this.currCamera = this.initialView;
    }


    /*
    * @param {integer} t - elapsed time since last call
    */
    update(t) {
        this.currTime += t;

        // If the animation is not active, return
        if (!this.active)
            return 0;

        // If the animation is active, update the camera
        if (this.currTime <= this.duration) {
            // Time percentage
            var timePercentage = (this.duration - this.currTime) / this.duration;

            // Update camera position
            var cameraPosition = [0, 0, 0]

            vec3.lerp(cameraPosition, this.finalViewPosition, this.initialViewPosition, timePercentage);

            // Update camera target
            var cameraTarget = [0, 0, 0]

            vec3.lerp(cameraTarget, this.finalViewTarget, this.initialViewTarget, timePercentage);

            // Update camera near, far and fov

            var cameraNear = this.finalViewNear + (this.initialViewNear - this.finalViewNear) * timePercentage;
            var cameraFar = this.finalViewFar + (this.initialViewFar - this.finalViewFar) * timePercentage;
            var cameraFOV = this.finalViewFOV + (this.initialViewFOV - this.finalViewFOV) * timePercentage;

            // Update camera
            this.currCamera = new CGFcamera(cameraFOV, cameraNear, cameraFar, cameraPosition, cameraTarget);
        }

        else {
            this.active = false;
            this.currCamera = this.finalView;

            this.applyCamera();
        }
    }

    apply() {
        if (!this.active) return 0;
        this.applyCamera()
    }

    applyCamera() {
        this.scene.camera = this.currCamera;
        this.scene.interface.setActiveCamera(this.scene.camera);
    }
}