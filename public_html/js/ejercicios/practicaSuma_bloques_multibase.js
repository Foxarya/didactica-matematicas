(function() {

	var canvasInterfaz;

	var capaInterfaz = new Kinetic.Layer();

	$(document).ready(function() {

		$.getScript("js/ejercicios/1_bloques_multibase.js").done(function(script, textStatus) {
			
			var bloquesJuego = new SceneBloques();
			
			$("<div id='canvasInterfaz' style='border: 2px solid black;border-bottom:0px'></div>").prependTo('.contenedor');

			canvasInterfaz = new MathCanvas.Canvas({
				container : 'canvasInterfaz',
				capas : [capaInterfaz],
				ancho : 1026,
				alto : 80,
				urlEjercicio : "img/ejercicios/practicaSuma_bloques_multibase/"
			});
		});

	});

})();

