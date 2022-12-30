import { CGFscene } from "../lib/CGF.js";
import {
  CGFaxis,
  CGFcamera,
  CGFcameraOrtho,
  CGFshader,
  CGFtexture,
  CGFappearance
} from "../lib/CGF.js";
import { MyViewAnimation } from "./animation/MyViewAnimation.js";
import { MyChecker } from "./game/board-elements/MyChecker.js";
import { MyGameOrchestrator } from "./game/orchestrator/MyGameOrchestrator.js";
import { MySceneGraph } from "./MySceneGraph.js";
import { MyRectangle } from "./primitives/MyRectangle.js";
import { MyCube } from "./primitives/MyCube.js";

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
    this.graphLoaded = false;

    this.setUpdatePeriod(20);

    // the activation of picking capabilities in WebCGF
    // will use a shader for picking purposes (lib\shaders\picking\vertex.glsl and lib\shaders\picking\fragment.glsl)
    this.setPickEnabled(true);

    this.startTime = null;

    this.enableTextures(true);

    /* ***************** Game Elements ***************** */

    this.gameOrchestrator = new MyGameOrchestrator(this);

    // Themes
    this.themes = ["UnderSea", "Day", "Night"];
    this.theme = "UnderSea";
    this.loadedThemes = 0;

    /* ************************************************** */


    /* ***************** Cameras ***************** */

    this.cameraList = [];
    this.cameraNames = [];
    this.cameraID;
    this.intermediateCamera = null;
    this.initCameras();

    /* ************************************************** */


    this.displayAxis = true;
    this.showLights = false;

    this.lightsVal = [];

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);

    this.poolShader = new CGFshader(
      this.gl,
      "shaders/pool.vert",
      "shaders/pool.frag"
    );

    this.poolShader.setUniformsValues({ uSampler2: 1 });
    this.poolShader.setUniformsValues({ uSampler: 0 });

    this.distortionmap = new CGFtexture(
      this,
      "scenes/images/textures/distortionmap.png"
    );

    this.pulseShader = new CGFshader(
      this.gl,
      "shaders/pulse.vert",
      "shaders/pulse.frag"
    );

    this.textShader = new CGFshader(
      this.gl,
      "shaders/font.vert",
      "shaders/font.frag"
    );

    // set number of rows and columns in font texture
    this.textShader.setUniformsValues({'dims': [16, 16]});

    this.sandShader = new CGFshader(this.gl, "shaders/sand.vert", "shaders/sand.frag");
    this.sandShader.setUniformsValues({ uSampler2: 1 });
		this.sandShader.setUniformsValues({ USampler: 0 });

    this.sandtexture = new CGFappearance(this);
    this.sandtexture.setAmbient(1.0,1.0,1.0,1);
    this.sandtexture.setDiffuse(1.0,1.0,1.0,1);
    this.sandtexture.setDiffuse(1.0,1.0,1.0,1);
    this.sandtexture.setShininess(10);

    this.texture = new CGFtexture(this, "scenes/images/textures/sand.png");
    this.sandtexture.setTexture(this.texture);
    this.sandtexture.setTextureWrap('REPEAT', 'REPEAT');

    this.texture2 = new CGFtexture(this, "scenes/images/textures/sandMap.png");

    this.surfaceShader = new CGFshader(this.gl, "shaders/surface.vert", "shaders/surface.frag");

    this.surfaceShader.setUniformsValues({ uSampler2: 1 });
		this.surfaceShader.setUniformsValues({ uSampler: 0 });

    this.surfacetexture = new CGFappearance(this);
    this.surfacetexture.setAmbient(0.7,0.7,0.7,1);
    this.surfacetexture.setDiffuse(0.9,0.9,0.9,1);
    this.surfacetexture.setDiffuse(0.2,0.2,0.2,1);
    this.surfacetexture.setShininess(10);

    this.waterpier = new CGFtexture(this, "scenes/images/textures/pier.png");
		this.surfacetexture.setTexture(this.texture);
		this.surfacetexture.setTextureWrap('REPEAT', 'REPEAT');

		this.distortionmap = new CGFtexture(this, "scenes/images/textures/distortionmap.png");

    this.ferrugem = new CGFappearance(this);
    this.ferrugem.setAmbient(0/255,139/255,139/255,1);
    this.ferrugem.setDiffuse(0/255,139/255,139/255,1);
    this.ferrugem.setDiffuse(0/255,139/255,139/255,1);
    this.ferrugem.setShininess(10);

    this.ferr = new CGFtexture(this, "scenes/images/textures/ferrugem.png");
    this.ferrugem.setTexture(this.ferr);
    this.ferrugem.setTextureWrap('REPEAT', 'REPEAT');

  }

  changeTheme(newTheme) {
    this.theme = newTheme;
  }

  start() {
    this.graphs = [];

    /* Create scene graphs
      - Note that MySceneGraph appends the graph to the XMLscene's graphs array, so we don't need to do it here
    */
    var under_sea = new MySceneGraph("themes/under_sea.xml", this);
    var day = new MySceneGraph("themes/pool_day.xml", this);
    var night = new MySceneGraph("themes/pool_night.xml", this);
  }

  /**
   * Initializes the scene views/cameras with the values read from the XML file.
   */
  createXMLCameras() {
    var themeIndex = this.themes.indexOf(this.theme);

    var i = 0;
    // Views index

    // Variables in commom in both kinds of views
    var near, far, from, to, type;

    // Camera
    var c;

    // Reads the views from the scene graph
    for (var key in this.graphs[themeIndex].views) {
      var view = this.graphs[themeIndex].views[key];

      /* Commom attributes of both cameras */
      (near = view[0]), (far = view[1]);
      type = view[2];
      (from = view[3]), (to = view[4]);

      /* Now let's parse each type of camera independently */
      if (type == "ortho") {
        var left = view[5];
        var right = view[6];
        var top = view[7];
        var bottom = view[8];
        var up = view[9];

        c = new CGFcameraOrtho(
          left,
          right,
          bottom,
          top,
          near,
          far,
          from,
          to,
          up
        );
      } else {
        var angle = view[5] * DEGREE_TO_RAD;
        c = new CGFcamera(angle, near, far, from, to);
      }
      this.cameraList.push(c);
      this.cameraNames.push(key);
    }
  }

  /**
   * Update the current camera
   */
  updateCamera(newCameraID) {
    var nextCamera = this.cameraList[this.cameraNames.indexOf(newCameraID)];

    this.intermediateCamera = new MyViewAnimation(
      this,
      this.camera,
      nextCamera,
      2
    );

    // Set the new camera and its id, and update the interface
    this.camera = nextCamera;
    this.cameraID = newCameraID;
    this.interface.setActiveCamera(this.camera);
  }

  /**
   * Initializes the scene cameras.
   */
  initCameras() {
    var themeIndex = this.themes.indexOf(this.theme);

    if (this.graphLoaded) {
      if (this.graphs[themeIndex].defaultCameraID != null) {
        var index = this.cameraNames.indexOf(
          this.graphs[themeIndex].defaultCameraID
        );
        this.camera = this.cameraList[index];
        this.cameraID = this.graphs[themeIndex].defaultCameraID;
      }
    } else {
      this.camera = new CGFcamera(
        0.4,
        0.1,
        500,
        vec3.fromValues(50, 20, 50),
        vec3.fromValues(0, 0, 0)
      );
      this.cameraNames.push("CGFDefault");
      this.cameraList.push(this.camera);
      this.cameraID = "CGFDefault";
    }

    this.interface.setActiveCamera(this.camera);
  }

  /**
   * Initializes the scene lights with the values read from the XML file.
   */
  initLights() {
    var i = 0;
    var themeIndex = this.themes.indexOf(this.theme);
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graphs[themeIndex].lights) {
      if (i >= 8) break; // Only eight lights allowed by WebGL.

      if (this.graphs[themeIndex].lights.hasOwnProperty(key)) {
        var light = this.graphs[themeIndex].lights[key];

        this.lights[i].setPosition(
          light[2][0],
          light[2][1],
          light[2][2],
          light[2][3]
        );
        this.lights[i].setAmbient(
          light[3][0],
          light[3][1],
          light[3][2],
          light[3][3]
        );
        this.lights[i].setDiffuse(
          light[4][0],
          light[4][1],
          light[4][2],
          light[4][3]
        );
        this.lights[i].setSpecular(
          light[5][0],
          light[5][1],
          light[5][2],
          light[5][3]
        );

        if (light[1] == "spot") {
          this.lights[i].setSpotCutOff(light[6]);
          this.lights[i].setSpotExponent(light[7]);
          this.lights[i].setSpotDirection(
            light[8][0],
            light[8][1],
            light[8][2]
          );
        }

        this.lights[i].setVisible(true);

        if (this.showLights) {
          this.lights[i].setVisible(true);
        } else this.lights[i].setVisible(false);

        if (light[0]) this.lights[i].enable();
        else this.lights[i].disable();

        this.lights[i].update();

        i++;
      }
    }
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
    if (this.loadedThemes > 0) {
      let themeIndex = this.themes.indexOf(this.theme);

      this.axis = new CGFaxis(this, this.graphs[themeIndex].referenceLength);
      this.gl.clearColor(...this.graphs[themeIndex].background);
      this.setGlobalAmbientLight(...this.graphs[themeIndex].ambient);
      this.createXMLCameras();
      this.initCameras();
      this.interface.createInterface();
      this.initLights();

      this.gameOrchestrator.init(this.graphs[themeIndex]);

      this.sceneInited = true;
    } else {
      this.loadedThemes++;
    }
  }

  /**
   * Displays the scene.
   */
  display() {
    // ---- BEGIN Background, camera and axis setup

    this.gameOrchestrator.orchestrate();

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    this.setLights();

    if (this.intermediateCamera != null) {
      this.intermediateCamera.apply();
    }

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    for (var i = 0; i < this.lights.length; i++) {
      this.lights[i].setVisible(this.showLights);
      this.lights[i].update();
    }

    if (this.sceneInited) {
      // Draw axis
      if (this.displayAxis) this.axis.display();

      // Sets the default appearance
      this.setDefaultAppearance();

      // Display
      this.gameOrchestrator.display();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup

  }

  update(t) {
    let elapsed;
    var themeIndex = this.themes.indexOf(this.theme);

    if (this.sceneInited) {
      if (this.startTime == null) elapsed = 0;
      else elapsed = t - this.startTime;

      this.startTime = t;

      this.checkKeys();

      /* Update animations */
      for (let i in this.graphs[themeIndex].kfAnimations)
        this.graphs[themeIndex].kfAnimations[i].update(elapsed / 1000);

      /* Animate Camera*/
      if (this.intermediateCamera != null)
        this.intermediateCamera.update(elapsed / 1000);

      /* Update pool shader */
      this.poolShader.setUniformsValues({ timeFactor: (t / 100) % 100 });

      /* Update pulse shader */
      this.pulseShader.setUniformsValues({ timeFactor: (t / 100) % 100 });

      this.surfaceShader.setUniformsValues({ timeFactor: (t / 100) % 100 });

      /* Update game orchestrator */
      this.gameOrchestrator.update(elapsed / 1000);
    }
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    if((this.gui.isKeyPressed("KeyZ") || this.gui.isKeyPressed("Keyz")) && this.gui.isKeyPressed("ControlLeft")) {
      text += " CTRL + Z ";
      keysPressed = true;
      this.gameOrchestrator.undo();
    }

    if((this.gui.isKeyPressed("KeyR") || this.gui.isKeyPressed("Keyr"))) {
      text += " R ";
      keysPressed = true;
      this.gameOrchestrator.restart();
    }

    if((this.gui.isKeyPressed("Keym") || this.gui.isKeyPressed("KeyM"))) {
      text += " M ";
      keysPressed = true;
      this.gameOrchestrator.movie();
    }

    if(keysPressed)
      console.log(text);

  }

  setLights() {
    var i = 0;

    for (var key in this.lightsVal) {
      if (this.lightsVal.hasOwnProperty(key)) {
        this.lights[i].setVisible(this.showLights);
        if (this.lightsVal[key]) this.lights[i].enable();
        else this.lights[i].disable();

        this.lights[i].update();

        i++;
      }
    }
  }
}
