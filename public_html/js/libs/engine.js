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

		if (config.seleccionable) {

			this.seleccion = {
				rect : null,
				origenX : 0,
				origenY : 0,
				finalX : 1,
				finalY : 1
			}

			this.capaSeleccion = new Kinetic.Layer();

			escenario.add(this.capaSeleccion);

			container.on("mouseout", function() {
				if (escenario.isDragging()) {
					escenario.stopDrag();
					seleccion.rect.destroy();
					this.capaSeleccion.draw();
					seleccion.rect = null;
				}
			});

			if (config.selectoresSeleccionables != null) {

				escenario.on('dragstart', function(evt) {

					capaSeleccion.moveToTop();

					if (seleccion.rect != null) {
						seleccion.rect.destroy();
						capaSeleccion.draw();
						seleccion.rect = null;
					}

					if (!evt.targetNode) {
						seleccion.rect = new Kinetic.Rect({
							x : posicionRaton().x,
							y : posicionRaton().y,
							width : 1,
							height : 1,
							stroke : '#000',
							strokeWidth : 2,
							fill : '#ddd',
							opacity : 0.5
						});

						seleccion.origenX = seleccion.rect.getX();
						seleccion.origenY = seleccion.rect.getY();

						capaSeleccion.add(seleccion.rect);
						capaSeleccion.draw();
					}
				});

				escenario.on('dragmove', function() {

					if (this.seleccion.rect != null) {
						this.seleccion.rect.setWidth(posicionRaton().x - seleccion.rect.getX());
						this.seleccion.rect.setHeight(posicionRaton().y - seleccion.rect.getY());
					}

				});

				escenario.on('dragend', function() {
					if (this.seleccion.rect != null) {
						this.seleccion.finalX = posicionRaton().x;
						this.seleccion.finalY = posicionRaton().y;

						var seleccionados = new Kinetic.Collection();
						var seleccionadoElementoDistinto = false;

						for (var i = 0; i < escenario.getChildren().length; i++) {

							var cubo = capaCubos.getChildren()[i];

							if ( cubo instanceof Kinetic.Rect || cubo.getName() == "bloque") {
								continue;
							}

							var mayorX = Math.max(seleccion.origenX, seleccion.finalX);
							var mayorY = Math.max(seleccion.origenY, seleccion.finalY);
							var menorX = Math.min(seleccion.origenX, seleccion.finalX);
							var menorY = Math.min(seleccion.origenY, seleccion.finalY);

							if ((cubo.getX() > menorX && cubo.getX() + cubo.getWidth() < mayorX) && (cubo.getY() > menorY && cubo.getY() + cubo.getHeight() < mayorY)) {
								seleccionados.push(cubo);
								/*cubo.applyFilter(Kinetic.Filters.Grayscale, null, function() {
								 capaCubos.draw();
								 });*/
								if (seleccionados[0].getName() != cubo.getName()) {
									seleccionadoElementoDistinto = true;
									break;
								}
							}

						}

						if (seleccionados.length >= base && !seleccionadoElementoDistinto) {
							var coordenadas = {
								x : seleccionados[0].getX(),
								y : seleccionados[0].getY()
							};
							var offsetX = coordenadas.x;

							for (var i = 0; i < seleccionados.length - (seleccionados.length % base); i++) {
								var cubo = seleccionados[i];

								if (i + 1 == seleccionados.length - (seleccionados.length % base)) {
									cubo.transitionTo({
										x : coordenadas.x,
										y : coordenadas.y,
										duration : 1,
										easing : 'ease-in-out',
										callback : function() {
											for (var n = 0; i < seleccionados.length - (seleccionados.length % base); i++) {
												var cubo = seleccionados[i];
												var tipo;
												if (i == 0)
													tipo = prioridad.indexOf(cubo.getName());

												cubo.destroy();

												if (i % base == 0) {
													var siguiente = new Elemento(coordenadas.x, coordenadas.y, prioridad[tipo - 1]);

													capaCubos.add(siguiente);
													capaCubos.draw();
													coordenadas.x = seleccionados[i + 1].getX();
													coordenadas.y = seleccionados[i + 1].getY();
												}

											}
										}
									});
								} else {
									cubo.transitionTo({
										x : coordenadas.x,
										y : coordenadas.y,
										duration : 1,
										easing : 'ease-in-out'
									});
									offsetX += 9;
								}

							}

						}

						seleccion.rect.destroy();
						capaCubos.draw();
						seleccion.rect = null;
					}
				});
			}
		}

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
			url : url,
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

					imagen.src = "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/" + nombreImagen + ".png";

				});
			}
		});

		return dictImg;

	}
})();
