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

      var angle = 0;
      var angleStep = Math.PI * 2 / this.loops;
      var phi = 0;
      var phiStep = Math.PI * 2 / this.slices;

      for (var loop = 0; loop <= this.loops; loop++) {
          var cosAngle = Math.cos(angle);
          var sinAngle = Math.sin(angle);

          for (var slice = 0; slice <= this.slices; slice++) {
              var cosPhi = Math.cos(phi);
              var sinPhi = Math.sin(phi);

              this.vertices.push((this.outerRadius + this.innerRadius * cosAngle) * cosPhi, (this.outerRadius + this.innerRadius * cosAngle) * sinPhi, this.innerRadius * sinAngle);


              var n_x = (this.outerRadius + this.innerRadius * cosPhi) * cosAngle - cosAngle*this.outerRadius;
              var n_y = (this.outerRadius + this.innerRadius * cosPhi) * sinAngle - sinAngle*this.outerRadius;
              var n_z = this.innerRadius * sinPhi;
              var magn = Math.sqrt(Math.pow(n_x, 2) + Math.pow(n_y,2) + Math.pow(n_z,2));
              this.normals.push(n_x/magn, n_y/magn, n_z/magn);

              phi += phiStep;
          }
          angle += angleStep;
      }

      for (let loop = 0; loop < this.loops; loop++) {
        for(let slice = 0; slice < this.slices; slice++) {
            const first = (loop * (this.slices + 1)) + slice;
            const second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first+1, second+1);

            this.texCoords.push(1 - (slice / this.slices), 1 - (loop / this.loops));
            this.texCoords.push(slice/this.slices, 1 - (loop * 1/this.loops));
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