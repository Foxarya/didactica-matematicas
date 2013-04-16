var container;
var padre;

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

var capaBotones = new Kinetic.Layer();
var capaCubos = new Kinetic.Layer();

var posiciones = {

	cubo : {
		x : 780,
		y : 60,
		offsetX : 0,
		offsetY : 0
	},
	barra : {
		x : 480,
		y : 60,
		offsetX : 0,
		offsetY : 0
	},
	placa : {
		x : 280,
		y : 60,
		offsetX : 0,
		offsetY : 0
	},
	bloque : {
		x : 5,
		y : 60,
		offsetX : 0,
		offsetY : 0
	}

};

var prioridad = ["bloque", "placa", "barra", "cubo"];

var dictImg = {};

var base = 6;

function posicionRaton() {
	return {
		x : escenario.getPointerPosition().x / escenario.getScale().x,
		y : escenario.getPointerPosition().y / escenario.getScale().y
	}
}

function cargarImagenes() {

	$.ajax({
		type : "GET",
		url : "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/indice.xml",
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

}

function Elemento(x, y, tipo) {

	this.x = x;
	this.y = y;
	this.tipo = tipo;
	
	var imagen = (tipo == "cubo") ? dictImg["cubo"] : dictImg[tipo+"_base"+base] 
	
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : imagen,
		width : imagen.width,
		height : imagen.height,
		draggable : true,
		name : tipo
	});

	this.kineticImage.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	this.kineticImage.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	var kine = this.kineticImage;
	this.kineticImage.on('dragstart', function(kine) {
		//kine.moveToTop();
	}(kine));

	return this.kineticImage;

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

	boton.on('click', onclick);

	if (draggable)
		boton.on('dragstart', ondrag);

	return boton;

}


$(document).ready(function() {
	container = $('#container');
	padre = $(container).parent();
	escenario.add(capaCubos);
	escenario.add(capaBotones);

	$(window).resize(redimensionaCanvas);
	container.on("mouseout", function() {
		if (escenario.isDragging()) {
			escenario.stopDrag();
			seleccion.rect.destroy();
			capaCubos.draw();
			seleccion.rect = null;
		}
	});

	function redimensionaCanvas() {
		container.attr('width', $(padre).width());
		escenario.setWidth($(padre).width());
		escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);
	}

	redimensionaCanvas();

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
			capaCubos.draw();
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

				var mayorX = Math.max(seleccion.origenX, seleccion.finalX);
				var mayorY = Math.max(seleccion.origenY, seleccion.finalY);
				var menorX = Math.min(seleccion.origenX, seleccion.finalX);
				var menorY = Math.min(seleccion.origenY, seleccion.finalY);

				if ((cubo.getX() > menorX && cubo.getX() + cubo.getWidth() < mayorX) && (cubo.getY() > menorY && cubo.getY() + cubo.getHeight() < mayorY)) {
					seleccionados.push(cubo);
					cubo.applyFilter(Kinetic.Filters.Grayscale, null, function() {
						capaCubos.draw();
					});
					if (seleccionados[0].getName() != cubo.getName()) {
						seleccionadoElementoDistinto = true;
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

					cubo.transitionTo({
						x : offsetX,
						y : coordenadas.y,
						duration : 1,
						easing : 'ease-in-out'
					});
					offsetX += 9;

				}
				for (var i = 0; i < seleccionados.length - (seleccionados.length % base); i++) {
					var cubo = seleccionados[i];
					var tipo;
					if (i == 0)
						tipo = prioridad.indexOf(cubo.getName());

					cubo.destroy();

					if (i % base == 0) {
						var siguiente = new Elemento(coordenadas.x, coordenadas.y, prioridad[tipo - 1]);

						capaCubos.add(siguiente);
						capaCubos.draw();
						coordenadas.x = seleccionados[i+1].getX();
						coordenadas.y = seleccionados[i+1].getY();
					}

				}

			}

			seleccion.rect.destroy();
			capaCubos.draw();
			seleccion.rect = null;
		}
	});

});

function logicaJuego() {

	var imgBotonCubo = new Boton(866, 30, 50, 50, dictImg["icono_cubo"], function() {

		var cubo = new Elemento(posiciones.cubo.x + posiciones.cubo.offsetX, posiciones.cubo.y + posiciones.cubo.offsetY, "cubo");

		capaCubos.add(cubo);

		posiciones.cubo.offsetY += 50;

		if (posiciones.cubo.offsetY > escenario.getHeight()) {
			posiciones.cubo.offsetY = 60;
			posiciones.cubo.offsetX += 40;
		}

		capaCubos.draw();

	}, function() {

		var cubo = new Elemento(posicionRaton().x - (dictImg["cubo"].width / 2), posicionRaton().y - (dictImg["cubo"].height / 2), "cubo");
		capaCubos.add(cubo);
		cubo.startDrag();

	});

	var imgBotonBarras = new Boton(610, 30, 100, 100, dictImg["icono_barra"], function() {

		var barra = new Elemento(posiciones.barra.x + posiciones.barra.offsetX, posiciones.barra.y + posiciones.barra.offsetY, "barra");

		capaCubos.add(barra);

		posiciones.barra.offsetY += 50;

		if (posiciones.barra.offsetY >= escenario.getHeight()) {
			posiciones.barra.offsetY = 60;
			posiciones.barra.offsetX += 40;
		}

		capaCubos.draw();

	}, function() {

		var barra = new Elemento(posicionRaton().x - (dictImg["barra_base" + base].width / 2), posicionRaton().y - (dictImg["barra_base"+base].height / 2), "barra");
		capaCubos.add(barra);
		barra.startDrag();

	});

	var imgBotonPlacas = new Boton(354, 20, 100, 100, dictImg["icono_placa"], function() {

		var placa = new Elemento(posiciones.placa.x + posiciones.placa.offsetX, posiciones.placa.y + posiciones.placa.offsetY, "placa");

		capaCubos.add(placa);

		posiciones.placa.offsetY += 80;

		if (posiciones.placa.offsetY > escenario.getHeight()) {
			posiciones.placa.offsetY = 60;
			posiciones.placa.offsetX += 40;
		}

		capaCubos.draw();

	}, function() {

		var placa = new Elemento(posicionRaton().x - (dictImg["placa_base" + base].width / 2), posicionRaton().y - (dictImg["placa_base" + base].height / 2), "placa");
		capaCubos.add(placa);
		placa.startDrag();

	});

	var imgBotonBloques = new Boton(95, 5, 100, 100, dictImg["icono_bloque"], function() {

		var bloque = new Elemento(posiciones.bloque.x + posiciones.bloque.offsetX, posiciones.bloque.y + posiciones.bloque.offsetY, "bloque");

		capaCubos.add(bloque);

		posiciones.bloque.offsetY += 100;

		if (posiciones.bloque.offsetY > escenario.getHeight()) {
			posiciones.bloque.offsetY = 60;
			posiciones.bloque.offsetX += 40;
		}
		capaCubos.draw();

	}, function() {

		var bloque = new Elemento(posicionRaton().x - (dictImg["bloque_base" + base].width / 2), posicionRaton().y - (dictImg["bloque_base" + base].height / 2), "bloque");
		capaCubos.add(bloque);
		bloque.startDrag();

	});

	var botonLimpiar = new Boton(950, 340, 32, 32, dictImg["icono_papelera"], function() {

		posiciones.cubo.offsetX = 60;
		posiciones.cubo.offsetY = 60;

		posiciones.barra.offsetX = 60;
		posiciones.barra.offsetX = 60;

		posiciones.placa.offsetX = 60;
		posiciones.placa.offsetX = 60;

		posiciones.bloque.offsetX = 60;
		posiciones.bloque.offsetX = 60;

		capaCubos.removeChildren();
		capaCubos.draw();
	});

	capaBotones.add(botonLimpiar);

	capaBotones.add(imgBotonCubo);

	capaBotones.add(imgBotonBarras);

	capaBotones.add(imgBotonPlacas);

	capaBotones.add(imgBotonBloques);

	capaBotones.draw();
}