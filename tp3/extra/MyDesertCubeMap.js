import { CGFobject, CGFtexture, CGFappearance } from '../../lib/CGF.js';
import { MyRectangle } from '../primitives/MyRectangle.js';


/**
 * MyCubeMap
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyDesertCubeMap extends CGFobject {
	constructor(scene) {
		super(scene);
		this.scene = scene;
		this.init();
	}

	init() {

        var vertexes = [];

		vertexes.push([1, -1.5, 3.0], [-1, -1.5, 3]);
		vertexes.push([1, 1.5, 3.0], [-1, 1.5, 3.0]);


		this.quad = new MyRectangle(this.scene, "none", 0, 1, 0, 1);

		this.updateAppliedTexture();

		this.quadMaterial = new CGFappearance(this.scene);
		this.quadMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.quadMaterial.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.quadMaterial.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.quadMaterial.setEmission(1,1,1,1);
		this.quadMaterial.setShininess(10);
		this.quadMaterial.setTextureWrap('REPEAT', 'REPEAT');


	}

	updateAppliedTexture() {

        this.texture = new CGFtexture(this.scene, "scenes/images/textures/desert.png");
        this.texture2 = new CGFtexture(this.scene, "scenes/images/textures/sun.jpg");

    }

	display() {

        this.scene.pushMatrix();

        this.scene.translate(0,0,20);
        this.scene.scale(50,10,40);

		//back
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
        this.scene.setActiveShader(this.scene.heatShader);
        this.scene.heatdistortionmap.bind(1);
		this.texture.bind(0);
		this.quad.display();
        this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

		//front
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.scene.setActiveShader(this.scene.heatShader);
        this.scene.heatdistortionmap.bind(1);
		this.texture.bind(0);
		this.quad.display();
        this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

		//bottom
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
		this.scene.translate(0, 2.87, 1);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.scene.setActiveShader(this.scene.sandShader);
		this.scene.texture2.bind(1);
		this.scene.texture.bind(0);
		this.quad.display();
		this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

		//top
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
		this.scene.translate(0, 2, 0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0, 0, 1);
        this.scene.setActiveShader(this.scene.heatShader);
        this.scene.heatdistortionmap.bind(1);
		this.texture2.bind(0);
		this.quad.display();
        this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

		//right
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
		this.scene.translate(1.0, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.setActiveShader(this.scene.heatShader);
        this.scene.heatdistortionmap.bind(1);
		this.texture.bind(0);
		this.quad.display();
        this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

		//left		
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.rotate( Math.PI / 2, 0, 1, 0);
        this.scene.setActiveShader(this.scene.heatShader);
        this.scene.heatdistortionmap.bind(1);
		this.texture.bind(0);
		this.quad.display();
        this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();

        this.scene.popMatrix();

	}

          /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cubemap
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(u, v) {
		//
	}
}
