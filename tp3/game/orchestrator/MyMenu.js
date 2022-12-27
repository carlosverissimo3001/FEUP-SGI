import { CGFtexture, CGFappearance, CGFshader } from "../../../lib/CGF.js";
import { MyRectangle } from "../../primitives/MyRectangle.js";

export class MyMenu {
    constructor(scene) {
        this.scene = scene;

        this.quad = new MyRectangle(scene, "none", 0, 1, 0, 1);
        this.quad_scene1 = new MyRectangle(scene, 65, 0, 1, 0, 1);
        this.quad_scene2 = new MyRectangle(scene, 66, 0, 1, 0, 1);
        this.quad_scene3 = new MyRectangle(scene, 67, 0, 1, 0, 1);
        this.quad2 = new MyRectangle(scene, "none", 0, 15, 0, 10);

        this.isDisplay = true;

        this.appearance = new CGFappearance(scene);

        this.fontTexture = new CGFtexture(scene, "scenes/images/textures/oolite-font.trans.png");
        this.appearance.setTexture(this.fontTexture);
    
        this.video_game_look = new CGFappearance(scene);
    
        this.video_game_look.setAmbient(0.0, 0.0, 0.0, 1);
        this.video_game_look.setDiffuse(0.0, 0.0, 0.0, 1);
        this.video_game_look.setSpecular(0.0, 0.0, 0.0, 1);
        this.video_game_look.setShininess(120);
    
        this.video_game_text = new CGFtexture(scene, "scenes/images/textures/retro_game.jpg");
        
        this.video_game_look.setTexture(this.video_game_text);
        this.video_game_look.setTextureWrap('REPEAT', 'REPEAT');

    }

    displayBG() {
        this.scene.pushMatrix();

        this.scene.translate(0,-30,-5);
        this.scene.rotate(Math.PI/2,0,1,0);

        this.video_game_look.apply();

        this.quad2.display();
        
        this.scene.popMatrix();

    }


    display() {

        this.scene.setActiveShader(this.scene.textShader);

        this.scene.pushMatrix();

        this.appearance.apply();

        this.scene.translate(3,-25,-11.5);
        this.scene.rotate(Math.PI/2,0,1,0);

        this.scene.textShader.setUniformsValues({'charCoords': [3,5]});	// S
        this.quad.display();

        this.scene.translate(0.5,0,0);
        this.scene.textShader.setUniformsValues({'charCoords': [7,4]});	// G
        this.quad.display();

        this.scene.translate(0.7,0,0);
        this.scene.textShader.setUniformsValues({'charCoords': [9,4]}); // I
        this.quad.display();


        this.scene.translate(-2.8,-2,0);
        this.scene.textShader.setUniformsValues({'charCoords': [1,3]}); // 1
        this.scene.registerForPick(this.quad_scene1.id, this.quad_scene1);
        this.quad_scene1.display();

        this.scene.translate(2,0,0);
        this.scene.textShader.setUniformsValues({'charCoords': [2,3]}); // 2
        this.scene.registerForPick(this.quad_scene2.id, this.quad_scene2);
        this.quad_scene2.display();

        this.scene.translate(2,0,0);
        this.scene.textShader.setUniformsValues({'charCoords': [3,3]}); // 3
        this.scene.registerForPick(this.quad_scene3.id, this.quad_scene3);
        this.quad_scene3.display();

        this.scene.popMatrix();

        // reactivate default shader
        this.scene.setActiveShader(this.scene.defaultShader);

        this.displayBG();

    }

    checkScene() {
    }


    setSelected() {
        this.video_game_look.setAmbient(0, 1, 0, 1);
        this.video_game_look.setDiffuse(0, 1, 0, 1);
        this.video_game_look.setSpecular(0, 1, 0, 1);
    }
}
