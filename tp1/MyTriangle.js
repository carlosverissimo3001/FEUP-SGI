import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangle
 * @method constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3) {
		super(scene);
        this.x1 = x1;
		this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
        this.y3 = y3;

		this.initBuffers();
	}

    // TODO: Change this
	initBuffers() {
		// Not sure about this
        this.vertices = [
			this.x1, this.y1, 0,
            this.x2, this.y2, 0,
            this.x3, this.y3, 0
		];


		this.indices = [
			//Counter-clockwise reference of vertices
			0, 1, 5,
			1, 2, 5,
			2, 3, 5,
			3, 4, 5,

			//Clockwise reference of vertices
			5, 1, 0,
			5, 2, 1,
			5, 3, 2,
			5, 4, 3
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}