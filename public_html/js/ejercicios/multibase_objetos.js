/**
 * @author Foxarya
 */

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 500,
	height : 300
});

var imgCubo = new Image();

var capaCubos = new Kinetic.Layer();
var capaBotones = new Kinetic.Layer();

$(document).ready(function() {

	imgCubo.onload = function() {
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

			var cubo = new Cubo(50, 50, true);

			cubo.añadiraCapa();
		});
		
		capaBotones.add(botonCubo);
		capaBotones.add(textoCubo);
		
		escenario.add(capaBotones);
		escenario.add(capaCubos);
	};

	imgCubo.src = "/didactica-matematicas/public_html/img/cubo.png";

});

/*
 * DEFINICIÓN DE CLASES
 */
function Cubo(x, y, independiente) {
	this.x = x;
	this.y = y;
	this.independiente = independiente;
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : imgCubo,
		width : 54,
		height : 55,
		draggable : this.independiente
	});
	
	
}

Cubo.prototype.añadiraCapa = function() {
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
	capaCubos.draw();
};

function Barra(x, y, draggable)
{
	this.x = x;
	this.y = y;
	this.draggable = draggable;
	this.kineticImage = new Kinetic.Image({
		x : this.x,
		y : this.y,
		image : imgCubo,
		width : 54,
		height : 55,
		draggable : this.draggable
	});
}


