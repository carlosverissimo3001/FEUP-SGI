import { CGFapplication } from '../lib/CGF.js';
import { XMLscene } from './XMLscene.js';
import { MyInterface } from './MyInterface.js';
import { MySceneGraph } from './MySceneGraph.js';
import { MyGameOrchestrator } from './game/orchestrator/MyGameOrchestrator.js';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

function main() {

	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    myScene.start();

	// start
    app.run();
}

main();
