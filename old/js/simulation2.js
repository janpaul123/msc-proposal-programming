$(function(){
	var points = 500;
	var u = new Array(2);
	u[0] = new Array(points);
	u[1] = new Array(points);
	var current = 0;
	var speed = new Array(points);
	var canvas = document.getElementById('wave');
	var context = canvas.getContext('2d');
	
	var startx = 0;
	var starty = 200;
	
	var mousePos = { x: 0, y: 0 }, lastMousePos = mousePos;
	
	for (var i=0; i<points; i++) {
		//u[i] = Math.sin(i/8)*100;
		u[0][i] = 0;
		u[1][i] = 0;
		speed[i] = 0;
	}
	
	//u[0] = 20;
	
	var render = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		context.beginPath();
		context.moveTo(startx, starty-u[current][0]);
		for (var i=1; i<points; i++) {
			context.lineTo(startx + i, starty - u[current][i]);
		}
		context.stroke();
		window.setTimeout(render, 20);
	}
	
	var lastTime = (new Date()).getTime();
	var update = function() {
		var time = (new Date()).getTime();
		var measured_dt = time-lastTime;
		
		var sim_speed = 20;
		var total_dt = measured_dt*sim_speed;
		var mouse_dx = Math.abs(lastMousePos.x - mousePos.x);
		var dt = Math.min(5, 0.5*total_dt/mouse_dx);
		var C = 0.05*dt;
		
		var iterations = Math.floor(total_dt/dt);
		
		lastTime += iterations*dt/sim_speed;
		
		for (var j=0; j<iterations; j++) {
			var x = Math.round(inter(lastMousePos.x, mousePos.x, j/iterations));
			var y = inter(lastMousePos.y, mousePos.y, j/iterations);
			u[current][x] = y;
			speed[x] = 0;
			
			for (var i=1; i<points-1; i++) {
				speed[i] += C*C*(u[current][i-1] - 2*u[current][i] + u[current][i+1]);
				speed[i] -= speed[i]/(5000/dt);
				speed[i] = bounds(speed[i], -10, 10);
			}
			
			for (var i=1; i<points-1; i++) {
				u[current][i] += speed[i];
			}
			
			// quick cheat: add some smoothing
			//var oldu = u.slice(0);
			
			var smooth = 0.05;
			for (var i=1; i<points-1; i++) {
				u[1-current][i] = bounds((smooth*u[current][i-1]+u[current][i]+smooth*u[current][i+1])/(1+smooth*2), -1000, 1000);
			}
			
			current = 1-current;
			
			u[current][x] = y;
			speed[x] = 0;
			
			// open ends
			u[current][0] = u[current][1];
			u[current][points-1] = u[current][points-2];
		}
		
		lastMousePos = mousePos;
		window.setTimeout(update, 20);
		console.log((new Date()).getTime()-time);
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
	
	var bounds = function(x, low, high) {
		return Math.min(Math.max(x, low), high);
	}
	
	render();
	update();
});