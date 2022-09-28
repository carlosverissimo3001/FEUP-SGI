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
        //this.gui.add(this.scene, 'displayTriangle').name('Display Triangle');
        //this.gui.add(this.scene, 'displayRectangle').name('Display Rectangle');
        //this.gui.add(this.scene, 'displaySphere').name('Display Sphere');
        //this.gui.add(this.scene, 'displayCylinder').name('Display Cylinder');
        //this.gui.add(this.scene, 'displayTorus').name('Display Torus');
        this.gui.add(this.scene, 'displayBalls').name('Display Balls');
        this.gui.add(this.scene, 'displayPool').name('Display Pool');
        this.gui.add(this.scene, 'displayGrass').name('Display Grass');
        this.gui.add(this.scene, 'displayLifebuoy').name('Display Lifebuoy');

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}