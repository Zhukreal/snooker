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


	$(document).ready(function() {
    $('#ball').plaxify({"xRange":40,"yRange":40})
    $('#plax-earth').plaxify({"xRange":20,"yRange":20,"invert":true})
    $('#plax-bg').plaxify({"xRange":10,"yRange":10,"invert":true})
    $.plax.enable()
});
