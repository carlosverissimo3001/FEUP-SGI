import { CGFnurbsSurface, CGFobject, CGFnurbsObject } from "../lib/CGF.js";

export class MyPatch extends CGFobject {
  constructor(scene, id, degree_u, parts_u, degree_v, parts_v, vertexes) {
    super(scene);
    this.degree_u = degree_u;
    this.parts_u = parts_u;
    this.degree_v = degree_v;
    this.parts_v = parts_v;
    this.vertexes = vertexes;

    this.initBuffers();
  }

  initBuffers() {
    //console.log(this.vertexes);

    this.surface = new CGFnurbsSurface(
      this.degree_u,
      this.degree_v,
      this.vertexes
    );

    this.obj = new CGFnurbsObject(
      this.scene,
      this.parts_u,
      this.parts_v,
      this.surface
    ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
  }

  display() {
    this.obj.display();
  }

  /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(u, v) {
		//
	}
}
