import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MySphere } from "../../primitives/MySphere.js";

export class MyChecker extends CGFobject {
  constructor(scene, color) {
    super(scene);

    this.parts = [];
    this.parts.push(new MySphere(scene, "none", 1, 15, 15));
    this.parts.push(new MySphere(scene, "none", 1, 15, 15));
    this.x = 20;
    this.y = 2;
    this.z = 40;

    this.checkerMaterial = new CGFappearance(scene);

    this.whiteTexture = new CGFtexture(scene, "scenes/images/textures/white-house.jpg");
    this.blackTexture = new CGFtexture(scene, "scenes/images/textures/soil.png");

    this.color = color;
  }

  /**
   * Update the position of the checker
   * @param {Integer} newX new x position
   * @param {Integer} newY new y position
   * @param {Integer} newZ new z position
   */
  updatePosition(newX, newY, newZ){
    this.x = newX;
    this.y = newY;
    this.z = newZ;
  }

  display() {
    console.log("displaying checker");
    this.scene.pushMatrix();

    if (this.color == "white") {
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI/2, 1, 0, 0)
      this.scene.scale(.1, .1, .025);
      this.checkerMaterial.setTexture(this.whiteTexture);
      this.checkerMaterial.apply();
      this.parts[0].display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y+0.02, this.z);
      this.scene.rotate(Math.PI/2, 1, 0, 0)
      this.scene.scale(.07, .07, .025);
      this.checkerMaterial.setTexture(this.whiteTexture);
      this.checkerMaterial.apply();
      this.parts[1].display();
      this.scene.popMatrix();
    }

    else if (this.color == "black") {
      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(Math.PI/2, 1, 0, 0)
      this.scene.scale(.1, .1, .025);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[0].display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(this.x, this.y+0.02, this.z);
      this.scene.rotate(Math.PI/2, 1, 0, 0)
      this.scene.scale(.07, .07, .025);
      this.checkerMaterial.setTexture(this.blackTexture);
      this.checkerMaterial.apply();
      this.parts[1].display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }

  updateTexCoords(length_s, length_t) {
    //
  }
}
