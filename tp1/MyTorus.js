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
  constructor(scene, innerRadius, outerRadius, slices, loops) {
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

              this.vertices.push((this.outerRadius + this.innerRadius * cosPhi) * cosAngle, (this.outerRadius + this.innerRadius * cosPhi) * sinAngle, this.innerRadius * Math.sin(phi));

              this.texCoords.push(1 - (slice / this.slices), 1 - (loop / this.loops));

              var n_x = (this.outerRadius + this.innerRadius * cosPhi) * cosAngle - cosAngle*this.outerRadius;
              var n_y = (this.outerRadius + this.innerRadius * cosPhi) * sinAngle - sinAngle*this.outerRadius;
              var n_z = this.innerRadius * Math.sin(phi);
              var magn = Math.sqrt(Math.pow(n_x, 2) + Math.pow(n_y,2) + Math.pow(n_z,2));
              this.normals.push(n_x/magn, n_y/magn, n_z/magn);

              phi += phiStep;
          }
          angle += angleStep;
      }

      var loopVerts = this.slices + 1;        
      for (let loop = 0; loop < this.loops; loop++) {
        for(let slice = 0; slice < this.slices; slice++) {
                  const first = loop * loopVerts + slice;
                  const second = first + loopVerts;

                  this.indices.push(first, second, first+1);
                  this.indices.push(second, second+1, first+1);    
        }
      }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
}