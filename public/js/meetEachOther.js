$(function (){
  $(window).scroll(function (){

    var top = $(document).scrollTop();
    if (top > 500) {
      $('#topcontrol').addClass('backToTop');
    } else {
      $('#topcontrol').removeClass('backToTop');
    }
  });
});
