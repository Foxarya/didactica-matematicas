(function() {

	var canvasInterfaz;

	var capaInterfaz = new Kinetic.Layer();

	$(document).ready(function() {

		$.getScript("js/ejercicios/1_bloques_multibase.js").done(function(script, textStatus) {
			$("<div id='canvasInterfaz' style='border: 2px solid black;border-bottom:0px'></div>").prependTo('.contenedor');

			canvas = new MathCanvas.Canvas({
				container : 'canvasInterfaz',
				capas : [capaInterfaz],
				ancho : 1026,
				alto : 80,
				urlEjercicio : "img/ejercicios/practicaSuma_bloques_multibase/",
				callback : logicaInterfaz
			});
		});

	});

	function logicaInterfaz() {

		var representacionNumerica = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 15,
			text : '0 0 0 0 ',
			fontSize : 30,
			fontFamily : 'Calibri',
			fill : 'black'
		});
		var representacionBase = new Kinetic.Text({
			x : canvasInterfaz.tamaño().ancho / 2,
			y : 47,
			text : 'Base ' + bases[base],
			fontSize : 18,
			fontFamily : 'Calibri',
			fill : 'black'
		});

		representacionNumerica.setId("numero");

		representacionBase.setX((canvasInterfaz.tamaño().ancho / 2) - (representacionBase.getWidth() / 2));

		var btnSubirBase = new MathCanvas.Boton({
			x : representacionBase.getX() + representacionBase.getWidth() + 32,
			y : 57,
			ancho : 24,
			alto : 24,
			spritesheet : canvasInterfaz.spritesheet,
			imagen : "subirBase",
			frames : canvasInterfaz.frames,
			onClick : function() {
				if (base != bases.length - 1) {
					if (cuentaRepresentados().base10 != numeroBase10 && cuentaRepresentados().base10 != 0) {
						numeroBase10 = cuentaRepresentados().base10;
					}
					base++;

					representacionBase.setText("Base " + bases[base]);
					capaInterfaz.draw();

					capaCubos.removeChildren();
					var resul = canvasInterfaz.cambiarBase(numeroBase10, bases[base]);

					if (resul.length <= 4 && resul.length != 0) {
						for (var i = resul.length - 1; i >= 0; i--) {
							for (var j = 0; j < resul[i]; j++) {
								var nuevoElemento = new Elemento((botones[i].getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (canvasInterfaz.tamaño().alto - limiteArrastreY - 100)), prioridad[i]);
								nuevoElemento.setScale(0, 0);

								capaCubos.add(nuevoElemento);

								TweenLite.to(nuevoElemento, 0.3, {
									setScaleX : 1,
									setScaleY : 1,
									ease : Back.easeOut,
									onUpdate : function() {
										capaCubos.batchDraw();
									}
								});
							}
						}

					}

					capaCubos.draw();

				}

				if (base == bases.length - 1) {
					this.hide();
					capaInterfaz.draw();
				}

			}
		});
 
		var btnBajarBase = new MathCanvas.Boton({
			x : representacionBase.getX() - 28,
			y : 57,
			ancho : 24,
			alto : 24,
			spritesheet : canvas.spritesheet,
			imagen : "bajarBase",
			frames : canvas.frames,
			onClick : function() {
				if (base != 0) {
					if (numeroBase10 < limites[base - 1]) {
						numeroBase10 = cuentaRepresentados().base10;
					}
					base--;
					representacionBase.setText("Base " + bases[base]);
					capaBotones.draw();
					capaCubos.removeChildren();
					var resul = canvas.cambiarBase(numeroBase10, bases[base]);

					if (resul.length <= 4 && resul.length != 0) {
						for (var i = resul.length - 1; i >= 0; i--) {
							for (var j = 0; j < resul[i]; j++) {
								var nuevoElemento = new Elemento((botones[i].getX() - 64) + (Math.random() * 128), limiteArrastreY + (Math.random() * (canvas.tamaño().alto - limiteArrastreY - 100)), prioridad[i]);
								nuevoElemento.setScale(0, 0);

								capaCubos.add(nuevoElemento);

								TweenLite.to(nuevoElemento, 0.3, {
									setScaleX : 1,
									setScaleY : 1,
									ease : Back.easeOut,
									onUpdate : function() {
										capaCubos.batchDraw();
									}
								});
							}
						}
					}
					capaCubos.draw();
				}

				if (base == 0) {
					this.hide();
					capaBotones.draw();
				}

			}
		});

		capaInterfaz.add(btnSubirBase);
		capaInterfaz.add(btnBajarBase);

		capaInterfaz.add(representacionNumerica);
		capaInterfaz.add(representacionBase);
		
		capaInterfaz.draw();

	}

})();

