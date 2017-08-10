$(document).ready(function() {
    
   
     
   
    
     setTimeout(function () {
    $("<audio></audio>").attr({
    'src':'vendors/assets/sounds/intro.ogg',
    'volume':0.1,
    'loop': true,
    'autoplay':'autoplay'}).appendTo("body");
    $('.title').addClass('fadeInDown');
     },800);
    
    setTimeout(function () {
     $('.left-ship').addClass('fadeInUp'); 
    $('.right-ship').addClass('fadeInUp');
    },1500);
    
    setTimeout(function () {
    $('.play').addClass('flash');
    },2600);
    
    $('.play').click(function(e){
        e.preventDefault();
        
        $('.title').addClass('zoomOut');
        $('.play').addClass('zoomOut');
        $('.left-ship').addClass('fadeOutUp'); 
        $('.right-ship').addClass('fadeOutUp');
        
        setTimeout(function () {
       window.location.href = "play.html";
        },2000);
    });
});