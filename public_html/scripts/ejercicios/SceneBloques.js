var SceneBloques;

(function() {

	var canvas;

	/*
	 * SceneBloques constructor
	 * @constructor
	 * @param {Object} config
	 * @param {Integer} config.base
	 * @param {Function} config.onDrawDelegate
	 */
	SceneBloques = function(config) {
		this._initScene(config);
	}

	SceneBloques.prototype = {
		_initScene : function(config) {
			$("<div id='canvasJuego' style='border: 2px solid black'></div>").prependTo('.contenedor');

			canvas = new MathCanvas.Canvas({
				container : 'canvasJuego',
				capas : [capaVarios, capaBotones, capaCubos],
				ancho : 1026,
				alto : 465,
				seleccion : {
					capa : capaCubos,
					callback : agrupar
				},
				urlEjercicio : "img/ejercicios/1_bloques_multibase/",
				callback : logicaJuego
			});

			this.canvas = canvas;
			
			base = bases.indexOf(config.base);
			
			if(base == -1) base = 3;

			var that = this;
			capaCubos.on('draw', function(evt) {

				try {
					var potencia = 3;
					for (var i in botones) {
						if (that.getRepresentados().base10 + Math.pow(bases[base], potencia) > limites[base]) {
							if (botones[i].isListening()) {
								botones[i].setOpacity(0.5);
								botones[i].setListening(false);
							}
						} else {
							botones[i].setListening(true);
							botones[i].setOpacity(1);
						}
						potencia--;
					}
					
					if(typeof config.onDrawDelegate != "undefined")
						config.onDrawDelegate(evt);
						
					capaBotones.draw();
				} catch(e) {
					console.log(e);
				}
			});

		},

		getNumero : function() {
			return numeroBase10;
		},

		getRepresentados : function() {

			return cuentaRepresentados();
		},

		getBase : function() {
			return bases[base];
		},

		setRepresentados : function(numero) {
			capaCubos.removeChildren();

			this.addElementos(numero);
		},

		setBase : function(nuevaBase) {

			if (this.getRepresentados().base10 != numeroBase10 && this.getRepresentados().base10 != 0) {
				numeroBase10 = this.getRepresentados().base10;
			}
			var resul = canvas.cambiarBase(numeroBase10, nuevaBase);

			base = bases.indexOf(nuevaBase);

			this.setRepresentados(resul);

		},

		addElementos : function(resul) {

			if (resul.length <= 4 && resul.length != 0) {
				for (var i = resul.length - 1; i >= 0; i--) {
					for (var j = 0; j < resul[i]; j++) {
						var nuevoElemento = new Elemento((botones[i].getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (canvas.tamaño().alto - limiteArrastreY - 100)), prioridad[i]);
						nuevoElemento.setScale(0, 0);

						capaCubos.add(nuevoElemento);

						TweenLite.to(nuevoElemento, 0.3, {
							setScaleX : 1,
							setScaleY : 1,
							ease : Back.easeOut,
							onUpdate : function() {
								capaCubos.batchDraw();
							}
						});
					}
				}
			}

			capaCubos.draw();
		},

		aumentarBase : function() {

			if (this.sePuedeSubirBase()) {
				this.setBase(bases[base + 1]);
			}

		},

		disminuirBase : function() {
			if (this.sePuedeBajarBase()) {
				//base--;

				this.setBase(bases[base - 1]);
			}
		},

		sePuedeSubirBase : function() {
			if (base + 1 < bases.length) {
				return true;
			}
			return false;
		},
		
		sePuedeBajarBase : function() {
			if (base - 1 >= 0) {
				return true;
			}
			return false;
		}, 
	};
	var capaBotones = new Kinetic.Layer();
	var capaCubos = new Kinetic.Layer();
	var capaVarios = new Kinetic.Layer();

	var borrando = false;

	var numeroBase10 = 0;

	var botones = [];

	/*
	 * CONSTANTES
	 */

	var posiciones = {
		bloque : {
			x : 128,
			y : 50
		},
		placa : {
			x : 385,
			y : 50
		},
		barra : {
			x : 641,
			y : 50
		},
		cubo : {
			x : 898,
			y : 50
		},
		papelera : {
			x : 966,
			y : 426,
		}

	};

	var prioridad = ["bloque", "placa", "barra", "cubo"];

	var bases = [2, 3, 4, 5, 6, 8, 10, 12];

	var limites = [15, 80, 255, 624, 1295, 4095, 9999, 20735];

	var contar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "F"];

	var base = 3;

	var limiteArrastreY = 130;

	var consejos = {
		sacarNuevoElemento : {
			trigger : true,
			texto : "Pulsa o arrastra para añadir un elemento nuevo",
			tiempo : 3
		},
		agrupar : {
			trigger : true,
			texto : "Pulsa en cualquier parte\n y arrastra para agrupar elementos",
			condicion : cuentaRepresentados().base10 >= bases[base],
			tiempo : 4
		},
		desagrupar : {
			trigger : true,
			texto : "Pulsa dos veces para desagrupar\nelementos compuestos",
			condicion : cuentaRepresentados().numero >= 10,
			tiempo : 15
		}
	};

	/*
	 * FIN CONSTANTES
	 */

	function cuentaRepresentados() {

		var cantidades = [];
		var devolver = "";
		var base10 = 0;

		var contador = 3;
		for (var i = 0; i < prioridad.length; i++) {
			var elementos = capaCubos.get("." + prioridad[i]).length;
			if (elementos >= bases[base]) {
				devolver = "nada";
			}

			if (elementos != 0) {
				cantidades[i] = contar[elementos];
			} else {
				cantidades[i] = 0;
			}
			base10 += elementos * Math.pow(bases[base], contador);
			contador--;

		}
		if (devolver != "nada") {
			var contador = 0;
			for (var i = 0; i < cantidades.length; i++) {

				devolver += cantidades[i] + " ";

			}
		}

		return {
			numero : (devolver != "nada") ? parseInt(devolver) : -1,
			texto : devolver,
			base10 : base10
		};

	}

	function agrupar(elementos) {

		if (elementos.length < bases[base]) {
			return;
		}

		var grupos = [];
		var cogidos = [];
		var tipo = prioridad.indexOf(elementos[0].getName());

		for (var i = 0; i < elementos.length - (elementos.length % bases[base]); i++) {

			if (elementos[i].getName() != prioridad[tipo] || elementos[i].getName() == "bloque") {
				return;
			}
			if (cogidos.indexOf(i) != -1)
				continue;

			var elemento = elementos[i];
			var distancias = [];
			var grupo = new Kinetic.Collection();

			for (var j = 0; j < elementos.length - (elementos.length % bases[base]); j++) {

				var distancia = {
					x : elemento.getX() - elementos[j].getX(),
					y : elemento.getY() - elementos[j].getY()
				};

				if (cogidos.indexOf(j) != -1)
					continue;

				//Teorema de Pitágoras
				distancias.push({
					distancia : Math.sqrt(Math.pow(distancia.x, 2) + Math.pow(distancia.y, 2)),
					indice : j
				});

			}

			distancias.sort(function(a, b) {
				if (a.distancia < b.distancia)
					return -1;
				if (a.distancia > b.distancia)
					return 1;
				return 0;
			});

			for (var coger = 0; coger < bases[base]; coger++) {

				cogidos.push(distancias[coger].indice);

				grupo.push(elementos[distancias[coger].indice]);

			}

			grupos.push(grupo);

		}

		var agrupados = 0;
		var coordenadas = [];
		for (var i = 0; i < grupos.length; i++) {

			coordenadas.push({
				x : grupos[i][0].getX(),
				y : grupos[i][0].getY()
			});

			grupos[i].each(function(elemento) {

				TweenLite.to(elemento, 0.3, {
					setX : grupos[i][0].getX(),
					setY : grupos[i][0].getY(),
					setScaleX : 0.5,
					setScaleY : 0.5,
					ease : Strong.easeIn,
					onUpdate : function() {
						capaCubos.batchDraw();
					},
					onComplete : function() {
						
						elemento.destroy();
						
						agrupados++;

						if (agrupados == bases[base] * grupos.length) {

							var numeroNuevosElementos = grupos.length;

							for (var n = 0; n < numeroNuevosElementos; n++) {
								var siguiente = new Elemento(coordenadas[n].x, coordenadas[n].y, prioridad[tipo - 1]);

								siguiente.setScale(0);

								capaCubos.add(siguiente);

								TweenLite.to(siguiente, 0.5, {
									setScaleX : 1,
									setScaleY : 1,
									ease : Strong.easeOut,
									onUpdate : function() {
										capaCubos.batchDraw();
									}
								});
							}

						}
					}
				});

			});
		}

	}

	function Elemento(x, y, tipo) {

		this.x = x;
		this.y = y;
		this.tipo = (tipo == "cubo") ? "cubo" : tipo + "_base" + bases[base];

		var sprite = new Kinetic.Sprite({
			x : x,
			y : y,
			width : canvas.frames[this.tipo][0].width,
			height : canvas.frames[this.tipo][0].height,
			offset : {
				x : canvas.frames[this.tipo][0].width / 2,
				y : canvas.frames[this.tipo][0].height / 2
			},
			image : canvas.spritesheet,
			animation : this.tipo,
			animations : canvas.frames,
			draggable : true,
			name : tipo
		});

		sprite.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		sprite.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});

		sprite.on('dblclick dbltap', function() {

			if (tipo != "cubo") {

				TweenLite.to(sprite, 0.3, {
					setScaleX : 0.5,
					setScaleY : 0.5,
					ease : Strong.easeIn,
					onUpdate : function() {
						capaCubos.batchDraw();
					},
					onComplete : function() {
						var siguientes = prioridad[prioridad.indexOf(tipo) + 1];
						var nombreImagenSiguientes = (siguientes == "cubo") ? "cubo" : siguientes + "_base" + bases[base];

						for (var i = 0; i < bases[base]; i++) {
							var desagrupado = new Elemento(sprite.getX(), sprite.getY(), siguientes);
							desagrupado.setScale(0);
							capaCubos.add(desagrupado);
							TweenLite.to(desagrupado, 0.5, {
								setX : (desagrupado.getX() - 32) + (Math.random() * 64),
								setY : (desagrupado.getY() - 32) + (Math.random() * 64),
								setScaleX : 1,
								setScaleY : 1,
								ease : Strong.easeOut,
								onUpdate : function() {
									capaCubos.batchDraw();
								}
							});

						}
						sprite.destroy();
						//capaCubos.draw();
					}
				})

			}

		});

		var papelera = capaVarios.get("#papelera")[0];

		sprite.on('dragstart', function() {
			sprite.moveToTop();
		});

		sprite.on('dragmove', function() {
			if (canvas.hayColision(sprite, papelera)) {
				TweenLite.to(sprite, 0.2, {
					setOpacity : 0.6,
					setScaleX : 0.9,
					setScaleY : 0.9,
					ease : Strong.easeIn,
					onUpdate : function() {
						capaCubos.batchDraw();
					}
				});
			} else if (sprite.getOpacity() != 1) {
				TweenLite.to(sprite, 0.2, {
					setOpacity : 1,
					setScaleX : 1,
					setScaleY : 1,
					ease : Power2.easeOut,
					onUpdate : function() {
						capaCubos.batchDraw();
					}
				});
			}
		});

		sprite.on('dragend', function() {
			if (canvas.hayColision(sprite, papelera)) {
				TweenLite.to(sprite, 0.3, {
					setX : papelera.getX(),
					setY : papelera.getY(),
					setScaleX : 0.5,
					setScaleY : 0.5,
					ease : Back.easeIn,
					onUpdate : function() {
						capaCubos.batchDraw();
					},
					onComplete : function() {
						sprite.destroy();
						capaCubos.draw();
					}
				});

			}

			if ( typeof sprite.getDragBoundFunc() == "undefined") {
				sprite.setDragBoundFunc(function(pos) {
					var nuevaY = (pos.y < limiteArrastreY * canvas.escenario.getScale().y) ? limiteArrastreY * canvas.escenario.getScale().y : pos.y;
					return {
						x : pos.x,
						y : nuevaY
					};
				});
				if (sprite.getY() < limiteArrastreY) {
					sprite.setY(limiteArrastreY);
					capaCubos.draw();
				}

			}
		});

		return sprite;

	}

	function logicaJuego() {

		for (var i = 0; i < 4; i++) {
			var tipo = prioridad[i];

			var boton = new MathCanvas.Boton({
				x : posiciones[tipo].x,
				y : posiciones[tipo].y,
				spritesheet : canvas.spritesheet,
				imagen : "icono_" + tipo,
				frames : canvas.frames,
				onClick : function() {
					if (!borrando) {
						var elemento = new Elemento((this.getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (canvas.tamaño().alto - limiteArrastreY - 100)), this.tipo);

						capaCubos.add(elemento);

						elemento.draw();
					}
				},
				onDrag : function() {
					if (!borrando) {
						var elemento = new Elemento(canvas.posicionRaton().x, canvas.posicionRaton().y, this.tipo);
						capaCubos.add(elemento);
						elemento.startDrag();
					}
				}
			});

			boton.tipo = tipo;

			botones.push(boton);

			capaBotones.add(boton);

		}

		var botonLimpiar = new MathCanvas.Boton({
			x : posiciones.papelera.x,
			y : posiciones.papelera.y,
			ancho : 32,
			alto : 32,
			spritesheet : canvas.spritesheet,
			imagen : "icono_papelera",
			frames : canvas.frames,
			onClick : function() {
				numeroBase10 = 0;
				var borradas = 0;
				for (var i = 0; i < capaCubos.getChildren().length; i++) {
					var elemento = capaCubos.getChildren()[i];
					borrando = true;
					TweenLite.to(elemento, 0.5, {
						setX : botonLimpiar.getX(),
						setY : botonLimpiar.getY(),
						setOpacity : 0.0,
						setScaleX : 0.5,
						setScaleY : 0.5,
						ease : Strong.easeOut,
						onUpdate : function() {
							capaCubos.batchDraw();
						},
						onComplete : function() {
							borradas++;
							if (borradas == capaCubos.getChildren().length) {
								capaCubos.removeChildren();
								capaCubos.draw();
								borrando = false;
							}
						}
					});
				}
			}
		});

		botonLimpiar.setId("papelera");

		capaVarios.add(botonLimpiar);

		/*var consejos = new Kinetic.Animation(function(frame) {
		 var time = frame.time, timeDiff = frame.timeDiff / 1000, frameRate = frame.frameRate;
		 if (frame.time > 4000 && !consejosMostrados.colocarNuevoElemento) {
		 consejosMostrados.colocarNuevoElemento = true;
		 var consejo = new Kinetic.Label({
		 x : 891,
		 y : 50,
		 opacity : 0,
		 listening : false,
		 text : {
		 text : 'Pulsa o arrastra para\nsacar un nuevo cubo',
		 fontFamily : 'Calibri',
		 fontSize : 18,
		 padding : 5,
		 fill : 'black'
		 },
		 rect : {
		 fill : 'yellow',
		 stroke : 'black',
		 strokeWidth : 2,
		 opacity : 0.5,
		 pointerDirection : 'down',
		 pointerWidth : 20,
		 pointerHeight : 10,
		 lineJoin : 'round',
		 shadowColor : 'black',
		 shadowBlur : 2,
		 shadowOffset : 10,
		 shadowOpacity : 0.1
		 }
		 });

		 consejo.setOffset(consejo.getWidth() / 2, consejo.getHeight() / 2);

		 capaBotones.add(consejo);

		 consejo.transitionTo({
		 y : 70,
		 opacity : 0.5,
		 duration : 1.5,
		 easing : 'ease-out'
		 });

		 }

		 }, capaBotones);

		 consejos.start();*/

		capaBotones.draw();
		capaCubos.draw();
		capaVarios.draw();
	}

})();
