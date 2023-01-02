import {CGFobject, CGFappearance, CGFtexture} from "../../../lib/CGF.js";
import { MyRectangle } from '../../primitives/MyRectangle.js';
import { MyCube } from "../../primitives/MyCube.js";
import { MyTorus } from "../../primitives/MyTorus.js";
import { MySphere } from "../../primitives/MySphere.js";
import { CGFOBJModel } from "../../extra/CGFOBJModel.js";

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
    this.turn = 1;

    this.initBuffers();

    this.min = 10;
    this.sec = 0;
    this.msec = 59;
    this.timeToMakeMoveMin = 0;
    this.timeToMakeMoveSec = 20;
    this.player2Min = this.timeToMakeMoveMin;
    this.player2Sec = this.timeToMakeMoveSec;
    this.player2MSec = 59;
    this.player1Min = 0;
    this.player1Sec = 0;
    this.player1MSec = 0;
    this.timeToMakeMove = 0.2;
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {

    this.timeBox = new MyCube(this.scene);
    this.miniTimerBox = new MyCube(this.scene);
    this.crown1 = new CGFOBJModel(this.scene, "scenes/obj/crown.obj");
    this.crown2 = new CGFOBJModel(this.scene, "scenes/obj/crown.obj");
    this.min1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.min2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.sec1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.sec2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.point_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    //player 1 timer
    this.minp1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.minp12_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.secp1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.secp12_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.point1_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    //player 2 timer
    this.minp2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.minp22_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.secp2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.secp22_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);
    this.point2_square = new MyRectangle(this.scene, "none", 0, 1, 0, 1);

    this.appearance = new CGFappearance(this.scene);

    this.fontTexture = new CGFtexture(this.scene, "scenes/images/textures/oolite-font.trans.png");
    this.appearance.setTexture(this.fontTexture);

    // Blue material for the checker
    this.blueMaterial = new CGFappearance(this.scene);
    this.blueMaterial.setAmbient(0, 0, 1, 1);
    this.blueMaterial.setDiffuse(0, 0, 1, 1);
    this.blueMaterial.setSpecular(0, 0, 1, 1);
    this.blueMaterial.setShininess(10.0);

    // Light blue material for the checker
    this.lightBlueMaterial = new CGFappearance(this.scene);
    this.lightBlueMaterial.setAmbient(0, 0.5, 1, 1);
    this.lightBlueMaterial.setDiffuse(0, 0.5, 1, 1);
    this.lightBlueMaterial.setSpecular(0, 0.5, 1, 1);

    // Red material for the checker
    this.redMaterial = new CGFappearance(this.scene);
    this.redMaterial.setAmbient(1, 0, 0, 1);
    this.redMaterial.setDiffuse(1, 0, 0, 1);
    this.redMaterial.setSpecular(1, 0, 0, 1);
    this.redMaterial.setShininess(10.0);

    // Light red material for the checker
    this.lightRedMaterial = new CGFappearance(this.scene);
    this.lightRedMaterial.setAmbient(1, 0.5, 0.5, 1);
    this.lightRedMaterial.setDiffuse(1, 0.5, 0.5, 1);
    this.lightRedMaterial.setSpecular(1, 0.5, 0.5, 1);

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
    this.scene.scale(0.1, 1.5, 4);
    this.scene.pink.apply();
    this.miniTimerBox.display();
    this.scene.popMatrix();

    this.displayLetter(Math.floor(this.min/10),3,this.min1_square,this.x + 8.5, this.y+0.8, this.z+3,1, 2, 1 );
    this.displayLetter(this.min%10,3,this.min2_square,this.x + 8.5, this.y+0.8, this.z+3.4,1, 2, 1 );
    this.displayLetter(10,3,this.point_square,this.x + 8.5, this.y+0.8, this.z+3.8,1, 2, 1 );
    this.displayLetter(Math.floor(this.sec/10),3,this.sec1_square,this.x + 8.5, this.y+0.8, this.z+4.2,1, 2, 1 );
    this.displayLetter(this.sec%10,3,this.sec2_square,this.x + 8.5, this.y+0.8, this.z+4.6,1, 2, 1 );

    this.displayPlayerTimers();

    this.displayCrowns();


  }

  displayPlayerTimers() {
    this.displayLetter(Math.floor(this.player1Min/10),3,this.minp1_square,this.x + 8.9, this.y+1, this.z+0.5, 0.5, 1, 0.5 );
    this.displayLetter(this.player1Min%10,3,this.minp12_square,this.x + 8.9, this.y+1, this.z+0.7, 0.5, 1, 0.5 );
    this.displayLetter(10,3,this.point1_square,this.x + 8.9, this.y+1, this.z+0.9, 0.5, 1, 0.5 );
    this.displayLetter(Math.floor(this.player1Sec/10),3,this.secp1_square,this.x + 8.9, this.y+1, this.z+1.1, 0.5, 1, 0.5 );
    this.displayLetter(this.player1Sec%10,3,this.secp12_square,this.x + 8.9, this.y+1, this.z+1.3, 0.5, 1, 0.5 );

    this.displayLetter(Math.floor(this.player2Min/10),3,this.minp2_square,this.x + 8.9, this.y+1, this.z+6.5, 0.5, 1, 0.5 );
    this.displayLetter(this.player2Min%10,3,this.minp22_square,this.x + 8.9, this.y+1, this.z+6.7, 0.5, 1, 0.5 );
    this.displayLetter(10,3,this.point2_square,this.x + 8.9, this.y+1, this.z+6.9, 0.5, 1, 0.5 );
    this.displayLetter(Math.floor(this.player2Sec/10),3,this.secp2_square,this.x + 8.9, this.y+1, this.z+7.1, 0.5, 1, 0.5 );
    this.displayLetter(this.player2Sec%10,3,this.secp22_square,this.x + 8.9, this.y+1, this.z+7.3, 0.5, 1, 0.5 );
  }

  displayLetter(x,y,rect,t,u,v,scale_x,scale_y,scale_z) {
    this.scene.pushMatrix();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(t,u,v);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.scale(scale_x, scale_y, scale_z);

    this.scene.textShader.setUniformsValues({'charCoords': [x,y]});
    rect.display();
    this.scene.popMatrix();

    // reactivate default shader
    this.scene.setActiveShader(this.scene.defaultShader);
  }

  displayCrowns() {
    this.scene.pushMatrix();
    if(this.turn == 1) {
      this.lightRedMaterial.apply();
    }else {
      this.redMaterial.apply();
    }
    this.scene.translate(this.x + 10, this.y + 3.1, this.z + 6.8);
    this.scene.scale(0.01,0.01,0.01);
    this.crown1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    if(this.turn == 2) {
      this.lightBlueMaterial.apply();
    }else {
      this.blueMaterial.apply();
    }
    this.scene.translate(this.x + 10, this.y + 3.1, this.z + 0.8);
    this.scene.scale(0.01,0.01,0.01);
    this.crown2.display();
    this.scene.popMatrix();
  }

  update() {
    if(this.msec == 0) {
      if(this.sec == 0) {
        if(this.min > 0) {
          this.min = this.min - 1;
          this.sec = 59;
          this.msec = 59;
        }
      }
      else {
        this.sec = this.sec - 1;
        this.msec = 59;
      }
    }
    else {
        this.msec = this.msec - 1;
    }
    if(this.turn == 2) {
      if(this.player1MSec == 0) {
        if(this.player1Sec == 0) {
          if(this.player1Min > 0) {
            this.player1Min = this.player1Min - 1;
            this.player1Sec = 59;
            this.player1MSec = 59;
          }
        }
        else {
          this.player1Sec = this.player1Sec - 1;
          this.player1MSec = 59;
        }
      }
      else {
          this.player1MSec = this.player1MSec - 1;
      }
    } if(this.player2MSec == 0) {
      if(this.player2Sec == 0) {
        if(this.player2Min > 0) {
          this.player2Min = this.player2Min - 1;
          this.player2Sec = 59;
          this.player2MSec = 59;
        }
      }
      else {
        this.player2Sec = this.player2Sec - 1;
        this.player2MSec = 59;

      }
    }
    else {
        this.player2MSec = this.player2MSec - 1;
    }
  }

  updateTimeToMakeMove(duration) {
    this.timeToMakeMove = duration;
    if(duration < 0.6){
      this.timeToMakeMoveMin = 0;
      this.timeToMakeMoveSec = duration*100;
      console.log("ok: " + this.timeToMakeMoveSec);
    }else {
      this.timeToMakeMoveMin = 1;
      this.timeToMakeMoveSec = 0;
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
