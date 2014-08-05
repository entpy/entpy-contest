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

function animate_entpy_world() {
	// function to start animation of entpy universe

	animate_element(".logo1AnimationAction", "bounceInDown", "3s", "1s", "1");

	$(".logo1AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

		// adding body no_overflow_x class
		$("body").addClass("no_overflow_x");

		// entpy logo tada
		$(".logo1AnimationAction").removeClass("bounceInDown");
		animate_element(".logo1AnimationAction", "tada", "2s", "1s", "1");

		$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

			// entpy logo out
			$(".logo1AnimationAction").removeClass("tada");
			animate_element(".logo1AnimationAction", "lightSpeedOut", "1s", "1s", "1");

			// scrolling universe to the city
			setTimeout(function() { page_scrolling(); }, 3000);
		});
	});

	return true;
}

function page_scrolling() {
	// function to scroll universe to the city (page bottom)

	$.scrollTo('.scroll_to_element1', 5500, { easing : 'easeOutBounce', onAfter : function(){
			animate_element(".logo2AnimationAction", "lightSpeedIn", "1s", "1s", "1");

				$(".logo2AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

					// bottom logo text in
					animate_element(".logoBottomTextAction", "zoomInDown", "2s", "1s", "1");

					$(".logoBottomTextAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
						// bottom logo text in animation end
					});
				});
			}
		} );

	return true;
}
