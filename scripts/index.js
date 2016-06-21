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
function init() {
    //Init the engine
    var engine = initEngine();
    //Create a new scene
    var scene = createScene(engine);
	
	//player
	var height = 10;
	//Create the main player camera
    var camera = createFreeCamera(scene,height);
    //Attach the control from the canvas' user input
    camera.attachControl(engine.getRenderingCanvas());
    //set the camera to be the main active camera;
    scene.activeCamera = camera;
	
	//讓滑鼠可以直接滑動控制視角
	initPointerLock(scene,camera);
	
	var box_width = 70;
	var box_length_rate = 0.77;
    //Create the floor
    var floor = createFloor(scene,box_width,box_length_rate);
    //Add a light.
    var light = createLight(scene);
    //Create the skybox
    createSkyBox(scene,box_width,box_length_rate);
    
    //Add an action manager to change the ball's color.
    generateActionManager(scene);
	
	//可能用的到暫放
	/*camera.onCollide = function (colMesh) {
		if (colMesh.uniqueId === floor.uniqueId) {
			cameraJump(scene);
		}
	}*/
	
	window.addEventListener("keyup", function(e){
		switch (event.keyCode) {
			case 16:
				if(camera.position.y < height)
					cameraStand(scene, height);
			break;
			case 32:
				cameraJump(scene, height);
			break;
		}
	}, false);
	
	window.addEventListener("keydown", function(e){
		switch (event.keyCode) {
			case 16:
				if(camera.position.y >= height)
					cameraSquat(scene, height);
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
	
	createWall(scene);
	
	createDoors(loader);
    createLocker(loader);
	createTable(loader);
	createChair(loader);
	createBlackBoard(loader);
	createLectern(loader);
	createLocker(loader);
	createWindows(loader);
	//obj不能用
	//createProjector(loader);
	createSpeaker(loader);
	createClock(loader);
	createComputer(loader);
	//createMicrophone(loader);
	createCellphone(loader);
	showAxis(scene,2);
	
    loader.onFinish = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };

    loader.load();
    //scene.debugLayer.show();
    engine.runRenderLoop(function () {
        scene.render();
    });
    return scene;
}

function createFreeCamera(scene,height) {

    var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, height, 0), scene);

    camera.speed = 0.8;
    camera.inertia = 0.4;
	//Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(0.5, height/2, 0.5);
	
	camera.keysUp.push(87); // "w"
	camera.keysRight.push(68);//d
	camera.keysLeft.push(65);//a
	camera.keysDown.push(83); // "s"
	
	//Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;
	
    return camera;
}

function addTextDescription(text) {
	document.getElementById("stuffName").innerHTML = text;
}

/**********裝潢區**********/
function createFloor(scene,box_width,box_length_rate) {
    //Create a ground mesh
    var floor = BABYLON.Mesh.CreateGround("floor", box_width*box_length_rate ,box_width, 1, scene, false);
    //Grass material
    var grassMaterial = new BABYLON.StandardMaterial(name, scene);
    //Texture used under https://creativecommons.org/licenses/by/2.0/ , from https://www.flickr.com/photos/pixelbuffer/3581676159 .
    var grassTexture = new BABYLON.Texture("Assets/TexturesCom_FloorsCheckerboard0048_9_S.jpg", scene);
    grassTexture.uScale = 10;
    grassTexture.vScale = 10;
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

function createSkyBox(scene,box_width,box_length_rate) {
    //SkyBox texture taken from http://www.humus.name/ , under the CC By 3.0 license https://creativecommons.org/licenses/by/3.0/
    //Create a box mesh
    var skybox = BABYLON.Mesh.CreateBox("skybox", box_width, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    //The cube texture is used for skz boxes and set as reflection texture 
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Assets/skybox/wall", scene);
    //reflection coordinates set to skybox mode
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
	
	skybox.scaling.z = box_length_rate;
	skybox.position.y = -10;
	
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

function createWall(scene){
	createBeam("rightFront",scene,26,34);
	createBeam("leftFront",scene,-26,34);
	createBeam("rightRear",scene,-26,-34);
	createBeam("leftRear",scene,26,-34);
	//createBeam("leftMiddle",scene,-26,0);
	//createBeam("rightMiddle",scene,27.3,0);
	var z = -0.6;
	//right
	//scene , size , x , y , z , scaleY,scaleZ
	createHorizontalWall(scene,10,31.3,26.2,12,1.2,9);//橫向上
	createHorizontalWall(scene,10,31.3,14.35,12,0.134,9);//橫向中
	createHorizontalWall(scene,10,31.3,-1,12,1.2,9);//橫向下
	
	createHorizontalWall(scene,7,29.8,17.6,29.3,0.75,1.3);//垂直最左上
	createHorizontalWall(scene,7,29.8,17.6,-29.3,0.75,1.3);//垂直最右上
	
	createHorizontalWall(scene,7,29.8,9.34,29.3,1.24,1.3);//垂直最左下
	createHorizontalWall(scene,7,29.8,9.34,-29.3,1.24,1.3);//垂直最右下
	
	createHorizontalWall(scene,7,29.8,17.6,9.2+z,0.75,0.3);//垂直第二左上
	createHorizontalWall(scene,7,29.8,17.6,-8+z,0.75,0.3);//垂直第二右上
	
	createHorizontalWall(scene,7,29.8,9.36,9.2+z,1.25,0.3);//垂直第二左下
	createHorizontalWall(scene,7,29.8,9.36,-8+z,1.25,0.3);//垂直第二右下

	//left (*-1)
	//scene , size , x , y , z , scaleY,scaleZ
	createHorizontalWall(scene,10,-31.3,26.2,12,1.2,9);//橫向上
	createHorizontalWall(scene,10,-31.3,14.35,12,0.128,9);//橫向中
	createHorizontalWall(scene,10,-31.3,2.5,0,0.5,4.96);//橫向下
	
	createHorizontalWall(scene,7,-29.8,17.6,29.3,0.75,1.3);//垂直最左上
	createHorizontalWall(scene,7,-29.8,17.6,-29.3,0.75,1.3);//垂直最右上
	
	createHorizontalWall(scene,7,-29.8,9.36,9.2+z,1.25,0.3);//垂直左下
	createHorizontalWall(scene,7,-29.8,9.36,-8+z,1.25,0.3);//垂直右下
	
	createHorizontalWall(scene,7,-29.8,17.6,9.2+z,0.75,0.3);//垂直左上
	createHorizontalWall(scene,7,-29.8,17.6,-8+z,0.75,0.3);//垂直右上
	
	createHorizontalWall(scene,6,-29.3,0,25.5,4.8,0.44);//前門左垂直
	createHorizontalWall(scene,6,-29.3,0,32.1,4.8,0.3);//前門右垂直
	createHorizontalWall(scene,6,-29.3,12.65,29,0.4,0.74);//前門上方橫向
	
	createHorizontalWall(scene,6,-29.3,0,-32.5,4.8,0.44);//後門左垂直
	createHorizontalWall(scene,6,-29.3,0,-25.8,4.8,0.35);//後門右垂直
	createHorizontalWall(scene,6,-29.3,12.65,-29,0.4,0.74);//後門上方橫向
}

function createBeam(name,scene,x,z){
	var box = BABYLON.Mesh.CreateBox(name, 2, scene);
	var wallTexture = new BABYLON.StandardMaterial("wall", scene);
	wallTexture.diffuseTexture = new BABYLON.Texture("Assets/wall.jpg", scene);
	box.material = wallTexture;
	
	box.position.x = x;
	box.position.z = z;
	box.scaling.y = 26;
}

function createHorizontalWall(scene,size,x,y,z,scaleY,scaleZ){
	var wall = BABYLON.Mesh.CreateBox("wall", size, scene);
	var wallTexture = new BABYLON.StandardMaterial("wall", scene);
	wallTexture.diffuseTexture = new BABYLON.Texture("Assets/wall.jpg", scene);
	wall.material = wallTexture;
	
	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;
	wall.scaling.y = scaleY;
	wall.scaling.z = scaleZ;
}

function createDoors(loader){
	//前門
	oneDoor("frontDoor",loader,29);
	//後門
	oneDoor("backDoor",loader,-29);
}

function oneDoor(name,loader,z){

	var door = loader.addMeshTask(name, "", "Assets/OBJ/door/", "door.obj");
	door.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {		
			obj.position.x = -26.7;
			obj.position.z = z;
			
			obj.rotation.y = Math.PI/2;
			var scale = 0.14;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
		});
	};
}


function createLocker(loader){
	var locker_positionx,locker_positiony,locker_positionz;
	var locker = new Array(16);
	var locker_flag =0;
	locker_positionz = -33.9;locker_positionx = -20;locker_positiony = 0;
	for(var locker_i = 0,locker_buffer = 0;locker_i < 1;locker_i++,locker_buffer += 8){
		for(var locker_j = 0;locker_j < 8;locker_j++){
				
				locker[locker_j + locker_buffer] = loader.addMeshTask("locker", "", "Assets/OBJ/Locker/", "locker.obj");
				locker[locker_j + locker_buffer].onSuccess = function (t) {
					if(locker_flag%12 ==0 && locker_flag!=0){
						locker_positionx = -30;
						locker_positiony += 2.5;
					}
					t.loadedMeshes.forEach(function (m) {
						m.scaling.x = 2.2;
						m.scaling.y = 2;
						m.scaling.z = 2.7;						
						m.position.x -= locker_positionx;
						m.position.y += locker_positiony;
						m.position.z += locker_positionz;
						m.checkCollisions = true; //加入碰撞，不可穿越
					});
					locker_positionx +=5.8;
					
					locker_flag++;
			};
		}
	}
}

function createTable(loader){
	var initX =-24.25;
	var table_positionx = initX,table_positionz = -22;
	var table = new Array(42);
	var table_flag = 0;
	
	for(var table_i = 0,table_buffer = 0;table_i < 7;table_i++,table_buffer += 7){
		for(var table_j = 0;table_j < 6;table_j++){
				
				table[table_j + table_buffer] = loader.addMeshTask("table", "", "Assets/OBJ/schooltable/", "schooltable.obj");
				table[table_j + table_buffer].onSuccess = function (t) {
					if(table_flag%7 ==0 && table_flag!=0){
						table_positionx = initX;
						table_positionz += 8;
					}
					t.loadedMeshes.forEach(function (m) {
						m.position.x -= table_positionx;
						m.position.z += table_positionz;
						m.checkCollisions = true; //加入碰撞，不可穿越
					});
					table_positionx +=8;
					
					table_flag++;
			};
		}
		
	}
}

function createChair(loader){
	var initX =-24.25;
	var positionx = initX,positionz = -22;
	var chair = new Array(42);
	var flag = 0;
	
	for(var table_i = 0,table_buffer = 0;table_i < 7;table_i++,table_buffer += 7){
		for(var table_j = 0;table_j < 6;table_j++){
				
				chair[table_j + table_buffer] = loader.addMeshTask("table", "", "Assets/OBJ/chair/", "chair.obj");
				chair[table_j + table_buffer].onSuccess = function (t) {
					if(flag%7 ==0 && flag!=0){
						positionx = initX;
						positionz += 8;
					}
					t.loadedMeshes.forEach(function (obj) {
						obj.position.x -= positionx;
						obj.position.z += positionz;
						
						obj.rotation.y = Math.PI/2;
						
						var scale = 0.11;
						obj.scaling.x = scale*0.95;
						obj.scaling.y = scale;
						obj.scaling.z = scale;
						obj.checkCollisions = true; //加入碰撞，不可穿越
					});
					positionx +=8;
					
					flag++;
			};
		}
		
	}
}

function createBlackBoard(loader){

	var blackbord = loader.addMeshTask("blackboard", "", "Assets/OBJ/blackboard/", "blackboard.obj");
	blackbord.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			//obj.position.x -= 0;
			obj.position.z = 34.0;
			obj.position.y = 4;
			
			obj.rotation.y = Math.PI/2;
			var scale = 0.22;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function createLectern(loader){

	var lectern = loader.addMeshTask("blackboard", "", "Assets/OBJ/lectern/", "lectern.obj");
	lectern.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			//obj.position.x -= 0;
			obj.position.z = 27;
			//obj.position.y = 4;*/
			
			obj.rotation.y = Math.PI/2;
			var scale = 0.18;
			obj.scaling.x = scale;
			obj.scaling.y = scale*0.75;
			obj.scaling.z = scale;
			obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function oneWindow(loader,x,y,z,minRate){
	var w = loader.addMeshTask("window", "", "Assets/OBJ/window/", "window.obj");
	w.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
			
			obj.rotation.y = Math.PI/2;
			
			var scale = 0.1;
			obj.scaling.x = scale;
			obj.scaling.y = scale*minRate;
			obj.scaling.z = scale;
		});
	};
}

function createWindows(loader){
	//var z = -1.2;
	var z = -0.6;
	
	neighborWindows(loader,26.6,5,14+z);
	neighborWindows(loader,26.6,5,-3.2+z);
	neighborWindows(loader,26.6,5,-20.4+z);
	
	neighborWindows(loader,-26.6,5,14+z);
	neighborWindows(loader,-26.6,5,-3.2+z);
	neighborWindows(loader,-26.6,5,-20.4+z);
}

function neighborWindows(loader,x,y,z){
	
	//transom window
	oneWindow(loader,x,y+10,z,0.6);
	oneWindow(loader,x,y,z,1);
	
	//transom window
	oneWindow(loader,x,y+10,z+7.6,0.6);
	oneWindow(loader,x,y,z+7.6,1);
}

//obj不能用
/*function createProjector(loader){

	var projector = loader.addMeshTask("projector", "", "Assets/OBJ/projector/", "projector.obj");
	projector.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			//obj.position.x -= 0;
			obj.position.z = 0;
			obj.position.y = 20;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.22;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}*/

function oneSpeaker(loader,x,y,z){

	var Speaker = loader.addMeshTask("Speaker", "", "Assets/OBJ/speaker/", "Speaker.obj");
	Speaker.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
			
			obj.rotation.y = Math.PI;
			var scale = 3;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}
 
function createSpeaker(loader){
	
	oneSpeaker(loader,20,20,36);
	oneSpeaker(loader,-20,20,36);
} 
 
function createClock(loader){
	var Clock = loader.addMeshTask("Clock", "", "Assets/OBJ/clock/", "Clock_obj.obj");
	Clock.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = 22.5;
			obj.position.y = 15;
			obj.position.z = 35;
			
			obj.rotation.y = Math.PI/2;
			var scale = 3;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function createComputer(loader){
	
	createKeyboard(loader,0,5.6,28);
	createImac(loader,-0.5,5.8,26);
	createMouse(loader,-1.8,5.4,28);
}

function createKeyboard(loader,x,y,z){
	var Keyboard = loader.addMeshTask("Keyboard", "", "Assets/OBJ/computer/clavier_imac/", "clavier_imac.obj");
	Keyboard.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
			
			obj.rotation.y = Math.PI/8;
			var scale = 5;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function createImac(loader,x,y,z){
	var Imac = loader.addMeshTask("Imac", "", "Assets/OBJ/computer/imac/", "imac.obj");
	Imac.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
			
			obj.rotation.y = Math.PI/8;
			var scale = 5;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function createMouse(loader,x,y,z){
	var Mouse = loader.addMeshTask("Mouse", "", "Assets/OBJ/computer/mouse_imac/", "mouse_imac.obj");
	Mouse.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 5;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

//obj不能用
function createMicrophone(loader){
	var Microphone = loader.addMeshTask("Microphone", "", "Assets/OBJ/microphone/", "Shure.obj");
	Microphone.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = 0;
			obj.position.y = 15;
			obj.position.z = 0;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 1;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

function createCellphone(loader){
	var Cellphone = loader.addMeshTask("Cellphone", "", "Assets/OBJ/cellphone/", "iphone5_OBJ.obj");
	Cellphone.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = 0;
			obj.position.y = 15;
			obj.position.z = 10;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.005;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
		});
	};
}

/**********功能區**********/ 
function cameraJump(scene, height){
	var camera = scene.cameras[0];
	camera.animations = [];		
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
	camera.animations.push(a);		
	scene.beginAnimation(camera, 0, 20, false);
}

function cameraSquat(scene, height){
	var camera = scene.cameras[0];
	camera.animations = [];		
	var a = new BABYLON.Animation("a", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	// Animation keys
	var keys = [];
	keys.push({ frame: 0, value: camera.position.y });
	keys.push({ frame: 5, value: camera.position.y - 5 });
	a.setKeys(keys);
	var easingFunction = new BABYLON.CircleEase();
	easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	a.setEasingFunction(easingFunction);
	
	camera.ellipsoid = new BABYLON.Vector3(0.5, (height-5)/2, 0.5);
	camera.animations.push(a);
	scene.beginAnimation(camera, 0, 5, false);
}

function cameraStand(scene, height){
	var camera = scene.cameras[0];
	camera.animations = [];		
	var a = new BABYLON.Animation("a", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	// Animation keys
	var keys = [];
	keys.push({ frame: 0, value: camera.position.y });
	keys.push({ frame: 5, value: camera.position.y + 5 });
	a.setKeys(keys);
	
	var easingFunction = new BABYLON.CircleEase();
	easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	a.setEasingFunction(easingFunction);
	
	camera.ellipsoid = new BABYLON.Vector3(0.5, height/2, 0.5);
	camera.animations.push(a);		
	scene.beginAnimation(camera, 0, 5, false);
}
  // show axis
function showAxis(scene,size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

//可以讓使用滑鼠改變視角
function  initPointerLock(scene,camera) {
		
	// Request pointer lock
	var canvas = scene.getEngine().getRenderingCanvas();
	// On click event, request pointer lock
	canvas.addEventListener("click", function(evt) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock();
		}
	}, false);

	// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
	var pointerlockchange = function (event) {
		var controlEnabled = (
						   document.mozPointerLockElement === canvas
						|| document.webkitPointerLockElement === canvas
						|| document.msPointerLockElement === canvas
						|| document.pointerLockElement === canvas);
		// If the user is alreday locked
		if (! controlEnabled) {
			//camera.detachControl(canvas);
			console.log('The pointer lock status is now locked');
		} else {
			//camera.attachControl(canvas);
			console.log('The pointer lock status is now unlocked'); 
		}
	};

	// Attach events to the document
	document.addEventListener("pointerlockchange", pointerlockchange, false);
	document.addEventListener("mspointerlockchange", pointerlockchange, false);
	document.addEventListener("mozpointerlockchange", pointerlockchange, false);
	document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}
