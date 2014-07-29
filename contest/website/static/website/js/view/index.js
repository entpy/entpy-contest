$(document).ready(function(){
	var s = Snap("#svg_container");
	Snap.load("static/website/img/entpy-universe2.svg", onSVGLoaded);
       
	function onSVGLoaded (svg){

		s.append(svg);
		var entpy_universe = s.select("#svg5571");
		var entpy_logo = s.select("#g4538-6");

		entpy_logo.animate({ transform: '' }, 2000);		

		// adding background to div
		// s.add(f);

		// define svg main elements
		// var ufo = s.select("#g4213-4");
		/*var logo = f.select("#g4538-6");
		var galaxy = s.select("#g5065-5");
		var computer = s.select("#g4219-3");
		var moon = s.select("#path4427-7");*/

		/*
		galaxy.drag();
		computer.drag();
		moon.drag();

		ufo.attr({fill: "#5D9170"});*/
		// main elements events
                /*ufo.click(function () {
			ufo.animate({y: -50,x: 10}, 1000);
                });*/
	}

	/*var bigCircle = s.circle(150, 150, 100);
	// By default its black, lets change its attributes
	bigCircle.attr({
		fill: "#bada55",
		stroke: "#000",
		strokeWidth: 5
	});

	bigCircle.animate({r: 50}, 1000);*/
});
