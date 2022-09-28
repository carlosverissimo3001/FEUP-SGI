import { CGFobject } from '../lib/CGF.js';

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
export class MyCylinder extends CGFobject {
	constructor(scene, id, height, topRadius, bottomRadius, stacks, slices) { 
        super(scene);	
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.textCoords = [];

        let angle = 0;
        let angleStep = 2*Math.PI/this.slices;
        let heightStep = this.height/this.stacks;
        let radiusStep = (this.topRadius - this.bottomRadius) / this.stacks;

        for (let x = 0; x <= this.slices; x++){
            for (let y = 0; y <= this.stacks; y++) {
                let cur_height = y*heightStep;
                console.log(cur_height);
                let cur_radius = y*radiusStep + this.bottomRadius;
                let cos_angle = Math.cos(angle);
                let sin_angle = Math.sin(angle);

                this.vertices.push(cur_radius*cos_angle,cur_radius*sin_angle,cur_height);
                this.normals.push(cos_angle, sin_angle);
                this.textCoords.push(x/this.slices,y/this.stacks);

                /* if (x < this.slices && y < this.stacks) {
                    let now = x + (this.stacks+1) + y;
                    let next = now+(this.stacks+1);

                    this.indices.push(now + 1, now, next);
                    this.indices.push(now + 1, next, next+1);
                } */
            }
            angle += angleStep;
        }
        console.log(this.vertices);
        for(let x = 0; x < this.slices - 2; x++) {
            for (let y = 0; y < this.stacks - 1; y++){
                let next = (x+1) * this.stacks + y;
                let now =  x * this.stacks + y;
                
                this.indices.push(now, next, now+1);  
                //this.indices.push(next, now + 1, next + 1);
            }
        }

            
            this.enableNormalViz();
            this.primitiveType = this.scene.gl.TRIANGLES;
		    this.initGLBuffers();
        }
}