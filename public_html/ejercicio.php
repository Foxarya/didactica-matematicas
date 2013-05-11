<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
	<!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>Didáctica de las Matemáticas - Universidad de Granada</title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">

		<link rel="stylesheet" href="css/normalize.min.css">
		<link rel="stylesheet" href="css/main.css">

		<script src="scripts/require.js"></script>
		<script>
			require.config({
			    baseUrl: "scripts"
			});
			require(["vendor/modernizr-2.6.2-respond-1.1.0.min"]);
			require(["vendor/jquery-1.9.1"]);
			require(["libs/EasePack.min", "libs/TweenLite.min", "libs/kinetic-v4.5.0.min",], function() {
				require(["libs/engine"]);
				require(["ejercicios/<?php echo $_GET['e']; ?>"]);
			});
		</script>

	</head>
	<body>
		<!--[if lt IE 8]>
		<p class="chromeframe">Estás utilizando un navegador <strong>obsoleto</strong>. Por favor, <a href="http://browsehappy.com/">actualiza tu navegador</a> o <a href="http://www.google.com/chromeframe/?redirect=true">activa Google Chrome Frame</a> para mejorar tu experiencia.</p>
		<![endif]-->

		<div class="header-container">
			<header class="wrapper clearfix">
				<h1 class="title">Didáctica de las Matemáticas</h1>
				<nav>
					<ul>
						<li>
							<a href="index.html">Inicio</a>
						</li>
						<li>
							<a href="#">Info</a>
						</li>
					</ul>
				</nav>

			</header>
		</div>

		<div class="main-container">
			<div class="main wrapper clearfix">

				<section class="contenedor">

				</section>

			</div>
			<!-- #main -->
		</div>
		<!-- #main-container -->

		<div class="footer-container">
			<footer class="wrapper">
				<h3>Facultad de Ciencias de la Educación | Universidad de Granada</h3>
			</footer>
		</div>

	</body>
</html>

