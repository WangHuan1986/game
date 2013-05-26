$.ns('pingpang');


(function($,window){
	
	var key = pingpang.key = {
		UP : 38,
		DOWN : 40,
		W : 87,
		S : 83
	};
	
	var ball = pingpang.ball = {
		speed : 5,
		x : 150,
		y : 150,
		directionX : -1,
		directionY : 1
	};
	
	var game = {
		
		pressedKey : {},
		
		init : function(){
			this._setDefaultPosition();
			this._addEvent();
			this._gameLoop();
		},
		
		_gameLoop : function(){
			var that = this;
			setTimeout(function(){
				
				that._movePaddles();
				that._moveBall();
				setTimeout(arguments.callee,30);
			},30);
		},
		
		_moveBall : function(){
			
			var playground = $('#playground'),
				playgroundWidth =  playground.width(),
				playgroundHeight =  playground.height();
			
			var ball = pingpang.ball;
			
			if(ball.x + ball.speed * ball.directionX > playgroundWidth){
				ball.directionX = -1;
			}
			if(ball.x + ball.speed * ball.directionX < 0){
				ball.directionX = 1;
			}
			if(ball.y + ball.speed * ball.directionY > playgroundHeight){
				ball.directionY = -1;
			}
			if(ball.y + ball.speed * ball.directionY < 0){
				ball.directionY = 1;
			}
			ball.x += ball.speed * ball.directionX;
			ball.y += ball.speed * ball.directionY;
			
			this._collisionCheck();
			$('#ball').css({
				left : ball.x,
				right : ball.y
			});
		},
		
		_collisionCheck : function(){
		
			var paddleA = $('#paddleA'),
				paddleB = $('#paddleB');
				
			var paddleAX = parseInt(paddleA.css('left')) + paddleA.width(),
				paddleATop = parseInt(paddleA.css('top')),
				paddleABotton = paddleATop + paddleA.height();
				
			var paddleBX = parseInt(paddleB.css('left')),
				paddleBTop = parseInt(paddleB.css('top')),
				paddleBBotton = paddleBTop + paddleB.height();
			var nextX = ball.x + ball.speed * ball.directionX,
				nextY = ball.y + ball.speed * ball.directionY;
			
			if(nextX < paddleAX && (nextY >= paddleATop && nextY <= paddleABotton)){
				ball.directionX = 1;
			}
			if(nextX > paddleBX && (nextY >= paddleBTop && nextY <= paddleBBotton)){
				ball.directionX = -1;
			}
		},
		
		_movePaddles : function(){
			
			var pressedKey = this.pressedKey;
			var paddleA = $('#paddleA'),
				paddleB = $('#paddleB');
				
			if(pressedKey[key.W]){
				var top = parseInt(paddleA.css('top'));
				paddleA.css('top',top - 5);
			}
			if(pressedKey[key.S]){
				var top = parseInt(paddleA.css('top'));
				paddleA.css('top',top + 5);
			}
			if(pressedKey[key.UP]){
				var top = parseInt(paddleB.css('top'));
				paddleB.css('top',top - 5);
			}
			if(pressedKey[key.DOWN]){
				var top = parseInt(paddleB.css('top'));
				paddleB.css('top',top + 5);
			}
			
		},
		
		_addEvent : function(){
			
			var that = this;
			
			$(document).bind('keydown',function(e){
				that.pressedKey[e.which] = true;
			})
			.bind('keyup',function(e){
				that.pressedKey[e.which] = false;
			});
			
		},
		
		_setDefaultPosition :  function(){
		
			$('#paddleA').css({
				top : 20
			});
			
			$('#paddleB').css({
				top : 60
			});
		}
		
	};
	
	pingpang.game = game;
	
})(jQuery,window);

$(function(){
	pingpang.game.init();
});