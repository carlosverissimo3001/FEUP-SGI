import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys(){
        //Create reference from the scene to the gui
        this.scene.gui = this;
        //Disable the processKeyboard function
        this.processKeyboard = function(){};
        //Create a named array to store which keys are being pressed
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        if(this.activeKeys[keyCode] && (keyCode == "keyM" || keyCode == "keym")){
            this.activeKeys[keyCode] = false;
            return true;
        }

        return this.activeKeys[keyCode] || false;
    }

    createInterface(){
        this.addLightsFolder();
        this.addViewsFolder();
        this.createCheckboxes();
        this.addHighlightedFolder();
    }

    addLightsFolder(){
        var lightsFolder = this.gui.addFolder('Lights');

        var lights = this.scene.graph.lights;

        for (var i in lights){
            if(lights.hasOwnProperty(i)){
                this.scene.lightsVal[i] = lights[i][0]
                lightsFolder.add(this.scene.lightsVal, i).onChange(this.scene.setLights.bind(this.scene))
            }
        }
    }

    addViewsFolder(){
        var cameraNames = this.scene.cameraNames;
        this.gui.add(this.scene, "cameraID", cameraNames).onChange(val => this.scene.updateCamera(val)).name("Camera");
    }

    createCheckboxes(){
        this.gui.add(this.scene, 'showLights').name('Show Lights').onChange(this.scene.setLights());
    }

    addHighlightedFolder(){
        var highlights = this.gui.addFolder('HighLights'); 

        var hl = this.scene.graph.shaders;

        for (const i in hl){
            if(hl[i]){
                highlights
                .add(this.scene.graph.components[i], "isHigh")
                .name(i)
                .onChange(this.scene.graph.components[i].changeIsHigh.bind(this.scene))
            }
        }

    }
}