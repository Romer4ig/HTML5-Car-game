/*global Car,TO_RADIANS,drawRotatedImage */

var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	ctxW = canvas.width,
	ctxH = canvas.height,
	player = eval(localStorage.getItem("car")) || car1,
	trackHit = new Image(),
	barrelsHit = new Image(),
	lapcount= 3
	elPX = $('#px'),
	elPY = $('#py'),
	speed = $('#speed');

trackHit.src = "image/track-hit.png";
barrelsHit.src = "image/barrels-hit.png";

// collision
var hit = new HitMap(trackHit),
	barrels = new HitMap(barrelsHit)

// Keyboard Variables
var key = {
	SPACE: 32,
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

var keys = {
	32: false,
	38: false,
	40: false,
	37: false,
	39: false
};
var checkpoints = {
	1:{x:815, y: 168},
	2:{x:380, y: 140},
	3:{x:318, y: 509}, 
	'finish':{x:860, y: 301}
},
	checkpoint_ = 1
	laps = 1

var startLap = new Date(),
	lapTime = []

function carChecpoint(x1 , y1) {
    var inCircle = Math.pow(x1 - checkpoints[checkpoint_].x, 2) + Math.pow(y1 - checkpoints[checkpoint_].y, 2) <= 50*50;
    if(inCircle){
    	if(checkpoint_ == 'finish'){
    		checkpoint_ = 1
    		lapTime.push((new Date() - startLap) / 1000) 
    		startLap = new Date()
    		laps += 1
    		return false;
    	}
    	checkpoint_ +=1
    }
    if(_.size(checkpoints) == checkpoint_){
    	checkpoint_ = 'finish'
    }
}
var barrel = new Image()
barrel.src = "image/barrel.png"
function drawBarrels(){
	context.drawImage(barrel, 815, 140);
	context.drawImage(barrel, 625, 175);
	context.drawImage(barrel, 465, 165);
	context.drawImage(barrel, 320, 155);
	context.drawImage(barrel, 280, 125);
	context.drawImage(barrel, 245, 95);
	context.drawImage(barrel, 135, 230);
	context.drawImage(barrel, 125, 360);
	context.drawImage(barrel, 400, 595);
	context.drawImage(barrel, 475, 580);
	context.drawImage(barrel, 825, 490);
}

function speedXY(rotation, speed) {
	return {
		x: Math.sin(player.get("rotation") * TO_RADIANS) * player.get("speed"),
		y: Math.cos(player.get("rotation") * TO_RADIANS) * player.get("speed") * -1,
	};
}

var x = 10,
	y = 10;

function step(car) {
	if (!car.isMoving()) {
		car.set("speed", 0);
	} else {
		car.set("speed", car.get('speed') * car.get("speedDecay"));
	}
	// keys movements
	if (keys[key.UP]) {
		car.accelerate();
	}
	if (keys[key.DOWN]) {
		car.decelerate();
	}
	if (keys[key.LEFT]) {
		car.steerLeft();
	}
	if (keys[key.RIGHT]) {
		car.steerRight();
	}
	if (keys[key.SPACE]) {
		car.set("speed", 0);
	}

	var speedAxis = speedXY();
	car.set("x", car.get("x") + speedAxis.x);
	car.set("y", car.get("y") + speedAxis.y);
	car.lookoffroad()
	car.lookBarrels()
	carChecpoint(car.get("x"),car.get("y"))

	// info
	speed.html(car.get("speed"));
	$('#laps').html(laps + ' of 3');
	$('#lap_time').html((new Date() - startLap) / 1000 );
}

function draw(car) {
	context.clearRect(0, 0, ctxW, ctxH);
	drawBarrels();
	// checkpoints
	// context.beginPath();
	// context.arc(checkpoints[checkpoint_].x, checkpoints[checkpoint_].y, 50, 0, 2 * Math.PI, false);
	// context.stroke();
	drawRotatedImage(car);
}

// Keyboard event listeners
$(window).keydown(function(e) {
	if (keys[e.keyCode] !== 'undefined') {
		keys[e.keyCode] = true;
	}
});
$(window).keyup(function(e) {
	if (keys[e.keyCode] !== 'undefined') {
		keys[e.keyCode] = false;
	}
});

var fps = 30,
	now = 0,
	then = Date.now(),
	interval = 1000/fps,
	delta = 0,
	counter = 0,
	first = then,
	gamestop = 0
function frame() {
	if (gamestop) return false
	if (laps > lapcount) {
		$("#fresult").html(function(){
			var str = "<img src='/image/finish.png'><br>FINISH! <br>";
			var bestLap = localStorage.getItem("bestLap") || 500;			
			for (var i = 0 ; i < lapTime.length ; i++) {
				if (lapTime[i] < bestLap) {
					bestLap = lapTime[i]
				}
				str += (i+1) + " lap : " + lapTime[i] +  " seconds <br>"
			};
			localStorage.setItem("bestLap",bestLap)
			str += "Best result: " + bestLap +  " seconds <br>"
			return str + "<div id='once_again' onclick='regame(1)'>Once again</div>"
		}).parent().css('display','table')
		$('canvas').hide();

		return false
	}
	step(player);
	draw(player);
	window.requestAnimationFrame(frame);
	now = Date.now();
	delta = now - then;
	
	if (delta > interval) {		
		then = now - (delta % interval);
		var time_el = (then - first)/1000;
		
		$('#fps').html(++counter + 'f / ' + parseInt(time_el) + 's = ' + parseInt(counter/time_el) + 'fps')
	}
}

frame();

function regame(newGame){
	$("#finish").hide()
	$('canvas').show();
	laps = 1
	lapTime = []
	startLap = new Date()
	player.set("x",870)
	player.set("y",370)
	player.set("rotation",350)
	player.set("speed", 0)
	player =  eval(localStorage.getItem("car")) || car1
	checkpoint_ = 1
	if (newGame) {
		frame()
	}
}