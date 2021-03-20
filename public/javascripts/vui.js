(function( $ ) {
$.fn.popup = function(options) {
var opts = $.extend({}, $.fn.popup.defaults, options);
$(this).click(function(){
switch(opts.type){
case "open":
var target = $(this).data("target");
console.log(target);
switch(target){
case "search":
var elem = $('[data-popup="'+target+'"]');
$(".vui.popupBack").css("display","block");
$(".vui.popupBack").data("target",target);
elem.fadeIn("fast");
break;
default:
var _top = $(this).offset().top;
var _top = _top+55;
var elem = $('[data-popup="'+target+'"]');
elem.css("top",_top);
$(".vui.popupBack").css("display","block");
$(".vui.popupBack").data("target",target);
elem.fadeIn("fast");
break;
}
break;
case "close":
var target = $(this).data("target");
var elem = $('[data-popup="'+target+'"]');
elem.fadeOut("fast");
$(".vui.popupBack").css("display","none");
break;
}
});
};
$.fn.menu = function(options) {
var opts = $.extend({}, $.fn.menu.defaults, options);
$(this).click(function(){
switch(opts.type){
case "open":
$(opts.elem1).css("display","block");
$(opts.elem2).animate({right:"+="+opts.left},"fast");
break;
case "close":
$(opts.elem1).css("display","none");
$(opts.elem2).animate({right:"-="+opts.left},"fast");
break;
case "home":
location.href=opts.url;
break;
case "refresh":
location.reload();
break;
case "back":
history.back();
break;
}
});
};
$.fn.search = function(options) {
var opts = $.extend({}, $.fn.menu.defaults, options);
$(this).keypress(function(e){
if(e.which == 13) {
var query = $(this).val();
location.href=opts.endpoint+"?q="+query;
return false;
}
});
};
$.fn.age = function() {
$(this).click(function(){
$.cookie("age_check", "true", { expires: 1 });
location.reload();
});
};
$.fn.popup.defaults = {
type:"open"
};
$.fn.menu.defaults = {
type:"open",
left:251,
elem1:".vui.sidebarBack",
elem2:".vui.sidebar",
url:"#"
};
}( jQuery ));
