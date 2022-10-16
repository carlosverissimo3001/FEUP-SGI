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

    createInterface(views){
        this.addLightsFolder();
        this.addViewsFolder(views);
        this.createCheckboxes();
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

    addViewsFolder(views){
        var viewsFolder = this.gui.addFolder('Views');
        var viewValues = [];
        for(var key in views){
            if(views.hasOwnProperty(key)){
                viewValues.push(key)
            }   
        }
        //setting the cameras dropdown 
        viewsFolder.add(this.scene, "cameraID", viewValues).onChange(val => this.scene.updateCamera(val)).name("Camera");
    }
    createCheckboxes(){
        view.add(this.scene, 'showLights').name('Show Lights').onChange(this.scene.setLights());
    }
    
}