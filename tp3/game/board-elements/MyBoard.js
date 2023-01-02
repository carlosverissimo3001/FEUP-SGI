import { MyCube } from "../../primitives/MyCube.js";
import { MyChecker } from "./MyChecker.js";
import { MyTile } from "./MyTile.js";
import { MyRectangle } from "../../primitives/MyRectangle.js";
import { CGFtexture, CGFappearance } from "../../../lib/CGF.js";

export class MyBoard {
  constructor(scene, size) {
    this.scene = scene;

    this.board = [];
    this.size = size;

    this.captureZone = new MyCube(scene);

    this.player1CaptureZone = new MyCube(scene);
    this.player2CaptureZone = new MyCube(scene);
    this.player1MarkerZone = new MyCube(scene);
    this.player2MarkerZone = new MyCube(scene);
    this.player1Marker = new MyRectangle(scene, "none", 0, 1, 0, 1);
    this.player2Marker = new MyRectangle(scene, "none", 0, 1, 0, 1);

    this.appearance = new CGFappearance(scene);

    this.fontTexture = new CGFtexture(
      scene,
      "scenes/images/textures/oolite-font.trans.png"
    );
    this.appearance.setTexture(this.fontTexture);

    this.border = [];
    this.border.push(new MyCube(scene));
    this.border.push(new MyCube(scene));
    this.border.push(new MyCube(scene));
    this.border.push(new MyCube(scene));

    this.borderMaterial = new CGFappearance(scene);
    this.borderMaterial.setAmbient(0, 0, 0, 1);
    this.borderMaterial.setDiffuse(0, 0, 0, 1);
    this.borderMaterial.setSpecular(0, 0.0, 0.0, 1);
    this.borderMaterial.setShininess(120);

    this.player1CaptureZoneMaterial = new CGFappearance(scene);

    this.player1CaptureZoneMaterial.setAmbient(1.0, 0, 0, 1);
    this.player1CaptureZoneMaterial.setDiffuse(1.0, 0, 0, 1);
    this.player1CaptureZoneMaterial.setSpecular(1.0, 0.0, 0.0, 1);
    this.player1CaptureZoneMaterial.setShininess(120);

    this.video_game_text = new CGFtexture(
      scene,
      "scenes/images/textures/retro_game.jpg"
    );

    this.player1CaptureZoneMaterial.setTexture(this.video_game_text);
    this.player1CaptureZoneMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.player2CaptureZoneMaterial = new CGFappearance(scene);

    this.player2CaptureZoneMaterial.setAmbient(0, 0, 1.0, 1);
    this.player2CaptureZoneMaterial.setDiffuse(0, 0, 1.0, 1);
    this.player2CaptureZoneMaterial.setSpecular(0, 0.0, 1.0, 1);
    this.player2CaptureZoneMaterial.setShininess(120);

    this.player2CaptureZoneMaterial.setTexture(this.video_game_text);
    this.player2CaptureZoneMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.debug = false;

    this.x = 10.75;
    this.y = 0.1;
    this.z = 42;

    this.player1MarkerNumber = 0;
    this.player2MarkerNumber = 0;

    // Initialize the board
    this.tiles = [];
    this.checkers = [];
    this.initialized = false;
    this.initBoard();
  }

  /**
   * Initializes the board
   * Alternates between light and dark tiles, starting with light
   */
  initBoard() {
    let light = true;
    let row = 0;
    let col = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        var id = i + "," + j;
        this.tiles.push(
          new MyTile(this.scene, id, this, row, col, light, null)
        );
        light = !light;
        col++;
      }
      light = !light;
      row++;
      col = 0;
    }

    this.initTiles(this.tiles);

    this.initCheckers();

    this.initialized = true;
  }
  /**
   * Given a 1D array of tiles, initializes the board with them, in the correct order
   * @param {MyTile[]} tiles 1D array of tiles
   */
  initTiles(tiles) {
    for (let i = 0; i < this.size; i++) {
      this.board.push([]);
      for (let j = 0; j < this.size; j++) {
        this.board[i].push(tiles[i * this.size + j]);
      }
    }
  }

  /**
   * Initializes the checkers
   * Rows 0, 1, 2, 5, 6, 7 have checkers, with a distance of 1 between them
   * Rows 3 and 4 are empty
   * */
  initCheckers() {
    for (var row = 0; row < this.size; row++) {
      for (var col = 0; col < this.size; col++) {
        /* Row 3 and 4 are empty */
        if (row < 3 || row > 4) {
          /* Checkers are placed with a distance of 1 between them */
          if (
            (col % 2 == 0 && row % 2 != 0) ||
            (col % 2 != 0 && row % 2 == 0)
          ) {
            var color = "blue";
            if (row >= 3) {
              var color = "red";
            }

            let checker = new MyChecker(
              this.scene,
              color,
              row,
              col,
              this,
              row + "," + col
            );
            this.addChecker(row + "," + col, checker);
          }
        }
      }
    }
  }

  /**
   * Add a tile to the board
   * @param {MyTile} tile tile to be added
   * @throws {Error} if the tile is already in the board
   */
  addTile(tile) {
    if (this.board[tile.row][tile.col] != null)
      console.error("Tile already in the board");
    this.board[tile.row][tile.col] = tile;
  }

  /**
   * Adds a checker to a given tile
   * @param {String} tile_id id of the tile
   * @param {MyChecker} checker checker to be added
   * @throws {Error} if there is already a checker in the tile
   * */

  addChecker(tile_id, checker) {
    /* Assumes id is a string with the format "row,col" */

    let row = parseInt(tile_id[0]);
    let col = parseInt(tile_id[2]);

    if (this.board[row][col].checker != null)
      console.error("There is already a checker in this tile");

    this.board[row][col].set(checker);

    this.checkers.push(checker);
  }

  /**
   * Removes a checker from a given tile
   * @param {String} tile_id id of the tile
   * @throws {Error} if there is no checker in the tile
   */
  removeChecker(tile_id) {
    /* Assumes id is a string with the format "row,col" */

    let row = parseInt(tile_id[0]);
    let col = parseInt(tile_id[2]);

    if (this.board[row][col].checker == null)
      console.error("No checker in this tile");

    this.board[row][col].remove();
  }

  /**
   * Gets a checker from a given tile
   * @param {String} tile_id id of the tile
   * @returns {MyChecker} checker in the tile
   * @throws {Error} if there is no checker in the tile
   */

  getChecker(tile_id) {
    /* Assumes id is a string with the format "row,col" */

    let row = parseInt(tile_id[0]);
    let col = parseInt(tile_id[2]);

    if (this.board[row][col].checker == null)
      console.error("No checker in this tile");

    return this.board[row][col].get();
  }

  /**
   * Gets a tile from a given checker
   * @param {String} checker_id id of the checker
   * @returns {MyTile} tile with the checker
   */
  getTile(checker_id) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          this.board[i][j].checker != null &&
          this.board[i][j].checker.id == checker_id
        )
          return this.board[i][j];
      }
    }
  }

  /**
   * Gets a tile from a given position
   * @param {Integer} x row of the tile
   * @param {Char} y column of the tile
   * @returns {MyTile} tile in the given position
   * */
  getTileByCoords(x, y) {
    // Assumes a coordinate system A-H and 0-7
    let row = x;
    let col = y.charCodeAt(0) - 65;

    return this.board[row][col];
  }

  /**
   * Gets a tile from a given position
   * @param {Integer} row row of the tile
   * @param {Integer} col column of the tile
   * @returns {MyTile} tile in the given position
   * */
  getTile(row, col) {
    return this.board[row][col];
  }

  /**
   * Moves a checker from a tile to another
   * @param {MyChecker} checker checker to be moved
   * @param {MyTile} oldTile tile where the checker is
   * @param {MyTile} newTile tile where the checker will be
   * */
  moveChecker(checker, oldTile, newTile) {
    this.removeChecker(oldTile.id);
    this.addChecker(newTile.id, checker);
  }

  displayCaptureZone() {
    this.scene.pushMatrix();
    this.scene.translate(this.x + 9, this.y, this.z + 7);
    this.scene.scale(1, 0.15, 1);
    this.player1CaptureZoneMaterial.apply();
    this.player1CaptureZone.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x - 2, this.y, this.z);
    this.scene.scale(1, 0.15, 1);
    this.player2CaptureZoneMaterial.apply();
    this.player2CaptureZone.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x + 9, this.y, this.z + 5);
    this.scene.scale(1, 0.15, 1);
    this.player1CaptureZoneMaterial.apply();
    this.player1MarkerZone.display();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(0.4, 0, 1.5);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(3, 8, 3);

    this.scene.textShader.setUniformsValues({
      charCoords: [this.player1MarkerNumber, 3],
    });
    this.player1Marker.display();
    this.scene.popMatrix();

    // reactivate default shader
    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x - 2, this.y, this.z + 2);
    this.scene.scale(1, 0.15, 1);
    this.player2CaptureZoneMaterial.apply();
    this.player2MarkerZone.display();
    this.scene.setActiveShader(this.scene.textShader);

    this.scene.pushMatrix();

    this.appearance.apply();

    this.scene.translate(1, 0, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.scale(3, 8, 3);

    this.scene.textShader.setUniformsValues({
      charCoords: [this.player2MarkerNumber, 3],
    });
    this.player2Marker.display();
    this.scene.popMatrix();

    // reactivate default shader
    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
  }

  displayBorder() {
    this.scene.pushMatrix();
    this.scene.translate(this.x - 0.3, this.y, this.z);
    this.scene.scale(0.3, 0.25, 8);
    this.borderMaterial.apply();
    this.border[0].display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x + 8, this.y, this.z);
    this.scene.scale(0.3, 0.25, 8);
    this.borderMaterial.apply();
    this.border[0].display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x - 0.3, this.y, this.z - 0.3);
    this.scene.scale(8.6, 0.25, 0.3);
    this.borderMaterial.apply();
    this.border[0].display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(this.x - 0.3, this.y, this.z + 8);
    this.scene.scale(8.6, 0.25, 0.3);
    this.borderMaterial.apply();
    this.border[0].display();
    this.scene.popMatrix();
  }

  /**
   * Displays the board
   * */
  display() {
    this.displayBorder();

    var id = 1;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.scene.registerForPick(id, this.board[i][j]);
        this.board[i][j].display();
        id++;
      }
    }

    // disable picking
    this.scene.clearPickRegistration();

    this.displayCaptureZone();
  }

  /**
   * Gets the tiles that are, diagnonally, 1 jump away from a given tile, ahead of the checker
   * @param {Integer} row row of the tile
   * @param {Integer} column column of the tile
   * @param {String} color color of the checker
   * */
  getDiagonalTiles(row, col, color) {
    let tiles = [];

    // Is the checker a king?
    if (!this.board[row][col].checker.isKing) {
      // If the checker not a king and is red, it can only move up, that is
      if (color == "red") {
        // Diagonal up left
        if (row >= 0 && col >= 0) {
          tiles["left"] = this.board[row - 1][col - 1];
        } else tiles["left"] = null;
        // Diagonal up right
        if (row >= 0 && col <= 7) {
          tiles["right"] = this.board[row - 1][col + 1];
        } else tiles["right"] = null;
      }

      // If the checker is not a king and is blue, it can only move down, that is
      else {
        // Diagonal down left
        if (row <= 7 && col >= 0) {
          tiles["left"] = this.board[row + 1][col - 1];
        } else tiles["left"] = null;
        // Diagonal down right
        if (row <= 7 && col <= 7) {
          tiles["right"] = this.board[row + 1][col + 1];
        } else tiles["right"] = null;
      }
    }

    // However, if the checker is a king, it can move in both directions
    else {
      // Diagonal up left
      if (row >= 0 && col >= 0) {
        tiles["up left"] = this.board[row - 1][col - 1];
      } else tiles["up left"] = null;

      // Diagonal up right
      if (row >= 0 && col <= 7) {
        tiles["up right"] = this.board[row - 1][col + 1];
      } else tiles["up right"] = null;

      // Diagonal down left
      if (row <= 7 && col >= 0) {
        tiles["down left"] = this.board[row + 1][col - 1];
      } else tiles["down left"] = null;

      // Diagonal down right
      if (row <= 7 && col <= 7) {
        tiles["down right"] = this.board[row + 1][col + 1];
      } else tiles["down right"] = null;
    }

    return tiles;
  }

  /**
   * Gets the checerks that have more than 1 available jump
   */
  getCheckers(color) {
    let checkers = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j].checker != null && this.board[i][j].checker.color == color) {
          if (this.validCheckerPosition(this.board[i][j].checker, color).length > 0) {
            checkers.push(this.board[i][j].checker);
          }
        }
      }
    }
    return checkers;
  }

  validCheckerPosition(checker, color) {
    // get diagonal tiles
    var diagonalTiles = this.getDiagonalTiles(checker.row, checker.col, color);

    // A tile is deemed avaliable if it is empty, or if a move to it, involves eating a checker
    var availableTiles = [];



    // If the checker is not a king, it can only move forward or backwards, not both
    if (!checker.isKing) {
      if (checker.selected) {
        console.log(availableTiles);
      }

      var tile = diagonalTiles["left"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (checker.color == "blue") {
                if (nextTile["down left"] != null && nextTile["down left"].checker == null && tile == diagonalTiles["left"]) {
                  availableTiles.push(nextTile["down left"]);
                }
              }
              else if (checker.color == "red") {
                if (nextTile["up left"] != null && nextTile["up left"].checker == null && tile == diagonalTiles["left"]) {
                  availableTiles.push(nextTile["up left"]);
                }
              }
            }

            else {
              if (nextTile["left"] != null && nextTile["left"].checker == null && tile == diagonalTiles["left"]) {
                availableTiles.push(nextTile["left"]);
              }
            }
          }
        }
      }
      var tile = diagonalTiles["right"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (checker.color == "blue") {
                if (nextTile["down right"] != null && nextTile["down right"].checker == null && tile == diagonalTiles["right"]) {
                  availableTiles.push(nextTile["down right"]);
                }
              }
              else if (checker.color == "red") {
                if (nextTile["up right"] != null && nextTile["up right"].checker == null && tile == diagonalTiles["right"]) {
                  availableTiles.push(nextTile["up right"]);
                }
              }
            }

            else {
              if (nextTile["right"] != null && nextTile["right"].checker == null && tile == diagonalTiles["right"]) {
                availableTiles.push(nextTile["right"]);
              }
            }
          }
        }
      }
    }

    // If the checker is a king, it can move in both directions
    else {
      if (checker.selected) {
        console.log(availableTiles);
      }

      var tile = diagonalTiles["up left"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker from the other player in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            // Get the diagnoal tiles of the tile with the checker
            // Which color to send? If the movement of the king is up, we send red
            // If the movement of the king is down, we send blue
            var deltaZ = tile.row - checker.row;
            var color = deltaZ < 0 ? "red" : "blue";
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (nextTile["up left"] != null && nextTile["up left"].checker == null && tile == diagonalTiles["up left"]) {
                availableTiles.push(nextTile["up left"]);
              }
            }

            else{
              // If the tile ahead is empty, add it to the available tiles
              if (nextTile["left"] != null && nextTile["left"].checker == null && tile == diagonalTiles["up left"]) {
              availableTiles.push(nextTile["left"]);
              }
            }
          }
        }
      }
      var tile = diagonalTiles["up right"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            var deltaZ = tile.row - checker.row;
            var color = deltaZ < 0 ? "red" : "blue";
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (nextTile["up right"] != null && nextTile["up right"].checker == null && tile == diagonalTiles["up right"]) {
                availableTiles.push(nextTile["up right"]);
              }
            }
            else{
              if (nextTile["right"] != null && nextTile["right"].checker == null && tile == diagonalTiles["up right"]) {
                availableTiles.push(nextTile["right"]);
              }
            }
          }
        }
      }
      var tile = diagonalTiles["down left"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            var deltaZ = tile.row - checker.row;
            var color = deltaZ < 0 ? "red" : "blue";
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (nextTile["down left"] != null && nextTile["down left"].checker == null && tile == diagonalTiles["down left"]) {
                availableTiles.push(nextTile["down left"]);
              }
            }

            else {
              if (nextTile["left"] != null && nextTile["left"].checker == null && tile == diagonalTiles["down left"]) {
                availableTiles.push(nextTile["left"]);
              }
            }
          }
        }
      }
      var tile = diagonalTiles["down right"];
      if (tile != null) {
        if (tile.checker == null) {
          availableTiles.push(tile);
        }
        // If there is a checker in the tile, check if there is an empty tile ahead
        else {
          if (tile.checker.color != color) {
            var deltaZ = tile.row - checker.row;
            var color = deltaZ < 0 ? "red" : "blue";
            var nextTile = this.getDiagonalTiles(tile.row, tile.col, color);

            if (tile.checker.isKing){
              if (nextTile["down right"] != null && nextTile["down right"].checker == null && tile == diagonalTiles["down right"]) {
                availableTiles.push(nextTile["down right"]);
              }
            }

            else {
              if (nextTile["right"] != null && nextTile["right"].checker == null && tile == diagonalTiles["down right"]) {
                availableTiles.push(nextTile["right"]);
              }
            }
          }
        }
      }
    }

    return availableTiles;
  }
}
