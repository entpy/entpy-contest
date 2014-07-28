$(document).ready(function(){

});

function placeholder_support() {
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
