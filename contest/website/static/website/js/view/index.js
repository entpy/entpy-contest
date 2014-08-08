// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

$(document).ready(function(){

	// validating svg image
	validate_document_img();

	// a bit of color
	// full_animation();

	// TODO: remove, debug only
	delay_page_scrolling();
});

function validate_document_img() {
	// function to use .svg or .png image (depending on browser support)

	// if (!Modernizr.svgasimg) {
		$(".check_image").each(function(index) {
			var old_src_path;
			var new_src_path;
			old_src_path = $(this).attr("src");
			new_src_path = old_src_path.replace(".svg", ".png");
			$(this).attr("src", new_src_path);
		});
	// }

	return true;
}

function animate_element(className, animationName, duration, delay, nIteration, callback) {
	// function to animate an element by class name

	$(className).addClass('animated');

	// animation details
	$(className).addClass(animationName);
	$(className).css('animation-duration', duration);
	$(className).css('animation-delay', delay);
	$(className).css('animation-iteration-count', nIteration);

	if (callback) {
		$(className).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
			callback();
		});
	}

	return true;
}

function full_animation() {
	// function to start animation of entpy universe

	animate_element(".logo1AnimationAction", "bounceInDown", "3s", "1s", "1");
	$(".logo1AnimationAction").removeClass("transparent");

	$(".logo1AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

		// adding body no_overflow_x class
		$("body").addClass("no_overflow_x");
		// $("html").addClass("no_overflow_x");

		// entpy logo tada
		$(".logo1AnimationAction").removeClass("bounceInDown");
		animate_element(".logo1AnimationAction", "tada", "2s", "1s", "1");

		$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

			// entpy logo out
			$(".logo1AnimationAction").removeClass("tada");
			animate_element(".logo1AnimationAction", "lightSpeedOut", "0.8s", "1s", "1");

			// scrolling universe to the city
			delay_page_scrolling();
		});
	});

	return true;
}

function delay_page_scrolling() {
	// function to scroll universe to the city (page bottom)

	// scrolling after a delay
	setTimeout("scrolling();", 3000);

	return true;
}

function scrolling() {
	// function to scrolling at page bottom...

	$.scrollTo('.scroll_to_bottom', 5500, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
			// ...at the end of bottom scrolling, return to logo pt2 animation
			$.scrollTo('.scroll_to_element1', 5000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
					animate_element(".logo2AnimationAction", "lightSpeedIn", "1s", "1s", "1");
					animate_element(".logoBottomTextAction", "shake", "1s", "1.2s", "1");
					/*$(".logo2AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

						// bottom logo text in
						animate_element(".logoBottomTextAction", "rubberBand", "2s", "0s", "1");

						$(".logoBottomTextAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
							// bottom logo text in animation end
						});
					});*/
				}
			});
		}
	});

	return true;
}

// TODO
function simple_animation() {

}
