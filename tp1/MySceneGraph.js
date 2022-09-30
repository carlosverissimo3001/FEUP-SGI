import { CGFXMLreader, CGFcamera, CGFappearance, CGFtexture, CGFcameraOrtho } from '../lib/CGF.js';

import { MyRectangle } from './MyRectangle.js';
import { MyCylinder } from './MyCylinder.js';
import { MyTriangle } from './MyTriangle.js';
import { MySphere } from './MySphere.js'
import { MyTorus } from './MyTorus.js';
import { MyComponent} from './MyComponent.js';

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        // Create views array
        this.views = [];

        var children = viewsNode.children;

        // this.defaultCamera = this.reader.getString(viewsNode, 'default');

        if (children.length == 0)
            this.onXMLError("No views defined");

        // For any number of cameras
        for (var i = 0; i < children.length; i++) {
            var curr_view = children[i];
            var curr_view_type = children[i].nodeName;

            // Check if view type is valid
            if (curr_view_type != "perspective" && curr_view_type != "ortho") {
                this.onXMLMinorError("unknown tag <" + curr_view_type + ">");
                continue;
            }

            // Get id of the current view
            var curr_view_ID = this.reader.getString(curr_view, 'id');


            // ! I feel like this could be done in a more effective way
            // ? Check this later

            // handle perspective view
            if(curr_view_type == "perspective"){
                var near = this.reader.getString(curr_view, "near");
                if (near == null || isNaN(near)){
                    return "unable to parse near component of the view for ID = " + curr_view_ID;
                }

                var far = this.reader.getString(curr_view, "far");
                if (far == null || isNaN(near)){
                    return "unable to parse far component of the view for ID = " + curr_view_ID;
                }

                var angle = this.reader.getString(curr_view, "angle");
                if (angle == null || isNaN(angle)){
                    return "unable to parse angle component of the view for ID = " + curr_view_ID;
                }

                // Read child nodes
                var curr_view_children = curr_view.children;

                var from = this.parseCoordinates3D(curr_view_children[0], "from field of view for ID" + curr_view_ID);
                var to = this.parseCoordinates3D(curr_view_children[1], "to field of view for ID" + curr_view_ID);

                // Create new perspective view
                // ? Don't know if the fov is correctly calculated
                var view = new CGFcamera(angle*DEGREE_TO_RAD, near, far, from, to);

                this.views[curr_view_ID] = view
            }

            // handle ortho view
            else if(curr_view_type == "ortho"){
                var near = this.reader.getString(curr_view, "near");
                if (near == null || isNaN(near))
                    return "unable to parse near component of the view for ID = " + curr_view_ID;

                var far = this.reader.getString(curr_view, "far");
                if (far == null || isNaN(far))
                    return "unable to parse far component of the view for ID = " + curr_view_ID;

                var left = this.reader.getString(curr_view, "left");
                if (left == null || isNaN(left))
                    return "unable to parse left component of the view for ID = " + curr_view_ID;

                var right = this.reader.getString(curr_view, "right");
                if (right == null || isNaN(right))
                    return "unable to parse right component of the view for ID = " + curr_view_ID;

                var top = this.reader.getString(curr_view, "top");
                if (top == null || isNaN(top))
                    return "unable to parse top component of the view for ID = " + curr_view_ID;

                var bottom = this.reader.getString(curr_view, "bottom");
                if (bottom == null || isNaN(bottom))
                    return "unable to parse bottom component of the view for ID = " + curr_view_ID;

                // Read child nodes
                var curr_view_children = curr_view.children;

                var from = this.parseCoordinates3D(curr_view_children[0], "from field of view for ID" + curr_view_ID);
                var to = this.parseCoordinates3D(curr_view_children[1], "to field of view for ID" + curr_view_ID);

                // Read up values if lenght is 3
                var up;

                if (curr_view_children.length == 3)
                    up = this.parseCoordinates3D(curr_view_children[2], "up field of view for ID" + curr_view_ID);

                // default is [0, 1, 0]
                else
                    up = [0, 1, 0]


                // Create new orthogonal camera
                var view = new CGFcameraOrtho(left, right, bottom, top, naer, far, from, to, up);
                this.views[curr_view_ID] = view
            }
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];

        // For any number of textures
        for (var i = 0; i < children.length; i++){

            if (children[i].nodeName != "texture"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs
            if (this.textures[textureID] != null){
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            }

            // Texture filepath
            var textureFilepath = this.reader.getString(children[i], 'file');

            /* TODO: Check if the file exists and handle folder differences
             Example. We expect: scenes/images/texture.png(or jpg), we might get only texture.png or images/texture.png
            */

            // Create new texture
            var texture = new CGFtexture(this.scene, textureFilepath);

            // Push it to the texture list
            this.textures[textureID] = texture;
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        this.materials = [];

        var grandChildren = [];

        // For any number of materials
        for (var i = 0; i < children.length; i++) {

            // Check the <material> tag
            if (children[i].nodeName != "material"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs
            if (this.materials[materialID] != null){
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";
            }

            // Read shininess
            var shininess = this.reader.getFloat(children[i], "shininess");
			if (shininess == null || isNaN(shininess))
				return ("unable to parse shininess of material with ID = " + materialID);

            // Check children of the node
            grandChildren = children[i].children;

            // Read material properties
            var emission = this.parseColor(grandChildren[0], "emission propertie of the material with ID = " + materialID);
			var ambient = this.parseColor(grandChildren[1], "ambient propertie of the material with ID = " + materialID);
			var diffuse = this.parseColor(grandChildren[2], "diffuse propertie of the material with ID = " + materialID);
			var specular = this.parseColor(grandChildren[3], "specular propertie of the material with ID = " + materialID);

            // Create new material
            var newMat = new CGFappearance(this.scene);

            // Fill its properties
            newMat.setAmbient(...ambient);
            newMat.setDiffuse(...diffuse);
            newMat.setEmission(...emission);
            newMat.setSpecular(...specular);

            newMat.setShininess(shininess);

            // Add it to the list of materials
            this.materials[materialID] = newMat;
        }
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    // translate transformation
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;

                    // scale transformation
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if(!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;

                    // rotate transformation
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], "axis");
                        if (axis != 'x' && axis != 'y' && axis != 'z')
                            this.onXMLError("Invalid axis for transformation for ID " + transformationID);

                        var angle = this.reader.getFloat(grandChildren[j], "angle");
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotation transformation for ID = " + transformationID;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);

                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            else if (primitiveType == 'triangle'){
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;


                var trian = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3)

                this.primitives[primitiveId] = trian;
            }

            else if (primitiveType == 'cylinder'){
                // base_radius
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive attributes for ID = " + primitiveId;

                // top_radius
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive attributes for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive attributes for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive attributes for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive attributes for ID = " + primitiveId;

                var cylin = new MyCylinder(this.scene, primitiveId, height, top, base, stacks, slices);

                this.primitives[primitiveId] = cylin;
            }

            else if (primitiveType == 'sphere'){
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive attributes for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive attributes for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive attributes for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }

            else if (primitiveType == 'torus'){
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive attributes for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive attributes for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive attributes for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive attributes for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        var transf = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            var transfNode = grandChildren[transformationIndex].children;

            if(transfNode.length == 0)
                transf = mat4.create();

            // This is the case in which the transformation is being mentioned, not created
            else if (transfNode[0].nodeName == "transformationref"){
                var transnfID = this.reader.getString(transfNode[0], "id")

                if (this.transformations[transnfID] != null)
                    transf = this.transformations[transnfID];

                    else
                    this.onXMLMinorError("Undefined transformation with the id: " + transnfID);
            }

            // parse a new tranformation
            else
               transf = this.parseTransformationsHelper(transfNode);

            // Materials
            var materialID = [];

			for (var j = 0; j < grandChildren[materialsIndex].children.length; j++) {
				materialID[j] = this.reader.getString(grandChildren[materialsIndex].children[j], "id");

				if (materialID[j] != "inherit" && this.materials[materialID[j]] == null) {
					this.onXMLMinorError("No material for ID : " + materialID[j]);
				}
			}

            // TODO: Better parse the materials

            // TODO: Parse textures

            // Children
            var children_children = grandChildren[childrenIndex].children;
            var primitives = [];
            var childs = [];
            var childID;

            for (var k = 0; k < children_children.length; k++){
                childID = this.reader.getString(children_children[k], "id");

                if (children_children[k].nodeName == "componentref"){
                    if (this.components[childID] == null)
						this.onXMLMinorError("No component with the ID of : " + childID);
                    childs.push(childID);
                }
                else if (children_children[k].nodeName == "primitiveref"){
                    if (this.primitives[childID] == null)
						this.onXMLMinorError("No primitive with the ID of : " + childID);
                    primitives.push(childID);
                }
                else{
                    this.onXMLMinorError("unknown tag");
                }
            }
            var component = new MyComponent(this.scene, componentID, transf, materialID, "none", childs, primitives, 1 , 1);
            this.components[componentID] = component;
        }
        this.log("Parsed components")
    }

    parseTransformationsHelper(transfNode){
        var transf = mat4.create();

        for (var j = 0; j < transfNode.length; j++){
            switch (transfNode[j].nodeName) {
                // translate transformation
                case 'translate':
                    var coordinates = this.parseCoordinates3D(transfNode[j], "translate transformation on component node");
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transf = mat4.translate(transf, transf, coordinates);
                    break;

                // scale transformation
                case 'scale':
                    var coordinates = this.parseCoordinates3D(transfNode[j], "scale transformation on component node");
                    if(!Array.isArray(coordinates))
                        return coordinates;

                    //console.log(coordinates);
                    transf = mat4.scale(transf, transf, coordinates);
                    break;

                // rotate transformation
                case 'rotate':
                    var axis = this.reader.getString(transfNode[j], "axis");
                    if (axis != 'x' && axis != 'y' && axis != 'z')
                        this.onXMLError("Invalid axis for transformation on component node")

                    var angle = this.reader.getFloat(transfNode[j], "angle");
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse angle of the rotation transformation on component node";

                    transf = mat4.rotate(transf, transf, angle * DEGREE_TO_RAD, this.axisCoords[axis]);

                    break;
            }
        }
        return transf;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
     displayScene() {
        //this.scene.pushMatrix();
        this.displayComponent(this.idRoot, null, null, 1 , 1);
        //this.scene.popMatrix();
	}

    /**
     * Display each node, receives the root node
     */
    displayComponent(componentID, material, texture, s , t) {

        if(this.components[componentID] == null)
        this.onXMLError("Error - No component with ID " + componentID);

        let component = this.components[componentID];


        this.scene.pushMatrix();
        this.scene.multMatrix(component.transf); // como vou buscar o current transformation?

        if(component.material != "inherit")
            material = this.materials[component.material];


        material.apply();

        for (var i = 0; i < component.primitives.length; i++){
            let primitive = this.primitives[component.primitives[i]];
            primitive.display();
            //this.primitives[component.primitives[i]].display();
        }

        for (var i = 0; i < component.children.length; i++){
            //this.scene.pushMatrix()
            this.displayComponent(component.children[i], material, texture, s, t);
            //this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }


}