var container;
var padre;

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 500,
	height : 400
});

var capaBotones = new Kinetic.Layer();
var capaCubos = new Kinetic.Layer();

var offsetX = 0;

var offsetYCubo = 60;
var offsetYBarra = 60;
var offsetYPlaca = 60;
var offsetYBloque = 60;

var dictImg = {};
var imgCargadas;

var base = 6;

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
						imgCargadas = true;
						logicaJuego();
					}
				};

				imagen.src = "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/" + nombreImagen + ".png";

			});
		}
	});

}

function Cubo(x, y) {

	this.x = x;
	this.y = y;
	if(!imgCargadas)
		return;
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : dictImg["cubo"],
		width : dictImg["cubo"].width,
		height : dictImg["cubo"].height,
		draggable : true
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

function Barra(x, y) {

	this.x = x;
	this.y = y;
	
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : dictImg["barra_base"+base],
		width : dictImg["barra_base"+base].width,
		height : dictImg["barra_base"+base].height,
		draggable : true
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

function Placa(x, y) {

	this.x = x;
	this.y = y;
	
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : dictImg["placa_base"+base],
		width : dictImg["placa_base"+base].width,
		height : dictImg["placa_base"+base].height,
		draggable : true
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

function Bloque(x, y) {

	this.x = x;
	this.y = y;
	
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : dictImg["bloque_base"+base],
		width : dictImg["bloque_base"+base].width,
		height : dictImg["bloque_base"+base].height,
		draggable : true
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

function Boton(x, y, ancho, alto, contenido, onclick, ondrag)
{
	
	var boton;
	var draggable = (ondrag != null) ? true : false;
	
	if(contenido instanceof Image)
	{
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
			x: x,
			y: y,
			opacity: 1,
			width: ancho,
			listening: true,
			text: {
				text: contenido,
				fontSize : 12,
				fontFamily : 'Calibri',
				fill : '#555',
				padding : 20,
				align : 'center'
			},
			rect: {
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
	
	if(draggable)
		boton.on('dragstart', ondrag);
			
	return boton;

}

$(document).ready(function() {
	container = $('#container');
	padre = $(container).parent();
	escenario.add(capaCubos);
	escenario.add(capaBotones);

	$(window).resize(redimensionaCanvas);

	function redimensionaCanvas() {
		container.attr('width', $(padre).width());
		escenario.setWidth($(padre).width());
		escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);
	}

	redimensionaCanvas();

	cargarImagenes();

});

function logicaJuego() {

	
	var imgBotonCubo = new Boton(740, 30, 50, 50, dictImg["icono_cubo"],function() {

		var cubo = new Cubo(680, offsetYCubo);
		
		capaCubos.add(cubo);
		
		offsetYCubo += 50;
		capaCubos.draw();

	}, function() {

		var cubo = new Cubo((escenario.getMousePosition().x - (dictImg["cubo"].width / 2)) / escenario.getScale().x, (escenario.getMousePosition().y - (dictImg["cubo"].height / 2)) / escenario.getScale().y);
		
		capaCubos.add(cubo);
		cubo.startDrag();
		
		//capaCubos.draw();

	});
	
	

	var imgBotonBarras = new Kinetic.Image({

		x : 540,
		y : 30,
		image : dictImg["icono_barra"],
		width : 100,
		heigth : 100,
		draggable : true,
		dragBoundFunc : function(pos) {
			return {
				x : this.getAbsolutePosition().x,
				y : this.getAbsolutePosition().y
			}
		}

	});

	imgBotonBarras.on('click', function() {

		var barra = new Barra(480, offsetYBarra);
		
		capaCubos.add(barra);
		
		offsetYBarra += 50;
		capaCubos.draw();

	});
	
	imgBotonBarras.on('dragstart', function() {

		var barra = new Barra(escenario.getMousePosition().x - (dictImg["barra_base"+base].width / 2), escenario.getMousePosition().y - (dictImg["barra_base"+base].height / 2));
		
		capaCubos.add(barra);
		barra.startDrag();
		
		capaCubos.draw();

	});

	var imgBotonPlacas = new Kinetic.Image({
		x : 340,
		y : 20,
		image : dictImg["icono_placa"],
		width : 100,
		heigth : 100,
		draggable : true,
		dragBoundFunc : function(pos) {
			return {
				x : this.getAbsolutePosition().x,
				y : this.getAbsolutePosition().y
			}
		}

	});

	imgBotonPlacas.on('click', function() {

		var placa = new Placa(280, offsetYPlaca);
		
		capaCubos.add(placa);

		offsetYPlaca += 80;
		capaCubos.draw();
	});
	
	imgBotonPlacas.on('dragstart', function() {

		var placa = new Placa(escenario.getMousePosition().x - (dictImg["placa_base"+base].width / 2), escenario.getMousePosition().y - (dictImg["placa_base"+base].height / 2));
		
		capaCubos.add(placa);
		placa.startDrag();
		
		capaCubos.draw();

	});

	var imgBotonBloques = new Kinetic.Image({
		x : 140,
		y : 5,
		image : dictImg["icono_bloque"],
		width : 100,
		heigth : 100,
		draggable : true,
		dragBoundFunc : function(pos) {
			return {
				x : this.getAbsolutePosition().x,
				y : this.getAbsolutePosition().y
			}
		}

	});

	imgBotonBloques.on('click', function() {

		var bloque = new Bloque(80, offsetYBloque);
		
		capaCubos.add(bloque);
		
		offsetYBloque += 100;
		capaCubos.draw();
	});
	
	imgBotonBloques.on('dragstart', function() {

		var bloque = new Bloque(escenario.getMousePosition().x - (dictImg["bloque_base"+base].width / 2), escenario.getMousePosition().y - (dictImg["bloque_base"+base].height / 2));
		
		capaCubos.add(bloque);
		bloque.startDrag();
		
		capaCubos.draw();

	});

	var botonLimpiar = new Boton(920, 240, 95, null, 'LIMPIAR', function() {
		
		offsetYCubo = 60;
		offsetYBarra = 60;
		offsetYPlaca = 60;
		offsetYBloque = 60;
		
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
