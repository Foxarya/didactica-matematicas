(function() {

	var escenario;

	var capaBotones = new Kinetic.Layer();
	var capaCubos = new Kinetic.Layer();
	var capaVarios = new Kinetic.Layer();

	var borrando = false;

	var numeroBase10 = 0;

	/*
	 * CONSTANTES
	 */

	var posiciones = {
		bloque : {
			x : 128,
			y : 130
		},
		placa : {
			x : 385,
			y : 130
		},
		barra : {
			x : 641,
			y : 130
		},
		cubo : {
			x : 898,
			y : 130
		}

	};

	var prioridad = ["bloque", "placa", "barra", "cubo"];

	var bases = [2, 3, 4, 5, 6, 8, 10, 12];

	var limites = [15, 80, 255, 624, 1295, 4095, 9999, 20735];

	var contar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "F"];

	var base = 3;

	var limiteArrastreY = 210;

	var consejos = {
		sacarNuevoElemento : {
			trigger: true,
			texto: "Pulsa o arrastra para añadir un elemento nuevo",
			tiempo: 3
		},
		agrupar: {
			trigger: true,
			texto: "Pulsa en cualquier parte\n y arrastra para agrupar elementos",
			condicion: cuentaRepresentados().base10 >= bases[base],
			tiempo: 4
		},
		desagrupar : {
			trigger: true,
			texto: "Pulsa dos veces para desagrupar\nelementos compuestos",
			condicion: cuentaRepresentados().numero >= 10,
			tiempo: 15
		}
	};

	/*
	 * FIN CONSTANTES
	 */

	function cambioDeBase() {

		var resul = [];

		var cociente = numeroBase10;
		var restos = [];
		do {
			restos.push(cociente % bases[base]);
			cociente = Math.floor(cociente / bases[base]);
		} while(cociente >= bases[base]);

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

				elemento.transitionTo({
					x : grupos[i][0].getX(),
					y : grupos[i][0].getY(),
					scale : {
						x : 0.5,
						y : 0.5
					},
					duration : 0.3,
					easing : 'strong-ease-in',
					callback : function() {

						agrupados++;

						if (agrupados == bases[base] * grupos.length) {

							var numeroNuevosElementos = grupos.length;

							for (var z = 0; z < grupos.length; z++) {
								grupos[z].each(function(elemento) {
									elemento.destroy();
								});
							}
							for (var n = 0; n < numeroNuevosElementos; n++) {
								var siguiente = new Elemento(coordenadas[n].x, coordenadas[n].y, prioridad[tipo - 1]);

								siguiente.setScale(0);

								capaCubos.add(siguiente);
								capaCubos.draw();

								siguiente.transitionTo({
									scale : {
										x : 1,
										y : 1
									},
									duration : 0.5,
									easing : 'strong-ease-out'
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
		this.tipo = tipo;

		var imagen = (tipo == "cubo") ? MathCanvas.dictImg["cubo"] : MathCanvas.dictImg[tipo + "_base" + bases[base]];

		var kineticImage = new Kinetic.Image({
			x : x,
			y : y,
			image : imagen,
			width : imagen.width,
			height : imagen.height,
			offset : {
				x : imagen.width / 2,
				y : imagen.height / 2
			},
			draggable : true,
			name : tipo
		});

		kineticImage.createImageHitRegion();

		kineticImage.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		kineticImage.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});

		kineticImage.on('dblclick dbltap', function() {

			if (tipo != "cubo") {

				kineticImage.transitionTo({
					scale : {
						x : 0.5,
						y : 0.5
					},
					duration : 0.3,
					easing : 'strong-ease-in',
					callback : function() {

						var siguientes = prioridad[prioridad.indexOf(tipo) + 1];
						var nombreImagenSiguientes = (siguientes == "cubo") ? "cubo" : siguientes + "_base" + bases[base];

						for (var i = 0; i < bases[base]; i++) {
							var desagrupado = new Elemento(kineticImage.getX(), kineticImage.getY(), siguientes);
							desagrupado.setScale(0);
							capaCubos.add(desagrupado);
							desagrupado.transitionTo({
								x : (this.getX() - 32) + (Math.random() * 64),
								y : (this.getY() - 32) + (Math.random() * 64),
								scale : {
									x : 1,
									y : 1
								},
								duration : 0.5,
								easing : 'strong-ease-out'
							});

						}
						kineticImage.destroy();
						capaCubos.draw();

					}
				});

			}

		});

		var papelera = capaVarios.get("#papelera")[0];

		kineticImage.on('dragstart', function() {
			kineticImage.moveToTop();
		});

		kineticImage.on('dragmove', function() {
			if (MathCanvas.hayColision(kineticImage, papelera)) {
				kineticImage.transitionTo({
					opacity : 0.6,
					scale : {
						x : 0.9,
						y : 0.9
					},
					duration : 0.2,
					easing : 'strong-ease-in'
				});
			} else if (kineticImage.getOpacity() != 1) {
				kineticImage.transitionTo({
					opacity : 1,
					scale : {
						x : 1,
						y : 1
					},
					duration : 0.2,
					easing : 'ease-out'
				});
			}
		});

		kineticImage.on('dragend', function() {
			if (MathCanvas.hayColision(kineticImage, papelera)) {
				kineticImage.transitionTo({
					x : papelera.getX(),
					y : papelera.getY(),
					scale : {
						x : 0.5,
						y : 0.5
					},
					duration : 0.3,
					easing : 'back-ease-in',
					callback : function() {
						kineticImage.destroy();
						capaCubos.draw();
					}
				});

			}

			if ( typeof kineticImage.getDragBoundFunc() == "undefined") {
				kineticImage.setDragBoundFunc(function(pos) {
					var nuevaY = (pos.y < limiteArrastreY) ? limiteArrastreY : pos.y;
					return {
						x : pos.x,
						y : nuevaY
					};
				});
				if (kineticImage.getY() < limiteArrastreY) {
					kineticImage.setY(limiteArrastreY);
					capaCubos.draw();
				}

			}
		});

		return kineticImage;

	}


	$(document).ready(function() {

		escenario = new MathCanvas.Escenario({
			capas : [capaVarios, capaBotones, capaCubos],
			seleccion : {
				capa : capaCubos,
				callback : agrupar
			},
			urlEjercicio : "img/ejercicios/1_bloques_multibase/",
			callback : logicaJuego
		});

	});

	function logicaJuego() {

		var botones = [];

		for (var i = 0; i < 4; i++) {
			var tipo = prioridad[i];

			var boton = new MathCanvas.Boton({
				x : posiciones[tipo].x,
				y : posiciones[tipo].y,
				contenido : MathCanvas.dictImg["icono_" + tipo],
				onClick : function() {
					if (!borrando) {
						var elemento = new Elemento((this.getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (MathCanvas.tamaño().alto - limiteArrastreY - 100)), this.tipo);

						capaCubos.add(elemento);

						elemento.draw();
					}
				},
				onDrag : function() {
					if (!borrando) {
						var elemento = new Elemento(MathCanvas.posicionRaton().x, MathCanvas.posicionRaton().y, this.tipo);
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
			x : 966,
			y : 506,
			ancho : 32,
			alto : 32,
			contenido : MathCanvas.dictImg["icono_papelera"],
			onClick : function() {
				numeroBase10 = 0;
				var borradas = 0;
				for (var i = 0; i < capaCubos.getChildren().length; i++) {
					var elemento = capaCubos.getChildren()[i];
					borrando = true;
					elemento.transitionTo({
						x : this.getX(),
						y : this.getY(),
						opacity : 0.0,
						scale : {
							x : 0.5,
							y : 0.5
						},
						duration : 0.5,
						easing : 'strong-ease-out',
						callback : function() {
							borradas++;
							if (borradas == capaCubos.getChildren().length) {
								capaCubos.removeChildren();
								capaCubos.draw();
								borrando = false;
							}
						}
					});
				}
				capaCubos.draw();
			}
		});

		botonLimpiar.setId("papelera");

		var representacionNumerica = new Kinetic.Text({
			x : MathCanvas.tamaño().ancho / 2,
			y : 15,
			text : '0 0 0 0 ',
			fontSize : 30,
			fontFamily : 'Calibri',
			fill : 'black'
		});
		var representacionBase = new Kinetic.Text({
			x : MathCanvas.tamaño().ancho / 2,
			y : 47,
			text : 'Base ' + bases[base],
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'black'
		});

		representacionNumerica.setId("numero");

		representacionBase.setX((MathCanvas.tamaño().ancho / 2) - (representacionBase.getWidth() / 2));

		var btnSubirBase = new MathCanvas.Boton({
			x : representacionBase.getX() + representacionBase.getWidth() + 32,
			y : 57,
			ancho : 24,
			alto : 24,
			contenido : MathCanvas.dictImg["subirBase"],
			onClick : function() {
				if (base != bases.length - 1) {
					if (cuentaRepresentados().base10 != numeroBase10 && cuentaRepresentados().base10 != 0) {
						numeroBase10 = cuentaRepresentados().base10;
					}
					base++;

					representacionBase.setText("Base " + bases[base]);
					capaBotones.draw();

					capaCubos.removeChildren();
					var resul = cambioDeBase();

					if (resul.length <= 4 && resul.length != 0) {
						for (var i = resul.length - 1; i >= 0; i--) {
							for (var j = 0; j < resul[i]; j++) {
								var nuevoElemento = new Elemento((botones[i].getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (MathCanvas.tamaño().alto - limiteArrastreY - 100)), prioridad[i]);
								nuevoElemento.setScale(0, 0);

								capaCubos.add(nuevoElemento);

								nuevoElemento.transitionTo({
									scale : {
										x : 1,
										y : 1
									},
									duration : 0.3,
									easing : 'back-ease-out'
								});
							}
						}

					}

					capaCubos.draw();

				}

				if (base == bases.length - 1) {
					this.hide();
					capaBotones.draw();
				}

			}
		});

		var btnBajarBase = new MathCanvas.Boton({
			x : representacionBase.getX() - 28,
			y : 57,
			ancho : 24,
			alto : 24,
			contenido : MathCanvas.dictImg["bajarBase"],
			onClick : function() {
				if (base != 0) {
					if (numeroBase10 < limites[base - 1]) {
						numeroBase10 = cuentaRepresentados().base10;
					}
					base--;
					representacionBase.setText("Base " + bases[base]);
					capaBotones.draw();
					capaCubos.removeChildren();
					var resul = cambioDeBase();

					if (resul.length <= 4 && resul.length != 0) {
						for (var i = resul.length - 1; i >= 0; i--) {
							for (var j = 0; j < resul[i]; j++) {
								var nuevoElemento = new Elemento((botones[i].getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (MathCanvas.tamaño().alto - limiteArrastreY - 100)), prioridad[i]);
								nuevoElemento.setScale(0, 0);

								capaCubos.add(nuevoElemento);

								nuevoElemento.transitionTo({
									scale : {
										x : 1,
										y : 1
									},
									duration : 0.3,
									easing : 'back-ease-out'
								});
							}
						}
					}
					capaCubos.draw();
				}

				if (base == 0) {
					this.hide();
					capaBotones.draw();
				}

			}
		});

		capaBotones.add(btnSubirBase);
		capaBotones.add(btnBajarBase);

		capaBotones.add(representacionNumerica);
		capaBotones.add(representacionBase);

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
		
		var limiteRepesentacionGrafica = new Kinetic.Text({
			x : MathCanvas.tamaño().ancho / 2,
			y : 70,
			text : 'El número no se puede representar gráficamente',
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'red'
		});
		
		var agrupacionPosible = new Kinetic.Text({
			x : MathCanvas.tamaño().ancho / 2,
			y : 70,
			text : 'Hay elementos que pueden agruparse',
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'red'
		});
		
		limiteRepesentacionGrafica.setX((MathCanvas.tamaño().ancho / 2) - (limiteRepesentacionGrafica.getWidth() / 2));
		agrupacionPosible.setX((MathCanvas.tamaño().ancho / 2) - (agrupacionPosible.getWidth() / 2));
		

		capaCubos.on('draw', function() {

			var cuenta = cuentaRepresentados();
			
			var potencia = 3;
			for (var i in botones) {
				if (cuenta.base10 + Math.pow(bases[base], potencia) > limites[base]) {
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

			if (cuenta.base10 == 0 && numeroBase10 != 0) {

				var resul = cambioDeBase();
				var texto = "";
				for (var i = 0; i < resul.length; i++) {
					texto += resul[i] + " ";
				}
				representacionNumerica.setText(texto);

				//Aquí se avisa que el número no se puede representar gráficamente en la base actual.
				
				capaBotones.add(limiteRepesentacionGrafica);
				
				limiteRepesentacionGrafica.show();
			
			} else {

				if (cuenta.texto == "nada") {

					representacionNumerica.hide();
					capaBotones.draw();

					//Aquí se avisa que quedan elementos por agrupar.
					
					capaBotones.add(agrupacionPosible);
					agrupacionPosible.show();
					

				} else {
					if (!representacionNumerica.isVisible())
						representacionNumerica.show();

					representacionNumerica.setText(cuenta.texto);

					//Aquí habría que comprobar si hay avisos mostrándose y hacerlos desaparecer
					
					limiteRepesentacionGrafica.hide();
					agrupacionPosible.hide();
					

				}
			}

			if (base != 0 && !btnBajarBase.isVisible()) {
				btnBajarBase.show();
			}

			if (base != bases.length - 1 && !btnSubirBase.isVisible()) {
				btnSubirBase.show();
			}

			representacionNumerica.setX((MathCanvas.tamaño().ancho / 2) - (representacionNumerica.getWidth() / 2));
			capaBotones.draw();

		});

		capaBotones.draw();
		capaCubos.draw();
		capaVarios.draw();
	}

})();