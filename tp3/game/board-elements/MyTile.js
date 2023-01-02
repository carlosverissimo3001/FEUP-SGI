import { CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import {MyChecker} from "./MyChecker.js";
import {MyCube} from "../../primitives/MyCube.js";
import { MyRectangle } from "../../primitives/MyRectangle.js";

export class MyTile {
    constructor(scene, id, board, row, col, color, checker) {
        this.scene = scene;
        this.id = id;

        this.row = row;
        this.col = col;
        this.color = color; // Light or dark

        // Pointer to the board
        this.board = board;

        // Each tile is separated by 0.1 unit
        this.x = this.board.x + this.col;
        this.y = 0.1;
        this.z = this.board.z + this.row;

        // Tile itself
        this.tile = new MyCube(this.scene);

        // Does the tile have a checker?
        this.hasChecker = checker != null;

        // Pointer to the checker in the tile, if there is one
        this.checker = (this.hasChecker) ? checker : null;

        // Is the tile available to move to?
        this.available = false;

        // Texture
        var textureID = (color) ? "light_wood.png" : "dark_wood.png";
        var texture = new CGFtexture(scene, "scenes/images/textures/" + textureID);

        // Available material, with a white hue
        this.availableMaterial = new CGFappearance(scene);
        this.availableMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.availableMaterial.setDiffuse(1.0, 1.0, 1.0, 1);
        this.availableMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.availableMaterial.setShininess(0.0);
        this.availableMaterial.setTexture(texture);

        // Normal material, without any hue
        this.normalMaterial = new CGFappearance(scene);
        this.normalMaterial.setTexture(texture);
    }

    /**
     * Set a checker in the tile
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
     * Get the tile's x coordinate
     * @returns {number} x coordinate
    */
    getX(){
        return this.board.x + this.col;
    }

    /**
     * Get the tile's z coordinate
     * @returns {number} z coordinate
     */
    getZ(){
        return this.board.z + this.row;
    }

    /**
     * Display the tile
     */
    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.scale(1, 0.1, 1);

        // If the tile is available, change the material to the available material
        (this.available) ? this.availableMaterial.apply() : this.normalMaterial.apply();

        this.tile.display();
        if (this.hasChecker) {
            // ! Pick ID start with 1, ex: tile at 0,0 has pick ID 1
            // ! So the pick ID is the row * board size + col + 1
            var checkerId = this.row * this.board.size + this.col + 1;
            this.scene.registerForPick(checkerId, this.checker);
            this.checker.display();
        }
        this.scene.popMatrix();
    }

    // Set the tile as avaliable to move to
    setAvailable() {
        this.available = true;
    }

    // Set the tile as not avaliable to move to
    unsetAvailable() {
        this.available = false;
    }
}