/**
 *
 * MathCanvas Engine
 * Copyright 2013, Carños Ocaña & Manuel Jesus Fernandez Muñoz
 * Licensed under the MIT license
 * Based on KineticJS JavaScript Framework
 *
 Copyright (c) 2013 by Carlos Ocaña, Manuel Jesus Fernandez Muñoz

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 *
 */

var MathCanvas = {};
(function() {

	Kinetic.Stage.prototype._buildDOM = function() {
		this.content = this.attrs.container;

		this.bufferCanvas = new Kinetic.Canvas();
		this.hitCanvas = new Kinetic.Canvas(0, 0, true);

		this._resizeDOM();
	};

	Kinetic.Stage.prototype._getContentPosition = function() {
		var rect = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : {
			top : 0,
			left : 0
		};
		return {
			top : rect.top,
			left : rect.left
		};
	};

	/*
	 * Escenario constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Array|Kinetic.Layer} config.capas
	 * @param {Integer} config.ancho
	 * @param {Integer} config.alto
	 * @param {Object} config.seleccion
	 * @param {Kinetic.Layer} config.seleccion.capa
	 * @param {Function} config.seleccion.callback
	 * @param {String} config.urlEjercicio
	 * @param {Function} config.callback
	 *
	 */
	MathCanvas.Canvas = function(config) {
		this._initCanvas(config);
	};
	MathCanvas.Canvas.prototype = {

		_initCanvas : function(config) {
			var canvas = this;
			this.urlEjercicio = config.urlEjercicio;
			this.callback = config.callback;
			this.capaEngine = new Kinetic.Layer();

			this.escenario = new Kinetic.Stage({
				container : 'container',
				width : config.ancho,
				height : config.alto,
				draggable : true,
				dragBoundFunc : function(pos) {
					return {
						x : this.getAbsolutePosition().x,
						y : this.getAbsolutePosition().y
					}
				}
			});

			for (var capa in config.capas) {
				this.escenario.add(config.capas[capa]);
			}

			this.escenario.add(this.capaEngine);

			$(window).resize({
				canvas : this,
				anchoOriginal : config.ancho,
				altoOriginal : config.alto
			}, function(event) {

				$('#container').attr('width', $('#container').parent().width());
				$('#container').attr('height', $('#container').parent().width() / (event.data.anchoOriginal / event.data.altoOriginal));
				event.data.canvas.escenario.setWidth($('#container').parent().width());
				event.data.canvas.escenario.setHeight($('#container').parent().width() / (event.data.anchoOriginal / event.data.altoOriginal));
				event.data.canvas.escenario.setScale($('#container').width() / event.data.anchoOriginal, $('#container').height() / event.data.altoOriginal);

			});

			$(window).resize();

			this.cargarSpriteSheet();

			if ( typeof config.seleccion != "undefined") {
				var seleccion = null;

				$('#container').on("mouseout", function(canvas) {
					if (canvas.escenario.isDragging()) {
						canvas.escenario.stopDrag();
						seleccion.destroy();
						seleccion = null;
					}
				}(this));

				this.escenario.on('dragstart', function(evt) {

					if (seleccion != null) {
						seleccion.destroy();
						seleccion = null;
					}

					if (!evt.targetNode) {
						seleccion = new Kinetic.Rect({
							x : canvas.posicionRaton().x,
							y : canvas.posicionRaton().y,
							width : 1,
							height : 1,
							stroke : '#000',
							strokeWidth : 2,
							fill : '#ddd',
							opacity : 0.5
						});

						canvas.capaEngine.add(seleccion);
					}
				});

				this.escenario.on('dragmove', function() {

					if (seleccion != null) {
						seleccion.setWidth(canvas.posicionRaton().x - seleccion.getX());
						seleccion.setHeight(canvas.posicionRaton().y - seleccion.getY());
					}

				});

				this.escenario.on('dragend', function() {
					if (seleccion != null) {
						var seleccionados = new Kinetic.Collection();

						for (var i = 0; i < config.seleccion.capa.getChildren().length; i++) {

							var elemento = config.seleccion.capa.getChildren()[i];

							if (canvas.hayColision(seleccion, elemento)) {
								seleccionados.push(elemento);
							}

						}

						seleccion.destroy();
						seleccion = null;
						canvas.capaEngine.draw();

						config.seleccion.callback(seleccionados);

					}
				});
			}
		},

		cargarSpriteSheet : function() {

			var canvas = this;

			var cargando = new Kinetic.Text({
				x : canvas.tamaño().ancho / 2,
				y : canvas.tamaño().alto / 2,
				text : 'Cargando',
				fontSize : 32,
				fontFamily : 'Calibri',
				fill : 'black'
			});

			cargando.setPosition((canvas.tamaño().ancho / 2) - (cargando.getWidth() / 2), (canvas.tamaño().alto / 2) - (cargando.getHeight() / 2));

			this.capaEngine.add(cargando);

			cargando.draw();

			this.spritesheet = new Image();

			this.spritesheet.onload = function() {

				$.getJSON(canvas.urlEjercicio + "spritesheet.json", function(json) {

					cargando.destroy();
					canvas.capaEngine.draw();
					canvas.frames = json;
					canvas.callback();

				}).fail(function(jqxhr, textStatus, error) {
					var err = textStatus + ', ' + error;
					console.log("Request Failed: " + err);
				});
			};

			this.spritesheet.src = this.urlEjercicio + "spritesheet.png";

		},

		tamaño : function() {

			var ancho = this.escenario.getWidth() / this.escenario.getScale().x;
			var alto = this.escenario.getHeight() / this.escenario.getScale().y;

			return {
				ancho : ancho,
				alto : alto
			}
		},

		posicionRaton : function() {

			var x = this.escenario.getPointerPosition().x / this.escenario.getScale().x;
			var y = this.escenario.getPointerPosition().y / this.escenario.getScale().y;
			return {
				x : x,
				y : y
			}
		},
		/*
		 * Comprueba si cualquier punto de a entra en contacto con la posición de b
		 * @name hayColision
		 * @param {Kinetic.Node} elementoA
		 * @param {Kinetic.Node} elementoB
		 *
		 */
		hayColision : function(a, b) {

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
		},

		cambiarBase : function(numero, base) {
			var resul = [];

			var cociente = numero;
			var restos = [];
			do {
				restos.push(cociente % base);
				cociente = Math.floor(cociente / base);
			} while(cociente >= base);

			restos.push(cociente);

			var contador = restos.length - 1;
			var maximo = (restos.length < 4) ? 4 : restos.length;
			for (var i = 0; i < maximo; i++) {
				if (restos.length < 4 && Math.abs(i - 4) > restos.length) {
					resul.push(0);
				} else {
					resul.push(restos[contador]);
					contador--;
				}

			}

			return resul;
		}
	};

	/*
	 * Boton constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Integer} config.x
	 * @param {Integer} config.y
	 * @param {Image} [config.spritesheet]
	 * @param {String} [config.imagen]
	 * @param {Object} [config.frames]
	 * @param {String} [config.texto]
	 * @param {Integer} [config.ancho]
	 * @param {Integer} [config.alto]
	 * @param {Function} [config.onClick] Acción opcional a realizar cuando se haga click al botón
	 * @param {Function} [config.onDrag] Acción opcional a realizar cuando se arrastre desde el botón (el botón es inmóvil pero puede reaccionar a intento de arrastre)
	 */
	MathCanvas.Boton = function(config) {

		var boton;
		var draggable = ( typeof config.onDrag != "undefined") ? true : false;

		if ( typeof config.imagen != "undefined") {
			boton = new Kinetic.Sprite({
				x : config.x,
				y : config.y,
				width : config.frames[config.imagen][0].width,
				height : config.frames[config.imagen][0].height,
				image : config.spritesheet,
				animation : config.imagen,
				animations : config.frames,
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

		if ( typeof config.onClick != "undefined")
			boton.on('click tap', config.onClick);

		if (draggable)
			boton.on('dragstart', config.onDrag);

		return boton;

	}
})();
