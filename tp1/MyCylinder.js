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
	constructor(scene, height, topRadius, bottomRadius, stacks, slices) { 
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

        for (let x = 0; x <= this.slices; i++){
            for (let y = 0; y <= this.stacks; j++) {

                        let cur_height = y*heightStep;
                        let cur_radius = x*radiusStep + this.bottomRadius;
                        cos_angle = Math.cos(angle);
                        sin_angle = Math.sin(angle);

                        this.vertices.push(cur_radius*cos_angle,cur_radius*sin_angle,cur_height);
                        this.normals.push(cos_angle, sin_angle);
                        this.textCoords.push(x/this.slices,j/this.stacks);

                        if (x < this.slices && y < this.stacks) {
                            
                            let now = i*(this.stacks+1)*j;
                            let next = now+(this.stacks+1);

                            this.indices.push(current + 1, current, next);
                            this.indices.push(current + 1, next, next+1);
                        }

                }
            angle += angleStep;
            }

            this.primitiveType = this.scene.gl.TRIANGLES;
		    this.initGLBuffers();
        }
}