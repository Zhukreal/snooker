$(window).load(function() {
	$("#loading").delay(2000).fadeOut(500);
	$("#loading-center").click(function() {
	$("#loading").fadeOut(500);
	})
})


/*$("#loading").bind("ajaxSend", function(){
	$(this).show(); 
}).bind("ajaxComplete", function(){
	$(this).hide(); 
});
*/

