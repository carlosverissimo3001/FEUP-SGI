import { CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import {MyChecker} from "./MyChecker.js";
import {MyCube} from "../../primitives/MyCube.js";

export class MyTile {
    constructor(scene, id, board, row, column, color, checker) {
        this.scene = scene;
        this.id = id;

        this.row = row;
        this.column = column;

        this.board = board;
        this.color = color;

        // Each tile is separated by 0.1 unit
        this.x = this.board.x + this.column;
        this.y = 0.1;
        this.z = this.board.z + this.row;

        this.tile = new MyCube(this.scene);

        this.hasChecker = checker != null;

        this.checker = (this.hasChecker) ? checker : null;

        this.material = new CGFappearance(scene);

        var textureID = (color) ? "light_wood.png" : "dark_wood.png";
        var texture = new CGFtexture(scene, "scenes/images/textures/" + textureID);

        this.material.setTexture(texture);
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
        this.scene.scale(1, 0.1, 1);
        this.material.apply();
        this.tile.display();
        if (this.hasChecker) {
            this.checker.display();
        }
        this.scene.popMatrix();
    }
}