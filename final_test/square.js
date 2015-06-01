var shape = shape || {};
shape.Square = shape.Square || {};
count = 0;


shape.Square = function() {
	this.element = document.createElement("div");
	this.onMouseMove = this._onMouseMove.bind(this);
	this.onMouseUp = this._onMouseUp.bind(this);
}

shape.Square.prototype.setPosition = function(left, top){
	this.x = left;
	this.y = top;
	this.element.style.top = top+"px";
	this.element.style.left = left+"px";	

	return this;
};

shape.Square.prototype.startDragging = function(e){
	if(document.querySelector(".dragging")){
		return;
	}
	this._startEventX = e.pageX;
	this._startEventY = e.pageY;
	this._startLeft = parseInt(this.element.style.left); 
	this._startTop = parseInt(this.element.style.top);
	document.addEventListener("mousemove", this.onMouseMove);
	document.addEventListener("mouseup", this.onMouseUp);
	this.element.classList.add("square");
	this.element.classList.add("dragging");

	this.element.innerHTML = count++;
	//전역변수 제거해야한다. 이것도 잘 안되네요. 
	return this;
};

shape.Square.prototype._onMouseMove = function(e){
	var diffX = e.pageX - this._startEventX;
	var diffY = e.pageY - this._startEventY;
	this.x = this._startLeft + diffX;
	this.y = this._startTop + diffY;
	this.element.style.left = this.x + "px";
	this.element.style.top = this.y + "px";
};

shape.Square.prototype._onMouseUp = function(){
	var minX = this.container.offsetLeft;
	var minY = this.container.offsetTop;
	var maxX = this.container.offsetWidth - this.element.offsetWidth + this.container.offsetLeft;
	var maxY = this.container.offsetHeight - this.element.offsetHeight + this.container.offsetTop;
	if(this.x < maxX && this.x >minX && this.y < maxY && this.y > minY){
		document.removeEventListener("mousemove", this.onMouseMove);
		document.removeEventListener("mousemove", this.onMouseUp);
		this.animate();
	}
};

shape.Square.prototype.animate = function(){

	var startX = this.x;
	var endY = this.container.offsetHeight - this.element.offsetHeight + this.container.offsetTop;
	var stepY = 2;
	//200/1000 이되어야 하는 것 같은데 너무 느리네요.
	var self = this, start;

	function tick(){
		var newY = self.y+stepY;
		self.setPosition(startX, Math.min(newY, endY));
		if(newY<endY){
			window.requestAnimationFrame(tick);
		}else{
			self.element.classList.remove("dragging");
		}
	}
	window.requestAnimationFrame(tick);
}

//밑에 두 함수는 제대로 못 썼습니다.
shape.Square.prototype.setContainer = function(container){
	this.container = container;
	return this;
}

shape.Square.prototype.setParent = function(){
	this.parent = document.querySelector("#sidebar");
	this.parent.appendChild(this.element);
	return this;
}
