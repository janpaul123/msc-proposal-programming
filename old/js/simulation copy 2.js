$(function(){
	var points = 500;
	var dx = 1;
	var u = new Array(points);
	var speed = new Array(points);
	var canvas = document.getElementById('wave');
	var context = canvas.getContext('2d');
	
	var startx = 0;
	var starty = 200;
	
	var mousePos = { x: 0, y: 0 }, lastMousePos = mousePos;
	
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
		
		var tfactor = 4;
		var C = 0.05*tfactor;
		
		for (var j=0; j<dt*6; j+=tfactor) {
			var x = Math.round(inter(lastMousePos.x, mousePos.x, j/(dt*6)));
			var y = inter(lastMousePos.y, mousePos.y, j/(dt*6));
			u[x] = y;
			speed[x] = 0;
			
			for (var i=1; i<points-1; i++) {
				speed[i] += C*C*(u[i-1] - 2*u[i] + u[i+1]);
				speed[i] -= speed[i]/(4000/tfactor);
			}
			
			for (var i=1; i<points-1; i++) {
				u[i] += speed[i];
			}
			
			// quick cheat: add some 
			var oldu = u.slice(0);
			
			for (var i=1; i<points-1; i++) {
				u[i] = (0.2*oldu[i-1]+oldu[i]+0.2*oldu[i+1])/1.4;
			}
			
			u[x] = y;
			
			// open ends
			u[0] = u[1];
			u[points-1] = u[points-2];
		}
		
		lastMousePos = mousePos;
		window.setTimeout(update, 20);
	}
	
	canvas.addEventListener('mousemove', function(e) {
		mousePos = getMousePos(canvas, e);
		mousePos.y = starty - mousePos.y;
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
	
	var inter = function(a,b,t) {
		return a + (b-a)*t;
	}
	
	render();
	update();
});