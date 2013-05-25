var matchingGame = {};
matchingGame.deck = [
	'cardAK','cardAK',
	'cardAQ','cardAQ',
	'cardAJ','cardAJ',
	'cardBK','cardBK',
	'cardBQ','cardBQ',
	'cardBJ','cardBJ'
];
$(function(){
	
	function removeTookCards(){
		$('.card-removed').remove();
	}
	
	function isMatchPattern(){
		var cards = $('.card-fliped');
		var pattern = $(cards[0]).data('pattern');
		var anotherPattern = $(cards[1]).data('pattern');
		return (pattern == anotherPattern);
	}
	
	function checkPattern(){
		if(isMatchPattern()){
			$('.card-fliped').removeClass('card-fliped').addClass('card-removed');
			$('.card-removed').bind('webkitTransitionEnd',removeTookCards);
		}
		else{
			$('.card-fliped').removeClass('card-fliped');
		}
	}
	
	function selectCard(){
		if($('.card-fliped').size() > 1){
			return;
		}
		$(this).addClass('card-fliped');
		if($('.card-fliped').size() == 2){
			setTimeout(checkPattern,700);
		}
	}
	
	function shuffle(){
		return 0.5 - Math.random();
	}
	matchingGame.deck.sort(shuffle);
	for(var i = 0;i < 11;i++){
		$('.card:first-child').clone().appendTo('#cards');
	}
	
	$('#cards').children().each(function(index){
		$(this).css({
			left : ($(this).width() + 20) * (index % 4),
			top : ($(this).height() + 20) * Math.floor(index / 4)
		});
		
		var pattern = matchingGame.deck.pop();
		$(this).find('.back').addClass(pattern);
		$(this).attr('data-pattern',pattern);
		$(this).click(selectCard);
	});
	
	
});