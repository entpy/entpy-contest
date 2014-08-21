// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

$(document).ready(function(){

	// validating svg image
	// validate_document_img();

	// a bit of color
	var ciakObj = ciakWrapper;
	ciakObj.preActions();
	ciakObj.doAnimationEasy();
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

	preActions : function() {
		// $(".form_container").css("visibility", "hidden");
		// $(".old_browser_container").remove();
	},

	postActions : function() {
		$(".code_input").focus();
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

		this.setAnimationType(this.animationTypeName.simple_animation);
		// this.setAnimationType(this.animationTypeName.advanced_animation);
		/*
			TODO
			Come decidere il tipo di animazione
			===================================

			lato server:
				se si arriva in questa pagina con il codice via GET (a seguito della lettura del QRCode)
				se si arriva in per la seconda volta
				----------
				inserire un tag HTML come questo 
					<div class="use_simple_animation">1</div> -> per forzare l'animazione semplice

			lato client:
				se il browser è obsoleto (e cioè??)
		*/
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

		if (this.getAnimationType()) {
			eval("this." + this.getAnimationType() +"()");
		}
	},

	showAdvancedForm : function() {
		// remove transparent class
		$(".new_browser_container .entpy_logo_image2").removeClass("transparent");
		$(".new_browser_container .form_container").removeClass("transparent");

		// add no-transparent class
		$(".new_browser_container .entpy_logo_image2").addClass("no-transparent");
		$(".new_browser_container .form_container").addClass("no-transparent");
	},

	// eval functions {{{
	noneAnimation : function() {
		console.log("implement this!");
	},

	simpleAnimation : function() {
		// method to start simple animation: scrolling universe to code form

		var scrollingObj = scrollingWrapper;
		scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling3, 500);
	},

	advancedAnimation : function() {
		// method to start advanced animation

		ciakWrapper.animateViaCssClass(".logo1AnimationAction", "bounceInDown", "3s", "1s", "1");
		$(".logo1AnimationAction").removeClass("transparent");

		$(".logo1AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

			// adding body no_overflow_x class
			$("body").addClass("no_overflow_x");
			// $("html").addClass("no_overflow_x");

			// entpy logo tada
			$(".logo1AnimationAction").removeClass("bounceInDown");
			ciakWrapper.animateViaCssClass(".logo1AnimationAction", "tada", "2s", "1s", "1");

			$(".logo1AnimationAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){

				// entpy logo out
				$(".logo1AnimationAction").removeClass("tada");
				ciakWrapper.animateViaCssClass(".logo1AnimationAction", "lightSpeedOut", "0.8s", "1s", "1");

				// scrolling universe to the city
				var scrollingObj = scrollingWrapper;
				scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling1, 2500);
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
		scrolling2 : "scrolling2",
		scrolling3 : "scrolling3"
	},

	scrollingDelay : false,

	doScrollingEasy : function(scrollName, delay) {
		this.scrollingDelay = delay;
		this.setScrollType(scrollName);
		this.scrollScene();
	},

	setScrollType : function(scrollName) {
		if (scrollName) {
			if (this.scrollTypeName.scrolling1 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling1;
			} else if (this.scrollTypeName.scrolling2 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling2;
			} else if (this.scrollTypeName.scrolling3 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling3;
			}
		}
	},

	getScrollType : function() { return this._scrollType; },

	scrollScene : function() {
		if (this.getScrollType()) {
			// scrolling delay
			setTimeout('scrollingWrapper.scrollDelay();', this.scrollingDelay);
		}
	},

	scrollDelay : function() { 
		// must be safe
		eval("this." + this.getScrollType() + "()");
		return true;
	},

	// eval functions {{{
	scrolling1 : function() {
		// function to scroll at page bottom and than to entpy logo

		$.scrollTo('.scroll_to_bottom', 5500, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				// ...at the end of bottom scrolling, return to logo pt2 animation
				var scrollingObj = scrollingWrapper;
				scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling2, 1000);
			}
		});

		return true;
	},

	scrolling2 : function() {
		// function to scroll directly to entpy logo
		$.scrollTo('.scroll_to_element1', 5000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				ciakWrapper.animateViaCssClass(".logoBottomTextAction", "fadeIn", "1.5s", "0s", "1");
				ciakWrapper.animateViaCssClass(".logo2AnimationAction", "lightSpeedIn", "1s", "2.8s", "1");
				ciakWrapper.animateViaCssClass(".form_container", "fadeIn", "3s", "4.5s", "1");

				// exec actions post animation
				ciakWrapper.postActions();
			}
		});
	},

	scrolling3 : function() {
		// function to scroll directly to entpy logo
		$.scrollTo('.scroll_to_element1', 2000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				/*$(".logoBottomTextAction").removeClass("transparent");
				$(".logo2AnimationAction").removeClass("transparent");
				$(".form_container").removeClass("transparent");*/
				ciakWrapper.animateViaCssClass(".logoBottomTextAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".logo2AnimationAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".form_container", "fadeIn", "1s", "0s", function(){ ciakWrapper.showAdvancedForm(); });

				// exec actions post animation
				ciakWrapper.postActions();
			}
		});
	}
	// eval functions }}}
};
