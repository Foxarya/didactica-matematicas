var container;
var padre;

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 500,
	height : 300
});

var capaBotones = new Kinetic.Layer();
var capaCubos = new Kinetic.Layer();

var offsetX = 0;
var offsetYCubo = 0;
var offsetYBarra = 0;
var offsetYPlaca = 0;
var offsetYBloque = 0;

var imgCubo = new Image();

var base = 2;

function dibujarCubo() {

	var cubo = new Kinetic.Image({
		x : 680,
		y : 15 + offsetYCubo,
		image : imgCubo,
		width : 54,
		height : 55,
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
		y : 15 + offsetYBarra,
		draggable : true
	});

	for (var i = 0; i < base; i++) {
		(function() {
			var n = i;
			var cubo;
			cubo = new Kinetic.Image({
				x : n * 30,
				y : 0,
				image : imgCubo,
				name : n,
				width : 54,
				height : 55
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
		y : 15 + offsetYPlaca,
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
					x : h * 30,
					y : n * 30,
					image : imgCubo,
					name : n,
					width : 54,
					height : 55
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
		y : 15 + offsetYBloque,
		draggable : true
	});

	for (var b = 0; b < base; b++) {
		var grupoPlaca = new Kinetic.Group({
			x : b * 16,
			y : -(b * 16)
		});
		for (var i = 0; i < base; i++) {
			var grupoBarra = new Kinetic.Group();
			for (var j = 0; j < base; j++) {
				(function() {
					var n = i;
					var h = j;
					var cubo;
					cubo = new Kinetic.Image({
						x : h * 30,
						y : n * 30,
						image : imgCubo,
						name : n,
						width : 54,
						height : 55
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
	anchoOriginal = $(padre).width();
	escenario.add(capaCubos);
	escenario.add(capaBotones);

	$(window).resize(redimensionaCanvas);

	function redimensionaCanvas() {
		container.attr('width', $(padre).width());
		escenario.setWidth($(padre).width());
		escenario.setScale($(padre).width() / 1026, $(padre).width() / 1026);
	}

	redimensionaCanvas();

	imgCubo.onload = function() {

		var textoCubo = new Kinetic.Text({
			x : 700,
			y : 5,
			text : 'CUBO',
			fontSize : 12,
			fontFamily : 'Calibri',
			fill : '#555',
			width : 90,
			padding : 20,
			align : 'center'
		});

		var botonCubo = new Kinetic.Rect({
			x : 700,
			y : 5,
			stroke : '#555',
			strokeWidth : 5,
			fill : '#ddd',
			width : 90,
			height : textoCubo.getHeight(),
			shadowColor : 'black',
			shadowBlur : 10,
			shadowOffset : [10, 10],
			shadowOpacity : 0.2,
			cornerRadius : 10
		});

		textoCubo.on('click', function() {

			dibujarCubo();
			

			offsetYCubo += 50;
			capaCubos.draw();

		});

		var textoBarras = new Kinetic.Text({
			x : 500,
			y : 5,
			text : 'BARRA',
			fontSize : 12,
			fontFamily : 'Calibri',
			fill : '#555',
			width : 90,
			padding : 20,
			align : 'center'
		});

		var botonBarras = new Kinetic.Rect({
			x : 500,
			y : 5,
			stroke : '#555',
			strokeWidth : 5,
			fill : '#ddd',
			width : 90,
			height : textoBarras.getHeight(),
			shadowColor : 'black',
			shadowBlur : 10,
			shadowOffset : [10, 10],
			shadowOpacity : 0.2,
			cornerRadius : 10
		});

		textoBarras.on('click', function() {

			dibujarBarra();
			
			offsetYBarra += 50;
			capaCubos.draw();

		});

		var textoPlacas = new Kinetic.Text({
			x : 300,
			y : 5,
			text : 'PLACA',
			fontSize : 12,
			fontFamily : 'Calibri',
			fill : '#555',
			width : 90,
			padding : 20,
			align : 'center'
		});

		var botonPlacas = new Kinetic.Rect({
			x : 300,
			y : 5,
			stroke : '#555',
			strokeWidth : 5,
			fill : '#ddd',
			width : 90,
			height : textoPlacas.getHeight(),
			shadowColor : 'black',
			shadowBlur : 10,
			shadowOffset : [10, 10],
			shadowOpacity : 0.2,
			cornerRadius : 10
		});

		textoPlacas.on('click', function() {
			dibujarPlaca();
			

			offsetYPlaca += 80;
			capaCubos.draw();
		});

		var textoBloques = new Kinetic.Text({
			x : 100,
			y : 5,
			text : 'BLOQUE',
			fontSize : 12,
			fontFamily : 'Calibri',
			fill : '#555',
			width : 90,
			padding : 20,
			align : 'center'
		});

		var botonBloques = new Kinetic.Rect({
			x : 100,
			y : 5,
			stroke : '#555',
			strokeWidth : 5,
			fill : '#ddd',
			width : 90,
			height : textoBloques.getHeight(),
			shadowColor : 'black',
			shadowBlur : 10,
			shadowOffset : [10, 10],
			shadowOpacity : 0.2,
			cornerRadius : 10
		});

		textoBloques.on('click', function() {
			dibujarBloque();
			

			offsetYBloque += 150;
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
			//offsetX = 0;
		});

		capaBotones.add(botonLimpiar);
		capaBotones.add(textoLimpiar);

		capaBotones.add(botonCubo);
		capaBotones.add(textoCubo);

		capaBotones.add(botonBarras);
		capaBotones.add(textoBarras);

		capaBotones.add(botonPlacas);
		capaBotones.add(textoPlacas);

		capaBotones.add(botonBloques);
		capaBotones.add(textoBloques);

		capaBotones.draw();
	};

	imgCubo.src = "/didactica-matematicas/public_html/img/cubo.png";

});
