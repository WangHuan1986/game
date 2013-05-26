$.ns('game.untangle');

(function($){
	
	var Circle = function(options){
		
		$.extend(this,{
			
		},options || {});
	};
	
	var Line = function(options){
		
		$.extend(this,{
			
		},options || {});
	};
	
	var untangle = {
		
		circles : [],
		
		lines : [],
		
		targetCircleIndex : undefined,
		
		thinLineWidth : 1,
		boldLineWidth : 5,
		
		init : function(){
			this.drawRadomCircle(5,10);
			this.linkCircles();
			this._addEvent();
			this._gameLoop();
		},
		
		_gameLoop : function(){
			var that = this;
			var canvas = $('#game');
			var ctx = canvas[0].getContext('2d');
			setTimeout(function(){
				that.clear(canvas[0]);
				that.drawAllCircles();
				that.linkCircles();
				setTimeout(arguments.callee,30);
			},30);
		},
		
		_addEvent : function(){
			
			var that = this,	
				circles = that.circles;
			$('#game').bind('mousedown',function(e){
				var canvasPos = $(this).offset();
				var mouseX = (e.pageX - canvasPos.left) || 0;
				var mouseY = (e.pageY - canvasPos.top) || 0;
				for(var i = 0;i < that.circles.length;i++){
					var circleX = circles[i].x,
						circleY = circles[i].y,
						radius = circles[i].radius;
					if(Math.pow(mouseX - circleX,2) + Math.pow(mouseY - circleY,2) < Math.pow(radius,2)){
						that.targetCircleIndex = i;
						break
					}
				}
			})
			.bind('mousemove',function(e){
				var targetCircleIndex = that.targetCircleIndex;
				if(targetCircleIndex !== undefined){
					var canvasPos = $(this).offset();
					var mouseX = (e.pageX - canvasPos.left) || 0;
					var mouseY = (e.pageY - canvasPos.top) || 0;
					var radius = circles[targetCircleIndex].radius;
					circles[targetCircleIndex] = new Circle({
						x: mouseX,
						y: mouseY,
						radius : radius
					});
				}
				
			})
			.bind('mouseup',function(e){
				that.targetCircleIndex = undefined;
			});
		},
		
		clear : function(canvas){
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0,0,canvas.width,canvas.height);
		},
		
		drawRadomCircle : function(num,radius){
			var canvas = $('#game');
			var ctx = canvas[0].getContext('2d');
			for(var i = 0;i < num;i++){
				var x = Math.random()*canvas[0].width;
				var y = Math.random()*canvas[0].height;
				this.drawCircle(ctx,x,y,radius);
				
				var circle = new Circle({
					x : x,
					y : y,
					radius : radius
				});
				
				this.circles.push(circle);
			}
	
		},
		
		drawAllCircles : function(){
			var canvas = $('#game');
			var ctx = canvas[0].getContext('2d'),
				circles = this.circles;
			for(var i = 0;i < circles.length;i++){
				var circle = circles[i];
				this.drawCircle(ctx,circle.x,circle.y,circle.radius);
			}
	
		},
		
		drawAllLines : function(){
			var canvas = $('#game');
			var ctx = canvas[0].getContext('2d'),
				lines = this.lines;
			for(var i = 0;i < lines.length;i++){
				var line = lines[i];
				this.drawLine(ctx,line.startPoint.x,line.startPoint.y,line.endPoint.x,line.endPoint.y,line.lineThickness);
			}
	
		},
		
		linkCircles : function(){
			
			var circles = this.circles,
				canvas = $('#game'),
				ctx = canvas[0].getContext('2d');
			
			this.lines = [];
			for(var i = 0;i < circles.length;i++){
				var startPoint = circles[i];
				for(var j = 0;j < i;j++){
					var endPoint = circles[j];
					//this.drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,this.thinLineWidth);
					var line = new Line({
						startPoint : startPoint,
						endPoint : endPoint,
						lineThickness : 1
					});
					this.lines.push(line);
				}
			}
			
			this.updateLine();
			
		},
		
		isInBetween : function(a,b,c){
			if(Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001){
				return false;
			}
			
			return (a < b && b < c) || (c < b && b < a);
		},
		
		isIntersect : function(line1,line2){
			var a1 = line1.endPoint.y - line1.startPoint.y,
				b1 = line1.startPoint.x - line1.endPoint.x,
				c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
				
			var a2 = line2.endPoint.y - line2.startPoint.y,
				b2 = line2.startPoint.x - line2.endPoint.x,
				c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
				
			var d = a1*b2 - a2*b1;
			if(d == 0){
				return false;
			}
			else{
				var x = (b2*c1 -b1*c2)/d,
					y = (a1*c2 -a2*c1)/d;
				
				if((this.isInBetween(line1.startPoint.x , x , line1.endPoint.x) || this.isInBetween(line1.startPoint.y , y , line1.endPoint.y))
					&& (this.isInBetween(line2.startPoint.x , x , line2.endPoint.x) || this.isInBetween(line2.startPoint.y , y , line2.endPoint.y))){
					return true;
				}
			}
			
			return false;
		},
		
		drawCircle : function(ctx,x,y,radius){
			ctx.fillStyle = "rgba(200,200,100,.6)";
			ctx.beginPath();
			ctx.arc(x,y,radius,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		},
		
		drawLine : function(ctx,x1,y1,x2,y2,thickness){
			ctx.beginPath();
			ctx.moveTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.lineWidth = thickness;
			ctx.strokeStyle = "#cfc";
			ctx.stroke();
		},
		
		updateLine : function(){
			var lines = this.lines;
			for(var i = 0;i < lines.length;i++){
				for(var j = 0;j < i;j++){
					var line1 = lines[i],
						line2 = lines[j];
					if(this.isIntersect(line1,line2)){
						line1.lineThickness = this.boldLineWidth;
						line2.lineThickness = this.boldLineWidth;
					}
				
				}
			}
			
			this.drawAllLines();
			
		}
		
	};
	
	game.untangle = untangle;

})(jQuery);

$(function(){
	game.untangle.init();
});