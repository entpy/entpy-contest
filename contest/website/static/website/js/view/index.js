// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

$(document).ready(function(){

	// validating svg image
	validate_document_img();

	// a bit of color
	animate_entpy_world();
});

function validate_document_img() {
	// function to use .svg or .png image (depending on browser support)

	if (!Modernizr.svgasimg) {
		$(".check_image").each(function(index) {
			var old_src_path;
			var new_src_path;
			old_src_path = $(this).attr("src");
			new_src_path = old_src_path.replace(".svg", ".png");
			$(this).attr("src", new_src_path);
		});
	}

	return true;
}

function animate_entpy_world() {
	// entpy logo bounceInDown
	$(".entpy_logo_image").addClass('animated bounceInDown');
	$(".entpy_logo_image").css('animation-duration', "3s");
	$(".entpy_logo_image").css('animation-delay', "1s");
	$(".entpy_logo_image").css('animation-iteration-count', "1");

	$(".entpy_logo_image").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
		// entpy logo tada
		$(this).removeClass("bounceInDown");
		$(this).addClass('tada');
		$(this).css('animation-duration', "2s");
		$(this).css('animation-delay', "1s");
		$(this).css('animation-iteration-count', "1");

		$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
			// entpy logo out
			$(this).removeClass("tada");
			$(this).addClass('lightSpeedOut');
			$(this).css('animation-duration', "1s");
			$(this).css('animation-delay', "1s");
			$(this).css('animation-iteration-count', "1");

			// scrolling universe to the city
			setTimeout(function() { page_scrolling(); }, 3000);
		});
	});

	return true;
}

function page_scrolling() {

	// scrolling universe to the city
	$.scrollTo('.scroll_to_element1', 5500, {easing:'easeOutBounce', onAfter:function(){ logo_swing_enter(); }});//specify an easing equation

	return true;
}

function logo_swing_enter() {
	// entpy logo swing in

	$(".entpy_logo_image_pt2").addClass('lightSpeedIn');
	$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
		// entpy logo out
		$(this).removeClass("lightSpeedIn");
		$(this).addClass('logo_container_after_animation');
	});

	return true;
}
