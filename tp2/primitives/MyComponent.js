import { CGFobject } from "../../lib/CGF.js";

/**
 * MyComponenet
 * @method constructor
 * @param scene
 * @param componentID ID of the component (unique)
 * @param transf Transformation matrix
 * @param textureID Texture ID
 * @param children Component children (references to other components)
 * @param primitives references to other primitives
 * @param length_t
 * @param length_s
 */

export class MyComponent extends CGFobject {
  constructor(scene, componentID, transf, materials, textureID, children, primtives, length_s, length_t, animationId, higlighted)
  {
    super(scene);
    this.componentID = componentID;
    this.transf = transf;
    this.materials = materials;
    this.textureID = textureID;
    this.children = children;
    this.primitives = primtives;
    this.length_s = length_s;
    this.length_t = length_t;

    this.materialID = this.materials[0];
    this.matIndex = 0;

    this.animationId = animationId;
    this.higlighted = higlighted

    this.transformation = mat4.create();
    mat4.identity(this.transformation);
  }

  changeMaterial() {
    this.matIndex++;

    if (this.matIndex == this.materials.length)
      this.matIndex = 0;

    this.materialID = this.materials[this.matIndex];
  }

}
