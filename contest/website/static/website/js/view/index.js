// attach events after the DOM is ready
$(document).ready(function(){
	$(document).on("mouseenter", ".skipIntroAction", function() {
		// skip button hover animation
		animate_button(".skipIntroAction");
		return true;
	});

	$(document).on("click", ".skipIntroAction", function() {
		// skip button click action
		skip_animation();
		return true;
	});

	$(document).on("click", ".sendButtonClickAction", function() {
		// validate code submit button click
		var code_to_validate = $(".codeInputAction").val();
		submit_promo_code(code_to_validate);
		return false;
	});

	$(document).on("click", ".howItWorksAction", function() {
		// opening help box (with help code)
		submit_promo_code("help_code");
		return false;
	});

	$(document).on("click", ".sendInfoMailAction", function() {
		// sending info email to Entpy
		send_info_email();
		return false;
	});

	$(document).on("keyup", ".sendmailBodyAction", function() {
		// validating email content on keyup
		validate_sendmail_form(true, false);
		return false;
	});

	$(document).on("keyup", ".sendmailUserEmailAction", function() {
		// validating user email on keyup
		validate_sendmail_form(false, true);
		return false;
	});

	$(document).on("submit", ".helpMailFormAction", function() {
		// info email form submit
		$(".sendInfoMailAction").click();
		return false;
	});

	$(document).on("submit", ".validateCouponFormAction", function() {
		// sending code at return press
		$(".sendButtonClickAction").click();
		return false;
	});
});

// start animation when when DOM and all sub-elements have been completely loaded
$(window).load(function(){

	// adding svg test to modernizr
	modernizrAddSvgTest();

	// detecting placeholder support
	placeholder_support();

	// a bit of color
	var ciakObj = ciakWrapper; // ...wow, so beautiful
	ciakObj.preActions();
	ciakObj.doAnimationEasy();
});
