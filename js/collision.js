function HitMap(img){
	var self = this;
	this.img = img;
	if (img.complete){
		this.draw();
	} else {
		img.onload = function(){
			self.draw();
		};
	}
}
HitMap.prototype = {
	draw: function(){
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.img.width;
		this.canvas.height = this.img.height;
		this.context = this.canvas.getContext('2d');
		this.context.drawImage(this.img, 0, 0);
	},
	isHit: function(x, y){
        if (this.context){
            var pixel = this.context.getImageData(x, y, 1, 1);
            if (pixel){
                return pixel.data[0] === 0;
            } else {
                return false;
            }
        } else {
            return false;
        }
	}
};

function CollisionPoint (car, rotation, distance) {
	this.car = car;
	this.rotation = rotation;
	this.distance = distance || this.distance;
}
CollisionPoint.prototype = {
	car: null,
	rotation: 0,
	distance: 20,
	getXY: function(){
		return rotatePoint(
					this.car.getCenter(),
					this.car.get("rotation") + this.rotation,
					this.distance
				);
	},
    isHit: function(hitMap){
        var xy = this.getXY();
        return hitMap.isHit(xy.x, xy.y);
    }
};
