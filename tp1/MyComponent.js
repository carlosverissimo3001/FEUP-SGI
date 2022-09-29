import { CGFobject } from "../lib/CGF.js";

/**
 * MyNode
 * @method constructor
 * @param scene
 * @param componentID ID of the component (unique)
 * @param transf Transformation matrix
 * @param children Component children (references to primitives or other components)
 */

export class MyComponent extends CGFobject{
    constructor(scene, componentID, transf, material, texture) {
        super(scene);

        this.componentID = componentID;
        this.transf = transf;
        this.material = material;
        this.texture = texture;
        this.children = children;
    }
}