import { MyGameSequence } from "./game-sequence/MyGameSequence.js";
import { MyAnimator } from "../MyAnimator.js";
import { MySceneGraph } from "../../MySceneGraph.js";
import { MyBoard } from "../board-elements/MyBoard.js";

export class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator();
        this.board = new MyBoard(scene, 8);

        this.theme = null;
    }

    /** Initializes the scene graph
     * @param {MySceneGraph} sceneGraph
     */
    init(sceneGraph) {
        this.theme = sceneGraph;
    }

    update(time) {
        /* this.animator.update(time); */
    }

    display() {
        // Display the scene graph
        this.displayComponent(this.theme.idRoot, null, null, 1, 1);

        this.board.display();

    }

     /**
     *
     * @param {string} currNodeID - Current component ID
     * @param {string} prevMaterialID - Parent material ID
     * @param {string} prevTextureID - Parent texture ID
     * @param {string} prev_length_s - Parent texture scale at s
     * @param {string} prev_length_t - Parent texture scale at t
     */
    displayComponent(currNodeID, prevMaterialID, prevTextureID, prev_length_s, prev_length_t) {
        // Get the node from the component tree using its ID
        var currNode = this.theme.components[currNodeID];

        if (currNode == null)
            this.onXMLError("Error - No component with ID " + currNodeID);

        // Check if the pool shader is gonna be applied
        var poolComponent;
        if (currNode.componentID == "pool" || currNode.componentID == "river") {
            poolComponent = true;
        }

        // If the material ID is "inherit" then it should not change the the current material and should pass it onto the children nodes as well
        var matID = (currNode.materialID != "inherit" ? currNode.materialID : prevMaterialID)

        var texID;

        /* Don't change the curr texture if the ID is "inherit" */
        if (currNode.textureID == "inherit"){
            texID = prevTextureID;
            currNode.length_s = prev_length_s
            currNode.length_t = prev_length_t
        }

        /* Covers the case in which the texture "none" */
        else if (currNode.textureID  == "none"){
            texID = null
        }

        /* Any other texure */
        else
            texID = currNode.textureID

        // retrieve the CGFappearence based on resolved material id
        var currAppearence = this.theme.materials[matID];

        // retrieve the CGFappearence based on resolved texture id if not "null"
        var currTexture = (texID !== null ? this.theme.textures[texID] : null)

        currAppearence.setTexture(currTexture);

        // set the active material.
        currAppearence.apply()

        this.scene.pushMatrix()
        this.scene.multMatrix(currNode.transf)

        var display;

        /* If the current component has an animation, apply it*/
        if(currNode.animationId != null){
            display = this.theme.kfAnimations[currNode.animationId].apply()
        }

        /* If the animation has not started or has no frames, it won't be dispalyed*/
        if (display != 0) {
            /* If this is a water component, then apply the pool shader */
            if (poolComponent) {
                this.scene.setActiveShader(this.scene.poolShader);
                this.scene.distortionmap.bind(1);
            }
            /* Check is this component has a shader */
            if (this.theme.shaders[currNodeID] && currNode.isHigh) {
                this.scene.pulseShader.setUniformsValues({
                    r: currNode.highlighted.r,
                    g: currNode.highlighted.g,
                    b: currNode.highlighted.b,
                    scale_h: currNode.highlighted.scale_h,
                });
                this.scene.setActiveShader(this.scene.pulseShader);
                this.textures[texID].bind();
            }
            /* Display component primitives */
            for (var i = 0; i < currNode.primitives.length; i++){
                let primitive = this.theme.primitives[currNode.primitives[i]];

                /* Update text coords */
                if (currNode.length_s == null && currNode.lenght_t == null)
                    primitive.updateTexCoords(1, 1)

                else if (currNode.length_s == null)
                    primitive.updateTexCoords(1, currNode.lenght_t)

                else if (currNode.lenght_t == null)
                    primitive.updateTexCoords(currNode.lenght_s, 1)

                else
                    primitive.updateTexCoords(currNode.lenght_s, currNode.lenght_t)

                primitive.display();
                currAppearence.apply()
            }
            if (poolComponent) this.scene.setActiveShader(this.scene.defaultShader);

            if (this.theme.shaders[currNodeID] && currNode.isHigh) {
                this.scene.setActiveShader(this.scene.defaultShader);
            }

            /* Display component children (these are references to other components) */
            for(var j = 0; j < currNode.children.length ; j++){
                // recursively visits the next child component
                this.displayComponent(currNode.children[j], matID, texID, prev_length_s, prev_length_t);
            }
        }

        this.scene.popMatrix()

    }

    orchestrate() {

    }

    managePick(){

    }
}


