$(function(){
	var points = 600;
	var dx = 1;
	var u = new Array(points);
	var speed = new Array(points);
	var canvas = document.getElementById('wave');
	var context = canvas.getContext('2d');
	
	var startx = 0;
	var starty = 150;
	var maxAmp = 100;
	
	var mousePos = 0;
	
	for (var i=0; i<points; i++) {
		//u[i] = Math.sin(i/8)*100;
		u[i] = 0;
		speed[i] = 0;
	}
	
	//u[0] = 20;
	
	var render = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		context.beginPath();
		context.moveTo(startx, starty-u[0]);
		for (var i=1; i<points; i++) {
			context.lineTo(startx + i*dx, starty - u[i]);
		}
		//for (var i=1; i<200; i++) {
		//	context.lineTo(startx + i*3, starty - (u[i*3-2]+u[i*3-1]+u[i*3])/3);
		//}
		context.stroke();
		window.setTimeout(render, 20);
	}
	
	var lastTime = (new Date()).getTime();
	var update = function() {
		var time = (new Date()).getTime();
		var dt = time-lastTime;
		lastTime = time;
		
		var newu0 = Math.sin(time/80)*50;
		//var newu0 = mousePos;
		
		var dU0 = (newu0-u[0])/(dt*6);
		
		for (var j=0; j<dt*6; j++) {
			u[0] += dU0;
			
			for (var i=1; i<points-1; i++) {
				speed[i] += 0.1*(1*u[i-1] - 2*u[i] + 1*u[i+1]);
				speed[i] -= speed[i]/2000;
			}
			
			for (var i=1; i<points-1; i++) {
				u[i] += 0.2*speed[i];
			}
			
			// quick cheat: add some 
			var oldu = u.slice(0);
			
			for (var i=1; i<points-1; i++) {
				u[i] = (0.1*oldu[i-1]+oldu[i]+0.1*oldu[i+1])/1.2;
			}
		}
		
		window.setTimeout(update, 20);
	}
	
	canvas.addEventListener('mousemove', function(e) {
		mousePos = starty-getMousePos(canvas, e).y;
	}, false);
	
	var getMousePos = function(canvas, evt){
		// get canvas position
		var obj = canvas;
		var top = 0;
		var left = 0;
		while (obj.tagName != 'BODY') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		
		// return relative mouse position
		var mouseX = evt.clientX - left + window.pageXOffset;
		var mouseY = evt.clientY - top + window.pageYOffset;
		
		return {
			x: mouseX,
			y: mouseY
		};
	}
	
	render();
	update();
});