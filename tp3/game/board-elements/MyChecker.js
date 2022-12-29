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

    this.y_eat = 0.27;

    this.wasEaten = false;
    this.available = false;

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
  }

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
    this.parts[0].display();
    this.scene.popMatrix();

    // Whole sphere
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.scale(0.32, 0.16 * this.scaleFactor, 0.32);
    this.parts[1].display();
    this.scene.popMatrix();

    // Inner torus
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.2, 0.2, 2 * this.scaleFactor);
    this.parts[2].display();
    this.scene.popMatrix();

    // Inner sphere
    this.scene.pushMatrix();
    this.color == "blue"
      ? this.scene.translate(20.27, this.y_eat, 49.5)
      : this.scene.translate(9.27, this.y_eat, 42.5);
    this.scene.scale(0.18, 0.21 * this.scaleFactor, 0.18);
    this.parts[3].display();
    this.scene.popMatrix();
  }

  display() {
    this.scene.pushMatrix();

    if (this.wasEaten) {
      this.displayEaten();
      return;
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
    } else if (this.color == "red") {
      /* Outer torus */
      this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 10);
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[0].display();
      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[1].display();
      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[2].display();
      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);

      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      (this.available ? this.lightRedMaterial : this.redMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[3].display();
      this.scene.popMatrix();
    } else if (this.color == "black") {
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
    } else if (this.color == "blue") {

      /* Outer torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.wasEaten ? null : this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.wasEaten ? null : this.scene.scale(0.1 * 3, 0.1 * 3, 10);
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[0].display();
      this.scene.popMatrix();

      /* Whole sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.1 * 3, 0.1 * 3, 0.75);
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[1].display();
      this.scene.popMatrix();

      /* Inner torus */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.065 * 3, 0.065 * 3, 10);
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
      this.parts[2].display();
      this.scene.popMatrix();

      /* Inner sphere */
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.055 * 3, 0.055 * 3, 1);
      (this.available ? this.lightBlueMaterial : this.blueMaterial).apply();
      (this.selected ? this.selectedMaterial.apply() : null)
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
