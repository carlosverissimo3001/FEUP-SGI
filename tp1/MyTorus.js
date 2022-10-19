import { CGFobject } from '../lib/CGF.js';

/**
 * MyTorus
 * @method constructor
 * @param scene - MyScene object
 * @param inner_radius
 * @param outer_radius
 * @param slices
 * @param loops
 */
export class MyTorus extends CGFobject{
  constructor(scene, id, innerRadius, outerRadius, slices, loops) {
    super(scene);
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
  }


  initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];


      for (var loop = 0; loop <= this.loops; loop++) {

          let outer_angle = loop /this.loops * 2 * Math.PI;
          let outer_x = Math.cos(outer_angle) * this.outerRadius;
          let outer_y = Math.sin(outer_angle) * this.outerRadius;

          for (var slice = 0; slice <= this.slices; slice++) {
              let inner_angle = slice / this.slices * 2 * Math.PI;

              let w = Math.sin(inner_angle) * this.innerRadius;
              let r = Math.cos(inner_angle) * this.innerRadius;

              var q = Math.cos(outer_angle) * r;
              var p = Math.sin(outer_angle) * r;

              this.vertices.push(q + outer_x, p + outer_y, w);

              this.normals.push(q, p, w);

              this.texCoords.push(slice / this.slices, loop / this.loops);
          }
      }

      for (let loop = 0; loop < this.loops; loop++) {
        for(let slice = 0; slice < this.slices; slice++) {
            const first = loop * (this.slices + 1) + slice;
            const second = (loop+1) * (this.slices + 1) + slice;

            this.indices.push(first, second, first+1);
            this.indices.push(second, second+1, first+1);

            //this.texCoords.push(slice/this.slices, 1 - (loop * 1/this.loops));
        }
      }

      /* console.log(this.vertices); */
      /* console.log(this.indices); */


      for (let loop = 0; loop < this.loops-1; loop++) {
        for(let slice = 0; slice < this.slices-1; slice++) {
          //this.texCoords.push(1 - (slice / this.slices), 1 - (loop / this.loops));
        }
      }

    //this.enableNormalViz();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the torus
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(u, v) {
		//
	}
}