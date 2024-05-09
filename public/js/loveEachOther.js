$(function (){
  $(window).scroll(function (){

    var top = $(document).scrollTop();
    if (top > 800) {
      $('#topcontrol').addClass('backToTop');
    } else {
      $('#topcontrol').removeClass('backToTop');
    }
  });

});

