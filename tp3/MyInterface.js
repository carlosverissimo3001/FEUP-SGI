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

        var miscFolder = this.gui.addFolder('Misc');

        miscFolder.add(this.scene, 'displayAxis').name('Display Axis');

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
        if (this.activeKeys[keyCode]){
            this.activeKeys[keyCode] = false;
            return true;
        }

        return this.activeKeys[keyCode] || false;
    }

    createInterface(){
        this.addLightsFolder();
        this.addViewsFolder();
        this.initTheme();
        this.initGameElements();
    }

    addLightsFolder(){
        var themeIndex = this.scene.themes.indexOf(this.scene.theme);

        var lightsFolder = this.gui.addFolder('Lights');

        var lights = this.scene.graphs[themeIndex].lights;
        lightsFolder.closed = false;

        for (var i in lights){
            if(lights.hasOwnProperty(i)){
                this.scene.lightsVal[i] = lights[i][0]
                lightsFolder.add(this.scene.lightsVal, i).onChange(this.scene.setLights.bind(this.scene))
                this.scene.lightsVal.length++;
            }
        }

        lightsFolder.add(this.scene, 'showLights').name('Show Lights').onChange(this.scene.setLights());

    }

    addViewsFolder(){
        var cameraNames = this.scene.cameraNames;
        var viewsFolder = this.gui.addFolder('Views');

        viewsFolder.add(this.scene, "cameraID", cameraNames).onChange(val => this.scene.updateCamera(val)).name("View");

        viewsFolder.open();
    }

    initTheme(){
        var themes = this.gui.addFolder('Themes');

        themes.add(this.scene, 'theme', this.scene.themes).name('Theme').onChange(this.scene.changeTheme.bind(this.scene));

        themes.open();
    }

    initGameElements(){
        var gameFolder = this.gui.addFolder('Game');

        // Open the folder
        gameFolder.open();

        gameFolder.add(this.scene.gameOrchestrator, 'undo').name('Undo');
        gameFolder.add(this.scene.gameOrchestrator, 'restart').name('Restart');
        gameFolder.add(this.scene.gameOrchestrator, 'movie').name('Movie');
        gameFolder.add(this.scene.gameOrchestrator, 'autoRotate').name('Auto Rotate');
    }
}