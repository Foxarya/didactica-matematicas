/**
 * @author Administrador
 */
var container;
var padre;

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 400,
	height : 300
});

var capaBotones = new Kinetic.Layer();
var capaCubos = new Kinetic.Layer();

var offsetX = 0;
var cubos = {};

$(document).ready(function() {
	container = $('#container');
	padre = $(container).parent();
	escenario.add(capaCubos);
	escenario.add(capaBotones);

	$(window).resize(redimensionaCanvas);

	function redimensionaCanvas() {
		container.attr('width', $(padre).width());
		escenario.setWidth($(padre).width());
	}

	redimensionaCanvas();

	var botonUnidades = new Kinetic.Rect({
		x : 0,
		y : 0,
		width : 100,
		height : 50,
		fill : 'green',
		stroke : 'black',
		strokeWidth : 4
	});
	botonUnidades.on('click', function() {
		var img = new Image();
		img.onload = function() {
			var cubo = new Kinetic.Image({
				x : offsetX,
				y : 50,
				image : img,
				width : 54,
				height : 55,
				draggable : true
			});

			capaCubos.add(cubo);

		};
		//
		capaCubos.draw();
		img.src = "/didactica-matematicas/public_html/img/cubo.png";
		offsetX += 30;
	});
	
	var botonLimpiar = new Kinetic.Rect({
		x: 60,
		y: 0,
		width: 100,
		height: 50,
		fill: 'blue',
		stroke: 'black',
		strokeWidth: 4
	});
	botonLimpiar.on('click', function() {
		capaCubos.remove();
		capaCubos = new Kinetic.Layer();
		escenario.add(capaCubos);
		offsetX = 0;
	});
	
	capaBotones.add(botonUnidades);
	capaBotones.add(botonLimpiar);
	capaBotones.draw();

});

