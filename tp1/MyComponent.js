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
    constructor(scene, componentID, transf, material, texture, children, primtives, lenght_s, length_t) {
        super(scene);

        this.componentID = componentID;
        this.transf = transf;
        this.material = material;
        this.texture = texture;
        this.children = children;
        this.primitives = primtives;
        this.lenght_s = lenght_s;
        this.lenght_t = length_t;
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