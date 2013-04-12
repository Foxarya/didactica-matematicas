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


var base = 12;

function cargarImagenes() {

	$.ajax({
		type : "GET",
		url : "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/indice.xml",
		dataType : "xml",
		success : function(xml) {
			var cargadas;
			var numeroImagenes = $(xml).find('imagen').length;
			$(xml).find('imagen').each(function() {
				var nombreImagen = $(this).text();
				var imagen = new Image();

				imagen.onload = function() {
					dictImg[nombreImagen] = imagen;
					cargadas += ".";
					if(cargadas.length == numeroImagenes)
					{
						logicaJuego();
					}
				};

				imagen.src = "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/" + nombreImagen + ".png";

			});
		}
	});

}

function dibujarCubo() {

	var cubo = new Kinetic.Image({
		x : 680,
		y : offsetYCubo,
		image : dictImg["cubo"],
		width : dictImg["cubo"].width,
		height : dictImg["cubo"].height,
		draggable : true
	});

	cubo.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	cubo.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	cubo.on('dragstart', function() {
		cubo.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(cubo);

}

function dibujarBarra() {
	
	var barra = new Kinetic.Image({
		x : 480,
		y : offsetYBarra,
		image : dictImg["barra_base"+base],
		width : dictImg["barra_base"+base].width,
		height : dictImg["barra_base"+base].height,
		draggable : true
	});

	barra.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	barra.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	barra.on('dragstart', function() {
		barra.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(barra);
}

function dibujarPlaca() {
	var placa = new Kinetic.Image({
		x : 280,
		y : offsetYCubo,
		image : dictImg["placa_base"+base],
		width : dictImg["placa_base"+base].width,
		height : dictImg["placa_base"+base].height,
		draggable : true
	});

	placa.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	placa.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	placa.on('dragstart', function() {
		placa.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(placa);
}

function dibujarBloque() {
	
	var bloque = new Kinetic.Image({
		x : 80,
		y : offsetYCubo,
		image : dictImg["bloque_base"+base],
		width : dictImg["bloque_base"+base].width,
		height : dictImg["bloque_base"+base].height,
		draggable : true
	});

	bloque.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	bloque.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	bloque.on('dragstart', function() {
		bloque.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(bloque);
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
	
	var imgBotonCubo = new Kinetic.Image({
		x : 740,
		y : 30,
		image : dictImg["cubo"],
		width : 50,
		heigth : 50

	});

	imgBotonCubo.on('click', function() {

		dibujarCubo();

		offsetYCubo += 50;
		capaCubos.draw();

	});

	var imgBotonBarras = new Kinetic.Image({

		x : 540,
		y : 30,
		image : dictImg["icono_barra"],
		width : 100,
		heigth : 100

	});

	imgBotonBarras.on('click', function() {

		dibujarBarra();

		offsetYBarra += 50;
		capaCubos.draw();

	});

	var imgBotonPlacas = new Kinetic.Image({

		x : 340,
		y : 20,
		image : dictImg["icono_placa"],
		width : 100,
		heigth : 100

	});

	imgBotonPlacas.on('click', function() {

		dibujarPlaca();

		offsetYPlaca += 80;
		capaCubos.draw();
	});

	var imgBotonBloques = new Kinetic.Image({
		x : 140,
		y : 5,
		image : dictImg["icono_bloque"],
		width : 100,
		heigth : 100

	});

	imgBotonBloques.on('click', function() {

		dibujarBloque();
		offsetYBloque += 100;
		capaCubos.draw();
	});

	var textoLimpiar = new Kinetic.Text({
		x : 920,
		y : 240,
		text : 'LIMPIAR',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonLimpiar = new Kinetic.Rect({
		x : 920,
		y : 240,
		stroke : '#555',
		strokeWidth : 5,
		fill : '#ddd',
		width : 95,
		height : textoLimpiar.getHeight(),
		shadowColor : 'black',
		shadowBlur : 10,
		shadowOffset : [10, 10],
		shadowOpacity : 0.2,
		cornerRadius : 10
	});

	textoLimpiar.on('click', function() {
		capaCubos.removeChildren();
		capaCubos.draw();
	});

	capaBotones.add(botonLimpiar);
	capaBotones.add(textoLimpiar);

	capaBotones.add(imgBotonCubo);

	capaBotones.add(imgBotonBarras);

	capaBotones.add(imgBotonPlacas);

	capaBotones.add(imgBotonBloques);

	capaBotones.draw();
}
