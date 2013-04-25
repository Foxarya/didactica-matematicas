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

	var numero = 0;
	var devolver = "";
	var multi = 1000;
	var numbase10 = 0;

	var id = ["bloque", "placa", "barra", "cubo"];
	var contador = 3;
	for (var i = 0; i < id.length; i++) {
		var elementos = capaCubos.get("." + id[i]);
		if (elementos.length >= bases[base] || elementos.length > 9) {
			devolver = "nada";
			numero += 9 * multi;
		}

		if (elementos.length != 0) {
			numero += elementos.length * multi;
		}
		numbase10 += elementos.length * Math.pow(bases[base], contador);
		contador--;

		multi /= 10;
	}
	if (devolver != "nada") {
		var contador = 0;
		for (var i = 4; i >= 0; i--) {
			if (numero.toString().length < i) {
				devolver += "0 ";
			} else {

				devolver += numero.toString().charAt(contador) + " ";
				contador++;

			}

		}
	}

	return {
		integer : numero,
		texto : devolver,
		base10 : numbase10
	};

}

function agrupar(elementos) {
	var coordenadas = {
		x : elementos[0].getX(),
		y : elementos[0].getY()
	};
	var offset = {
		x : 0,
		y : 0
	};

	for (var i = 0; i < elementos.length - (elementos.length % bases[base]); i++) {
		var elemento = elementos[i];

		var tipo;
		if (i == 0)
			tipo = prioridad.indexOf(elemento.getName());

		if (i + 1 == elementos.length - (elementos.length % bases[base])) {
			elemento.moveToBottom();
			elemento.transitionTo({
				x : coordenadas.x + offset.x,
				y : coordenadas.y + offset.y,
				duration : 1,
				easing : 'ease-in-out',
				callback : function() {

					for (var i = 0; i < elementos.length - (elementos.length % bases[base]); i++) {
						var elemento = elementos[i];

						elemento.destroy();

						if (i % bases[base] == 0) {
							var siguiente = new Elemento(coordenadas.x, coordenadas.y, prioridad[tipo - 1]);

							capaCubos.add(siguiente);
							siguiente.draw();
							coordenadas.x = elementos[i + 1].getX();
							coordenadas.y = elementos[i + 1].getY();
						}

					}
				}
			});
		} else {
			elemento.moveUp();
			elemento.transitionTo({
				x : coordenadas.x + offset.x,
				y : coordenadas.y + offset.y,
				duration : 1,
				easing : 'ease-in-out'
			});
			offset.x += posiciones[elemento.getName()].offset.x;
			offset.y += posiciones[elemento.getName()].offset.y;

		}

		if (i + 1 % bases[base] == 0) {
			offset.y += 20;
		}

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
		x : this.x,
		y : this.y,
		image : imagen,
		width : imagen.width,
		height : imagen.height,
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
			var siguientes = prioridad[prioridad.indexOf(tipo) + 1];
			var offsetY = 0;
			for (var i = 0; i < bases[base]; i++) {
				var desagrupado = new Elemento(kineticImage.getX(), kineticImage.getY() + offsetY, siguientes);
				capaCubos.add(desagrupado);
				offsetY += 30;

			}
			kineticImage.destroy();
			capaCubos.draw();
		}

	});

	var papelera = capaPapelera.get("#papelera")[0];

	kineticImage.on('dragstart', function() {
		kineticImage.moveToTop();
	});

	kineticImage.on('dragmove', function() {
		if (hayColision(kineticImage, papelera)) {
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
		if (hayColision(kineticImage, papelera)) {
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
	});

	return kineticImage;

}

function Boton(x, y, ancho, alto, contenido, onclick, ondrag) {

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

				/*var mayorX = Math.max(seleccion.origenX, seleccion.finalX);
				 var mayorY = Math.max(seleccion.origenY, seleccion.finalY);
				 var menorX = Math.min(seleccion.origenX, seleccion.finalX);
				 var menorY = Math.min(seleccion.origenY, seleccion.finalY);

				 if ((cubo.getX() > menorX && cubo.getX() + cubo.getWidth() < mayorX) && (cubo.getY() > menorY && cubo.getY() + cubo.getHeight() < mayorY)) {
				 seleccionados.push(cubo);
				 /*cubo.applyFilter(Kinetic.Filters.Grayscale, null, function() {
				 capaCubos.draw();
				 });
				 if (seleccionados[0].getName() != cubo.getName()) {
				 seleccionadoElementoDistinto = true;
				 break;
				 }
				 }*/

				if (hayColision(seleccion.rect, cubo)) {
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

	var imgBotonCubo = new Boton(866, 80, 50, 50, dictImg["icono_cubo"], function() {
		var cubo = new Elemento(posiciones.cubo.x, posiciones.cubo.y, "cubo");

		capaCubos.add(cubo);

		cubo.draw();
	}, function() {

		var cubo = new Elemento(posicionRaton().x - (dictImg["cubo"].width / 2), posicionRaton().y - (dictImg["cubo"].height / 2), "cubo");
		capaCubos.add(cubo);
		cubo.startDrag();

	});

	var imgBotonBarras = new Boton(610, 80, 100, 100, dictImg["icono_barra"], function() {

		var barra = new Elemento(posiciones.barra.x, posiciones.barra.y, "barra");

		capaCubos.add(barra);

		barra.draw();

	}, function() {

		var barra = new Elemento(posicionRaton().x - (dictImg["barra_base" + bases[base]].width / 2), posicionRaton().y - (dictImg["barra_base" + bases[base]].height / 2), "barra");
		capaCubos.add(barra);
		barra.startDrag();

	});

	var imgBotonPlacas = new Boton(354, 78, 100, 100, dictImg["icono_placa"], function() {

		var placa = new Elemento(posiciones.placa.x, posiciones.placa.y, "placa");

		capaCubos.add(placa);

		placa.draw();

	}, function() {

		var placa = new Elemento(posicionRaton().x - (dictImg["placa_base" + bases[base]].width / 2), posicionRaton().y - (dictImg["placa_base" + bases[base]].height / 2), "placa");
		capaCubos.add(placa);
		placa.startDrag();

	});

	var imgBotonBloques = new Boton(95, 60, 100, 100, dictImg["icono_bloque"], function() {

		var bloque = new Elemento(posiciones.bloque.x, posiciones.bloque.y, "bloque");

		capaCubos.add(bloque);

		posiciones.bloque.offset.y += 100;

		if (posiciones.bloque.offset.y > escenario.getHeight()) {
			posiciones.bloque.offset.y = 60;
			posiciones.bloque.offset.x += 40;
		}
		bloque.draw();

	}, function() {

		var bloque = new Elemento(posicionRaton().x - (dictImg["bloque_base" + bases[base]].width / 2), posicionRaton().y - (dictImg["bloque_base" + bases[base]].height / 2), "bloque");
		capaCubos.add(bloque);
		bloque.startDrag();

	});

	var botonLimpiar = new Boton(950, 490, 32, 32, dictImg["icono_papelera"], function() {

		var borradas = 0;
		for(var i = 0; i < capaCubos.getChildren().length; i++)
		{
			var elemento = capaCubos.getChildren()[i];
			elemento.transitionTo({
				x: this.getX(),
				y: this.getY(),
				opacity: 0.5,
				scale: {
					x: 0.5,
					y: 0.5
				},
				duration: 0.5,
				easing: 'back-ease-in',
				callback: function() {
					borradas++;
					if(borradas == capaCubos.getChildren().length)
					{
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

	var imgSubirBase = new Boton(representacionBase.getX() + representacionBase.getWidth() + 20, 45, 24, 24, dictImg["subirBase"], function() {

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

	var imgBajarBase = new Boton(representacionBase.getX() - 40, 45, 24, 24, dictImg["bajarBase"], function() {

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