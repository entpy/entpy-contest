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
 *	-common js functions used in this project
 *  	-require jquery
 */

/*
	TODO list:
	- quando si inserisce un codice far luccicare il pulsante di invio
	- fix della posizione del pulsante "skip" nella versione smartphone
	- test su browser obsoleti e smartphone
	- preparare i vari codici
	- V inserire un pulsante "come funziona" che spedisca un codice info con gli step da fare
	- V gestire messaggi (email e contenuto email) mancanti
	- V gestire messaggio email inviata con successo
	- V spostare div con i messaggi dei codici sotto al pulsante invia
	- V al termine della validazione di un codice far scrollare la pagina nel box del messaggio, posto sotto al pulsante "valida codice"

/*

testo codice "HELP" {{{
Come funziona? (bella domanda)
1) Inserisci qui sotto il codice presente sul retro del volantino

2) Clicca su "Valida codice"

3) Attendi...

3) Attendi...

4) ...se stai ancora attendendo, qualcosa non ha funzionato...

5) Perfetto, hai scoperto cosa contiene il tuo codice!

6) Impressionato/a? Stupito/a? Meravigliato/a?
Contattaci, con noi i tuoi tuoi clienti proveranno le stesse emozioni
Fatti RI-scoprire
Entpy software www.entpy.com
"abbiamo visto il futuro, te lo presentiamo sotto forma di software"
"abbiamo visto il futuro, lui non ancora"
}}}

*/

*/

function placeholder_support() {
	// adding placeholder support to old browser

	Modernizr.load({
		test: Modernizr.input.placeholder,
		nope: ['/static/website/js/jquery.placeholder.js'],
		complete: function(){
			if (!Modernizr.input.placeholder) {
				$('input, textarea').placeholder();
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
			// returnVar = 'Entpy ti connette: contattaci per soluzioni tecnologicamente avanzate!';
			returnVar = 'Vuoi sapere come utilizzare il coupon? Contattaci!';
		} else if (msgType == "tip") {
			returnVar = 'Rimani incredulo, contattaci per avere soluzioni vincenti!';
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
