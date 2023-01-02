import {CGFobject, CGFappearance, CGFtexture} from "../../../lib/CGF.js";
import { MyRectangle } from '../../primitives/MyRectangle.js';

export class MyTie extends CGFobject {
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
    
    this.w_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.e_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.h_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.a_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.v_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.e_letter2 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.a_letter2 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.t_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.i_letter = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.e_letter3 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.ex1 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.ex2 = new MyRectangle(this.scene, "none", 0, 1, 0, 1);

    this.x = 10.75;
    this.y = 0.1;
    this.z = 42;

    this.appearance = new CGFappearance(this.scene);

    this.fontTexture = new CGFtexture(this.scene, "scenes/images/textures/oolite-font.trans.png");
    this.appearance.setTexture(this.fontTexture);

  }

  display(){
    this.scene.pushMatrix();
    this.scene.translate(this.x+1, 0, this.z+3);
    this.displayLetter(7,5,this.w_letter, 0,5,0, 1, 1, 1);
    this.displayLetter(5,4,this.e_letter, 0.5,5,0, 1, 1, 1);
    this.displayLetter(8,4,this.h_letter, 1,5,0, 1, 1, 1);
    this.displayLetter(1,4,this.a_letter, 1.5,5,0, 1, 1, 1);
    this.displayLetter(6,5,this.v_letter, 2,5,0, 1, 1, 1);
    this.displayLetter(5,4,this.e_letter2, 2.5,5,0, 1, 1, 1);
    this.displayLetter(1,4,this.a_letter2, 3.8,5,0, 1, 1, 1);
    this.displayLetter(4,5,this.t_letter, 4.5,5,0, 1, 1, 1);
    this.displayLetter(9,4,this.i_letter, 4.8,5,0, 1, 1, 1);
    this.displayLetter(5,4,this.e_letter3, 2.5,5,0, 1, 1, 1);
    this.displayLetter(1,2,this.ex1, 5.5,5,0, 1, 1, 1);
    this.displayLetter(1,2,this.ex2, 6.0,5,0, 1, 1, 1);
    this.scene.popMatrix();
  }

  displayLetter(x,y,rect,t,u,v,scale_x,scale_y,scale_z) {
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(t,u,v);
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
