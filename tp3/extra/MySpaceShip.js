import {CGFobject} from '../../lib/CGF.js';
import { CGFOBJModel } from './CGFOBJModel.js';


export class MySpaceShip extends CGFobject {
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

    this.bigShip = new CGFOBJModel(this.scene, "scenes/obj/ship.obj");

  }


  display(){
    
    this.scene.pushMatrix();
    this.scene.gray.apply();
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(25, -40, -7);
    this.scene.scale(0.09,0.09,0.09);
    this.bigShip.display();
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