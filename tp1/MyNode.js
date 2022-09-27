/**
 * MyNode
 * @method constructor
 */

export class MyNode {
    constructor() {
        this.transformation = mat4.create();
        this.material = "";
        this.texture = {};
        this.descendants = [];
    }

    setTransformation(transformation) {
        this.transformation = transformation;
    }
    
    setMaterial(material) {
        this.material = material;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setDescendants(descendants) {
        this.descendants = descendants;
    }

    getTransformation() {
        return this.transformation;
    }
    
    getMaterial() {
        return this.material;
    }

    getTexture() {
        return this.texture;
    }

    getDescendants() {
        return this.descendants;
    }
}