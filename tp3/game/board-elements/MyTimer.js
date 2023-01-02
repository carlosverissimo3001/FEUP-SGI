import {CGFobject, CGFappearance, CGFtexture} from "../../../lib/CGF.js";
import { MyRectangle } from '../../primitives/MyRectangle.js';
import { MyCube } from "../../primitives/MyCube.js";

export class MyTimer extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   */
  constructor(scene) {
    super(scene);
    this.scene = scene;

    this.x = 10.75;
    this.y = 0.1;
    this.z = 42;

    this.initBuffers();

    this.min = 10;
    this.sec = 0;
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {

    this.timeBox = new MyCube(this.scene);
    this.miniTimerBox = new MyCube(this.scene);
    this.min1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.min2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.sec1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.sec2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.point_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);

    this.appearance = new CGFappearance(this.scene);

    this.fontTexture = new CGFtexture(this.scene, "scenes/images/textures/oolite-font.trans.png");
    this.appearance.setTexture(this.fontTexture);

  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.x + 9, this.y, this.z  );
    this.scene.scale(1.0, 3, 8);
    this.scene.green.apply();
    this.timeBox.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x + 8.8, this.y+1, this.z+2 );
    this.scene.scale(0.1, 1.5, 6);
    this.scene.pink.apply();
    this.miniTimerBox.display();
    this.scene.popMatrix();


    this.displayLetter(Math.floor(this.min/10),3,this.min1_square,this.x + 8.5, this.y+1, this.z+3.3 );
    this.displayLetter(this.min%10,3,this.min2_square,this.x + 8.5, this.y+1, this.z+3.7 );
    this.displayLetter(10,3,this.point_square,this.x + 8.5, this.y+1, this.z+4.1 );
    this.displayLetter(Math.ceil(this.sec/10),3,this.sec1_square,this.x + 8.5, this.y+1, this.z+4.5 );
    this.displayLetter(this.sec%10,3,this.sec2_square,this.x + 8.5, this.y+1, this.z+4.9 );


  }

  displayLetter(x,y,rect,t,u,v) {
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(t,u,v);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.scale(1, 2, 1);

    this.scene.textShader.setUniformsValues({'charCoords': [x,y]});
    rect.display();
    this.scene.popMatrix();

    // reactivate default shader
    this.scene.setActiveShader(this.scene.defaultShader);
  }

  update() {
    if(this.sec == 0) {
        if(this.min > 0) this.min = this.min - 1;
        this.sec = 59;
    }
    else {
        this.sec = this.sec - 1;
    }
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
