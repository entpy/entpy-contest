// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

$(document).ready(function(){

	// validating svg image
	validate_document_img();

	// a bit of color
	// var ciakObj = ciakWrapper;
	// ciakObj.doAnimationEasy();

	// TODO: remove, debug only
	// delay_page_scrolling();
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

var ciakWrapper = {

	_animationType: false,

	animationTypeName : {
		none_animation : "noneAnimation",
		simple_animation : "simpleAnimation",
		advanced_animation : "advancedAnimation"
	},

	doAnimationEasy : function() {
		this.detectAnimationType();
		this.animate();
	},

	animateViaCssClass : function(className, animationName, duration, delay, nIteration, callback) {
		// method to animate an element by class name

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
	},

	detectAnimationType : function() {
		// method to recognise animation type (simple or advanced)
		// TODO
		// debug only
		this.setAnimationType(this.animationTypeName.advanced_animation);
	},

	setAnimationType : function(animationType) {
		if (animationType) {
			if (this.animationTypeName.none_animation == animationType) {
				this._animationType = this.animationTypeName.none_animation;
			} else if (this.animationTypeName.simple_animation == animationType) {
				this._animationType = this.animationTypeName.simple_animation;
			} else if (this.animationTypeName.advanced_animation == animationType) {
				this._animationType = this.animationTypeName.advanced_animation;
			}
		}
	},

	getAnimationType : function() {
		return this._animationType;
	},

	animate : function() {

		if (getAnimationType) {
			eval(getAnimationType +"()");
		}
	},

	// eval functions {{{
	noneAnimation : function() {
		console.log("implement this!");
	},

	simpleAnimation : function() {
		console.log("implement this!");
	},

	advancedAnimation : function() {
		// method to start an advanced animation

		this.animateViaCssClass(".logo1AnimationAction", "bounceInDown", "3s", "1s", "1");
		$(".logo1AnimationAction").removeClass("transparent");

		$(".logo1AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

			// adding body no_overflow_x class
			$("body").addClass("no_overflow_x");
			// $("html").addClass("no_overflow_x");

			// entpy logo tada
			$(".logo1AnimationAction").removeClass("bounceInDown");
			this.animateViaCssClass(".logo1AnimationAction", "tada", "2s", "1s", "1");

			$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

				// entpy logo out
				$(".logo1AnimationAction").removeClass("tada");
				this.animateViaCssClass(".logo1AnimationAction", "lightSpeedOut", "0.8s", "1s", "1");

				// scrolling universe to the city
				// delay_page_scrolling();
				var scrollingObj = scrollingWrapper;
				scrollingObj.doScrollingEasy(scrollingObj.scrolling1, 2000);
			});
		});

		return true;
	},
	// eval functions }}}
};

var scrollingWrapper = {

	_scrollType : false,

	scrollTypeName : {
		scrolling1 : "scrolling1",
		scrolling2 : "scrolling2"
	},

	scrollingDelay : false,

	doScrollingEasy : function(scrollingType, delay) {
		this.scrollingDelay = delay;
		this.setScrollType(scrollingType);
		this.scrollScene();
	},

	setScrollType : function(scrollName) {
		if (scrollName) {
			if (this.scrollTypeName.scrolling1 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling1;
			} else if (this.scrollTypeName.scrolling2 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling2;
			}
		}
	},

	getScrollType : function() { return this._scrollType },

	scrollScene : function() {
		if (this.getScrollType()) {
			// must be safe
			setTimeout('eval(this.getScrollType+"()");', this.scrollingDelay);
		}
	},

	// eval functions {{{
	scrolling1 : function() {
		// function to scroll at page bottom and than to entpy logo

		$.scrollTo('.scroll_to_bottom', 5500, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				// ...at the end of bottom scrolling, return to logo pt2 animation
				$.scrollTo('.scroll_to_element1', 5000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
						ciakWrapper.animate_element(".logo2AnimationAction", "lightSpeedIn", "1s", "1s", "1");
						ciakWrapper.animate_element(".logoBottomTextAction", "shake", "1s", "1.2s", "1");
					}
				});
			}
		});

		return true;
	},

	scrolling2 : function() {
		// function to scroll directly to entpy logo
		console.log("implement this!");
	}
	// eval functions }}}
};
