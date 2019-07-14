$(window).on('load', function() {
     $(window).css("overflow","hidden");
     $('.preloader').fadeOut('slow', function(){
          $(window).css("overflow","auto");
     });
});
