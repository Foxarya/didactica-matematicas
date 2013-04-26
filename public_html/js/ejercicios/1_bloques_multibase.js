var container;
var padre;

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 500,
	height : 575,
	draggable : true,
	dragBoundFunc : function(pos) {
		return {
			x : this.getAbsolutePosition().x,
			y : this.getAbsolutePosition().y
		}
	}
});

var capaBotones = new Kinetic.Layer();
var capaCubos = new Kinetic.Layer();
var capaPapelera = new Kinetic.Layer();

var posiciones = {

	cubo : {
		x : 780,
		y : 60,
		offset : {
			x : 17,
			y : 0
		}
	},
	barra : {
		x : 480,
		y : 60,
		offset : {
			x : 0,
			y : 17
		}
	},
	placa : {
		x : 280,
		y : 60,
		offset : {
			x : 2,
			y : -2
		}
	},
	bloque : {
		x : 5,
		y : 60,
		offset : {
			x : 0,
			y : 0
		}
	}

};

var prioridad = ["bloque", "placa", "barra", "cubo"];

var bases = [2, 3, 4, 5, 6, 8, 10, 12];

var limites = [15, 80, 255, 624, 1295, 4095, 9999, 20735];

var contar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "F"];

var dictImg = {};

var base = 3;

function tamaño() {
	return {
		width : escenario.getWidth() / escenario.getScale().x,
		height : escenario.getHeight() / escenario.getScale().y
	}
}

function posicionRaton() {
	return {
		x : escenario.getPointerPosition().x / escenario.getScale().x,
		y : escenario.getPointerPosition().y / escenario.getScale().y
	}
}

function cargarImagenes() {

	var barraCarga = new Kinetic.Rect({
		x : tamaño().width / 2 - 250,
		y : tamaño().height / 2,
		width : 0,
		height : 5,
		stroke : 'black',
		strokeWidth : 2,
		fill : 'orange'

	});

	capaCubos.add(barraCarga);

	$.ajax({
		type : "GET",
		url : "img/ejercicios/1_bloques_multibase/indice.xml",
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
						logicaJuego();
					}
				};

				imagen.src = "img/ejercicios/1_bloques_multibase/" + nombreImagen + ".png";

			});
		}
	});

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

		if (cogidos.indexOf(i) != -1)
			continue;

		var elemento = elementos[0];
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

function hayColision(elementoA, elementoB) {

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

function Elemento(x, y, tipo) {

	this.x = x;
	this.y = y;
	this.tipo = tipo;

	var imagen = (tipo == "cubo") ? dictImg["cubo"] : dictImg[tipo + "_base" + bases[base]];

	var kineticImage = new Kinetic.Image({
		x : -(imagen.width / 2),
		y : -(imagen.height / 2),
		image : imagen,
		width : imagen.width,
		height : imagen.height
	});

	var grupo = new Kinetic.Group({
		x : x,
		y : y,
		width : kineticImage.getWidth(),
		height : kineticImage.getHeight(),
		draggable : true,
		name : tipo
	});

	grupo.add(kineticImage);

	kineticImage.createImageHitRegion();

	grupo.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupo.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});

	grupo.on('dblclick dbltap', function() {

		if (tipo != "cubo") {

			grupo.transitionTo({
				scale : {
					x : 0.5,
					y : 0.5
				},
				duration : 0.3,
				easing : 'strong-ease-in',
				callback : function() {
					
					
					var siguientes = prioridad[prioridad.indexOf(tipo) + 1];
					var nombreImagenSiguientes = (siguientes == "cubo") ? "cubo" : siguientes + "_base" + bases[base];
					var separacion = 5;
					var offset = {
						x: 0,
						y: -((dictImg[nombreImagenSiguientes].height * bases[base] + separacion * bases[base]) / 2)
					};
					
					for (var i = 0; i < bases[base]; i++) {
						var desagrupado = new Elemento(grupo.getX() + offset.x, grupo.getY() + offset.y, siguientes);
						desagrupado.setScale(0);
						capaCubos.add(desagrupado);
						desagrupado.transitionTo({
							scale: {
								x: 1,
								y: 1
							},
							duration: 0.5,
							easing: 'strong-ease-out'
						});
						offset.y += desagrupado.getHeight() + separacion;
						if(offset.y > tamaño.height)
						{
							offset.y = -((dictImg[siguientes + "_base"+bases[base]].height * bases[base] + separacion * bases[base]) / 2);
							offset.x += grupo.getWidth();
						}

					}
					grupo.destroy();
					capaCubos.draw();
					
				}
			});

		}

	});

	var papelera = capaPapelera.get("#papelera")[0];

	grupo.on('dragstart', function() {
		grupo.moveToTop();
	});

	grupo.on('dragmove', function() {
		if (hayColision(grupo, papelera)) {
			grupo.transitionTo({
				opacity : 0.6,
				scale : {
					x : 0.9,
					y : 0.9
				},
				duration : 0.2,
				easing : 'strong-ease-in'
			});
		} else if (grupo.getOpacity() != 1) {
			grupo.transitionTo({
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

	grupo.on('dragend', function() {
		if (hayColision(grupo, papelera)) {
			grupo.transitionTo({
				x : papelera.getX(),
				y : papelera.getY(),
				scale : {
					x : 0.5,
					y : 0.5
				},
				duration : 0.3,
				easing : 'back-ease-in',
				callback : function() {
					grupo.destroy();
					capaCubos.draw();
				}
			});

		}
	});

	return grupo;

}

function Boton(x, y, ancho, alto, contenido, onclick, ondrag) {

	var boton;
	var draggable = (ondrag != null) ? true : false;
	var grupo;

	if ( contenido instanceof Image) {
		boton = new Kinetic.Image({
			x : -(contenido.width / 2),
			y : -(contenido.height / 2),
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
			x : 0,
			y : 0,
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

		boton.setX(-(boton.getWidth() / 2));
		boton.setY(-(boton.getHeight() / 2));

	}

	grupo = new Kinetic.Group({
		x : x,
		y : y,
		width : boton.getWidth(),
		height : boton.getHeight(),
		draggable : draggable,
		dragBoundFunc : function(pos) {
			return {
				x : this.getAbsolutePosition().x,
				y : this.getAbsolutePosition().y
			}
		}
	});

	grupo.add(boton);

	grupo.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupo.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});

	grupo.on('click tap', onclick);

	if (draggable)
		grupo.on('dragstart', ondrag);

	return grupo;

}


$(document).ready(function() {
	container = $('#container');
	padre = $(container).parent();
	var resolucionOriginal = {
		ancho : 1026,
		alto : escenario.getHeight(),
		relacion : 1026 / escenario.getHeight()
	};
	escenario.add(capaPapelera);
	escenario.add(capaCubos);
	escenario.add(capaBotones);

	$(window).resize(function() {

		container.attr('width', $(padre).width());
		container.attr('height', $(padre).width() / resolucionOriginal.relacion);
		escenario.setWidth($(padre).width());
		escenario.setHeight($(padre).width() / resolucionOriginal.relacion);
		escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);

	});

	$(window).resize();

	container.on("mouseout", function() {
		if (escenario.isDragging()) {
			escenario.stopDrag();
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

	escenario.on('dragstart', function(evt) {

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

	escenario.on('dragmove', function() {

		if (seleccion.rect != null) {
			seleccion.rect.setWidth(posicionRaton().x - seleccion.rect.getX());
			seleccion.rect.setHeight(posicionRaton().y - seleccion.rect.getY());
		}

	});

	escenario.on('dragend', function() {
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

});

function logicaJuego() {

	var imgBotonCubo = new Boton(891, 130, 50, 50, dictImg["icono_cubo"], function() {
		var cubo = new Elemento(this.getX(), this.getY() + 200, "cubo");

		capaCubos.add(cubo);

		cubo.draw();
	}, function() {

		var cubo = new Elemento(posicionRaton().x, posicionRaton().y, "cubo");
		capaCubos.add(cubo);
		cubo.startDrag();

	});

	var imgBotonBarras = new Boton(660, 130, 100, 100, dictImg["icono_barra"], function() {

		var barra = new Elemento(posiciones.barra.x, posiciones.barra.y, "barra");

		capaCubos.add(barra);

		barra.draw();

	}, function() {

		var barra = new Elemento(posicionRaton().x, posicionRaton().y, "barra");
		capaCubos.add(barra);
		barra.startDrag();

	});

	var imgBotonPlacas = new Boton(404, 130, 100, 100, dictImg["icono_placa"], function() {

		var placa = new Elemento(posiciones.placa.x, posiciones.placa.y, "placa");

		capaCubos.add(placa);

		placa.draw();

	}, function() {

		var placa = new Elemento(posicionRaton().x, posicionRaton().y, "placa");
		capaCubos.add(placa);
		placa.startDrag();

	});

	var imgBotonBloques = new Boton(145, 130, 100, 100, dictImg["icono_bloque"], function() {

		var bloque = new Elemento(posiciones.bloque.x, posiciones.bloque.y, "bloque");

		capaCubos.add(bloque);

		posiciones.bloque.offset.y += 100;

		if (posiciones.bloque.offset.y > escenario.getHeight()) {
			posiciones.bloque.offset.y = 60;
			posiciones.bloque.offset.x += 40;
		}
		bloque.draw();

	}, function() {

		var bloque = new Elemento(posicionRaton().x, posicionRaton().y, "bloque");
		capaCubos.add(bloque);
		bloque.startDrag();

	});

	var botonLimpiar = new Boton(966, 506, 32, 32, dictImg["icono_papelera"], function() {

		var borradas = 0;
		for (var i = 0; i < capaCubos.getChildren().length; i++) {
			var elemento = capaCubos.getChildren()[i];
			elemento.transitionTo({
				x : this.getX(),
				y : this.getY(),
				opacity : 0.1,
				scale : {
					x : 0.5,
					y : 0.5
				},
				duration : 1,
				easing : 'strong-ease-out',
				callback : function() {
					borradas++;
					if (borradas == capaCubos.getChildren().length) {
						capaCubos.removeChildren();
						capaCubos.draw();
					}
				}
			});
		}

	});

	botonLimpiar.setId("papelera");

	var representacionNumerica = new Kinetic.Text({
		x : tamaño().width / 2,
		y : 15,
		text : '0 0 0 0 ',
		fontSize : 30,
		fontFamily : 'Calibri',
		fill : 'black'
	});
	var representacionBase = new Kinetic.Text({
		x : tamaño().width / 2,
		y : 47,
		text : 'Base ' + bases[base],
		fontSize : 18,
		fontFamily : 'Calibri',
		fill : 'black'
	});

	representacionNumerica.setId("numero");

	representacionNumerica.setX((tamaño().width / 2) - (representacionNumerica.getWidth() / 2));
	representacionBase.setX((tamaño().width / 2) - (representacionBase.getWidth() / 2));

	var imgSubirBase = new Boton(representacionBase.getX() + representacionBase.getWidth() + 32, 57, 24, 24, dictImg["subirBase"], function() {

		if (base != bases.length - 1) {
			base++;
			representacionBase.setText("Base " + bases[base]);
			capaBotones.draw();
			capaCubos.removeChildren();

			capaCubos.draw();

		}

		if (base == bases.length - 1) {
			this.hide();
			capaBotones.draw();
		}

	});

	var imgBajarBase = new Boton(representacionBase.getX() - 28, 57, 24, 24, dictImg["bajarBase"], function() {

		if (base != 0) {
			base--;
			representacionBase.setText("Base " + bases[base]);
			capaBotones.draw();
			capaCubos.removeChildren();
			capaCubos.draw();
		}

		if (base == 0) {
			this.hide();
			capaBotones.draw();
		}

	});

	var botones = [imgBotonCubo, imgBotonBarras, imgBotonPlacas, imgBotonBloques];

	capaBotones.add(imgSubirBase);
	capaBotones.add(imgBajarBase);

	capaBotones.add(representacionNumerica);
	capaBotones.add(representacionBase);

	capaPapelera.add(botonLimpiar);

	capaBotones.add(imgBotonCubo);

	capaBotones.add(imgBotonBarras);

	capaBotones.add(imgBotonPlacas);

	capaBotones.add(imgBotonBloques);

	capaCubos.on('draw', function() {

		var cuenta = cuentaRepresentados();

		for (var i = 0; i < botones.length; i++) {
			if (cuenta.base10 + Math.pow(bases[base], i) > limites[base]) {
				if (botones[i].isListening()) {
					botones[i].setOpacity(0.5);
					botones[i].setListening(false);
				}
			} else {
				botones[i].setListening(true);
				botones[i].setOpacity(1);
			}
		}

		if (cuenta.texto == "nada") {

			representacionNumerica.hide();
			capaBotones.draw();

		} else {
			if (!representacionNumerica.isVisible())
				representacionNumerica.show();

			representacionNumerica.setText(cuenta.texto);

		}

		if (base != 0 && !imgBajarBase.isVisible()) {
			imgBajarBase.show();
		}

		if (base != bases.length - 1 && !imgSubirBase.isVisible()) {
			imgSubirBase.show();
		}

		capaBotones.draw();

	});

	capaBotones.draw();
	capaCubos.draw();
	capaPapelera.draw();
}