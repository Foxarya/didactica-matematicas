/**
 *
 * MathCanvas Engine
 * Copyleft 2013 - Carlos Ocaña, Manuel Jesus Fernandez
 *
 * Based on KineticJS JavaScript Framework
 *
 */

var MathCanvas = {};

(function() {

	/*
	 * Escenario constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Array|String} config.selectoresSeleccionables
	 * @param {Function} config.procesarSeleccion
	 *
	 */
	MathCanvas.Escenario = function(config) {

		var escenario = new Kinetic.Stage({
			container : 'container',
			width : 500,
			height : 400,
			draggable : true,
			dragBoundFunc : function(pos) {
				return {
					x : this.getAbsolutePosition().x,
					y : this.getAbsolutePosition().y
				}
			}
		});

		container = $('#container');
		padre = $(container).parent();

		$(window).resize(redimensionaCanvas);

		function redimensionaCanvas() {
			container.attr('width', $(padre).width());
			escenario.setWidth($(padre).width());
			escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);
		}

		redimensionaCanvas();

		return escenario;

	}

	MathCanvas.ImagenesEjercicio = function(url) {

		var dictImg = {};

		$.ajax({
			type : "GET",
			url : url+"indice.xml",
			dataType : "xml",
			success : function(xml) {
				var compruebaCargadas;
				var numeroImagenes = $(xml).find('imagen').length;
				$(xml).find('imagen').each(function() {
					var nombreImagen = $(this).text();
					var imagen = new Image();

					imagen.onload = function() {
						dictImg[nombreImagen] = imagen;
						compruebaCargadas += ".";
						if (compruebaCargadas.length == numeroImagenes) {
							logicaJuego();
						}
					};

					imagen.src = url + nombreImagen + ".png";

				});
			}
		});

		return dictImg;

	}
	
	
})();
