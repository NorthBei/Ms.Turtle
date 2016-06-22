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
 var timer = 300; //遊戲倒數時間
 var countDownControler;
 
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
	initPlayerAction(scene,camera);
	
	var skybox_width = 400;
	var box_width = 70;
	var box_length_rate = 0.77;
    //Create the floor
    var floor = createFloor(scene,box_width,box_length_rate);
    //Add a light.
    var light = createLight(scene);
    //Create the skybox
    createSkyBox(scene,skybox_width,box_length_rate);
    
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
	
	createSceneSound(scene);
	createWalkSound(scene);
	
	createWall(scene);
	createTube_light(loader);
	createDoors(loader);
    createLocker(loader);
	createTable(loader);
	createChair(loader);
	createBlackBoard(loader);
	createLectern(loader);
	createLocker(loader);
	createWindows(loader);
	createSpeaker(loader);
	createClock(loader);
	createComputer(loader);
	createCellphone(loader);
	createMotherboard(loader);
	createMotherboardWithIC(loader);
	createBook(loader);
	createPlayBoy(loader, scene);
	createBattery(loader);
	createRemote(loader);
	createRemoteWithBattery(loader, scene)
	createIC(loader);
	createHammer(loader);
	createFireExtinguisher(loader);
	createRubbish(loader);
	createRat(loader);
	//animateRat(scene);
	
    loader.onFinish = function () {
        engine.runRenderLoop(function () {
            scene.render();
        });
		startCountingDown();
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

    camera.speed = 0.5;
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

function createSceneSound(scene) {
	var SceneSound = new BABYLON.Sound("SceneSound", "Assets/sounds/Scraping_The_Sewer.mp3", scene, function () {
		}, { loop: true, autoplay: true });
}

function createWalkSound(scene) {
	var WalkSound = new BABYLON.Sound("WalkSound", "Assets/sounds/walking_on_a_floor.mp3", scene, function () {
			var i = 0;
			window.addEventListener("keydown", function(e){
				switch (event.keyCode) {
					case 87:
						if(!WalkSound.isPlaying)
							WalkSound.play();
					break;
					case 68:
						if(!WalkSound.isPlaying)
							WalkSound.play();
					break;
					case 65:
						if(!WalkSound.isPlaying)
							WalkSound.play();
					break;
					case 83:
						if(!WalkSound.isPlaying)
							WalkSound.play();
					break;
				}	
			}, false);
			window.addEventListener("keyup", function(e){
				switch (event.keyCode) {
					case 87:
						WalkSound.stop();
					break;
					case 68:
						WalkSound.stop();
					break;
					case 65:
						WalkSound.stop();
					break;
					case 83:
						WalkSound.stop();
					break;
				}
			}, false);
		});
}

function createBreakGlassSound(scene) {
	var BreakGlassSound = new BABYLON.Sound("BreakGlassSound", "Assets/sounds/Crash.mp3", scene, function () {
			BreakGlassSound.play();
		});
}

function createMissGoogleSound(scene) {
	var MissGoogleSound = new BABYLON.Sound("MissGoogleSound", "Assets/sounds/MissGoogle.mp3", scene, function () {
			MissGoogleSound.play();
		});
}

function createDemonSound(scene) {
	var DemonSound = new BABYLON.Sound("DemonSound", "Assets/sounds/demon.mp3", scene, function () {
			DemonSound.play();
		});
}

function createPutSound(scene) {
	var PutSound = new BABYLON.Sound("PutSound", "Assets/sounds/putSound.mp3", scene, function () {
			PutSound.play();
		});
}

function createUseSound(scene) {
	var UseSound = new BABYLON.Sound("UseSound", "Assets/sounds/useSound.mp3", scene, function () {
			UseSound.play();
		});
}


function addTextDescription(text) {
	document.getElementById("stuffName").innerHTML = "<span style='background-color:rgba(255, 255, 255, 0.6);'>" + text + "</span>";
	setTimeout("document.getElementById('stuffName').innerHTML = '';", 3000);
}

function startCountingDown() {
	countDownControler = setInterval(function() {document.getElementById('timer').innerHTML = 'Time: ' + timer--; if (timer < 0) document.body.innerHTML="<img src='Assets/explodeBear.jpg' style='position: absolute; top: 50px; left: 50%; margin: 0 0 0 -325px;'/><div style='font-size:13em; position: absolute; top: 400px; left: 50%; margin: 0 0 0 -325px;'>LOSER</div>"}, 1000);
}

function getTime()
{
	//var time = clone(timer);
	clearInterval(countDownControler);
	//document.getElementById("timeTemp").textContent = time;
	
	var success = document.getElementById("success");
	success.style.display = "block";
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
	var light = new Array(6);
	var light_positionx,light_positiony,light_positionz;
	var light_flag = 0;
	light_positionx = -20;light_positiony = 21;light_positionz = -10;
	for(var light_i = 0,light_buffer = 0;light_i < 3;light_i++,light_buffer += 2){
				for(var light_j = 0;light_j < 2;light_j++){
					if(light_flag%2 ==0 && light_flag!=0){
							light_positionx += 20;
							light_positionz = -10;
						}	
				light[light_buffer + light_j] = new BABYLON.PointLight("dir"+light_buffer + light_j, new BABYLON.Vector3(0, -10, 0), scene);
				light[light_buffer + light_j].position = new BABYLON.Vector3(light_positionx, light_positiony, light_positionz);
				light[light_buffer + light_j].intensity = 0.2;
				light[light_buffer + light_j].diffuse = new BABYLON.Color3(0.9, 0.7, 0.7);
				light[light_buffer + light_j].specular = new BABYLON.Color3(0.3, 0.3, 0.3);
				light_positionz += 25;
				light_flag++;
				}
	}

    //create a second one to simulate light on dark sides

    return light;
}

function createSkyBox(scene,box_width,box_length_rate) {
    //SkyBox texture taken from http://www.humus.name/ , under the CC By 3.0 license https://creativecommons.org/licenses/by/3.0/
    //Create a box mesh
    var skybox = BABYLON.Mesh.CreateBox("skybox", box_width, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    //The cube texture is used for skz boxes and set as reflection texture 
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Assets/skybox/skybox", scene);
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
	createHorizontalWall_front(scene,30,0,13,35.5,3,0.005);
	createHorizontalWall_front(scene,30,0,13,-35.5,2.5,0.05);
	createceiling(scene,50,0,26.8,0,0.7,0.05);
	
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
	box.checkCollisions = true; //加入碰撞，不可穿越
}
function createceiling(scene,size,x,y,z,scaleX,scaleY){
	var wall = BABYLON.Mesh.CreateBox("wall", size, scene);
	var wallTexture = new BABYLON.StandardMaterial("wall", scene);
	wallTexture.diffuseTexture = new BABYLON.Texture("Assets/wall.jpg", scene);
	wall.material = wallTexture;
	
	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;
	wall.scaling.y = scaleY;
	wall.scaling.x = scaleX;
	wall.checkCollisions = true; //加入碰撞，不可穿越
}
function createHorizontalWall_front(scene,size,x,y,z,scaleX,scaleZ){
	var wall = BABYLON.Mesh.CreateBox("wall", size, scene);
	var wallTexture = new BABYLON.StandardMaterial("wall", scene);
	wallTexture.diffuseTexture = new BABYLON.Texture("Assets/wall.jpg", scene);
	wall.material = wallTexture;
	
	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;
	wall.scaling.x = scaleX;
	wall.scaling.z = scaleZ;
	wall.checkCollisions = true; //加入碰撞，不可穿越
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
	wall.checkCollisions = true; //加入碰撞，不可穿越
}

function createDoors(loader){
	//前門
	oneDoor("frontDoor",loader,29);
	//後門
	oneDoor("backDoor",loader,-29);
}

function createTube_light(loader){
	var Tube_light_positionx,Tube_light_positiony,Tube_light_positionz;
	var Tube_light = new Array(6);
	var Tube_light_flag = 0;
	Tube_light_positionx = -20;Tube_light_positiony = 23.50;Tube_light_positionz = -10;
	for(var Tube_light_i = 0,Tube_light_buffer = 0;Tube_light_i < 3;Tube_light_i++,Tube_light_buffer += 2){
				for(var Tube_light_j = 0;Tube_light_j < 2;Tube_light_j++){
				Tube_light[Tube_light_j + Tube_light_buffer] = loader.addMeshTask("Tubelight", "", "Assets/OBJ/Tubelight/", "Tubelight.obj");
				Tube_light[Tube_light_j + Tube_light_buffer].onSuccess = function (t) {
				if(Tube_light_flag%2 ==0 && Tube_light_flag!=0){
							Tube_light_positionx += 20;
							Tube_light_positionz = -10;
						}		
				t.loadedMeshes.forEach(function (obj) {	
				obj.scaling.x = 0.009;
				obj.scaling.y = 0.010;
				obj.scaling.z = 0.015;
				obj.position.x += Tube_light_positionx;
				obj.position.z -= Tube_light_positionz;
				obj.position.y += Tube_light_positiony;
				obj.rotation.x = Math.PI;
				obj.rotation.y = Math.PI/2;
				obj.checkCollisions = true; //加入碰撞，不可穿越
			});
			Tube_light_positionz += 25;
			Tube_light_flag++;
			};
		}
	}
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
			obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Door';
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
						m.name = 'Locker';
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
						m.scaling.y = 1.5;
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
						obj.scaling.y = scale*1.2;
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
			obj.name = 'BlackBoard';
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
			obj.name = 'Podium';
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
			obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Window';
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
			obj.name = 'Speaker';
			obj.id = 'Speaker';
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
			obj.name = 'Clock';
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
			obj.name = 'Keyboard';
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
			obj.name = 'Screen';
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
			obj.name = 'Mouse';
		});
	};
}

function createCellphone(loader){
	var Cellphone = loader.addMeshTask("Cellphone", "", "Assets/OBJ/cellphone/", "3d-model.obj");
	//var materialCellphone = new BABYLON.StandardMaterial("materialCellphone", scene);
	//materialCellphone.diffuseTexture = new BABYLON.Texture("Assets/OBJ/cellphone/screen.jpg", scene);
	Cellphone.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			//obj.material = materialCellphone;
			obj.position.x = -9;
			obj.position.y = 4;
			obj.position.z = 13;
			
			obj.rotation.x = Math.PI/2;
			var scale = 0.2;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Cellphone';
		});
	};
}

function createMotherboard(loader){
	var Motherboard = loader.addMeshTask("Motherboard", "", "Assets/OBJ/Motherboard/", "Motherboard.obj");
	
	Motherboard.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = 23.3;
			obj.position.y = 0.5;
			obj.position.z = -33.5;
			
			obj.rotation.z = -Math.PI/4;
			var scale = 0.005;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'MotherBoard';
		});
	};
}

function createMotherboardWithIC(loader){
	var Motherboard = loader.addMeshTask("Motherboard", "", "Assets/OBJ/Motherboard/", "Motherboard.obj");
	
	Motherboard.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = 0;
			obj.position.y = 100;
			obj.position.z = 5;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.005;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'MotherBoardWithIC';
			obj.id = 'MotherBoardWithIC';
		});
	};
}

function createBook(loader){
	var Book = loader.addMeshTask("Book", "", "Assets/OBJ/Book/", "book.obj");
	
	Book.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = 24;
			obj.position.y = 4;
			obj.position.z = 22;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.5;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Books';
		});
	};
}

function createPlayBoy(loader, scene){
	var PlayBoy = loader.addMeshTask("PlayBoy", "", "Assets/OBJ/playboy/", "book.obj");
	var materialPlayBoy = new BABYLON.StandardMaterial("materialPlayBoy", scene);
	materialPlayBoy.diffuseTexture = new BABYLON.Texture("Assets/OBJ/playboy/playboy.png", scene);
	PlayBoy.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.material = materialPlayBoy;
			obj.position.x = -0.2;
			obj.position.y = 3;
			obj.position.z = 27.2;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.7;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'PlayBoy';
		});
	};
}

function createHammer(loader){

	var Hammer = loader.addMeshTask("hammer", "", "Assets/OBJ/hammer/", "hammer.obj");
	Hammer.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {

			obj.position.x = 15;
			obj.position.y = 4;
			obj.position.z = 33.8;
			
			obj.rotation.z = Math.PI/2;
			obj.scaling.x = 2;
			obj.scaling.y = 2;
			obj.scaling.z = 2;
			obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Hammer';
		});
	};
}

function createBattery(loader){
	var Battery = loader.addMeshTask("Battery", "", "Assets/OBJ/battery/", "Battery.obj");
	
	Battery.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = -26.5;
			obj.position.y = 5.15;
			obj.position.z = 24;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.15;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Battery';
		});
	};
}

function createRemote(loader){
	var Remote = loader.addMeshTask("Remote", "", "Assets/OBJ/Remote/", "smalls sky remote control.obj");
	
	Remote.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = -10;
			obj.position.y = 4;
			obj.position.z = -10;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.1;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Remote';
		});
	};
}

function createRemoteWithBattery(loader){
	
	var Remote = loader.addMeshTask("Remote", "", "Assets/OBJ/Remote/", "smalls sky remote control.obj");
	
	Remote.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = -5;
			obj.position.y = 100;
			obj.position.z = 15;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.1;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'RemoteWithBattery';
			obj.id = 'RemoteWithBattery';
		});
	};
}

function createIC(loader){
	var IC = loader.addMeshTask("IC", "", "Assets/OBJ/IC/", "C64_CHIP.obj");
	
	IC.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = 2;
			obj.position.y = 9;
			obj.position.z = -33.5;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.005;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'IC';
		});
	};
}

function createFireExtinguisher(loader){
	var FireExtinguisher = loader.addMeshTask("FireExtinguisher", "", "Assets/OBJ/FireExtinguisher/", "fire extinguisher.obj");
	
	FireExtinguisher.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = -24;
			obj.position.y = 0;
			obj.position.z = 34;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 10;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'ireExtinguisher';
		});
	};
}

function createRubbish(loader){
	var Rubbish = loader.addMeshTask("Rubbish", "", "Assets/OBJ/Rubbish_Bin_By_Berken/", "Rubbish_Bin_By_Berken obj.obj");
	
	Rubbish.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			obj.position.x = 23.7;
			obj.position.y = 0;
			obj.position.z = -32.5;
			
			//obj.rotation.y = Math.PI/2;
			var scale = 0.015;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;
			//obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Rubbish';
		});
	};
}

function createRat(loader){

	var Rat = loader.addMeshTask("Rat", "", "Assets/OBJ/Rat/", "RE O zombi Rat.obj");
	
	Rat.onSuccess = function (t) {
	
		t.loadedMeshes.forEach(function (obj) {
			
			obj.position.x = 0;
			obj.position.y = 0;
			obj.position.z = 0;
			
			//obj.rotation.z = Math.PI/2;
			var scale = 1;
			obj.scaling.x = scale;
			obj.scaling.y = scale;
			obj.scaling.z = scale;

			obj.checkCollisions = true; //加入碰撞，不可穿越
			obj.name = 'Rat';
			obj.id = 'Rat';
		});
	};
}

function animateRat(scene){
	
	var rat = scene.getMeshByID('Rat');
	var moveBox =  new BABYLON.Animation(
			"moveBox",
			"position",
			60,
			BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
			BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var start = rat.position;
	var mid = new BABYLON.Vector3(rat.position.x + 1 ,rat.position.y , rat.position.z + 2);
	var end = rat.position;

	var keys = [];
	keys.push({
		frame: 0,
		value: start
	});
		
	keys.push({
		frame: 10,
		value: mid
	});

	keys.push({
		frame: 20,
		value: end
	});

	moveBox.setKeys(keys);
	rat.animations.push(moveBox);
	scene.beginAnimation(rat,0,100,true);
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

/*function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
	var len
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}*/
