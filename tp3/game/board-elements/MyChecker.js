import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyKeyframe } from "../../animation/MyKeyframe.js";
import { MyKeyframeAnimation } from "../../animation/MyKeyframeAnimation.js";
import { MyComponent } from "../../primitives/MyComponent.js";
import { MySphere } from "../../primitives/MySphere.js";
import { MyTorus } from "../../primitives/MyTorus.js";

export class MyChecker extends CGFobject {
  constructor(scene, color, row, col, board, tileID) {
    super(scene);

    this.scene = scene;

    /*
      The checker piece will be composed by 4 parts:
      - 2 torus
        - 1 outer torus
        - 1 inner torus
      - 2 spheres
        - 1 outer sphere
        - 1 sphere where all the pieces will be placed
    */
    this.components = [];

    // Outer torus
    this.components.push(new MyTorus(scene, "none", 0.1, 1, 40, 40));
    // Whole sphere
    this.components.push(new MySphere(scene, "none", 1, 40, 40));
    // Inner torus
    this.components.push(new MyTorus(scene, "none", 0.1, 1, 40, 40));
    // Inner sphere
    this.components.push(new MySphere(scene, "none", 1, 40, 40));

    this.x = 0.5;
    this.y = 2.1;
    this.z = 0.5;

    this.y_eat = 0.27;

    this.transformations = [];
    this.initTransformations();

    this.row = row;
    this.col = col;
    this.board = board;
    this.id = row + "," + col;

    // Was the checker piece eaten?
    this.wasEaten = false;

    // Can this piece be moved
    this.available = false;

    // Is this piece selected?
    this.selected = false;

    // Is this piece moving? If so, straight or jumping?
    this.moving = false;

    // Pointer to the tile where the checker is placed
    var tileID = tileID;

    // Blue material for the checker
    this.blueMaterial = new CGFappearance(scene);
    this.blueMaterial.setAmbient(0, 0, 1, 1);
    this.blueMaterial.setDiffuse(0, 0, 1, 1);
    this.blueMaterial.setSpecular(0, 0, 1, 1);
    this.blueMaterial.setShininess(10.0);

    // Light blue material for the checker
    this.lightBlueMaterial = new CGFappearance(scene);
    this.lightBlueMaterial.setAmbient(0, 0.5, 1, 1);
    this.lightBlueMaterial.setDiffuse(0, 0.5, 1, 1);
    this.lightBlueMaterial.setSpecular(0, 0.5, 1, 1);

    // Red material for the checker
    this.redMaterial = new CGFappearance(scene);
    this.redMaterial.setAmbient(1, 0, 0, 1);
    this.redMaterial.setDiffuse(1, 0, 0, 1);
    this.redMaterial.setSpecular(1, 0, 0, 1);
    this.redMaterial.setShininess(10.0);

    // Light red material for the checker
    this.lightRedMaterial = new CGFappearance(scene);
    this.lightRedMaterial.setAmbient(1, 0.5, 0.5, 1);
    this.lightRedMaterial.setDiffuse(1, 0.5, 0.5, 1);
    this.lightRedMaterial.setSpecular(1, 0.5, 0.5, 1);

    // Selected material for the checker, light green
    this.selectedMaterial = new CGFappearance(scene);
    this.selectedMaterial.setAmbient(0, 1, 0, 1);
    this.selectedMaterial.setDiffuse(0, 1, 0, 1);
    this.selectedMaterial.setSpecular(0, 1, 0, 1);

    this.tile = this.board.getTile(tileID.split(",")[0], tileID.split(",")[1]);

    this.color = color;

    this.initialPos = [];
    this.initialPos.push(this.tile.getX() + this.x);
    this.initialPos.push(1.1);
    this.initialPos.push(this.tile.getZ() + this.z);

    // Normal animation -> Piece moves from one tile to another, without eating another piece
    this.normalAnimation = new MyKeyframeAnimation(
      this.scene,
      "checkerNormalAnimation"
    );

    // Eating animation -> Piece moves from one tile to another, eating another piece
    this.eatingAnimation = new MyKeyframeAnimation(
      this.scene,
      "checkerEatingAnimation"
    );

    // Being eaten animation -> Piece is being eaten by another piece
    this.eatenAnimation = new MyKeyframeAnimation(
      this.scene,
      "checkerEatenAnimation"
    );

    // Audio
    this.audio = new Audio("sounds/slide.mp3");
    this.audio.volume = 0.5;
    this.audioActive = false;

    // Animation duration
    this.animDuration = 0.44;

    this.animation = null;
  }

  /**
   * Updates the checker piece position
   */
  updatePos() {
    this.initialPos[0] = this.tile.getX() + this.x;
    this.initialPos[2] = this.tile.getZ() + this.z;
  }

  initTransformations() {
    // Outer torus
    var transf = mat4.create();

    transf = mat4.translate(transf, transf, [this.x, this.y, this.z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 10]);

    this.transformations.push(transf);

    // Whole sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [this.x, this.y, this.z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 0.75]);

    this.transformations.push(transf);

    // Inner torus
    transf = mat4.create();

    mat4.translate(transf, transf, [this.x, this.y, this.z]);
    mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    mat4.scale(transf, transf, [0.065 * 3, 0.065 * 3, 10]);

    this.transformations.push(transf);

    // Inner sphere
    transf = mat4.create();

    mat4.translate(transf, transf, [this.x, this.y, this.z]);
    mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    mat4.scale(transf, transf, [0.055 * 3, 0.055 * 3, 1]);

    this.transformations.push(transf);
  }

  /**
   * Starts the animation for the checker piece
   * @param {MyTile} tile - Destination tile
   */
  startAnimation(tile) {
    /* Since the checker is being displayed within the tile scene, the first frame of
      the animation will be the checker's initial position, which is the center of the old tile.

      The final frame of the animation will be the checker's final position, which is the center of the new tile.
      So no tranlation is needed for the last kf.
    */

    // Get the destination tile coordinates
    var x = tile.getX() + 0.5;
    var y = 1.1;
    var z = tile.getZ() + 0.5;

    // Compute the distance between the initial and final positions
    var deltaX = this.initialPos[0] - x;
    var deltaY = 0;
    var deltaZ = this.initialPos[2] - z;

    /* Initial frame -> Deltas to old position */
    var initialkf = new MyKeyframe(
      0,
      [deltaX, deltaY, deltaZ],
      [0, 0, 0],
      [1, 1, 1]
    );

    if (this.animation.animationId == "checkerEatingAnimation") {
      this.animDuration*=2;

      var halfKf = new MyKeyframe(
        this.animDuration / 2,
        [deltaX / 2, 8, deltaZ / 2],  // Checker jumps up
        [0, 0, 0],
        [1, 1, 1]
      )
      this.animation.addKeyframe(halfKf);
    }

    // Final frame -> Current position, therefore no deltas
    var finalkf = new MyKeyframe(
      this.animDuration,
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 1]
    );

    // Add the keyframes to the animation
    this.animation.addKeyframe(initialkf);
    this.animation.addKeyframe(finalkf);

    this.animation.update_order();

    // Start the animation
    this.moving = true;
  }

  displayMoving() {
    this.scene.pushMatrix();

    // Has the animation finished?
    if (this.animation.finished) {
      // If so, checker piece is no longer moving
      this.moving = false;

      this.updatePos();

      // No animation is being played
      this.animation = null;
      this.scene.popMatrix();

      // Stop the audio
      this.audio.pause();
      this.audioActive = false;

      return;
    }

    // Otherwise, display the checker piece, with the animation
    else {
      // Play the audio
      if (!this.audioActive) {
        this.audioActive = true;
      }

      this.audio.loop = true;
      this.audio.play();


      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.animation.getMatrix());
        this.scene.multMatrix(this.transformations[i]);
        this.components[i].display();
        this.scene.popMatrix();
      }
    }
    this.scene.popMatrix();
  }

  /**
   * Displays the checker piece, when it it has been eaten
   */
  displayEaten() {
    this.scaleFactor = 0.4;
    this.scene.pushMatrix();
    switch (this.color) {
      case "white":
        /*         this.checkerMaterial.setTexture(this.whiteTexture);
        this.checkerMaterial.apply(); */
        break;
      case "red":
        this.redMaterial.apply();
        break;
      case "black":
        /*         this.checkerMaterial.setTexture(this.blackTexture);
        this.checkerMaterial.apply(); */
        break;
      case "blue":
        this.blueMaterial.apply();
        break;
      default:
        break;
    }

    // Outer torus
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);

    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.3, 0.3, 1.75 * this.scaleFactor);
    this.components[0].display();
    this.scene.popMatrix();

    // Whole sphere
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.scale(0.32, 0.16 * this.scaleFactor, 0.32);
    this.components[1].display();
    this.scene.popMatrix();

    // Inner torus
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.2, 0.2, 2 * this.scaleFactor);
    this.components[2].display();
    this.scene.popMatrix();

    // Inner sphere
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.scale(0.18, 0.21 * this.scaleFactor, 0.18);
    this.components[3].display();
    this.scene.popMatrix();
  }

  /**
   * Displays the checker piece
   */
  display() {
    this.scene.pushMatrix();

    if (this.wasEaten) {
      this.displayEaten();
      return;
    }

    if (this.color == "red") {
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      this.selected ? this.selectedMaterial.apply() : null;
    }

    if (this.color == "blue") {
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      this.selected ? this.selectedMaterial.apply() : null;
    }

    if (this.moving) {
      this.displayMoving();
      return;
    }

    // Display components
    for (var i = 0; i < this.components.length; i++) {
      this.scene.pushMatrix();
      this.scene.multMatrix(this.transformations[i]);
      this.components[i].display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }

  /**
   * Updates the list of texture coordinates of the checker.
   * @param {Number} length_s - Length of the texture coordinate in the S axis.
   * @param {Number} length_t - Length of the texture coordinate in the T axis.
   * @note This method is only used in the MyRectangle and MyTriangle classes.
   */
  updateTexCoords(length_s, length_t) {
    //
  }

  // If a checker is selected, the material will change to  green
  setSelected() {
    this.selected = true;
  }

  unsetSelected() {
    this.selected = false;
  }

  setAvailable() {
    this.available = true;
  }

  unsetAvailable() {
    this.available = false;
  }
}
