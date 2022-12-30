import {CGFobject} from '../../lib/CGF.js';
import { CGFOBJModel } from './CGFOBJModel.js';


export class MyPyramid extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   */
  constructor(scene) {
    super(scene);
    this.scene = scene;


    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {

    this.pyramid = new CGFOBJModel(this.scene, "scenes/obj/pyramid.obj");
    this.esfinge1 = new CGFOBJModel(this.scene, "scenes/obj/esfinge.obj");
    this.esfinge2 = new CGFOBJModel(this.scene, "scenes/obj/esfinge.obj");

  }


  display(){
    
    this.scene.pushMatrix();
    this.scene.heattexture.apply();
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(-40, 0.5, 30);
    this.scene.scale(1.3,1.3,1.3);
    this.pyramid.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(15, -38, 0);
    this.scene.scale(0.001,0.001,0.001);
    this.esfinge1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.translate(-15, 53, 0);
    this.scene.scale(0.001,0.001,0.001);
    this.esfinge2.display();
    this.scene.popMatrix();

  }

      /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the seaFloor
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(u, v) {
		//
	}

}