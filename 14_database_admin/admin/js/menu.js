$(function(){
    var on = 'on';
    $('.hamburger').on("click",function(){
        
        if (on == 'on') {
            $('.nav-side').stop().animate({
                left:0
            },200);
            $('.container').css('backgroundColor','rgba(0,0,0,0.5)');
            $('.container-fiuld').hide();
            on = 'off';     
        }
        else {
            $('.nav-side').stop().animate({
                left: -210
            },200);
            $('.container').css('backgroundColor', '#fff');
            $('.container-fiuld').show();
            on = 'on';
        }
        $('.container').on('click', function () {
            $('.nav-side').stop().animate({
                left: -210
            },200);
            $('.container').css('backgroundColor', '#fff');
            $('.container-fiuld').show();
            on = 'on';
        });
    });

});