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

    this.y_eat_ini = 0.335;

    this.color = color;

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

    // Is this the first move of this piece?
    this.firstMove = true;

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

    // Will store the transformation matrix so the piece can be displayed in the correct position, while its movement is being animated
    this.relativeTransformations = [];

    // Location of the deposit where the piece will be placed when it is eaten. Only the y coordinate will change, depending on the number of pieces already in the deposit
    this.depositLocation =
      this.color == "blue"
        ? [9.27, this.y_eat_ini, 49.5]
        : [9.27, this.y_eat_ini, 42.5];

    // As this matrix is fixed (the deposits are always in the same place), it will be initialized only once, in the constructor
    this.depositTransformations = [];
    this.initDepositTransformations();

    this.initialPos = [];
    this.initialPos.push(this.tile.getX() + this.x);
    this.initialPos.push(this.y);
    this.initialPos.push(this.tile.getZ() + this.z);

    this.animation = null;

    this.yUpdated = false;

    // Audio
    this.audio = new Audio("sounds/slide.mp3");
    this.audio.volume = 0.5;
    this.audioActive = false;

    // Animation duration
    this.animDuration = 1;

    this.movementDir = "";

    // Is this piece moving to the eat location?
    this.isMoving_eat = false;
  }

  /**
   * Updates the checker piece position
   */
  updatePos() {
    this.initialPos[0] = this.tile.getX() + this.x;
    this.initialPos[2] = this.tile.getZ() + this.z;

    if (!this.isMoving_eat) this.relativeTransformations = [];
  }

  /**
   * These are the transformations relative to the tile
   */
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
   * Computes the checker piece movement direction
   * @param {MyTile} tile - destination tile
   */
  getMovementDirection(tile) {
    var x = tile.getX() - this.tile.getX();

    x < 0 ? (this.movementDir = "left") : (this.movementDir = "right");
  }

  /**
   * These are the transformations relative to the origin
   * @param {boolean} eatMove - true if the checker piece is moving to eat another piece
   */
  initRelativeTransformations(eatMove, goingToDeposit) {
    // Outer torus
    var transf = mat4.create();

    // The x and z coordinates are relative to the tile' absolute position + offset

    var x,
      y = 0.3,
      z;

    // Red checker piece
    if (this.color == "red") {
      // Checker piece is moving to the right
      if (this.movementDir == "right") {
        x = this.tile.getX() + 1.5;
        z = this.tile.getZ() - 0.5;

        if (eatMove) {
          x += 1;
          z -= 1;
        }
      }
      // Checker piece is moving to the left
      else {
        x = this.tile.getX() - 0.5;
        z = this.tile.getZ() - 0.5;

        if (eatMove) {
          x -= 1;
          z -= 1;
        }
      }
    }

    // Blue checker piece
    else {
      // Checker piece is moving to the right
      if (this.movementDir == "right") {
        x = this.tile.getX() + 1.5;
        z = this.tile.getZ() + 1.5;

        if (eatMove) {
          x += 1;
          z += 1;
        }
      }
      // Checker piece is moving to the left
      else {
        x = this.tile.getX() - 0.5;
        z = this.tile.getZ() + 1.5;

        if (eatMove) {
          x -= 1;
          z += 1;
        }
      }
    }

    if (goingToDeposit){
      x = this.tile.getX() + this.x;
      z = this.tile.getZ() + this.z;
    }

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 1]);

    this.relativeTransformations.push(transf);

    // Whole sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.32, 0.064, 0.32]);

    this.relativeTransformations.push(transf);

    // Inner torus
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.2, 0.2, 1.04]);

    this.relativeTransformations.push(transf);

    // Inner sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.18, 0.084, 0.234]);

    this.relativeTransformations.push(transf);
  }

  /**
   * Computes the checker piece absolute transformations to the deposit location
   */
  initDepositTransformations() {
    var scaleFactor = 0.4;
    var transf = mat4.create();

    var x = this.depositLocation[0];
    var y = this.depositLocation[1];
    var z = this.depositLocation[2];

    // Outer torus

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 1.75 * scaleFactor]);

    this.depositTransformations.push(transf);

    // Whole sphere

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.32, 0.16 * scaleFactor, 0.32]);

    this.depositTransformations.push(transf);

    // Inner torus

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.2, 0.2, 2 * scaleFactor]);

    this.depositTransformations.push(transf);

    // Inner sphere

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.18, 0.21 * scaleFactor, 0.18]);

    this.depositTransformations.push(transf);
  }

  /**
   * Sets up the animation for the checker piece
   * @param {MyTile} tile - Destination tile
   * @param {boolean} eatMove - true if the checker piece is moving to eat another piece
   */
  startAnimation(tile, eatMove) {
    // Get the movement direction
    this.getMovementDirection(tile);

    // Get transformations relative to the origin
    this.initRelativeTransformations(eatMove);

    // Create the animation
    this.animation = new MyKeyframeAnimation(this.scene, "checkerAnimation");

    // Get the destination tile coordinates
    var x = tile.getX() + 0.5;
    var y = 1.1;
    var z = tile.getZ() + 0.5;

    // Compute the distance between the initial and final positions
    var deltaX = this.initialPos[0] - x;
    var deltaY = 0;
    var deltaZ = this.initialPos[2] - z;

    // Initial frame -> Deltas to old position
    var initialkf = new MyKeyframe(
      0,
      [deltaX, deltaY, deltaZ],
      [0, 0, 0],
      [1, 1, 1]
    );

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

  /**
   * Sets up the animation for the checker piece when it will be deposited in the eat locaiton
   */
  startEatAnimation() {
    // Transformations relative to the origin, to the current tile
    this.initRelativeTransformations(false, true);

    // Create the animation
    this.animation = new MyKeyframeAnimation(this.scene, "jumpAnimation");

    var deltaX = this.depositLocation[0] - this.initialPos[0];

    // Y position on top of the deposit location
    var deltaY = this.depositLocation[1]

    var deltaZ = this.depositLocation[2] - this.initialPos[2];

    // Time it takes for the checker eating to collide with this piece
    var deltaTime = 0.26;

    // The duration of the animation will vary depending on the distance between the initial and final positions
    this.animDuration = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ) / 2;

    // Remove 50% of the duration, to make the animation faster
    this.animDuration *= 0.5;

    // Create 10 keyframes for the animation, to simulate an arc-like movement
    for (var i = 0; i < 10; i++) {
      // Increase the instant by 10% of the animation duration
      var instant = deltaTime + (i * this.animDuration) / 10;

      // x and z go from 0 to their deltas
      var x = (instant - deltaTime) * deltaX / this.animDuration;
      var z = (instant - deltaTime) * deltaZ / this.animDuration;

      // TODO: Change this so, when the animation is finished, the y value is at deltaY
      var y = 0.5 * Math.sin((instant - deltaTime) * Math.PI / this.animDuration);

      console.log("At instant " + i + ", y = " + y + "")

      var kf = new MyKeyframe(
        instant,
        [x, y, z],
        [0, 0, 0],
        [1, 1, 1]
      );

      this.animation.addKeyframe(kf);
    }

    // This only needs to be called due to an oversight in the MyKeyframeAnimation class -> the startTime and endTime are only set when the update_order method is called
    this.animation.update_order();

    // Start the animation
    this.isMoving_eat = true;
  }

  /**
   * Displays the checker piece, when moving to a tile
   */
  displayMoving() {
    this.scene.pushMatrix();

    // Has the animation finished?
    if (this.animation.finished) {
      // If so, checker piece is no longer moving
      this.moving = false;

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

        // Applies the animation
        this.scene.multMatrix(this.animation.getMatrix());

        // Puts the piece in the correct position
        this.scene.multMatrix(this.relativeTransformations[i]);

        this.components[i].display();
        this.scene.popMatrix();
      }
    }
    this.scene.popMatrix();
  }

  /**
   * Displays the checker piece, when it it being eaten
   */
  displayEaten() {
    this.scene.pushMatrix();

    // Has the animation finished?
    if (this.animation.finished) {
      // If so, checker piece is no longer moving
      this.isMoving_eat = false;

      // No animation is being played
      this.animation = null;
      this.scene.popMatrix();
      return;
    }

    // Otherwise, display the checker piece, with the animation
    else {
      // Play the audio
      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();

        // Applies the animation
        this.scene.multMatrix(this.animation.getMatrix());

        // Puts the piece in the correct position
        this.scene.multMatrix(this.relativeTransformations[i]);

        this.components[i].display();
        this.scene.popMatrix();
      }
    }
    this.scene.popMatrix();
  }

  /**
   * Displays the checker piece, when it is deposited in the eat location
   */
  displayDeposited() {
    // Used to update the transformations to the deposit location
    if (!this.yUpdated){
      // this.depositLocation[1] has been updated, so the checker piece can be displayed in the correct position
      this.depositTransformations = [];
      this.initDepositTransformations();
      this.yUpdated = true;
    }

    /* console.log(this.depositLocation[1]) */

    for (var i = 0; i < this.components.length; i++) {
      this.scene.pushMatrix();
      this.scene.multMatrix(this.depositTransformations[i]);
      this.components[i].display();
      this.scene.popMatrix();
    }
  }

  /**
   * Displays the checker piece
   */
  display() {
    this.scene.pushMatrix();

    if (this.color == "red") {
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      this.selected ? this.selectedMaterial.apply() : null;
    }

    if (this.color == "blue") {
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      this.selected ? this.selectedMaterial.apply() : null;
    }

    // Arc animation to deposit the checker piece
    if (this.isMoving_eat) {
      this.displayEaten();
      return;
    }

    // If the animation was completed, the condition above is false, so this function is called
    if (this.wasEaten) {
      // Display the checker piece in the eat location
      this.displayDeposited();
      return;
    }

    // If the piece is moving, display the animation
    if (this.moving) {
      this.displayMoving();
      return;
    }

    // Standard display
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
