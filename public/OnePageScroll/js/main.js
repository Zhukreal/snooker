$(function(){

	$('.main').onepage_scroll();

});
var svg = new Walkway({
  selector: 'svg',
  duration: '4000',
  // can pass in a function or a string like 'easeOutQuint'
  easing: function (t) {
    return t * t;
  }
});

svg.draw();
