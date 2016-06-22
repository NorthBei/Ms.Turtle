var takeObj = null;
var stableObj = ['skybox', 'Speaker', 'Window', 'Clock', 'BlackBoard', 'Door', 'floor', 'Locker', 'rightFront', 'leftFront', 'rightRear', 'leftRear', 'wall', 'Podium', 'Cube'];

function initPlayerAction(scene, camera)
{
	var canvas = scene.getEngine().getRenderingCanvas();
	
	canvas.addEventListener("click", function(evt) {
		console.log("Left Click!");
	
        var width = scene.getEngine().getRenderWidth();
        var height = scene.getEngine().getRenderHeight();
		
        var pickInfo = scene.pick(width/2, height/2, null, false, camera);
		
		//console.log('000000  ' + pickInfo.pickedMesh.name);

		clickLeft(evt, pickInfo, camera, scene);
		
    }, false);
	
	window.addEventListener("keydown", function (evt) 
	{        
		switch (evt.keyCode) 
		{            
			case 71:  
				putDown(scene, camera); 
				break; 
			
			default: 
				break;        
		} 
	});
}
	
function clickLeft(evt, pickInfo, camera, scene) {
	var takeable = true;
	
	for(var i=0; i<stableObj.length; i++)
	{
		if(stableObj[i] == pickInfo.pickedMesh.name)
			takeable = false;
	}
   
   var pickedObj = pickInfo.pickedMesh;
   
   	var detlaPosition = new BABYLON.Vector3(camera.position.x - pickedObj.position.x, camera.position.y - pickedObj.position.y, camera.position.z - pickedObj.position.z);

	var distance = Math.sqrt(Math.pow(detlaPosition.x,2) + Math.pow(detlaPosition.y,2) + Math.pow(detlaPosition.z,2));
   
   if(takeObj == null && takeable == true && distance<=15)
	{
		Objdetail(pickedObj.name);
		//addTextDescription('you pick a ' + pickedObj.name);
		
		//if(pickedObj.name == 'SchoolTable' || pickedObj.name == 'Chair' || pickedObj.name == '2b0b494d-2131-4d3a-8518-0483f955fd8b')
		{
			console.log('s obj position: ' + pickedObj.position);
			pickedObj.parent = camera;
			pickedObj.position = new BABYLON.Vector3(2, -2, 5);
			
			console.log('camera position: ' + camera.position);
			console.log('obj position: ' + pickedObj.position);
			
			takeObj = pickedObj;
		}
	}
	else(takeObj != null && distance<=15 )
	{
		createUseSound(scene);
		Objdetail(pickedObj.name);
		var moveBox =  new BABYLON.Animation(
				"moveBox",
				"position",
				60,
				BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
				BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			var start = takeObj.position;
			var mid = new BABYLON.Vector3(takeObj.position.x + 1*Math.sin(camera.rotation.y) ,takeObj.position.y , takeObj.position.z + 1*Math.cos(camera.rotation.y));
			var end = takeObj.position;

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
			takeObj.animations.push(moveBox);
			scene.beginAnimation(takeObj,0,100,true);
		act(takeObj, pickedObj,scene);
	}
}

function putDown(scene, camera)
{
	takeObj = null;
	
	var putDownObj = camera.getChildren()[0];
	
	putDownObj.rotation.y = camera.rotation.y;
	
	camera.getChildren()[0].parent = null;
	//console.log("putDown!");
	var canvas = scene.getEngine().getRenderingCanvas();
	/*console.log(camera.position);
	console.log(camera.getChildren()[0].name);
	
	console.log('y: ' + camera.rotation.y);
		*/
	var rotateY = camera.rotation.y;
	
	var angle = camera.rotation.y * (180/Math.PI);
		
	var xPlus;
	var zPlus;
		
	if(angle<0)
		angle = angle+360;
	if(angle>360)
		angle = angle/360.0;
		
	/*
	if(angle>0 && angle<180)
		xPlus = 9;
	else
		xPlus = -9;
		
	if(angle>270 || angle<90)
		zPlus = 9;
	else
		zPlus = -9;
	*/
	
	xPlus = 9*Math.sin(rotateY);
	zPlus = 9*Math.cos(rotateY);	
	
	putDownObj.position = camera.position;
	
			var moveBox =  new BABYLON.Animation(
				"moveBox",
				"position",
				60,
				BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
				BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			var start = putDownObj.position;
			var end =  new BABYLON.Vector3(camera.position.x + xPlus,0, camera.position.z+ zPlus);
			console.log(start +" +++ " + end)
			var keys = [];
			keys.push({
				frame: 0,
				value: start
			});
	
			keys.push({
				frame: 20,
				value: end
			});

			moveBox.setKeys(keys);
			putDownObj.animations.push(moveBox);
			scene.beginAnimation(putDownObj,0,100,true);
			
	//camera.getChildren()[0].position = new BABYLON.Vector3(camera.position.x + xPlus,0, camera.position.z+ zPlus);
	
	/*console.log(angle);
	console.log(xPlus + " " + zPlus);*/
	console.log(camera.position);
	
	//camera.getChildren()[0].position = new BABYLON.Vector3(camera.position.x + xPlus,0, camera.position.z+ zPlus);
	createPutSound(scene);
	//a.position = new BABYLON.Vector3(camera.position.x + xPlus,0, camera.position.z+ zPlus);

}

function act(takeObject, pickedObject, scene)
{
	console.log('act!');
	console.log(takeObject.name);
	console.log(pickedObject.name);
	/*if(takeObject.name=='SchoolTable' && pickedObject.name=='Chair')
	{
		console.log('act!');
		
		takeObject.dispose();
		pickedObject.dispose();
		
		takeObj = null;
	}*/
	
	switch(takeObject.name)
	{
		case 'Battery':
			if(pickedObject.name == 'Remote')
			{
				createDemonSound(scene);
				addTextDescription('把電池放進遙控器中... <br> 遙控器有電了!');
				var RemoteWithBattery = scene.getMeshByID('RemoteWithBattery');
				RemoteWithBattery.position = pickedObject.position;
				takeObject.dispose();
				pickedObject.dispose();
				
				takeObj = null;
			}
			break;
			
		case 'RemoteWithBattery':
			if(pickedObject.name == 'Screen')
				addTextDescription('嗶...嗶...嗶...! <br> 什麼事都沒發生...被耍了');
			else if(pickedObject.name == 'SpeakerWithMotherBoard')
			{
				addTextDescription('是誰在說話...?');
				createMissGoogleSound(scene);
			}
			break;
			
		case 'IC':
			if(pickedObject.name == 'MotherBoard')
			{
				createDemonSound(scene);
				addTextDescription('把IC插進電路板中 <br> 看起來完美的契合了! ');
				var MotherBoardWithIC = scene.getMeshByID('MotherBoardWithIC');
				MotherBoardWithIC.position = pickedObject.position;
				takeObject.dispose();
				pickedObject.dispose();
				
				takeObj = null;
			}
			break;	
		case 'MotherBoardWithIC':
			if(pickedObject.name == 'Speaker')
			{
				createDemonSound(scene);
				addTextDescription('喀嚓! <br> 電路板剛好放進喇叭的缺口了! ');
				var Speaker = scene.getMeshByID('Speaker');
				pickedObject.name = 'SpeakerWithMotherBoard';
				takeObject.dispose();
				takeObj = null;
			}
			break;	
		case 'Hammer':
			if(pickedObject.name == 'Window')
			{
				addTextDescription('太神啦');
				createBreakGlassSound(scene);
				pickedObject.dispose();
				getTime();
			}
			break;
	}
}

function Objdetail(name)
{
	switch(name)
	{
		case 'SchoolTable':
			addTextDescription('[木頭桌子]<br>木頭製造的桌子<br>桌面上有奇怪的塗鴉...');
			break;
		case 'Chair':
			addTextDescription('[木頭椅子]<br>木頭製造的椅子<br>看起來沒什麼用處...');
			break;
		case 'Books':
			addTextDescription('[歷史課本]<br>乾乾淨淨的課本<br>看起來根本沒在上課');
			break;
		case 'Hammer':
			addTextDescription('[鐵鎚]<br>教室怎麼會有鐵鎚<br>難道平偉在這一班?');
			break;
		case 'Screen':
			addTextDescription('[螢幕]<br>沒有開關的螢幕<br>說不定有遙控器!');
			break;
		case 'Keyboard':
			addTextDescription('[鍵盤]<br>竟然是Razer電競專用鍵盤<br>出不去就來打LOL吧...');
			break;
		case 'Speaker':
			addTextDescription('[喇叭]<br>教室老舊的喇叭<br>看起來好像缺少了什麼東西');
			break;
		case 'Mouse':
			addTextDescription('[滑鼠]<br>古老的滾球滑鼠<br>真是令人懷念的古董啊!');
			break;
		case 'IC':
			addTextDescription('[80386]<br>不知道從哪裡掉出來的IC<br>長得好像蟑螂啊......');
			break;
		case 'MotherBoard':
			addTextDescription('[缺漏的電路板]<br>一整塊電路板<br>看起來好像有個缺口!');
			break;
		case 'Cellphone':
			addTextDescription(' [Sansung Note 5] <br> 哇!是全新的Note5 <br><br> 手機殼...... ');
			break;
		case 'Remote':
			addTextDescription(' [遙控器] <br> 長得很奇怪的遙控器 <br> 但是電池被拔掉了 ');
			break;
		case 'Clock':
			addTextDescription(' [時鐘] <br> 左右相反的時鐘 <br><br> 不知道是時間靜止了 <br> 還是沒電了 ');
			break;
		case 'Battery':
			addTextDescription(' [3A電池] <br> 找到一顆電池 <br> 應該派得上用場! ');
			break;
		case 'RemoteWithBattery':
			addTextDescription(' [有電的遙控器] <br> 裝上電池的遙控器 <br> 大概可以開啟什麼吧? ');
			break;
		case 'MotherBoardWithIC':
			addTextDescription(' [完整的電路板] <br> 裝上80386的電路板 <br> 但是可以拿來幹嘛呢... ');
			break;
		case 'SpeakerWithMotherBoard':
			addTextDescription(' [喇叭] <br> 好像需要什麼來啟動他');
			break;
		case 'FireExtinguisher':
			addTextDescription(' [滅火器] <br> 白色的滅火器 <br> 感覺不太可靠');
			break;
		case 'Rubbish':
			addTextDescription(' [啦嘰桶] <br> 充滿啦嘰的啦嘰桶 <br> 超啦嘰');
			break;
		case 'PlayBoy':
			addTextDescription(' [Play Boy] <br> 嘿嘿嘿 <br> 嘿嘿嘿嘿嘿嘿嘿');
			break;
		case 'Rat':
			addTextDescription(' [大鼠加大] <br> 好大的老鼠RRR');
			break;
	}
}

