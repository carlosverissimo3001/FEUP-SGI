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
            let cur_radius = this.bottomRadius;
            let cur_height = 0;
            let cos_angle = Math.cos(angle);
            let sin_angle = Math.sin(angle);
            for (let y = 0; y <= this.stacks; y++) {

                
                this.vertices.push(cur_radius*cos_angle,cur_radius*sin_angle,cur_height);
                this.normals.push(cos_angle, sin_angle,0);
                this.textCoords.push(x/this.slices, 1 - (y * 1/this.stacks));

                cur_radius += radiusStep;
                cur_height += heightStep;
            }
            angle += angleStep;
        }
        console.log(this.vertices);
        for(let i = 0; i < this.slices; i++) {
            for (let j = 0; j < this.stacks; j++){
                let next = (i+1) * (this.stacks+1) + j;
                let now =  i * (this.stacks+1) + j;
                
                this.indices.push(
					next, now+1, now,
					now+1, next, next+1,
                    now, now+1, next,
                    next+1, next, now+1
				);
            }
        }

            this.enableNormalViz();
            this.primitiveType = this.scene.gl.TRIANGLES;
		    this.initGLBuffers();
        }
}