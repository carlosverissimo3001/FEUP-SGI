import { CGFappearance } from "../../../lib/CGF.js";
import {MyChecker} from "./MyChecker.js";
/* import {MyCube} from ".." */

export class MyTile {
    constructor(scene, id, board, row, column, color, checker) {
        this.scene = scene;
        this.id = id;

        this.row = row;
        this.column = column;

        this.board = board;
        this.color = color;

        /* this.tile = new MyCube(scene, 1, 0.1, 1); */

        this.hasChecker = checker != null;

        this.checker = (this.hasChecker) ? checker : null;

        this.material = new CGFappearance(scene);

        this.texture = (color == "light") ? "light_wood.png" : "dark_wood.png";

        this.material.setTexture("scenes/images/textures/" + this.texture);
    }

    /**
     * Set the checker of the tile
     * @param {MyChecker} cheker
     */
    set(checker){
        this.checker = checker;
        this.hasChecker = true;
    }

    /**
     * Get the checker of the tile
     * @returns {MyChecker}
     */
    get(){
        if (this.checker == null) {
            console.error("No checker in this tile");
        }

        return this.checker;
    }

    /**
     * Remove the checker from the tile
     * @returns
     * @throws {Error} if there is no checker in the tile
     */
    remove(){
        if (this.checker == null) {
            console.error("No checker in this tile");
        }
        this.checker = null;
        this.hasChecker = false;
    }

    /**
     * Display the tile
     */
    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        /* this.scene.scale(1, 0.1, 1); */
        this.material.apply();
        this.tile.display();
        this.scene.popMatrix();
    }
}