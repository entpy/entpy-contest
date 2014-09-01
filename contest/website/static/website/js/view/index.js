// adding Modernizr svgasimg method to check if an svg could be used inside img tag
Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));

$(document).ready(function(){

	// a bit of color
	var ciakObj = ciakWrapper;
	ciakObj.preActions();
	ciakObj.doAnimationEasy();

	var msgObj = msgWrapper;
	// msgObj.testMessage(); -> debug only
	// msgObj.showMessageEasy(msgObj.msgTypeList.errorMsg, "Error!", "Description");

	// msgObj.removeMessage();

	// skip button animation
	$(document).on("mouseenter", ".skipIntroAction", function() {
		var ciakObj = ciakWrapper;
		ciakObj.animateViaCssClass(".skipIntroAction", "tada", "1s", "0s", "1");

		$(".skipIntroAction").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(param){
			$(this).removeClass("animated tada");
		});
	});

	// skip button click action
	$(document).on("click", ".skipIntroAction", function() {
		disable_current_scroll_event();
		var scrollingObj = scrollingWrapper;
		scrollingObj.doScrollingEasy(scrollingObj.scrollTypeName.scrolling3, 500);
	});

	// validate code submit button click
	$(document).on("click", ".sendButtonClickAction", function() {

		var csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
		var code_to_validate = $(".codeInputAction").val();

		if (code_to_validate) {
			var ajaxCallData = {
				url : "/validate-code/",
				data : "code_to_validate=" + code_to_validate + "&csrfmiddlewaretoken=" + csrfmiddlewaretoken,
				async : false,
				success : function(result) {
					// console.log(result);
					// function to manage JSON response
					manage_json_response(result);
				},
				error : function(result) {
					// ...fuck
				}
			}

			loadDataWrapper.getGenericDataViaAjaxCall(ajaxCallData);
		}

		return false;
	});
});

function manage_json_response(json) {
	// function to manage a JSON response
	
	var returnVar = false;

	if (json) {
		// retrieving message type name
		msg_type = map_code_type_to_message(json.code_type);

		// showing message
		var msgWrapperObj = msgWrapper;
		msgWrapperObj.showMessageEasy(msg_type, json.code_type_description, json.content, build_expiring_in_string(json.expiring_in_days));
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
			returnVar = msgWrapperObj.successMsg;
		}

		if (code_type == "error_code") {
			returnVar = msgWrapperObj.errorMsg;
		}

		if (code_type == "alert_code") {
			returnVar = msgWrapperObj.alertMsg;
		}

		if (code_type == "tip_code") {
			returnVar = msgWrapperObj.tipMsg;
		}
	}

	return returnVar;
}

function disable_current_scroll_event() {
	$(".skipAnimationAction").html("1");
	$.scrollTo.window().stop(true);
}

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
			this.useSvgInstead();
		}

		if (this.animationTypeName[this.getAnimationFromHtml()] == this.animationTypeName.advanced_animation) {
			// add skip button
			$(".skipIntroAction").removeClass("display_none");
		}

		// check code via GET to auto fill code form
		if ($(".code_to_check").html()) {
			$(".codeInputAction").val($(".code_to_check").html());
		}
	},

	postActions : function() {
		if (this.animationTypeName[this.getAnimationFromHtml()] == this.animationTypeName.advanced_animation) {
			// remove skip button
			$(".skipIntroAction").addClass("display_none");
		}

		// check code via GET to light up validate coupon button (...mah...)
		/* if ($(".code_to_check").html()) {
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

		/*$(".check_image").each(function(index) {
			var old_src_path;
			var new_src_path;
			old_src_path = $(this).attr("src");
			new_src_path = old_src_path.replace(".png", ".svg");
			$(this).attr("src", new_src_path);
		});*/
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
		// method to write code form inside old browser tag, without animations
		$(".old_browser_container").html($(".new_browser_container").html());
		$(".new_browser_container").addClass("display_none");

		// remove transparent class
		$(".old_browser_container .entpy_logo_image2").removeClass("transparent");
		$(".old_browser_container .form_container").removeClass("transparent");
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
		// function to scroll directly to entpy logo
		$.scrollTo('.scroll_to_element1', 2000, { axis:'y', easing : 'easeInOutQuart', onAfter : function(){
				/*$(".logoBottomTextAction").removeClass("transparent");
				$(".logo2AnimationAction").removeClass("transparent");
				$(".form_container").removeClass("transparent");*/
				ciakWrapper.animateViaCssClass(".logoBottomTextAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".logo2AnimationAction", "fadeIn", "1s", "0s", "1");
				ciakWrapper.animateViaCssClass(".form_container", "fadeIn", "3s", "0s", setTimeout("ciakWrapper.showAdvancedForm();", 3000));

				// exec actions post animation
				ciakWrapper.postActions();
			}
		});
	}
};

var msgWrapper = {

	/* private vars {{{ */
	_msg_container_class : ".msgContainerAction",
	_msg_title_class : ".msgTitleAction",
	_msg_content_class : ".msgContentAction",
	_msg_extra_param_class : ".msgExtraParamAction",
	_msg_type : false,
	_msg_title : false,
	_msg_content : false,
	_msg_extra_param : false, 
	/* private vars }}} */

	// list of all message type availables
	// plz after adding a new type see "map_code_type_to_message" function
	msgTypeList : {
		successMsg : "success",
		errorMsg : "error",
		alertMsg : "alert",
		tipMsg : "tip",
	},

	/* private get/set methods {{{ */
	setMsgType : function(val) {
		this._msg_type = val;
	},

	setMsgTitle : function(val) {
		this._msg_title = val;
	},

	setMsgContent : function(val) {
		this._msg_content = val;
	},

	setMsgExtraParam : function(val) {
		this._msg_extra_param = val;
	},

	getMsgType : function() {
		return this._msg_type;
	},

	getMsgTitle : function() {
		return this._msg_title;
	},

	getMsgContent : function() {
		return this._msg_content;
	},

	getMsgExtraParam : function(val) {
		this._msg_extra_param;
	},
	/* private get/set methods }}} */

	removeTypeClass : function() {
		// method to remove all type class from message container

		$(this._msg_container_class).removeClass("success");
		$(this._msg_container_class).removeClass("error");
		$(this._msg_container_class).removeClass("alert");
		$(this._msg_container_class).removeClass("tip");
	},

	removeMessage : function() {
		// method to remove message and clean HTML

		this.removeTypeClass();
		this.setMsgType("");
		this.setMsgTitle("");
		this.setMsgContent("");
		this.setMsgExtraParam("");
		this.showMessage();
	},

	showMessage : function() {
		// method to show a loaded message into "this"

		this.removeTypeClass();
		$(this._msg_container_class).addClass(this.getMsgType());
		$(this._msg_title_class).html(this.getMsgTitle());
		$(this._msg_content_class).html(this.getMsgContent());
		$(this._msg_extra_param_class).html(this.getMsgExtraParam());
	},

	testMessage : function() {
		// method to print a test message

		this.setMsgType(this.msgTypeList.tipMsg);
		this.setMsgTitle("Test title");
		this.setMsgContent("Test description");
		this.setMsgExtraParam("Test extra param");
		this.showMessage();
	},

	showMessageEasy : function(msgType, msgTitle, msgDescription, msgExtraParam) {
		// method to show a custom message

		// this must be a valid name: (success | error | alert | tip)
		if (msgType) {
			this.setMsgType(msgType);
		}

		this.setMsgTitle(msgTitle);
		this.setMsgContent(msgDescription);
		this.setMsgExtraParam(msgExtraParam);
		this.showMessage();
	}
};
