import { CGFobject } from "../lib/CGF.js";

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
  constructor(scene, componentID, transf, materials, textureID, children, primtives, length_s, length_t, animation, higlighted)
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

    this.higlighted = higlighted
    this.animationMatrix = null; // no animation matrix
  }

  changeMaterial() {
    this.matIndex++;

    if (this.matIndex == this.materials.length) this.matIndex = 0;

    this.materialID = this.materials[this.matIndex];
  }

  /* display(){
    if (this.animationMatrix !== null)
      this.scene.multMatrix(this.animationMatrix);
  } */

  computeAnimation(ellapsedTime) {
    // if node does not have animation return
    // if beyond animation range, animationMatrix is the last animation state and return
    // know the active animation segment based on ellapsed time
    // calculate execution ratio [0..1] within the active segment
    // calculate TRS properties based on execution ratio
    // compute animationMatrix mat4 based on active segment start state and TRS properties
    // animationMatrix mat4 is used in the display method
    }
}
