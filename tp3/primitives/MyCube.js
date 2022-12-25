import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MyPatch } from './MyPatch.js';
import { MyRectangle } from './MyRectangle.js';
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCube extends CGFobject {
    constructor(scene) {
		super(scene);
		this.scene = scene;

		this.init();
	}

	init() {
		var vertexes = [];

		vertexes.push([1, -1.5, 3.0], [-1, -1.5, 3]);
		vertexes.push([1, 1.5, 3.0], [-1, 1.5, 3.0]);

        /* this.quad = new MyPatch(this.scene, "none", 1, 100, 1, 20, vertexes) */
		this.quad = new MyRectangle(this.scene,0, 1, 0, 1, 0);
	}

	display() {
		this.scene.pushMatrix();

		//back
		this.scene.pushMatrix();
		this.quad.display();
		this.scene.popMatrix();

		//front
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.quad.display();
		this.scene.popMatrix();

		//bottom
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.quad.display();
		this.scene.popMatrix();

		//top
		this.scene.pushMatrix();
		this.scene.translate(0, 1, 0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.quad.display();
		this.scene.popMatrix();

		//right
		this.scene.pushMatrix();
		this.scene.translate(1.0, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.quad.display();
		this.scene.popMatrix();

		//left
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate( Math.PI / 2, 0, 1, 0);
		this.quad.display();
		this.scene.popMatrix();

		this.scene.popMatrix();
	}
}