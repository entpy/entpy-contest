$(document).ready(function(){

	// setting svg aspect ratio
	// $("#svg > svg").attr("preserveAspectRatio", "xMinYMin slice");

	var s = Snap("#svg_container");

	// Lets create big circle in the middle:
	/*var bigCircle = s.circle(100, 100, 100);

	bigCircle.attr({
		fill: "#bada55",
		stroke: "#000",
		strokeWidth: 5
	});

	var smallCircle = s.circle(180, 100, 100);

	smallCircle.animate({r: 50}, 1000);*/
	Snap.load("static/website/img/entpy-universe2.svg", onSVGLoaded);

	function onSVGLoaded (svg){

		s.add(svg);

		// var svgData = s.select("#g13").getBBox();
		// var viewBox_h = svgData["y2"] - svgData["y"];

		s.select("#svg2").attr({
			preserveAspectRatio : "xMinYMin slice",
			viewBox : "0 0 150 454.85983"
		});

		//$("#svg2").attr("height", viewBox_h * 10);

		var entpy_universe = s.select("#svg5571");
		var entpy_logo = s.select("#g4538-6");
		var galaxy = s.select("#path35");
		var galaxy2 = s.select("#path37");

		// entpy logo entering XXX: OK
		/*entpy_logo.transform('matrix(0.00,0,0,0.00,60,868.50045)');
		entpy_logo.animate({ transform: 'matrix(0.10,0,0,0.10,35,868.50045)' }, 5000, mina.bounce);
		*/

		// galaxy.animate( { transform: "matrix(0.1224681,0,0,0.1224681,265.99041,985.0055)" }, 1000 );
		enableGalaxyAnimation(galaxy, 'r20', '-1916.3996,-641.4472', 5000);
		enableGalaxyAnimation(galaxy2, 'r20', '-1966.5809,-604.8831', 2000);

		s.select("#svg2").animate({ transform: "matrix(1,0,0,1,0,-114)" }, 5000);

		var galaxy_details = s.select("#g33").getBBox();
		// console.log(galaxy_details);

	}

	function enableGalaxyAnimation(galaxy, radius, position, time) {
		galaxy.animate({ transform: radius + "," + position }, time);
	}

	function resetGalaxyAnimation(galaxy, radius, position, time) {
		galaxy.animate({ transform: radius + "," + position }, time);
	}

});
