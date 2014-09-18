/**
 * 	Author: Ivan Torchio <i.torchio at entpy dot com>
 * 	Version: 0.1.0
 *
 * 	License: GPL_v3 {Link: http://gplv3.fsf.org/}
 *
 *	Permission is hereby granted, free of charge, to any person obtaining
 *	a copy of this software and associated documentation files (the
 *	"Software"), to deal in the Software without restriction, including
 *	without limitation the rights to use, copy, modify, merge, publish,
 *	distribute, sublicense, and/or sell copies of the Software, and to
 *	permit persons to whom the Software is furnished to do so, subject to
 *	the following conditions:
 *
 *	The above copyright notice and this permission notice shall be
 *	included in all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *	- common js functions used in this project
 *  	- require jquery
 */

// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

function placeholder_support() {
	// adding placeholder support to old browser

	Modernizr.load({
		test: Modernizr.input.placeholder,
		nope: ['/static/website/js/jquery.placeholder.js'],
		complete: function(){
			if (!Modernizr.input.placeholder) {
				// console.log("added placeholder support");
				$('input').placeholder();
				$('textarea').placeholder();
			}
		}
	});

	return true;
}

function animate_button(elementToAnimate) {
	// function to animate a button

	if (elementToAnimate) {
		var ciakObj = ciakWrapper;
		ciakObj.animateViaCssClass(elementToAnimate, "tada", "1s", "0s", "1");

		$(elementToAnimate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
			$(elementToAnimate).removeClass("animated tada");
		});
	}

	return true;
}

function skip_animation() {
	// function to skip entpy animation

	disable_current_scroll_event();
	var scrollingObj = scrollingWrapper;
	scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling3, 500);

	return true;
}

function submit_promo_code(code_to_validate) {
	// function to send a promo code

	// reading csrfmiddlewaretoken from cookie
	var csrftoken = $.cookie('csrftoken');
	// var csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();

	if (code_to_validate) {
		var ajaxCallData = {
			url : "/validate-code/",
			data : "code_to_validate=" + code_to_validate,
			async : false,
			headers: { "X-CSRFToken": csrftoken },
			success : function(result) {
				// console.log(result);
				// function to manage JSON response
				manage_json_response(result);
			},
			error : function(result) {
				// ...fuck
				// console.log(result);
			}
		}

		// performing ajax call
		loadDataWrapper.getGenericDataViaAjaxCall(ajaxCallData);
	}

	return true;
}

function send_info_email() {
	// function to send an info email to Entpy

	// reading csrfmiddlewaretoken from cookie
	var csrftoken = $.cookie('csrftoken');

	// var csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();

	var user_email = $(".sendmailUserEmailAction").val();
	var email_content = $(".sendmailBodyAction").val();
	var code = $(".sendmailValidCodeAction").val();

	// validate sendmail form data
	validate_sendmail_form(true, true, true);

	if (user_email && email_content) {

		// creating array with data
		var arrAjaxParam = Array();
		arrAjaxParam = {
			"user_email" : user_email,
			"email_content" : email_content,
			"promo_code" : code
		};
		var ajaxCallParam = JSON.stringify(arrAjaxParam);

		var ajaxCallData = {
			url : "/send-info-email/",
			data : "call_data=" + ajaxCallParam,
			async : false,
			headers: { "X-CSRFToken": csrftoken },
			success : function(result) {
				console.log(result);
				// show success/error message
				manage_json_info_email_response(result);
			},
			error : function(result) {
				// ...fuck
			}
		}

		// performing ajax call
		loadDataWrapper.getGenericDataViaAjaxCall(ajaxCallData);
	}

	return true;
}

function validate_sendmail_form(validate_content, validate_email, show_alert) {
	// function to validate send email form data

	var returnVar = true;
	var sendmail_body_valid = false;
	var sendmail_email_valid = false;

	var sendmail_body = $(".sendmailBodyAction").val();
	var sendmail_email = $(".sendmailUserEmailAction").val();

	if (validate_content) {
		if (!sendmail_body) {
			returnVar = false;
			$(".sendmailBodyAction").addClass("email_form_input_error");
		} else {
			$(".sendmailBodyAction").removeClass("email_form_input_error");
			sendmail_body_valid = true;
		}
	}

	if (validate_email) {
		if (!sendmail_email) {
			sendmail_email = false;
			$(".sendmailUserEmailAction").addClass("email_form_input_error");
		} else {
			$(".sendmailUserEmailAction").removeClass("email_form_input_error");
			sendmail_email_valid = true;
		}
	}

	if (!sendmail_body_valid || !sendmail_email_valid) {
		if (show_alert) {
			alert("Inserisci un messaggio e la tua email");
		}
	}

	return returnVar;
}

function manage_json_info_email_response(json) {
	// function to manage a JSON info email response

	var returnVar = false;

	if (json) {
		if (json.return_status == "success") {
			alert("Grazie, una risposta ti arriverà a breve!");
			returnVar = true;
		}
	}

	return returnVar;
}

function manage_json_response(json) {
	// function to manage a JSON response

	var returnVar = false;

	if (json) {
		// retrieving message type name
		msg_type = map_code_type_to_message(json.code_type);

		// showing message
		var msgWrapperObj = msgWrapper;
		msgWrapperObj.showMessageEasy(msg_type, json.code_type_description, json.content, build_expiring_in_string(json.expiring_in_days), build_contact_us_link(msg_type));

		// copy code inside valid code block
		copy_validated_code(json.code);
		returnVar = true;

		// scrolling to message box
		var scrollingObj = scrollingWrapper;
		scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling4, 0);
	}

	return returnVar;
}

function copy_validated_code(validCouponCode) {
	// function to copy a valid code inside valid code block

	var returnVar = false;

	if (validCouponCode) {

		// copy valid code
		$(".sendmailValidCodeAction").val(validCouponCode)

		returnVar = true;
	}

	return returnVar;
}

function build_contact_us_link(msgType) {
	// function to create a contact us link

	var returnVar = false;

	if (msgType) {
		if (msgType == "success") {
			returnVar = 'Dubbi o domande? Entpy ha la risposta, contattaci adesso.';
		} else if (msgType == "error") {
			returnVar = 'Evita la coda! Contattaci prima di qualcun\'altro.';
		} else if (msgType == "alert") {
			returnVar = 'Vuoi sapere come utilizzare il coupon? Contattaci!';
		} else if (msgType == "tip") {
			returnVar = 'Evita la coda! Contattaci prima di qualcun\'altro.';
		}
	}

	return returnVar;
}

function build_expiring_in_string(days) {
	// function to build an expiring in string

	var returnVar = "";

	if (days === 0) {
		returnVar = "Affrettati, l'offerta scade OGGI";
	}

	if (days === 1) {
		returnVar = "L'offerta scade domani";
	}

	if (days > 1) {
		returnVar = "L'offerta scade tra " + days + " giorni";
	}

	return returnVar;
}

function map_code_type_to_message(code_type) {
	// function to map promotion type name to msg type class name

	var returnVar = false;

	if (code_type) {
		msgWrapperObj = msgWrapper;

		if (code_type == "success_code") {
			returnVar = msgWrapperObj.msgTypeList.successMsg;
		}

		if (code_type == "error_code") {
			returnVar = msgWrapperObj.msgTypeList.errorMsg;
		}

		if (code_type == "alert_code") {
			returnVar = msgWrapperObj.msgTypeList.alertMsg;
		}

		if (code_type == "tip_code") {
			returnVar = msgWrapperObj.msgTypeList.tipMsg;
		}
	}

	return returnVar;
}

function disable_current_scroll_event() {
	// Function to disable current scroll event

	$(".skipAnimationAction").html("1");
	$.scrollTo.window().stop(true);

	return true;
}

// Wrapper to manage animation and other funny stuff {{{
var ciakWrapper = {

	_animationType: false,
	_browserType: false,

	animationTypeName : {
		none_animation : "noneAnimation",
		simple_animation : "simpleAnimation",
		advanced_animation : "advancedAnimation"
	},

	browserTypeName : {
		simple_browser : "simple_browser",
		advanced_browser : "advanced_browser"
	},

	doAnimationEasy : function() {
		this.detectAnimationType();
		this.animate();
	},

	preActions : function() {

		// browser type init
		this.initBrowserType();

		if (this.getBrowserType() == this.browserTypeName.advanced_browser) {
			// use svg instead png
			// this.useSvgInstead();
		}

		if (this.animationTypeName[this.getAnimationFromHtml()] == this.animationTypeName.advanced_animation) {
			// add skip button
			$(".skipIntroAction").removeClass("display_none");
		}

		// check code via GET to auto fill code form
		if ($(".codeToCheckAction").html()) {
			$(".codeInputAction").val($(".codeToCheckAction").html());
		}
	},

	postActions : function() {
		if (this.animationTypeName[this.getAnimationFromHtml()] == this.animationTypeName.advanced_animation) {
			// remove skip button
			$(".skipIntroAction").addClass("display_none");
		}

		// check code via GET to light up validate coupon button (...mah...)
		/* if ($(".codeToCheckAction").html()) {
			setTimeout('$(".sendButtonClickAction").click();', 1500);
		}*/
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

	getAnimationFromHtml : function() {
		// method to retrieve animation type from HTML

		return $(".animationTypeAction").html();
	},

	detectAnimationType : function() {
		// method to recognise animation type (none, simple or advanced)

		// this.setAnimationType(this.animationTypeName.simple_animation);
		animation_type = this.getAnimationFromHtml();

		if (this.animationTypeName[animation_type]) {
			this.setAnimationType(this.animationTypeName[animation_type]);
		}
	},

	setBrowserType : function(browserType) {
		// method to set browser type inside object

		this._browserType = browserType;
	},

	getBrowserType : function() {
		// method to get browser type

		return this._browserType;
	},

	getBrowserTypeFromHtml : function() {
		// method to get browser type from html

		return $(".browserTypeAction").html();
	},

	initBrowserType : function() {
		// method to set browser type

		// retrieving browser type from HTML
		browserTypeFromHtml = this.getBrowserTypeFromHtml();

		// setting browser type inside object
		this.setBrowserType(browserTypeFromHtml);
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

	useSvgInstead : function() {
		// method to use svg images instead png images

		$(".check_image").each(function(index) {
			var old_src_path;
			var new_src_path;
			old_src_path = $(this).attr("src");
			new_src_path = old_src_path.replace(".png", ".svg");
			$(this).attr("src", new_src_path);
		});
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
		// showing form without animation

		this.showAdvancedForm();

		// method to write code form inside old browser tag, without animations
		$(".old_browser_container").html($(".new_browser_container").html());
		$(".new_browser_container").addClass("display_none");
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
// Wrapper to manage animation and other funny stuff }}}

// Wrapper to manage scrolling and other funny stuff {{{
var scrollingWrapper = {

	_scrollType : false,

	scrollTypeName : {
		scrolling1 : "scrolling1",
		scrolling2 : "scrolling2",
		scrolling3 : "scrolling3",
		scrolling4 : "scrolling4"
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
			} else if (this.scrollTypeName.scrolling4 == scrollName) {
				this._scrollType = this.scrollTypeName.scrolling4;
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

		if (!$(".skipAnimationAction").html()) {
			$.scrollTo('.scroll_to_bottom', 5500, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
					// ...at the end of bottom scrolling, return to logo pt2 animation
					var scrollingObj = scrollingWrapper;
					scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling2, 1000);
				}
			});
		}

		return true;
	},

	scrolling2 : function() {
		// function to scroll directly to entpy logo

		if (!$(".skipAnimationAction").html()) {
			$.scrollTo('.scroll_to_element1', 5000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
					ciakWrapper.animateViaCssClass(".logoBottomTextAction", "fadeIn", "1.5s", "0s", "1");
					ciakWrapper.animateViaCssClass(".logo2AnimationAction", "lightSpeedIn", "1s", "2.8s", "1");
					ciakWrapper.animateViaCssClass(".form_container", "fadeIn", "3s", "4.5s", "1");

					// exec actions post animation
					ciakWrapper.postActions();
				}
			});
		}

		return true;
	},

	scrolling3 : function() {
		// function to scroll directly to entpy logo (like "this.scrolling2()" function)
		$.scrollTo('.scroll_to_element1', 2000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				ciakWrapper.animateViaCssClass(".logoBottomTextAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".logo2AnimationAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".form_container", "fadeIn", "3s", "0s", setTimeout("ciakWrapper.showAdvancedForm();", 3000));

				// exec actions post animation
				ciakWrapper.postActions();
			}
		});
	},

	scrolling4 : function() {
		// function to scroll directly to entpy logo
		$.scrollTo('.msgContainerAction', 2000, { offset: -10, axis:'y', easing : 'easeInOutQuart', onAfter : function(){} });
	}
	// eval functions }}}
};
// Wrapper to manage scrolling and other funny stuff }}}
