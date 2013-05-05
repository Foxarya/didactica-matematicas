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

	MathCanvas.atrib = {};

	/*
	 * Escenario constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Array|Kinetic.Layer} capas
	 * @param {Object} config.seleccion
	 * @param {Kinetic.Layer} config.seleccion.capa
	 * @param {Function} config.seleccion.callback
	 * @param {String} config.urlEjercicio
	 * @param {Function} config.callback
	 *
	 */
	MathCanvas.Escenario = function(config) {

		MathCanvas.atrib.url = config.urlEjercicio;
		MathCanvas.atrib.callback = config.callback;
		MathCanvas.atrib.capaEngine = new Kinetic.Layer();

		MathCanvas.atrib.escenario = new Kinetic.Stage({
			container : 'container',
			width : 1026,
			height : 575,
			draggable : true,
			dragBoundFunc : function(pos) {
				return {
					x : this.getAbsolutePosition().x,
					y : this.getAbsolutePosition().y
				}
			}
		});

		var container = $('#container');
		var padre = $(container).parent();
		var resolucionOriginal = {
			ancho : 1026,
			alto : MathCanvas.atrib.escenario.getHeight(),
			relacion : 1026 / MathCanvas.atrib.escenario.getHeight()
		};

		for (var capa in config.capas) {
			MathCanvas.atrib.escenario.add(config.capas[capa]);
		}

		MathCanvas.atrib.escenario.add(MathCanvas.atrib.capaEngine);

		$(window).resize(function() {

			container.attr('width', $(padre).width());
			container.attr('height', $(padre).width() / resolucionOriginal.relacion);
			MathCanvas.atrib.escenario.setWidth($(padre).width());
			MathCanvas.atrib.escenario.setHeight($(padre).width() / resolucionOriginal.relacion);
			MathCanvas.atrib.escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);

		});

		$(window).resize();

		MathCanvas.cargarImagenes();

		if ( typeof config.seleccion != undefined) {
			container.on("mouseout", function() {
				if (MathCanvas.atrib.escenario.isDragging()) {
					MathCanvas.atrib.escenario.stopDrag();
					seleccion.rect.destroy();
					seleccion.rect = null;
				}
			});

			var seleccion = null;

			MathCanvas.atrib.escenario.on('dragstart', function(evt) {

				if (seleccion != null) {
					seleccion.destroy();
					seleccion = null;
				}

				if (!evt.targetNode) {
					seleccion = new Kinetic.Rect({
						x : MathCanvas.posicionRaton().x,
						y : MathCanvas.posicionRaton().y,
						width : 1,
						height : 1,
						stroke : '#000',
						strokeWidth : 2,
						fill : '#ddd',
						opacity : 0.5
					});

					MathCanvas.atrib.capaEngine.add(seleccion);
				}
			});

			MathCanvas.atrib.escenario.on('dragmove', function() {

				if (seleccion != null) {
					seleccion.setWidth(MathCanvas.posicionRaton().x - seleccion.getX());
					seleccion.setHeight(MathCanvas.posicionRaton().y - seleccion.getY());
				}

			});

			MathCanvas.atrib.escenario.on('dragend', function() {
				if (seleccion != null) {
					var seleccionados = new Kinetic.Collection();

					for (var i = 0; i < config.seleccion.capa.getChildren().length; i++) {

						var elemento = config.seleccion.capa.getChildren()[i];

						if (MathCanvas.hayColision(seleccion, elemento)) {
							seleccionados.push(elemento);
						}

					}

					seleccion.destroy();
					seleccion = null;
					MathCanvas.atrib.capaEngine.draw();

					config.seleccion.callback(seleccionados);

				}
			});
		}

		return MathCanvas.atrib.escenario;

	}

	MathCanvas.cargarImagenes = function() {

		var dictImg = {};

		var barraCarga = new Kinetic.Rect({
			x : MathCanvas.tamaño().ancho / 2 - 250,
			y : MathCanvas.tamaño().alto / 2,
			width : 0,
			height : 5,
			stroke : 'black',
			strokeWidth : 2,
			fill : 'orange'

		});

		MathCanvas.atrib.capaEngine.add(barraCarga);

		$.ajax({
			type : "GET",
			url : MathCanvas.atrib.url + "indice.xml",
			dataType : "xml",
			success : function(xml) {
				var cargadas = 0;
				var numeroImagenes = $(xml).find('imagen').length;
				$(xml).find('imagen').each(function() {
					var nombreImagen = $(this).text();
					var imagen = new Image();

					imagen.onload = function() {

						dictImg[nombreImagen] = imagen;
						cargadas++;
						barraCarga.transitionTo({
							width : ((cargadas * 100) / numeroImagenes) * 5,
							duration : 0.1,
							easing : 'ease-in-out'
						});
						barraCarga.draw();
						if (cargadas == numeroImagenes) {
							barraCarga.destroy();
							MathCanvas.atrib.capaEngine.draw();
							MathCanvas.dictImg = dictImg;
							MathCanvas.atrib.callback();
						}
					};

					imagen.src = MathCanvas.atrib.url + nombreImagen + ".png";

				});
			}
		});

	}

	MathCanvas.tamaño = function() {

		return {
			ancho : MathCanvas.atrib.escenario.getWidth() / MathCanvas.atrib.escenario.getScale().x,
			alto : MathCanvas.atrib.escenario.getHeight() / MathCanvas.atrib.escenario.getScale().y
		}
	}

	MathCanvas.posicionRaton = function() {

		return {
			x : MathCanvas.atrib.escenario.getPointerPosition().x / MathCanvas.atrib.escenario.getScale().x,
			y : MathCanvas.atrib.escenario.getPointerPosition().y / MathCanvas.atrib.escenario.getScale().y
		}
	}
	/*
	 * Comprueba si cualquier punto de a entra en contacto con la posición de b
	 * @name hayColision
	 * @param {Kinetic.Node} elementoA
	 * @param {Kinetic.Node} elementoB
	 *
	 */
	MathCanvas.hayColision = function(a, b) {

		var coordA = {
			x : a.getX() - a.getOffset().x,
			y : a.getY() - a.getOffset().y
		};

		var mayorX = Math.max(coordA.x, coordA.x + a.getWidth());
		var mayorY = Math.max(coordA.y, coordA.y + a.getHeight());
		var menorX = Math.min(coordA.x, coordA.x + a.getWidth());
		var menorY = Math.min(coordA.y, coordA.y + a.getHeight());

		if ((b.getX() > menorX && b.getX() < mayorX) && (b.getY() > menorY && b.getY() < mayorY)) {

			return true;

		}

		return false;
	}
	/*
	 * Boton constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Integer} config.x
	 * @param {Integer} config.y
	 * @param {Integer} [config.ancho]
	 * @param {Integer} [config.alto]
	 * @param {Function} [config.onClick] Acción opcional a realizar cuando se haga click al botón
	 * @param {Function} [config.onDrag] Acción opcional a realizar cuando se arrastre desde el botón (el botón es inmóvil pero puede reaccionar a intento de arrastre)
	 */
	MathCanvas.Boton = function(config) {
		var boton;
		var draggable = (typeof config.onDrag != "undefined") ? true : false;

		if (config.contenido instanceof Image) {
			boton = new Kinetic.Image({
				x : config.x,
				y : config.y,
				image : config.contenido,
				width : ( typeof config.ancho != "undefined") ? config.ancho : config.contenido.width,
				heigth : ( typeof config.alto != "undefined") ? config.alto : config.contenido.height,
				shadowColor : 'black',
				shadowBlur : 1.5,
				shadowOffset : 5,
				shadowOpacity : 0.1,
				draggable : draggable,
				dragBoundFunc : function(pos) {
					return {
						x : this.getAbsolutePosition().x,
						y : this.getAbsolutePosition().y
					}
				}
			});

		} else {
			boton = new Kinetic.Label({
				x : config.x,
				y : config.y,
				width : config.ancho,
				listening : true,
				text : {
					text : config.contenido,
					fontSize : 12,
					fontFamily : 'Calibri',
					fill : '#555',
					padding : 20,
					align : 'center'
				},
				rect : {
					stroke : '#555',
					strokeWidth : 5,
					fill : '#ddd',
					shadowColor : 'black',
					shadowBlur : 10,
					shadowOffset : [10, 10],
					shadowOpacity : 0.2,
					cornerRadius : 10
				},
				draggable : draggable,
				dragBoundFunc : function(pos) {
					return {
						x : this.getAbsolutePosition().x,
						y : this.getAbsolutePosition().y
					}
				}
			});

		}

		boton.setOffset(boton.getWidth() / 2, boton.getHeight() / 2);

		boton.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		boton.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});
		
		if(typeof config.onClick != "undefined")
			boton.on('click tap', config.onClick);

		if (draggable)
			boton.on('dragstart', config.onDrag);

		return boton;
	}
})();
