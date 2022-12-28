import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MySphere } from "../../primitives/MySphere.js";
import { MyTorus } from "../../primitives/MyTorus.js";

export class MyChecker extends CGFobject {
  constructor(scene, color, row, col, board, tileID) {
    super(scene);

    /*
      The checker piece will be composed by 4 parts:
      - 2 torus
        - 1 outer torus
        - 1 inner torus
      - 2 spheres
        - 1 outer sphere
        - 1 sphere where all the pieces will be placed
    */
    this.parts = [];

    // Outer torus
    this.parts.push(new MyTorus(scene, "none", 0.1, 1, 40, 40));
    // Whole sphere
    this.parts.push(new MySphere(scene, "none", 1, 40, 40));
    // Inner torus
    this.parts.push(new MyTorus(scene, "none", 0.1, 1, 40, 40));
    // Inner sphere
    this.parts.push(new MySphere(scene, "none", 1, 40, 40));

    this.row = row;
    this.col = col;
    this.board = board;
    this.id = row + "," + col;

    this.x = 0.5;
    this.y = 1.1;
    this.z = 0.5;

    this.y_eat = 0;

    this.wasEaten = false;

    // Pointer to the tile where the checker is placed
    var tileID = tileID;

    this.tile = this.board.getTile(tileID.split(",")[0], tileID.split(",")[1]);

    this.checkerMaterial = new CGFappearance(scene);

    this.whiteTexture = new CGFtexture(
      scene,
      "scenes/images/textures/white.png"
    );
    this.redTexture = new CGFtexture(scene, "scenes/images/textures/red.jpg");
    this.blackTexture = new CGFtexture(
      scene,
      "scenes/images/textures/grey.png"
    );
    this.blueTexture = new CGFtexture(scene, "scenes/images/textures/blue.jpg");

    this.color = color;
  }

  displayEaten() {
    this.scene.pushMatrix();
    switch (this.color) {
      case "white":
        this.checkerMaterial.setTexture(this.whiteTexture);
        this.checkerMaterial.apply();
        break;
      case "red":
        this.checkerMaterial.setTexture(this.redTexture);
        this.checkerMaterial.apply();
        break;
      case "black":
        this.checkerMaterial.setTexture(this.blackTexture);
        this.checkerMaterial.apply();
        break;
      case "blue":
        this.checkerMaterial.setTexture(this.blueTexture);
        this.checkerMaterial.apply();
        break;
      default:
        break;
    }

    // Outer torus
    (this.color == "blue")
    ? this.scene.translate(20.27, this.y_eat, 49.5)
    : this.scene.translate(10.27, this.y_eat, 40.5);

    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(.3, .3, 1.75);
    this.parts[0].display();
    this.scene.popMatrix();

    // Whole sphere
    this.scene.pushMatrix();
    (this.color == "blue")
    ? this.scene.translate(20.27, this.y_eat, 49.5)
    : this.scene.translate(10.27, this.y_eat, 40.5);
    this.scene.scale(0.32, 0.18, 0.32);
    this.parts[1].display();
    this.scene.popMatrix();


    // Inner torus
    this.scene.pushMatrix();
    (this.color == "blue")
    ? this.scene.translate(20.27, this.y_eat, 49.5)
    : this.scene.translate(10.27, this.y_eat, 40.5);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.2, 0.2, 2);
    this.parts[2].display();
    this.scene.popMatrix();

    // Inner sphere
    this.scene.pushMatrix();
    (this.color == "blue")
    ? this.scene.translate(20.27, this.y_eat, 49.5)
    : this.scene.translate(10.27, this.y_eat, 40.5);
    this.scene.scale(0.18, 0.21, .18);
    this.parts[3].display();
    this.scene.popMatrix();

  }

  display() {
    this.scene.pushMatrix();

    if (this.wasEaten) {
      this.displayEaten();
      return
    }


    if (this.color == "white") {
      /* Outer torus */
      this.scene.pushMatrix();

      this.checkerMaterial.setTexture(this.whiteTexture);
      this.checkerMaterial.apply();

      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 10);
      this.parts[0].display();

      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      this.parts[1].display();


      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      this.parts[2].display();

      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      this.parts[3].display();

      this.scene.popMatrix();

    }

    else if (this.color == "red") {
      /* Outer torus */
      this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 10);
      this.checkerMaterial.setTexture(this.redTexture);
      this.checkerMaterial.apply();
      this.parts[0].display();
      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      this.checkerMaterial.setTexture(this.redTexture);
      this.checkerMaterial.apply();
      this.parts[1].display();
      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      this.checkerMaterial.setTexture(this.redTexture);
      this.checkerMaterial.apply();
      this.parts[2].display();
      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      this.checkerMaterial.setTexture(this.redTexture);
      this.checkerMaterial.apply();
      this.parts[3].display();
      this.scene.popMatrix();

    }

    else if (this.color == "black") {
      /* Outer torus */
      this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 10);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[0].display();
      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[1].display();
      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[2].display();
      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[3].display();
      this.scene.popMatrix();
    }

    else if (this.color == "blue") {
      /* Outer torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.wasEaten ? null : this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.wasEaten ? null : this.scene.scale(0.1 * 3, 0.1 * 3, 10);

      this.checkerMaterial.setTexture(this.blueTexture);
      this.checkerMaterial.apply();
      this.parts[0].display();
      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      this.checkerMaterial.setTexture(this.blueTexture);
      this.checkerMaterial.apply();
      this.parts[1].display();
      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      this.checkerMaterial.setTexture(this.blueTexture);
      this.checkerMaterial.apply();
      this.parts[2].display();
      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      this.checkerMaterial.setTexture(this.blueTexture);
      this.checkerMaterial.apply();
      this.parts[3].display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }

  updateTexCoords(length_s, length_t) {
    //
  }

  // If a checker is selected, the material will change to  green
  setSelected() {
    this.checkerMaterial.setAmbient(0, 255 / 255, 0, 1);
    this.checkerMaterial.setDiffuse(0, 255 / 255, 0, 1);
    this.checkerMaterial.setSpecular(0, 255 / 255, 0, 1);
  }

  unsetSelected() {
    this.checkerMaterial = new CGFappearance(this.scene);
    if (this.color == "blue")
      this.checkerMaterial.setTexture(this.blackTexture);
    else this.checkerMaterial.setTexture(this.whiteTexture);
  }

  // If a checker is selected, the material will change to a light green
  setAvaliable() {
    this.checkerMaterial.setAmbient(1, 1, 0, 1);
    this.checkerMaterial.setDiffuse(1, 1, 0, 1);
    this.checkerMaterial.setSpecular(1, 1, 0, 1);
  }

  unsetAvaliable() {
    this.checkerMaterial = new CGFappearance(this.scene);
    if (this.color == "blue")
      this.checkerMaterial.setTexture(this.blackTexture);
    else this.checkerMaterial.setTexture(this.whiteTexture);
  }
}
