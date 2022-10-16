import { CGFscene } from '../lib/CGF.js';
import { CGFaxis, CGFcamera } from '../lib/CGF.js';

var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.setUpdatePeriod(50);

        this.enableTextures(true);
        this.initCameras();

        this.displayAxis = true;
        this.showLights = false;

        this.lightsVal = []

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene cameras.
     */

     initXMLCameras() {
        this.cameraID = this.graph.defaultCameraId;
        this.camera = this.graph.views[this.graph.defaultCameraId];
        this.interface.setActiveCamera(this.default);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 20, 50), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);

                if (this.showLights) {
                    this.lights[i].setVisible(true);
                } else
                    this.lights[i].setVisible(false);


                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Update the current camera according to a change in the  cameras dropdown in the interface
     */
     updateCamera(newCamera) {
        this.cameraID = newCamera;
        this.camera = this.graph.views[this.cameraID];
        this.interface.setActiveCamera(this.camera);
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initCameras();

        this.initXMLCameras();

        this.interface.createInterface(this.graph.views);

        this.initLights();

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.setLights();

        this.pushMatrix();

        if (this.displayAxis)
            this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }


        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(t){
        this.checkKeys();
    }

    checkKeys(){
        var text="Keys pressed: ";
        var keysPressed = false;

        if (this.gui.isKeyPressed("KeyM")){
            this.updateMaterials();
            text += "M "
            keysPressed = true;
        }

        if (keysPressed)
            console.log(text);
    }

    updateMaterials(){
        if (!this.sceneInited)
            return

        var components = this.graph.components

        /* Transverse the scene tree */
        for (var i in components){
            var currComp = components[i]

            /* If there are more than two materials declared for a component, cycle through them */
            if (currComp.materials.length > 1){
                /* Update the material */
                currComp.changeMaterial();

                /* Display the component after changing the material*/
                this.graph.displayComponent(currComp.componentID, currComp.textureID, currComp.materialID, currComp.length_s, currComp.length_t);
            }
        }
    }

    setLights(){
        var i = 0;

        for (var key in this.lightsVal){
            if(this.lightsVal.hasOwnProperty(key)){

                this.lights[i].setVisible(this.showLights);
                if (this.lightsVal[key])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }
}