document.addEventListener("DOMContentLoaded", function() {
	var parentBox = document.querySelector("#Box");
	var btnAdd = document.querySelector("#btnAdd");
	var btnDelete = document.querySelector("#btnDelete");
	var eldomCount = document.querySelector("#domCount");
	var domCount = 0;
	var parentStyle = {
		offsetTop: parentBox.offsetTop,
		offsetHeight: parentBox.offsetHeight,
		offsetLeft: parentBox.offsetLeft,
		offsetWidth: parentBox.offsetWidth
	}

	btnAdd.addEventListener("click", function(){

		var	startTime = new Date()/1000;
		for(var i=0; i<1000; i++){
			var box = new Box();
			box.setStyle(parentStyle);
			parentBox.appendChild(box.element);
		}
		timeDiv = document.createElement("div");

		var timeElapsed = new Date()/1000 - startTime;
		domCount = domCount+1000;
		timeDiv.innerHTML = domCount-1000+"~"+domCount+", "+timeElapsed;
		document.querySelector("body").appendChild(timeDiv);
	});

	btnDelete.addEventListener("click", function(){
		parentBox.removeChild(Box.currentElement);
	});
});

function Box(){
	this.r = rand(0, 255);
	this.g = rand(0, 255);
	this.b = rand(0, 255);
	this.size = rand(1,3);
	this.element = document.createElement("div");

	this.onMouseMove = this._onMouseMove.bind(this);
	this.onMouseUp = this._onMouseUp.bind(this);
	
	this.element.addEventListener("click", this._onSelect.bind(this));
	this.element.addEventListener("mousedown", this._onDragStart.bind(this));
}

Box.prototype.setStyle = function(parentStyle){
	console.log(this.size);
	this.element.style.cssText = 'width:'+this.size+'px;height:'+this.size+'px;background-color:rgb('+this.r+', '+this.g+', '+this.b+');position: absolute;top:'+rand(parentStyle.offsetTop, parentStyle.offsetHeight)+"px;left:"+rand(parentStyle.offsetLeft, parentStyle.offsetWidth)+"px";
}

Box.prototype._onSelect = function(){
	if(Box.currentElement){
		Box.currentElement.style.outline="";
	}
	Box.currentElement = this.element;
	this.element.style.outline="3px solid black";
}

Box.prototype.updateColor = function(){
	this.element.style.background='rgb('+this.r+', '+this.g+', '+this.b+')';
}

Box.prototype.setPosition = function(parent){
	this.element.style.position = "absolute";
	this.element.style.top = rand(parent.offsetTop, parent.offsetHeight-this.element.offsetHeight)+"px";
	this.element.style.left = rand(parent.offsetLeft, parent.offsetWidth-this.element.offsetWidth)+"px";
	this.animate();
}

Box.prototype.animate = function(){
	var endR = this.r, endG = this.g, endB = this.b;
	var stepR = (255-this.r)/2000;
	var stepG = (255-this.g)/2000;
	var stepB = (255-this.b)/2000;
	var self = this, start;
	
	function tick(timestamp){
		if(!start) start = timestamp;
		var elapsed = timestamp - start;
		self.r = Math.round(Math.max(255-stepR*elapsed, endR));
		self.g = Math.round(Math.max(255-stepG*elapsed, endG));
		self.b = Math.round(Math.max(255-stepB*elapsed, endB));
		self.updateColor();
		if(self.r>endR||self.g>endG||self.b>endB){
			window.requestAnimationFrame(tick);
		}
	}
	window.requestAnimationFrame(tick);
}

Box.prototype._onDragStart = function(e) {
	this._startEventX = e.pageX;
	this._startEventY = e.pageY;
	this._startLeft = parseInt(this.element.style.left); 
	this._startTop = parseInt(this.element.style.top);
			this.element.classList.add("square");

	document.addEventListener("mousemove", this.onMouseMove);
	document.addEventListener("mouseup", this.onMouseUp);
};

Box.prototype._onMouseMove = function(e){
	var diffX = e.pageX - this._startEventX;
	var diffY = e.pageY - this._startEventY;
	this.element.style.left = this._startLeft + diffX + "px";
	this.element.style.top = this._startTop + diffY + "px";
};

Box.prototype._onMouseUp = function(){
	console.log(this._onMouseMove.bind(this));
	document.removeEventListener("mousemove", this.onMouseMove);
	document.removeEventListener("mousemove", this.onMouseUp);
};


function rand(max, min){
	return Math.round((Math.random()*(max-min))+min);
}