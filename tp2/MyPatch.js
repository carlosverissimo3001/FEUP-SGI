import { CGFnurbsSurface,CGFobject } from '../lib/CGF.js';

export class MyPatch extends CGFobject {
    constructor(scene, id, degree_u, parts_u, degree_v, parts_v, vertexes){
        super(scene);
        this.degree_u = degree_u;
        this.parts_u = parts_u;
        this.degree_v = degree_v;
        this.parts_v = parts_v;
        this.vertexes = vertexes;

        this.surface = new CGFnurbsSurface(this.degree_u, this.degree_v, this.vertexes);

        this.obj = new new CGFnurbsObject(this, this.parts_u, this.parts_v, this.surface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    display(){
        this.obj.display();
    }
}