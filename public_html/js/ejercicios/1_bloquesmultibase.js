/**
 * @author Administrador
 */
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
var imgCubo = new Image();

var base = 2;

function dibujarCubo(img, offsetX) {
	var cubo = new Kinetic.Image({
		x : offsetX,
		y : 65,
		image : img,
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

	offsetX += 30;
	capaCubos.add(cubo);

}

function dibujarBarra() {
	var grupo = new Kinetic.Group({
		draggable : true
	});

	var img = new Image();

	img.onload = function() {
		for (var i = 0; i < base; i++) {

			(function() {
				var n = i;
				var cubo;
				cubo = new Kinetic.Image({
					x : n * 30,
					y : 85,
					image : img,
					name : n,
					width : 54,
					height : 55
				});

				grupo.add(cubo);
				//cubo.moveToTop();
			})();
		}
	}
	img.src = "/didactica-matematicas/public_html/img/cubo.png";

	grupo.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	grupo.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	grupo.on('dragstart', function() {
		grupo.moveToTop();
		capaCubos.draw();
	});

	capaCubos.add(grupo);
}

function dibujarPlaca() {
	var grupoPlaca = new Kinetic.Group({
		x : offsetX,
		y : 70,
		draggable : true
	});

	var img = new Image();

	img.onload = function() {
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
						image : img,
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
	}
	img.src = "/didactica-matematicas/public_html/img/cubo.png";

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
		x : offsetX,
		y : 70,
		draggable : true
	});

	var img = new Image();

	img.onload = function() {
		for (var b = 0; b < base; b++) {
			var grupoPlaca = new Kinetic.Group({
				x: b * 16,
				y: -(b * 16)
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
							image : img,
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
	}
	img.src = "/didactica-matematicas/public_html/img/cubo.png";

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

	var textoCubo = new Kinetic.Text({
		x : 105,
		y : 5,
		text : 'CUBO',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonCubo = new Kinetic.Rect({
		x : 105,
		y : 5,
		stroke : '#555',
		strokeWidth : 5,
		fill : '#ddd',
		width : 95,
		height : textoCubo.getHeight(),
		shadowColor : 'black',
		shadowBlur : 10,
		shadowOffset : [10, 10],
		shadowOpacity : 0.2,
		cornerRadius : 10
	});

	textoCubo.on('click', function() {

		var img = new Image();
		img.onload = function() {
			dibujarCubo(img);
		};

		img.src = "/didactica-matematicas/public_html/img/cubo.png";

		capaCubos.draw();
	});

	var textoBarras = new Kinetic.Text({
		x : 205,
		y : 5,
		text : 'BARRA',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonBarras = new Kinetic.Rect({
		x : 205,
		y : 5,
		stroke : '#555',
		strokeWidth : 5,
		fill : '#ddd',
		width : 95,
		height : textoBarras.getHeight(),
		shadowColor : 'black',
		shadowBlur : 10,
		shadowOffset : [10, 10],
		shadowOpacity : 0.2,
		cornerRadius : 10
	});

	textoBarras.on('click', function() {

		dibujarBarra();

		capaCubos.draw();

	});

	var textoPlacas = new Kinetic.Text({
		x : 305,
		y : 5,
		text : 'PLACA',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonPlacas = new Kinetic.Rect({
		x : 305,
		y : 5,
		stroke : '#555',
		strokeWidth : 5,
		fill : '#ddd',
		width : 95,
		height : textoPlacas.getHeight(),
		shadowColor : 'black',
		shadowBlur : 10,
		shadowOffset : [10, 10],
		shadowOpacity : 0.2,
		cornerRadius : 10
	});

	textoPlacas.on('click', function() {
		var img = new Image();
		img.onload = function() {
			dibujarPlaca();
		};

		img.src = "/didactica-matematicas/public_html/img/cubo.png";
		offsetX += 30;
		capaCubos.draw();
	});

	var textoBloques = new Kinetic.Text({
		x : 405,
		y : 5,
		text : 'BLOQUE',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonBloques = new Kinetic.Rect({
		x : 405,
		y : 5,
		stroke : '#555',
		strokeWidth : 5,
		fill : '#ddd',
		width : 95,
		height : textoBloques.getHeight(),
		shadowColor : 'black',
		shadowBlur : 10,
		shadowOffset : [10, 10],
		shadowOpacity : 0.2,
		cornerRadius : 10
	});

	textoBloques.on('click', function() {
		var img = new Image();
		img.onload = function() {
			dibujarBloque();
		};

		img.src = "/didactica-matematicas/public_html/img/cubo.png";

		capaCubos.draw();
	});

	var textoLimpiar = new Kinetic.Text({
		x : 5,
		y : 5,
		text : 'LIMPIAR',
		fontSize : 12,
		fontFamily : 'Calibri',
		fill : '#555',
		width : 95,
		padding : 20,
		align : 'center'
	});

	var botonLimpiar = new Kinetic.Rect({
		x : 5,
		y : 5,
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
		offsetX = 0;
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

});

