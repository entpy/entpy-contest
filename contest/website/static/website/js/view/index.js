$(document).ready(function(){

	// http://www.jsdb.io/animation/?sort=rating
	initSnapSvg();

	// setting svg aspect ratio
	// $("#svg > svg").attr("preserveAspectRatio", "xMinYMin slice");

	// Lets create big circle in the middle:
	/*var bigCircle = s.circle(100, 100, 100);

	bigCircle.attr({
		fill: "#bada55",
		stroke: "#000",
		strokeWidth: 5
	});

	var smallCircle = s.circle(180, 100, 100);

	smallCircle.animate({r: 50}, 1000);*/
	//Snap.load("static/website/img/entpy-universe2.svg", onSVGLoaded);

	//function onSVGLoaded (svg){

		// s.add(svg);

		// var svgData = s.select("#g13").getBBox();
		// var viewBox_h = svgData["y2"] - svgData["y"];

		/*s.select("#svg2").attr({
			preserveAspectRatio : "xMinYMin slice",
			viewBox : "0 0 150 454.85983"
		});*/

		//$("#svg2").attr("height", viewBox_h * 10);

		/*var entpy_universe = snapifiedSvg.select("#svg5571");
		var entpy_logo = snapifiedSvg.select("#g4538-6");
		var galaxy = snapifiedSvg.select("#path35");
		var galaxy2 = snapifiedSvg.select("#path37");*/

		// entpy logo entering XXX: OK
		/*entpy_logo.transform('matrix(0.00,0,0,0.00,60,868.50045)');
		entpy_logo.animate({ transform: 'matrix(0.10,0,0,0.10,35,868.50045)' }, 5000, mina.bounce);
		*/

		// galaxy.animate( { transform: "matrix(0.1224681,0,0,0.1224681,265.99041,985.0055)" }, 1000 );
		/*enableGalaxyAnimation(galaxy, 'r20', '-1916.3996,-641.4472', 5000);
		enableGalaxyAnimation(galaxy2, 'r20', '-1966.5809,-604.8831', 2000);

		var galaxy_details = snapifiedSvg.select("#g33").getBBox();*/
		// console.log(galaxy_details);

	//}

	function enableGalaxyAnimation(galaxy, radius, position, time) {
		galaxy.animate({ transform: radius + "," + position }, time);
	}

	function resetGalaxyAnimation(galaxy, radius, position, time) {
		galaxy.animate({ transform: radius + "," + position }, time);
	}

});

function initSnapSvg() {
	Snap.load("static/website/img/entpy-universe2.svg", onSVGLoaded);

	function onSVGLoaded (svg){

		// http://stackoverflow.com/questions/22091976/creating-a-snap-svg-object-from-an-object-element
		var objectSvg = Snap("#svg_object");
		// grab the referenced content
		// var objectSvgContent = objectSvg.node.contentDocument;
		// snapify it
		// console.log(objectSvg.node);
		var snapifiedSvg = Snap(objectSvg);

		var entpy_logo = snapifiedSvg.select("#g4538-6");
		entpy_logo.transform('matrix(0.00,0,0,0.00,60,868.50045)');
		entpy_logo.animate({ transform: 'matrix(0.10,0,0,0.10,35,868.50045)' }, 5000, mina.bounce);
	}
}
