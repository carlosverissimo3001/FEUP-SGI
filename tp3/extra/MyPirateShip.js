import {CGFobject} from '../../lib/CGF.js';
import { CGFOBJModel } from './CGFOBJModel.js';


export class MyPirateShip extends CGFobject {
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

    this.ship = new CGFOBJModel(this.scene, "scenes/obj/Project Name.obj");

  }


  display(){
    
    this.scene.pushMatrix();
    this.scene.ferrugem.apply();
    this.scene.translate(40, 0.5, 40);
    this.ship.display();
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