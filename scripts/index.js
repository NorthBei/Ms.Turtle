///<reference path="scripts/babylon.max.js" />

/*
 * This is the code for "Babylon.js: Building a Basic Game for the Web”, written for MSDN Magazine.  
 * 
 * Program was written on September 2015 by Raanan Weber, https://blog.raananweber.com
 * 
 * The code is for learning purpose only. 
 * There are much better ways to orginize your code! Try TypeScript, you won't regret it.
 * If you have any questions, please ask me directly or any other person at the Babylon.js forum:
 * http://www.html5gamedevs.com/forum/16-babylonjs/
 * 
 */
//player
var height = 7;

//Constants for the lane in meters
var laneWidth = 1.07;
var foulLineToHeadPin = 18.28;
var foulLineToArrows = 4.57;
var foulLineToInnerDots = 1.83;
var firstApproachDotsToFoulLine = 3.66;
var secondApproachtoFirstApprocah = 0.91;
var approachBoardToSecondApproachDots = 4;
var pinAreaLength = 1.02 + 0.5; //including a buffer
var totalLaneLength = approachBoardToSecondApproachDots + firstApproachDotsToFoulLine + secondApproachtoFirstApprocah + foulLineToHeadPin + pinAreaLength;
var laneHeight = 0.2;

//Pins constants
var pinHeight = 0.48;
var pinDiameter = 0.18;
var distanceBetweenRows = 0.26;
var distanceBetweenPins = 0.3;
var firstPinPosition = firstApproachDotsToFoulLine + secondApproachtoFirstApprocah + foulLineToHeadPin;
var pinYPosition = pinHeight / 2 + laneHeight;
//Array of pin positions, redundant calculation for readability.
var pinPositions = [
    //Row 1
    new BABYLON.Vector3(0, pinYPosition, firstPinPosition),
    //Row 2
    new BABYLON.Vector3(-(distanceBetweenPins / 2), pinYPosition, firstPinPosition + distanceBetweenRows),
    new BABYLON.Vector3(distanceBetweenPins / 2, pinYPosition, firstPinPosition + distanceBetweenRows),
    //Row 3
    new BABYLON.Vector3(-distanceBetweenPins, pinYPosition, firstPinPosition + 2 * distanceBetweenRows),
    new BABYLON.Vector3(0, pinYPosition, firstPinPosition + 2 * distanceBetweenRows),
    new BABYLON.Vector3(distanceBetweenPins, pinYPosition, firstPinPosition + 2 * distanceBetweenRows),
    //Row 4
    new BABYLON.Vector3(-((distanceBetweenPins / 2) + distanceBetweenPins), pinYPosition, firstPinPosition + 3 * distanceBetweenRows),
    new BABYLON.Vector3(-(distanceBetweenPins / 2), pinYPosition, firstPinPosition + 3 * distanceBetweenRows),
    new BABYLON.Vector3((distanceBetweenPins / 2), pinYPosition, firstPinPosition + 3 * distanceBetweenRows),
    new BABYLON.Vector3(((distanceBetweenPins / 2) + distanceBetweenPins), pinYPosition, firstPinPosition + 3 * distanceBetweenRows)
];

function init() {
    //Init the engine
    var engine = initEngine();
    //Create a new scene
    var scene = createScene(engine);
    //Create the main player camera
    var camera = createFreeCamera(scene);
    //Attach the control from the canvas' user input
    camera.attachControl(engine.getRenderingCanvas());
    //set the camera to be the main active camera;
    scene.activeCamera = camera;
    //Create the floor
    var floor = createFloor(scene);
    //Add a light.
    var light = createLight(scene);
    //Create the skybox
    createSkyBox(scene);
    
    //Add an action manager to change the ball's color.
    generateActionManager(scene);
	
	
	/*camera.onCollide = function (colMesh) {
		if (colMesh.uniqueId === floor.uniqueId) {
			cameraJump(scene);
		}
	}*/
	
	window.addEventListener("keyup", function(e){
		switch (event.keyCode) {
			case 32:
				cameraJump(scene);
			break;
		}	
	}, false);
}

function initEngine() {
    // Get the canvas element from index.html
    var canvas = document.getElementById("renderCanvas");
    // Initialize the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return engine;
}

function createScene(engine) {
    var scene = new BABYLON.Scene(engine);
    // Register a render loop to repeatedly render the scene
   /* engine.runRenderLoop(function () {
        scene.render();
    });*/
    var loader = new BABYLON.AssetsManager(scene);
	
	//Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;
	
    createLocker(loader);
	createTable(loader);
	
    loader.onFinish = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };

    loader.load();
    scene.debugLayer.show();
    engine.runRenderLoop(function () {
        scene.render();
    });
    return scene;
}

function createFreeCamera(scene) {
    var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 7, 0), scene);

    camera.speed = 0.8;
    camera.inertia = 0.4;
	//Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(3, 3.5, 3);
	
	camera.keysUp.push(87); // "w"
	camera.keysRight.push(68);//d
	camera.keysLeft.push(65);//a
	camera.keysDown.push(83); // "s"
	
	//Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;
	
    return camera;
}

function createFloor(scene) {
    //Create a ground mesh
    var floor = BABYLON.Mesh.CreateGround("floor", 100, 100, 1, scene, false);
    //Grass material
    var grassMaterial = new BABYLON.StandardMaterial(name, scene);
    //Texture used under https://creativecommons.org/licenses/by/2.0/ , from https://www.flickr.com/photos/pixelbuffer/3581676159 .
    var grassTexture = new BABYLON.Texture("Assets/TexturesCom_FloorsCheckerboard0048_9_S.jpg", scene);
    grassTexture.uScale = 8;
    grassTexture.vScale = 8;
    grassMaterial.diffuseTexture = grassTexture;
    floor.material = grassMaterial;
	//Collisions
	floor.checkCollisions = true;
    return floor;
}

function createLight(scene) {
    //Create a directional light
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0.5, -1, 0.5), scene);
    light.position = new BABYLON.Vector3(20, 40, -20);
    light.intensity = 0.9;

    //create a second one to simulate light on dark sides
    var secondLight = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
    secondLight.intensity = 0.35;

    return light;
}

function createSkyBox(scene) {
    //SkyBox texture taken from http://www.humus.name/ , under the CC By 3.0 license https://creativecommons.org/licenses/by/3.0/
    //Create a box mesh
    var skybox = BABYLON.Mesh.CreateBox("skybox", 80.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    //The cube texture is used for skz boxes and set as reflection texture 
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Assets/skybox/wall", scene);
    //reflection coordinates set to skybox mode
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.position.y = -23.5;
    //rotate it so front will be more interesting.
    skybox.rotate(BABYLON.Axis.Y, - Math.PI / 2);
    return skybox;
}

function generateActionManager(scene) {
    scene.actionManager = new BABYLON.ActionManager(scene);

    //generate a new color each time I press "c"
    var ball = scene.getMeshByName("ball");
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "c" },
        //the function that will be executed
        function () {
            ball.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        }
    ));
}

function createLocker(loader){
	var locker_positionx,locker_positiony,locker_positionz;
	var locker = new Array(16);
	var locker_flag =0;
	locker_positionz = -37;locker_positionx = -20;locker_positiony = 0;
	for(var locker_i = 0,locker_buffer = 0;locker_i < 1;locker_i++,locker_buffer += 8){
		for(var locker_j = 0;locker_j < 12;locker_j++){
				
				locker[locker_j + locker_buffer] = loader.addMeshTask("locker", "", "Assets/OBJ/Locker/", "locker.obj");
				locker[locker_j + locker_buffer].onSuccess = function (t) {
					if(locker_flag%12 ==0 && locker_flag!=0){
						locker_positionx = -35;
						locker_positiony += 2.5;
					}
					t.loadedMeshes.forEach(function (m) {
						m.position.x -= locker_positionx;
						m.position.y += locker_positiony;
						m.position.z += locker_positionz;
					});
					locker_positionx +=2.6;
					
					locker_flag++;
			};
		}
	}
}

function createTable(loader){
	var table_positionx,table_positionz;
	var table = new Array(36);
	var table_flag = 0;
	table_positionx = -30;table_positionz = -30;
	for(var table_i = 0,table_buffer = 0;table_i < 6;table_i++,table_buffer += 6){
		for(var table_j = 0;table_j < 6;table_j++){
				
				table[table_j + table_buffer] = loader.addMeshTask("table", "", "Assets/OBJ/schooltable/", "schooltable.obj");
				table[table_j + table_buffer].onSuccess = function (t) {
					if(table_flag%6 ==0 && table_flag!=0){
						table_positionx = -30;
						table_positionz += 8;
					}
					t.loadedMeshes.forEach(function (m) {
						m.position.x -= table_positionx;
						m.position.z += table_positionz;
					});
					table_positionx +=8;
					
					table_flag++;
			};
		}
		
	}
}
        	
function cameraJump(scene) {
	var cam = scene.cameras[0];
	cam.animations = [];		
	var a = new BABYLON.Animation("a", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	// Animation keys
	var keys = [];
	keys.push({ frame: 0, value: height });
	keys.push({ frame: 5, value: height - 1 });
	keys.push({ frame: 10, value: height + 6 });
	keys.push({ frame: 20, value: height });
	a.setKeys(keys);
	
	var easingFunction = new BABYLON.CircleEase();
	easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	a.setEasingFunction(easingFunction);
	
	cam.animations.push(a);		
	scene.beginAnimation(cam, 0, 20, false);
} 

