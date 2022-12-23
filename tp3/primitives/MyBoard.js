import { CGFobject } from '../../lib/CGF.js';
import { MyCube } from './MyCube.js';

/**
 * MyCylinder
 * @method constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - bottom's radius
 * @param topRadius - top's radius
 * @param height - cilinder's height
 * @param stacks - number of divisions between poles
 * @param slices - number of divisions around axis
 */
export class MyBoard extends CGFobject {
	constructor(scene, width, x, y , z) {
        super(scene);
        this.width = width;
        this.x = x;
        this.y = y;
        this.z = z;
        this.cubes = [];

        this.initBuffers();
    }

    initBuffers() {
        for (let i = this.z; i < this.z + this.width; i++){
            if(i%2==0) this.color = false;
            else this.color= true;
            for (let j = this.x; j < this.x + this.width; j++) {
                console.log(i);
                if(this.color){
                    let cube = new MyCube(this.scene, 0, 0, 0, j, 0, i);
                    this.color = false;
                    this.cubes.push(cube);
                }
                else {
                    let cube = new MyCube(this.scene, 1, 1, 1, j, 0, i);
                    this.color = true;
                    this.cubes.push(cube);
                }
            }
            
        }

    }

    /**
	 * @method display
	 */
	display() {
        for (let x = 0; x < this.cubes.length; x++) {
            this.cubes[x].display();
        }
	}
}