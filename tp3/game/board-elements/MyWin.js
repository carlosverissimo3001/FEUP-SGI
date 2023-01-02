import {CGFobject, CGFappearance, CGFtexture} from "../../../lib/CGF.js";
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
    
    this.p_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.l_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.a_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.y_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.e_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.r_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.number = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.w_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.i_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.n_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.ex1 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.ex2 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);

    this.n = 1;

    this.appearance = new CGFappearance(this.scene);

    this.fontTexture = new CGFtexture(this.scene, "scenes/images/textures/oolite-font.trans.png");
    this.appearance.setTexture(this.fontTexture);

  }

  display(){
    this.displayLetter(0,5,this.p_letter, 0,5,-3, 1, 1, 1);
    this.displayLetter(12,4,this.l_letter, 0.5,5,-3, 1, 1, 1);
    this.displayLetter(1,4,this.a_letter, 1,5,-3, 1, 1, 1);
    this.displayLetter(9,5,this.y_letter, 1.5,5,-3, 1, 1, 1);
    this.displayLetter(5,4,this.e_letter, 2,5,-3, 1, 1, 1);
    this.displayLetter(2,5,this.r_letter, 2.5,5,-3, 1, 1, 1);
    this.displayLetter(this.n,3,this.number, 3.3,5,-3, 1, 1, 1);
    this.displayLetter(7,5,this.w_letter, 3.8,5,-3, 1, 1, 1);
    this.displayLetter(9,4,this.i_letter, 4.5,5,-3, 1, 1, 1);
    this.displayLetter(14,4,this.n_letter, 4.8,5,-3, 1, 1, 1);
    this.displayLetter(1,2,this.ex1, 5.5,5,0, 1, 1, 1);
    this.displayLetter(1,2,this.ex2, 6.0,5,0, 1, 1, 1);
  }

  displayLetter(x,y,rect,t,u,v,scale_x,scale_y,scale_z) {
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(t,u,v);
    //this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.scale(scale_x, scale_y, scale_z);

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
