import { CGFobject } from "../lib/CGF.js";

/**
 * MyNode
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

export class MyComponent extends CGFobject{
    constructor(scene, componentID, transf, materials, textureID, children, primtives, lenght_t, lenght_s) {
        super(scene);
        this.componentID = componentID;
        this.transf = transf;
        this.materials= materials;
        this.textureID = textureID;
        this.children = children;
        this.primitives = primtives;
        this.lenght_t = lenght_t;
        this.lenght_s = lenght_s;

        this.materialID = this.materials[0];
        this.matIndex = 0;
    }

    change_material(){
        if (this.matIndex++ == this.materials.length)
            this.matIndex = 0

        this.materialID = this.materials[++matIndex];
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