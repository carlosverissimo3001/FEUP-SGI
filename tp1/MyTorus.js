import { CGFobject } from '../lib/CGF.js';

/**
 * MySphere
 * @method constructor
 * @param scene - MyScene object
 * @param inner_radius
 * @param outer_radius
 * @param slices
 * @param loops
 */
export class MyTorus extends CGFobject{
  constructor(scene, id, inner_radius, outer_radius, slices, loops){
    super(scene);
    this.inner_radius = inner_radius;
    this.outer_radius = outer_radius;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the torus buffers
   * TODO: IMPLEMENT THIS
   */
  initBuffers() {
    /* this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers(); */
  }
}