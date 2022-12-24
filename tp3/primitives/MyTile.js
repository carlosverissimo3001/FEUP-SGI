import CGFobject from '../lib/CGF.js';
import MyCylinder from './MyCylinder.js';

export class MyTile extends CGFobject {
    constructor(scene, id){
        super(scene);
        this.id = id;

        this.cylinderArray = [];

        this.numCylinders = 3;

        this.cylinderArray.push(new MyCylinder(scene, 0.5, 0.5, 0.5, 20, 20));
        this.cylinderArray.push(new MyCylinder(scene, 0.5, 0.5, 0.5, 20, 20));
        this.cylinderArray.push(new MyCylinder(scene, 0.5, 0.5, 0.5, 20, 20));
    }

    display(){
        for (var i = 0; i < this.cylinderArray.length; i++){
            this.scene.pushMatrix();
            this.cylinderArray[i].display();
            this.scene.popMatrix();
        }
    }
}