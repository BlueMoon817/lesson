$(function(){
	$('body').scroll(function(){
		if ($('body').scrollTop() > 350) {
			$('.top').fadeIn(100);
		} else {
			$('.top').fadeOut(200);
		};
	});
	$('.top').on('click',function(){
		$('body').animate({
			'scrollTop':0
		},300);
	});

});

$(window).on("load resize", function (e) {

	if ($(window).width() <= 768){
		if ($('header').find('.ham').text() != '메뉴'){
			$('header').append('<a class="ham" href="#none" style="color:rgba(0,0,0,0);">메뉴</a>');
		};
		// $('.sub-gnb-box').hide();
		$('.gnb > li > a').on('click', function (e) {
			var idx = $(this).parent('li').index();
			if (idx != 2 && idx != 3) {
				
				e.preventDefault();
				$(this).parent('li').addClass('on').siblings('li').removeClass('on');
			};
		});
		$('.ham').on('click', function () {
			$(this).toggleClass('on');
			$('nav').toggle();
		});
	}
	if ($(window).width() > 768){
		$('.ham, .ham.on').remove();
	};
		
});