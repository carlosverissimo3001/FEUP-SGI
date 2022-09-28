import { CGFobject } from '../lib/CGF.js';

/**
 * MySphere
 * @method constructor
 * @param scene - MyScene object
 * @param radius - radius of the sphere
 * @param slices - "sides" around the z axis
 * @param stacks - "sides" along the z axis
 */
export class MySphere extends CGFobject{
  constructor(scene, id, radius, slices, stacks){
    super(scene);
    this.radius = radius;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;


    // create variables representing latitude and longitude and then increment variables which are dependable on the numb. of slices and stacks passed through the constructor
    var long = 0;
    var lat = 0;
    var latIncrement = 1/this.latDivs;
    var longIncrement = 1/this.longDivs;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      long = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = this.radius * Math.cos(theta) * sinPhi;
        var y = this.radius * cosPhi;
        var z = this.radius * Math.sin(-theta) * sinPhi;
        this.vertices.push(x, y, z);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)

          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
       this.texCoords.push(long, lat);
       long = long + longIncrement; // increments long value inside the correspondent for loop

      }
      phi += phiInc;
      lat = lat + latIncrement; // increments lat value inside the correspondent for loop
    }

    this.enableNormalViz();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}