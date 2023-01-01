import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import { MyRectangle } from '../../primitives/MyRectangle.js';

export class MyWin extends CGFobject {
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
    
    this.w = new MyRectangle(scene, "none", 0, 1, 0, 1);
    this.i = new MyRectangle(scene, "none", 0, 1, 0, 1);
    this.n = new MyRectangle(scene, "none", 0, 1, 0, 1);

    this.appearance = new CGFappearance(scene);

    this.fontTexture = new CGFtexture(scene, "scenes/images/textures/oolite-font.trans.png");
    this.appearance.setTexture(this.fontTexture);

  }

  display(){
    this.displayLetter(7,5,this.w);
    this.displayLetter(9,4,this.i);
    this.displayLetter(14,4,this.n);
  }

  displayLetter(x,y,rect) {
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(0.4,0,-0.3);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.scale(3, 8, 3);

    this.scene.textShader.setUniformsValues({'charCoords': [x,y]});
    rect.display();
    this.scene.popMatrix();

    // reactivate default shader
    this.scene.setActiveShader(this.scene.defaultShader);
  }

        /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the surface
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(u, v) {
		//
	}
}
