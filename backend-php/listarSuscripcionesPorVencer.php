<?php

	//error_reporting(E_ALL); ini_set('display_errors', 1);

	// Buffer de salida: evita que warnings/whitespace previos rompan el JSON
	ob_start();

	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	header('Access-Control-Allow-Headers: *');

	include('configuraciones.php');

	include_once ($GLOBALS['vtClass'] . 'administrador/suscripcionesClass.php');
	$susAdmin = new AdminSuscripciones();

	$method = $_SERVER['REQUEST_METHOD'];
	$fileExecute = $_SERVER['REQUEST_URI'];
	try {

		/*Inicializacion*/
		if($method !='POST')
			throw new Exception("Metodo de conexion equivocado", 1004);

		//obtener flujo de informacion por POST con file_get_content
		$post = json_decode(file_get_contents("php://input"), true);

		if(!$post)
			throw new Exception("No existen parametros", 1001);

		$tokenGet = $post['token'];
		if(!isset($post['token']) or empty($tokenGet))
			throw new Exception("no existe token", 1);

		if(!$userapp->AuthToken($tokenGet))
			throw new Exception($userapp->error, $userapp->codeerror);

		if(!$infor = $susAdmin->listarPorVencer($post))
			throw new Exception($susAdmin->error, $susAdmin->codeerror);

		/*fin de inicializacion*/
		$resultado =
		array(
			"estado"		=>	true,
			"codigo" 		=> 	0,
			'msj'			=> "Correcto",
			'data'			=> $infor
		);

		if (ob_get_length() !== false) ob_clean();
		echo __json_encode($resultado);

	} catch (Exception $e) {
		$resultado = array('estado'=>false,'codigo'=>$e->getCode(),'msj'=>$e->getMessage());
		if (ob_get_length() !== false) ob_clean();
		echo json_encode($resultado);
	}

	ob_end_flush();
