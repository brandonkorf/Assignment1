var pos = [], vel = [], ground = [];
//pos[0] = 0; pos[1] = 0.5; vel[0] = 0; vel[1] = 1; ground[0] = 0; ground[1] = 1; 
var timestep = 0.1;
var simInt;

function update(){
	pos[0] = parseFloat(document.getElementById('posx').value);
	pos[1] = parseFloat(document.getElementById('posy').value);
	vel[0] = parseFloat(document.getElementById('velx').value);
	vel[1] = parseFloat(document.getElementById('vely').value);
	ground[0] = parseFloat(document.getElementById('groundx').value);
	ground[1] = parseFloat(document.getElementById('groundy').value);
	timestep = parseFloat(document.getElementById('timestep').value);

	displayVals();
	drawFrame();
}

function reset(){
	document.getElementById('posx').value = 0;
	document.getElementById('posy').value = 0;
	document.getElementById('velx').value = 0;
	document.getElementById('vely').value = 1;
	document.getElementById('groundx').value = 0;
	document.getElementById('groundy').value = 1;
	document.getElementById('timestep').value = 0.1;
	update();
}

function displayVals(){
	console.log("Pos = "+pos[0]+", "+pos[1]);
	console.log("Vel X = " + vel[0] + ", " + vel[1]);
	console.log("Ground X = " + ground[0] + ", " + ground[1]);
	console.log("Time Step = " + timestep);
}

function start(){
	simInt = setInterval(simulation,timestep*1000);
}

function stop(){
	clearInterval(simInt);
}

function drawFrame() {
	//50 to 450 is box for bouncing, scale by 400

	context.fillStyle = "rgb(200, 200, 200)"
	context.fillRect(0, 0, 500, 500)			

	context.fillStyle = "rgb(0, 0, 0)"

	//context.fillRect(45, 45, 415, 5)
	context.fillRect(45, 45, 5, 415)
	context.fillRect(455, 45, 5, 415)
	context.fillRect(45, 455, 415, 5)

	//"normalize" tangent so tangent[0] is always the same
	//think triangles
	tangent = [];
	tangent[0] = ground[1];
	tangent[1] = -1*ground[0];
	console.log(tangent);
	//

	context.lineWidth = 6;
	/*context.beginPath();
	context.moveTo(45,45-400*tangent[1]);
	context.lineTo(60+400*tangent[0],45);
	context.stroke();*/

	context.beginPath();
	context.moveTo(250,247);
	context.lineTo(45,247-200*tangent[1]/tangent[0]);
	context.stroke();

	context.beginPath();
	context.moveTo(250,247);
	context.lineTo(460,247+200*tangent[1]/tangent[0]);
	context.stroke();

	context.fillRect(Math.round(pos[0]*200)+250, Math.round(pos[1]*200)+250, 5, 5)
}

function simulation() {
	console.log(pos);
	var nextPos = []
	var nextVel = []

	/*
	
	Box shape:
	-1 < x < 1
	y < 1
	ground[0] * x + ground[1] * y > 0
	*/

	nextPos[0] = timestep * vel[0] + pos[0];
	nextPos[1] = timestep * vel[1] + pos[1];

	nextVel = vel;

	if(nextPos[0] >= 0.999 || nextPos[0] <= -0.999){
		nextVel[0] = -vel[0];
	}
	if(nextPos[1] >= 0.999){
		nextVel[1] = -vel[1];
	}
	else if(ground[0]*nextPos[0] + ground[1]*nextPos[1] <= 0.001){
		
		//Calculate unit vector for ground
		var magGround = Math.sqrt(ground[0]*ground[0] + ground[1]*ground[1]);
		var unitGround = [];
		unitGround[0] = ground[0]/magGround;
		unitGround[1] = ground[1]/magGround;

		//calculate dot product of normal and velocity
		dot = vel[0]*unitGround[0] + vel[1]*unitGround[1];

		//calculate incident vector
		incident = [];
		incident[0] = dot*unitGround[0];
		incident[1] = dot*unitGround[1];
		
		//calculate reflecton vector
		reflect = [];
		reflect[0] = vel[0] - 2*incident[0];
		reflect[1] = vel[1] - 2*incident[1];

		//set velocity
		nextVel[0] = reflect[0];
		nextVel[1] = reflect[1];
	}

	/*return {
		position: nextPos,
		velocity: nextVel
	}*/

	pos = nextPos;
	vel = nextVel;
	drawFrame();
}
