var Car = Backbone.Model.extend({
	defaults: {
		x: 870,
		y: 370,
		code: 'player',
		acceleration: 1.05,
		rotationStep: 2.5,
		rotation: 350,
		speed: 0,
		speedDecay: 0.98,
		maxOffRoadSpeed: 1.5,
		maxRoadSpeed: 3,
		maxSpeed: 3,
		backSpeed: 1.1,
		png: "",
		img: "",
		collisions: {}
},
	initialize: function (){
		img = new Image();
		img.src = this.get("png");
		this.set("img",img);
		this.set("collisions", {
			top: new CollisionPoint(this, 0),
			corner1: new CollisionPoint(this, 45, 11),
			right: new CollisionPoint(this, 90, 7),
			corner2: new CollisionPoint(this, 135, 11),
			bottom: new CollisionPoint(this, 180),
			corner3: new CollisionPoint(this, 225, 11),			
			left: new CollisionPoint(this, 270, 7),
			corner4: new CollisionPoint(this, 315, 11)
		})
	},
	lookoffroad: function(){
		if(this.get("collisions").left.isHit(hit) || this.get("collisions").right.isHit(hit) || this.get("collisions").top.isHit(hit) || this.get("collisions").bottom.isHit(hit) ){
			this.set("maxSpeed", this.get("maxOffRoadSpeed"))							
		}else{
			this.set("maxSpeed", this.get("maxRoadSpeed"))
		}	
	},
	lookBarrels: function(){
		var car = this
		_.each(this.get("collisions"), function(collusion){
			if(collusion.isHit(barrels) ) {
				car.set("speed", car.get("speed") >= 0 ? -0.4 : -(car.get("speed")/4))
			}
		})
	},
	isMoving: function (speed) {
		return !(this.get("speed") > -0.4 && this.get("speed") < 0.4);
	},
	getCenter: function(){
		return {
			x: this.get("x"),
			y: this.get("y")
		};
	},
	accelerate: function(){
		var speed 	 = this.get("speed"),
			maxSpeed = this.get("maxSpeed")
		if (speed < maxSpeed){
			if (speed < 0){
				this.set("speed", speed * this.get("speedDecay"));
			} else if (speed === 0){
				this.set("speed", 0.4);
			} else {
				_speed = speed * this.get("acceleration")
				this.set("speed", _speed > maxSpeed ? maxSpeed : _speed); 
			}
		}
	},
	decelerate: function(min){
		var speed = this.get("speed"),
			min = min || 0;

		if (Math.abs(speed) < (this.get("maxSpeed") * 0.7 )){
			if (speed > 0){
				speed = speed * this.get("speedDecay");
				this.set("speed", speed < min ? min : this.get("speed"));
			} else if (speed === 0){
				this.set("speed", -0.4);
			} else {
				_speed = speed * this.get("backSpeed");
				this.set("speed",  _speed > min ? min : _speed);
			}
		}
	},
	steerLeft: function(){
		if (this.isMoving()){
			this.set("rotation", this.get("rotation") - this.get("rotationStep") * (this.get("speed")/this.get("maxSpeed")) );
		}
	},
	steerRight: function(){
		if (this.isMoving()){
			this.set("rotation", this.get("rotation") + this.get("rotationStep") * (this.get("speed")/this.get("maxSpeed")) );
		}
	}
})

var carsCollection = Backbone.Collection.extend({
	model: Car
})

var car1 = new Car({
	code: 'car1',
	acceleration: 1.05,
	maxOffRoadSpeed: 1.2,
	maxRoadSpeed: 3,
	speed: 0,
	png: "image/car1.png"
}),car2 = new Car({
	code: 'car2',
	acceleration: 1.05,
	rotationStep: 2.9,
	maxOffRoadSpeed: 1.5,
	maxRoadSpeed: 3,
	speed: 0,
	png: "image/car2.png"
}),car3 = new Car({
	code: 'car3',
	acceleration: 1.06,
	maxOffRoadSpeed: 1.1,
	maxRoadSpeed: 2.5,
	speed: 0,
	png: "image/car3.png"
}),car4 = new Car({
	code: 'car4',
	acceleration: 1.05,
	rotationStep: 3.5,
	maxOffRoadSpeed: 2,
	maxRoadSpeed: 3.5,
	speed: 0,
	png: "image/car4.png"
})
var carCol = new carsCollection([car1,car2,car3,car4])