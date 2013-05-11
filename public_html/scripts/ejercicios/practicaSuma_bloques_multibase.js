(function() {

	var canvasInterfaz;

	var bloquesJuego;

	var capaInterfaz = new Kinetic.Layer();

	$(document).ready(function() {

		require(["ejercicios/SceneBloques"], function() {

			bloquesJuego = new SceneBloques({
				base : 10
			});

			$("<div id='canvasInterface' style='border: 2px solid black'></div>").prependTo('.contenedor');

			canvasInterfaz = new MathCanvas.Canvas({
				container : 'canvasInterface',
				capas : [capaInterfaz],
				ancho : 1026,
				alto : 80
			});

		});

	});

})();

