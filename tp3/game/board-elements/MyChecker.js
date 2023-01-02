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

    this.row = row;
    this.col = col;
    this.board = board;
    this.id = row + "," + col;

    this.x = 0.5;
    this.y = 2.1;
    this.z = 0.5;

    this.y_eat_ini = 0.335;

    this.color = color;
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

    // Checker piece height
    this.stackDelta = 2.075;

    // If the checker is a king, it can move backwards and forwards. It will be represented by two checkers on top of each other
    this.isKing = false;

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

    // Stores the initial position of the piece, and is updated every time the piece is moved
    this.initialPos = [];
    this.initialPos.push(this.tile.getX() + this.x);
    this.initialPos.push(this.y);
    this.initialPos.push(this.tile.getZ() + this.z);

    // Animation
    this.animation = null;
    this.animDuration = 1;

    // Audio
    this.audio = new Audio("sounds/slide.mp3");
    this.audio.volume = 0.5;
    this.audioActive = false;

    // Direction of the movement
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
   * These are the transformations relative to the tile, used in the normal display, called by MyTile
   * @param {boolean} isStakedPiece - true if the checker piece is a staked on top of another piece
   */
  initTransformations(isStakedPiece) {
    // Outer torus
    var transf = mat4.create();

    var transformations = [];

    var x = this.x;
    var y = this.y;
    var z = this.z;

    if (isStakedPiece)
      y+=this.stackDelta

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 10]);

    transformations.push(transf);

    // Whole sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 0.75]);

    transformations.push(transf);

    // Inner torus
    transf = mat4.create();

    mat4.translate(transf, transf, [x, y, z]);
    mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    mat4.scale(transf, transf, [0.065 * 3, 0.065 * 3, 10]);

    transformations.push(transf);

    // Inner sphere
    transf = mat4.create();

    mat4.translate(transf, transf, [x, y, z]);
    mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    mat4.scale(transf, transf, [0.055 * 3, 0.055 * 3, 1]);

    transformations.push(transf);

    return transformations;
  }

  /**
   * Computes the checker piece movement direction to the destination tile
   * @param {MyTile} tile - destination tile
   */
  getMovementDirection(tile) {
    var x = tile.getX() - this.tile.getX();

    x < 0 ? (this.movementDir = "left") : (this.movementDir = "right");
  }

  /**
   * These are the transformations relative to the origin, used in the animation display, called by the Orchestrator
   * @param {boolean} isStakedPiece - true if the checker piece is a staked on top of another piece
   * @returns {Array} - array of transformations
   */
  initRelativeTransformations(isStakedPiece) {
    // Outer torus
    var transf = mat4.create();

    var relativeTransformations = [];

    // The x and z coordinates are relative to the tile' absolute position + offset

    // Red checker piece
    var x = this.tile.getX() + this.x;
    var y = 0.3
    var z = this.tile.getZ() + this.z;

    if (isStakedPiece){
      y+=0.2
    }

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 1]);

    relativeTransformations.push(transf);

    // Whole sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.32, 0.064, 0.32]);

    relativeTransformations.push(transf);

    // Inner torus
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.2, 0.2, 1.04]);

    relativeTransformations.push(transf);

    // Inner sphere
    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.18, 0.084, 0.234]);

    relativeTransformations.push(transf);

    return relativeTransformations;
  }

  /**
   * Computes the checker piece absolute transformations to the deposit location
   * @param {boolean} isStackedPiece - true if the checker piece is a staked on top of another piece
   */
  initDepositTransformations(isStackedPiece) {
    var scaleFactor = 0.4;
    var transf = mat4.create();

    var transformations = [];

    var x = this.depositLocation[0];
    var y = this.depositLocation[1];
    var z = this.depositLocation[2];

    if (isStackedPiece) {
      y += 0.15;
    }

    // Outer torus

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.3, 0.3, 1.75 * scaleFactor]);

    transformations.push(transf);

    // Whole sphere

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.32, 0.16 * scaleFactor, 0.32]);

    transformations.push(transf);

    // Inner torus

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.rotate(transf, transf, Math.PI / 2, [1, 0, 0]);
    transf = mat4.scale(transf, transf, [0.2, 0.2, 2 * scaleFactor]);

    transformations.push(transf);

    // Inner sphere

    transf = mat4.create();

    transf = mat4.translate(transf, transf, [x, y, z]);
    transf = mat4.scale(transf, transf, [0.18, 0.21 * scaleFactor, 0.18]);

    transformations.push(transf);

    return transformations;
  }

  /**
   * Sets up the animation for the checker piece
   * @param {MyTile} tile - Destination tile
   */
  startAnimation(tile) {
    // Get the movement direction
    this.getMovementDirection(tile);

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

    this.deltasX = [];
    this.deltasZ = [];

    // We will only update the spotlight each 0.1 second, since the animation is 1 second long
    for (var i = 0; i < 10; i++) {
      this.deltasX.push(deltaX / 10);
      this.deltasZ.push(deltaZ / 10);
    }

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

    // Create the animation
    this.animation = new MyKeyframeAnimation(this.scene, "jumpAnimation");

    var deltaX = this.depositLocation[0] - this.initialPos[0];

    // Y position on top of the deposit location
    var deltaY = this.depositLocation[1]

    var deltaZ = this.depositLocation[2] - this.initialPos[2];

    // Time it takes for the checker eating to collide with this piece
    var deltaTime = 0.26*this.animDuration;

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

      // Get translation deltas for the spotlight
      var deltas = this.animation.getTranslationMatrix();

      // Deltas are always positive, so we need to check the movement direction to know if we need to add or subtract the deltas

      if (this.color == "red") {
        if (this.movementDir == "right") {
          if (deltas[0] > 0) {
            deltas[0] *= -1;
          }
        }
        else {
          // Do nothing, deltas are ok
        }
      }
      else {
        if (this.movementDir == "right") {
          if (deltas[0] > 0) {
            deltas[0] *= -1;
          }
          if (deltas[2] > 0) {
            deltas[2] *= -1;
          }
        }
        else {
          if (deltas[2] > 0) {
            deltas[2] *= -1;
          }
        }
      }

      // Create the light
      this.audio.loop = true;
      this.audio.play();

      this.orchestrator.addSpotlight([this.initialPos[0] - deltas[0], 1, this.initialPos[2] - deltas[2]]);

      var transformations = this.initRelativeTransformations(false);

      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();

        // Applies the animation
        this.scene.multMatrix(this.animation.getMatrix());

        // Puts the piece in the correct position
        this.scene.multMatrix(transformations[i]);

        this.components[i].display();
        this.scene.popMatrix();

      }

      if (this.isKing){
        var transformations = this.initRelativeTransformations(true);

        for (var i = 0; i < this.components.length; i++) {
          this.scene.pushMatrix();

          // Applies the animation
          this.scene.multMatrix(this.animation.getMatrix());

          // Puts the piece in the correct position
          this.scene.multMatrix(transformations[i]);

          this.components[i].display();
          this.scene.popMatrix();
        }
      }

    }
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
      var transformations = this.initRelativeTransformations(false);

      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();

        // Applies the animation
        this.scene.multMatrix(this.animation.getMatrix());

        // Puts the piece in the correct position
        this.scene.multMatrix(transformations[i]);

        this.components[i].display();
        this.scene.popMatrix();
      }

      if (this.isKing){
        transformations = this.initRelativeTransformations(true);

        for (var i = 0; i < this.components.length; i++) {
          this.scene.pushMatrix();

          // Applies the animation
          this.scene.multMatrix(this.animation.getMatrix());

          // Puts the piece in the correct position
          this.scene.multMatrix(transformations[i]);

          this.components[i].display();
          this.scene.popMatrix();
        }
      }
    }
    this.scene.popMatrix();
  }

  /**
   * Displays the checker piece, when it is deposited in the eat location
   */
  displayDeposited() {
    var transformations = this.initDepositTransformations(false);

    for (var i = 0; i < this.components.length; i++) {
      this.scene.pushMatrix();
      this.scene.multMatrix(transformations[i]);
      this.components[i].display();
      this.scene.popMatrix();
    }

    /* if (this.isKing){
      transformations = this.initDepositTransformations(true);

      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();
        this.scene.multMatrix(transformations[i]);
        this.components[i].display();
        this.scene.popMatrix();
      }
    } */
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
    var transformations = this.initTransformations(false);

    for (var i = 0; i < this.components.length; i++) {
      this.scene.pushMatrix();
      this.scene.multMatrix(transformations[i]);
      this.components[i].display();
      this.scene.popMatrix();
    }

    if (this.isKing) {
      var transformations = this.initTransformations(true);

      for (var i = 0; i < this.components.length; i++) {
        this.scene.pushMatrix();
        this.scene.multMatrix(transformations[i]);
        this.components[i].display();
        this.scene.popMatrix();
      }
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

  // Set the checker piece as selected
  setSelected() {
    this.selected = true;
  }

  // Set the checker piece as unselected
  unsetSelected() {
    this.selected = false;
  }

  // Set the checker piece as available
  setAvailable() {
    this.available = true;
  }

  // Set the checker piece as unavailable
  unsetAvailable() {
    this.available = false;
  }

  // Set the scene orchestrator
  setOrchestrator(orchestrator) {
    this.orchestrator = orchestrator;
  }

  // Set the checker piece as king
  setKing(){
    this.isKing = true;
  }

  // When the user changes the animation duration value in the interface, this function is executed
  updateAnimationDuration(duration){
    this.animDuration = duration;
  }
}
