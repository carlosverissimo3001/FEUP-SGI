import { CGFobject } from "../lib/CGF.js";

/**
 * MyNode
 * @method constructor
 * @param scene
 * @param componentID ID of the component (unique)
 * @param transf Transformation matrix
 * @param children Component children (references to other components)
 * @param primitives references to other primitives
 */

export class MyComponent extends CGFobject{
    constructor(scene, componentID, transf, material, texture, children, primtives) {
        super(scene);

        this.componentID = componentID;
        this.transf = transf;
        this.material = material;
        this.texture = texture;
        this.children = children;
        this.primitives = primtives;
    }

    setTransformation(transf) {
        this.transf = transf;
    }

    setMaterial(material) {
        this.material = material;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setChildren(children) {
        this.children = children;
    }

    setPrimitives(primitives) {
        this.primitives = primitives;
    }

    getTransformation() {
        return this.transf;
    }

    getMaterial() {
        return this.material;
    }

    getTexture() {
        return this.texture;
    }

    getChildren() {
        return this.children;
    }

    getPrimitives() {
        return this.primitives;
    }
}