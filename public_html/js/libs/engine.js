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
	 * @param {Integer} config.alto
	 * @param {Function} config.procesaSeleccion
	 * @param {String} config.urlImagenes
	 * @param {Function} config.callback
	 *
	 */
	MathCanvas.Engine = function(config) {

		this.url = config.urlImagenes;
		this.callback = config.callback;
		this.escenario = escenario;

		var escenario = new Kinetic.Stage({
			container : 'container',
			width : 500,
			height : config.alto,
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
			alto : escenario.getHeight(),
			relacion : 1026 / escenario.getHeight()
		};

		this.capaEngine = new Kinetic.Layer();

		escenario.add(this.capaEngine);

		$(window).resize(function() {

			container.attr('width', $(padre).width());
			container.attr('height', $(padre).width() / resolucionOriginal.relacion);
			escenario.setWidth($(padre).width());
			escenario.setHeight($(padre).width() / resolucionOriginal.relacion);
			escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);

		});

		$(window).resize();
		
		this.cargarImagenes();

		/*if (config.procesaSeleccion != undefined) {
		 container.on("mouseout", function() {
		 if (this.escenario.isDragging()) {
		 this.escenario.stopDrag();
		 seleccion.rect.destroy();
		 capaCubos.draw();
		 seleccion.rect = null;
		 }
		 });

		 cargarImagenes();

		 var seleccion = {
		 rect : null,
		 origenX : 0,
		 origenY : 0,
		 finalX : 1,
		 finalY : 1
		 }

		 this.escenario.on('dragstart', function(evt) {

		 if (seleccion.rect != null) {
		 seleccion.rect.destroy();
		 capaCubos.draw();
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

		 capaCubos.add(seleccion.rect);
		 seleccion.rect.draw();
		 }
		 });

		 this.escenario.on('dragmove', function() {

		 if (seleccion.rect != null) {
		 seleccion.rect.setWidth(posicionRaton().x - seleccion.rect.getX());
		 seleccion.rect.setHeight(posicionRaton().y - seleccion.rect.getY());
		 }

		 });

		 this.escenario.on('dragend', function() {
		 if (seleccion.rect != null) {
		 seleccion.finalX = posicionRaton().x;
		 seleccion.finalY = posicionRaton().y;

		 var seleccionados = new Kinetic.Collection();
		 var seleccionadoElementoDistinto = false;

		 for (var i = 0; i < capaCubos.getChildren().length; i++) {

		 var cubo = capaCubos.getChildren()[i];

		 if ( cubo instanceof Kinetic.Rect || cubo.getName() == "bloque") {
		 continue;
		 }

		 if (hayColision(seleccion.rect, cubo)) {
		 seleccionados.push(cubo);
		 if (seleccionados[0].getName() != cubo.getName()) {
		 seleccionadoElementoDistinto = true;
		 break;
		 }
		 }

		 }

		 if (seleccionados.length >= bases[base] && !seleccionadoElementoDistinto) {

		 agrupar(seleccionados);
		 }

		 seleccion.rect.destroy();
		 capaCubos.draw();
		 seleccion.rect = null;
		 }
		 });
		 }*/
		

	}

	MathCanvas.Engine.prototype.cargarImagenes = function() {

		var dictImg = {};

		var barraCarga = new Kinetic.Rect({
			x : this.tamaño().width / 2 - 250,
			y : this.tamaño().height / 2,
			width : 0,
			height : 5,
			stroke : 'black',
			strokeWidth : 2,
			fill : 'orange'

		});

		this.capaEngine.add(barraCarga);
		var puntero = this.callback;

		$.ajax({
			type : "GET",
			url : this.url + "indice.xml",
			dataType : "xml",
			success : function(xml) {
				var urlSinXml = this.url.substring(0, this.url.indexOf("indice.xml"));
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
							puntero(dictImg);
						}
					};
					
					

					imagen.src = urlSinXml + nombreImagen + ".png";

				});
			}
		});


	}

	MathCanvas.Engine.prototype.tamaño = function() {

		return {
			ancho : this.escenario.getWidth() / this.escenario.getScale().x,
			alto : this.escenario.getHeight() / this.escenario.getScale().y
		}
	}

	MathCanvas.Engine.prototype.posicionRaton = function() {

		return {
			x : this.escenario.getPointerPosition().x / this.escenario.getScale().x,
			y : this.escenario.getPointerPosition().y / this.escenario.getScale().y
		}
	}

	MathCanvas.Engine.prototype.hayColision = function(elementoA, elementoB) {
		var centroB = {
			x : elementoB.getX() + (elementoB.getWidth() / 2),
			y : elementoB.getY() + (elementoB.getHeight() / 2)
		};

		var mayorX = Math.max(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
		var mayorY = Math.max(elementoA.getY(), elementoA.getY() + elementoA.getHeight());
		var menorX = Math.min(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
		var menorY = Math.min(elementoA.getY(), elementoA.getY() + elementoA.getHeight());

		if ((centroB.x > menorX && centroB.x < mayorX) && (centroB.y > menorY && centroB.y < mayorY)) {

			return true;

		}

		return false;
	}

	MathCanvas.Boton = function(x, y, ancho, alto, contenido, onclick, ondrag) {
		var boton;
		var draggable = (ondrag != null) ? true : false;

		if ( contenido instanceof Image) {
			boton = new Kinetic.Image({
				x : x,
				y : y,
				image : contenido,
				width : ancho,
				heigth : alto,
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
				x : x,
				y : y,
				opacity : 1,
				width : ancho,
				listening : true,
				text : {
					text : contenido,
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
				}
			});

		}

		boton.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		boton.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});

		boton.on('click tap', onclick);

		if (draggable)
			boton.on('dragstart', ondrag);

		return boton;
	}
})();
