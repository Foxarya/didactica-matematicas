(function() {

	var canvasInterfaz;

	var bloquesJuego;

	var capaInterfaz = new Kinetic.Layer();

	var representacionNumerica, representacionBase, imgSubirBase, imgBajarBase, limiteRepresentacionGrafica, agrupacionPosible;

	$(document).ready(function() {

		require(["ejercicios/SceneBloques"], function() {

			bloquesJuego = new SceneBloques({
				onDrawDelegate: onDraw
			});

			$("<div id='canvasInterface' style='border: 2px solid black'></div>").prependTo('.contenedor');

			canvasInterfaz = new MathCanvas.Canvas({
				container : 'canvasInterface',
				capas : [capaInterfaz],
				ancho : 1026,
				alto : 80,
				callback: logicaInterfaz
			});

		});

	});

	function onDraw(evt) {

		var cuenta = bloquesJuego.getRepresentados();

		if (cuenta.base10 == 0 && bloquesJuego.getNumero() != 0) {

			var resul = canvasInterfaz.cambiarBase(bloquesJuego.getNumero(), bloquesJuego.getBase());
			var texto = "";
			for (var i = 0; i < resul.length; i++) {
				texto += resul[i] + " ";
			}
			representacionNumerica.setText(texto);

			//Aquí se avisa que el número no se puede representar gráficamente en la base actual.

			if (!limiteRepresentacionGrafica.isVisible())
				limiteRepresentacionGrafica.show();

		} else {

			if (cuenta.texto == "nada") {

				representacionNumerica.hide();

				//Aquí se avisa que quedan elementos por agrupar.

				if (!agrupacionPosible.isVisible())
					agrupacionPosible.show();

			} else {
				if (!representacionNumerica.isVisible())
					representacionNumerica.show();

				representacionNumerica.setText(cuenta.texto);

				//Aquí habría que comprobar si hay avisos mostrándose y hacerlos desaparecer

				if (limiteRepresentacionGrafica.isVisible())
					limiteRepresentacionGrafica.hide();

				if (agrupacionPosible.isVisible())
					agrupacionPosible.hide();

			}
		}

		if (bloquesJuego.sePuedeBajarBase() && !btnBajarBase.isVisible()) {
			btnBajarBase.show();
		} else if (!bloquesJuego.sePuedeBajarBase() && btnBajarBase.isVisible()) {
			btnBajarBase.hide();
		}

		if (bloquesJuego.sePuedeSubirBase() && !btnSubirBase.isVisible()) {
			btnSubirBase.show();
		} else if (!bloquesJuego.sePuedeSubirBase() && btnSubirBase.isVisible()) {
			btnSubirBase.hide();
		}

		representacionNumerica.setX((canvasInterfaz.tamaño().ancho / 2) - (representacionNumerica.getWidth() / 2));
		capaInterfaz.draw();

	}

	function logicaInterfaz() {

		representacionNumerica = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 5,
			text : '0 0 0 0 ',
			fontSize : 30,
			fontFamily : 'Calibri',
			fill : 'black'
		});
		representacionBase = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 37,
			text : 'Base ' + bloquesJuego.getBase(),
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'black'
		});

		representacionNumerica.setId("numero");

		representacionBase.setX((canvasInterfaz.tamaño().ancho / 2) - (representacionBase.getWidth() / 2));

		btnSubirBase = new MathCanvas.Boton({
			x : representacionBase.getX() + representacionBase.getWidth() + 32,
			y : 47,
			ancho : 24,
			alto : 24,
			spritesheet : bloquesJuego.canvas.spritesheet,
			imagen : "subirBase",
			frames : bloquesJuego.canvas.frames,
			onClick : function() {

				bloquesJuego.aumentarBase();
				representacionBase.setText('Base ' + bloquesJuego.getBase());
				capaInterfaz.draw();

			}
		});

		btnBajarBase = new MathCanvas.Boton({
			x : representacionBase.getX() - 28,
			y : 47,
			ancho : 24,
			alto : 24,
			spritesheet : bloquesJuego.canvas.spritesheet,
			imagen : "bajarBase",
			frames : bloquesJuego.canvas.frames,
			onClick : function() {

				bloquesJuego.disminuirBase();
				representacionBase.setText('Base ' + bloquesJuego.getBase());
				capaInterfaz.draw();

			}
		});

		limiteRepresentacionGrafica = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 60,
			text : 'El número no se puede representar gráficamente',
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'red'
		});

		agrupacionPosible = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 60,
			text : 'Hay elementos que pueden agruparse',
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'red'
		});

		limiteRepresentacionGrafica.setX((canvasInterfaz.tamaño().ancho / 2) - (limiteRepresentacionGrafica.getWidth() / 2));
		agrupacionPosible.setX((canvasInterfaz.tamaño().ancho / 2) - (agrupacionPosible.getWidth() / 2));

		capaInterfaz.add(btnSubirBase);
		capaInterfaz.add(btnBajarBase);

		capaInterfaz.add(representacionNumerica);
		capaInterfaz.add(representacionBase);

		capaInterfaz.add(limiteRepresentacionGrafica);
		capaInterfaz.add(agrupacionPosible);

		capaInterfaz.draw();

		onDraw();

	}

})();

