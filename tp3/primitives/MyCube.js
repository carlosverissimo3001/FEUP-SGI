import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MyRectangle } from './MyRectangle.js';
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
export class MyCube extends CGFobject {
    constructor(scene, r, g, b, x, y, z) {
		super(scene);
		this.scene = scene;
        this.r = r;
        this.g = g;
        this.b = b;
        this.x = x;
        this.y = y;
        this.z = z;
		this.init();
	}

	init() {


		this.quad = new MyRectangle(this.scene,0, 1, 0, 1, 0);

		this.quadMaterial = new CGFappearance(this.scene);
		this.quadMaterial.setAmbient(this.r, this.g, this.b, 1.0);
        this.quadMaterial.setDiffuse(this.r, this.g, this.b, 1.0);
        this.quadMaterial.setSpecular(this.r, this.g, this.b, 1.0);
        this.quadMaterial.setEmission(0,0,0,1);
		this.quadMaterial.setShininess(10);


	}

	updateAppliedTexture() {
        this.texture = new CGFtexture(this.scene, "scenes/images/textures/dark_wood.png");
    }

	display() {


		this.scene.pushMatrix();

		this.scene.translate(this.x,this.y,this.z);
		
		//back
		this.quadMaterial.setTexture(this.texture);
		this.scene.pushMatrix();
		this.quadMaterial.apply();
		this.quad.display();
		this.scene.popMatrix();

		//front
		this.quadMaterial.setTexture(this.texture);
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.quadMaterial.apply();
		this.quad.display();
		this.scene.popMatrix();

		//bottom
		this.quadMaterial.setTexture(this.texture);
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.quadMaterial.apply();
		this.quad.display();
		this.scene.popMatrix();

		//top
		this.quadMaterial.setTexture(this.texture);
		this.scene.pushMatrix();
		this.scene.translate(0, 1, 0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.quadMaterial.apply();
		this.quad.display();
		this.scene.popMatrix();

		//right
		this.quadMaterial.setTexture(this.texture);
		this.quadMaterial.apply();
		this.scene.pushMatrix();
		this.scene.translate(1.0, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.quad.display();
		this.scene.popMatrix();

		//left
		this.quadMaterial.setTexture(this.texture);
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate( Math.PI / 2, 0, 1, 0); 
		this.quadMaterial.apply();
		this.quad.display();
		this.scene.popMatrix();

		this.scene.popMatrix();
	}
}