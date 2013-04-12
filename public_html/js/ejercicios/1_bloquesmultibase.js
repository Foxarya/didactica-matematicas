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

var base = 2;

function cargarImagenes() {

	$.ajax({
		type : "GET",
		url : "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/indice.xml",
		dataType : "xml",
		success : function(xml) {
			$(xml).find('imagen').each(function() {
				var nombreImagen = $(this).text();
				var imagen = new Image();

				imagen.onload = function() {
					dictImg[nombreImagen] = imagen;
				};

				imagen.src = "/didactica-matematicas/public_html/img/ejercicios/1_bloquesmultibase/" + nombreImagen + ".png";

			});
			logicaJuego();
		}
	});

}

function dibujarCubo() {

	var cubo = new Kinetic.Image({
		x : 680,
		y : offsetYCubo,
		image : dictImg["cubo"],
		width : 30,
		height : 30,
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
	var grupoBarra = new Kinetic.Group({
		x : 480,
		y : offsetYBarra,
		draggable : true
	});

	for (var i = 0; i < base; i++) {
		(function() {
			var n = i;
			var cubo;
			cubo = new Kinetic.Image({
				x : n * 17,
				y : 0,
				image : dictImg["cubo"],
				name : n,
				width : 30,
				height : 30
			});

			grupoBarra.add(cubo);
			//cubo.moveToTop();

		})();
	}
	grupoBarra.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupoBarra.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	grupoBarra.on('dragstart', function() {
		grupoBarra.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(grupoBarra);
}

function dibujarPlaca() {
	var grupoPlaca = new Kinetic.Group({
		x : 280,
		y : offsetYPlaca,
		draggable : true
	});

	for (var i = 0; i < base; i++) {
		var grupoBarra = new Kinetic.Group();

		for (var j = 0; j < base; j++) {

			(function() {
				var n = i;
				var h = j;
				var cubo;
				cubo = new Kinetic.Image({
					x : h * 17,
					y : n * 17,
					image : dictImg["cubo"],
					name : n,
					width : 30,
					height : 30
				});

				grupoBarra.add(cubo);

			})();
		}

		grupoPlaca.add(grupoBarra);
		grupoBarra.moveToBottom();
	}

	grupoPlaca.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupoPlaca.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});

	grupoPlaca.on('dragstart', function() {
		grupoPlaca.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(grupoPlaca);
}

function dibujarBloque() {
	var grupoBloque = new Kinetic.Group({
		x : 80,
		y : offsetYBloque,
		draggable : true
	});

	for (var b = 0; b < base; b++) {
		var grupoPlaca = new Kinetic.Group({
			x : b * 4,
			y : -(b * 4)
		});
		for (var i = 0; i < base; i++) {
			var grupoBarra = new Kinetic.Group();
			for (var j = 0; j < base; j++) {
				(function() {
					var n = i;
					var h = j;
					var cubo;
					cubo = new Kinetic.Image({
						x : h * 17,
						y : n * 17,
						image : dictImg["cubo"],
						name : n,
						width : 30,
						height : 30
					});

					grupoBarra.add(cubo);
					//cubo.moveToBottom();
				})();
			}

			grupoPlaca.add(grupoBarra);
			grupoBarra.moveToBottom();
		}
		grupoBloque.add(grupoPlaca);
		grupoPlaca.moveToBottom();
	}

	grupoBloque.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupoBloque.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});

	grupoBloque.on('dragstart', function() {
		grupoBloque.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(grupoBloque);
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
		y : 5,
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
		y : 5,
		image : dictImg["icono_barra"],
		width : 200,
		heigth : 50

	});

	imgBotonBarras.on('click', function() {

		dibujarBarra();

		offsetYBarra += 50;
		capaCubos.draw();

	});

	var imgBotonPlacas = new Kinetic.Image({

		x : 340,
		y : 5,
		image : dictImg["icono_placa"],
		width : 200,
		heigth : 200

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
		width : 300,
		heigth : 300

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
