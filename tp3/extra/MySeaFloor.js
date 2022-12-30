import {CGFobject} from '../../lib/CGF.js';
import { MyRectangle } from '../primitives/MyRectangle.js';



export class MySeaFloor extends CGFobject {
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

    this.plane = new MyRectangle(this.scene, 20, 0, 1, 0 ,1);

  }


  display(){
    
    this.scene.pushMatrix();
    this.scene.translate(0,2.9,60);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.scale(50,50,1);
    this.scene.setActiveShader(this.scene.sandShader);
    this.scene.texture2.bind(1);
    this.scene.texture.bind(0);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
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