<?php
ob_start();
// NO añadir cabeceras CORS aquí: Apache (en www.visitaecuador.com) ya las agrega
// globalmente. Si el PHP también las pone, quedan DUPLICADAS y el navegador
// rechaza leer la respuesta ("CORS Multiple Origin Not Allowed").
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
	include_once("configuraciones.php"); 
	include_once($GLOBALS['vtLibreriasFunciones']."fn_conectarBD.php");
	include_once($GLOBALS['vtLibreriasFunciones']."fn_general.php"); 
    include_once($vtLibreriasFunciones."fn_registrarKardex.php");
 
// pr($_POST);
try {
	//verificar que este logueado
	if(!$_SESSION[sesion_iniciada] == true and $_SESSION['siIdUsuario'] < 0)
	{
		throw new Exception("Error Processing Request", 1);
	}

    //verificar informacion
    if( !$empresa > 0)
    {
        $errores['empresa'] = array('msj'=>'Por favor Seleccione una empresa');
    }
    if( !$idUsuarioCliente > 0 or !$idUsuarioCliente > 0)
    {
        $errores['establecimiento'] = array('msj'=>'Por favor Seleccione un establecimiento');
    }
    //esoger suscritpor
    // if(!($id_suscripcion > 0 and $id_suscripcion > 0))
    //     $errores['suscriptor'] = array('msj'=>'Por favor Seleccione un suscriptor');

 
    //estableciiento
    if(!$data[minimo_porcentaje]> 0)
        $errores['minimo_porcentaje'] = array('msj'=>'Por favor seleccione un M&iacute;nimo porcentaje de Reserva');
    
    //estableciiento
    if(!$data[max_dias_reserva]> 0)
        $errores['max_dias_reserva'] = array('msj'=>'Por favor seleccione un M&aacute;ximo de d&iacute;as para reserva');
 
    //estableciiento
    if(!$data[iva_porcentaje]> 0)
        $errores['iva_porcentaje'] = array('msj'=>'Iva que se utilizara durante el contrato');
 
    if($noches_gratis_meta>0)
        if(!$data[x_noches_gratis]>0)
            $errores['x_noches_gratis'] = array('msj'=>'Por favor noches gratis');

    if($data[x_noches_gratis]>0)
        if(!$noches_gratis_meta>0)
            $errores['noches_gratis_meta'] = array('msj'=>'Por favor coloque una meta');
    // if(!$data[x_noches_canje]>0)
    //     $errores['x_noches_canje'] = array('msj'=>'Por favor noches canje');

    //fechas
    if(empty($desdeptFechaReserva) )
    {
        $errores['desdeptFechaReserva'] = array('msj'=>'Por favor seleccione una fecha');

    }
    if(empty($hastaptFechaReserva) )
    {
        $errores['hastaptFechaReserva'] = array('msj'=>'Por favor seleccione una fecha');

    }

    if(!empty($desdeptFechaReserva) and !empty($hastaptFechaReserva) )
    {

        if($id > 0)
            $whereContratoVerificar[] = 'id_tbl_contrato != '.$id;
        $whereContratoVerificar[] = "id_tbl_establecimiento =".$idEstablecimiento;
        // $whereContratoVerificar[] = "date(fecha_fin) between date('".$desdeptFechaReserva."') and date('".$hastaptFechaReserva."')";
        $whereContratoVerificar[] = "id_tbl_activacion = 1";
        ///verificar si el establecimiento tiene otro contrato en esta fecha o si hay un contrato activo
        $contratoActivo = $model->find("all",array(
            "select"=> "id_tbl_contrato,
            fecha_ini,
            fecha_fin,
            IF(
                NOW() BETWEEN DATE(fecha_ini) AND DATE(fecha_fin), 'Activo', 'Inactivo'
            ) AS estado,
            CASE
                    WHEN (DATE(fecha_ini)<= DATE('$hastaptFechaReserva') AND DATE(fecha_fin) >=  DATE('$desdeptFechaReserva')) AND DATE(fecha_fin) !=  DATE('$desdeptFechaReserva') THEN 'si'
            ELSE 'no'
          END AS cruce",            
            "from"  =>"tbl_contrato",
            "where" =>implode(' and ', $whereContratoVerificar)
        ));



         //pr($model->error);
         //pr($model->lastQuery);

        //pr($contratoActivo);

        if($contratoActivo)
        {
            foreach ($contratoActivo as $key => $value) {
                # code...
                if($value['estado']=='Activo' and !isset($arraMsj[0]))
                {
                    // $arraMsj[0] = 'El contrato '.$value['id_tbl_contrato']. ' esta activo.';
                }
                if($value['cruce']=='si' and !isset($arraMsj[1]))
                {
                    $arraMsj[1] = 'El contrato '.$value['id_tbl_contrato']. ' ya esta existe en esta fecha de: '.$value['fecha_ini']." hasta: ".$value['fecha_fin'];
                }
            }
            if(count($arraMsj) > 0)
                $errores['desdeptFechaReserva'] = array('msj'=> implode(' y ',$arraMsj) );
        }
    }
    
    //verificar que se escoja por lo menos un tipo de ofertas
    if(!$tipoOfertas)
    
        $errores['grupo-ofertas'] = array('msj'=>'Por favor escoje por lo menos un tipo de oferta');

    //remate y consulta
    if(!$clasificacionOferta)
        $errores['grupo-remate'] = array('msj'=>'Por favor escoje por lo menos un tipo de servicio');


    if(!$preferencia_lugar)
        $errores['grupo-preferencia'] = array('msj'=>'Por favor escoje por lo menos un lugar de preferencia');
    //gestionar tipo de pago

    //if(count($pago_valor)<1){}
        //$errores['tipoPago'] = array('msj'=>'Por favor seleccione un tipo de pago');
    if(count($pago_valor)<1)
        $errores['tipoPago'] = array('msj'=>'Por favor seleccione un tipo de pago');
    else{
        foreach ($pago_valor as $key => $pago_val) {
            # code...
            if(!($pago_val>0 and is_numeric($pago_val)))
                $errores['tipo_pago']['pago_valor-'.$key] = array('msj'=>'Por favor coloque un valor');
        }
    }


 

	if(!empty($errores))
	{
		$msj = "";
		throw new Exception("Por favor completa el formulario", 1);
	} 


    /**
    * Almacenar Bd
    */
  
    
    $camposContrato = array( 
        'fecha_ini'=> $desdeptFechaReserva,
        'fecha_fin'=> $hastaptFechaReserva ,
        'fecha'=>  date('Y-m-d h:i:s'),
        'comentario'=> "$comentarios",
        'minimo_porcentaje'=> $data['minimo_porcentaje'] ,
        'id_tbl_cab_kardex'=> $id_tbl_cab_kardex,
        'id_tbl_movimiento'=> $idMovimiento,
        'comisionable'=> $data['comisionable'],
        'comision_apartir'=> $data['a_partir'],
        'comision_porcentaje'=> $data['comisionable_porcentaje'] ,
        'terminosycondiciones'=> "$terminos",
        'max_dias_cancelar_reserva'=> $data['max_dias_reserva'],
        'id_tbl_tipo_contrato'=> $idTipoContrato,
        'id_tbl_establecimiento'=> $idEstablecimiento,
        'id_tbl_activacion'=> 1,
        'x_noches_gratis' =>$data['x_noches_gratis'],
        'x_noches_canje' =>$data['x_noches_canje'],
        'doc'=> $nombreArchivo,
        'mime'=> $mime,
        'preferencia_lugar'=> $preferencia_lugar,
        'edad_nino'=>$data['edad_nino'],
        'iva'=>$data['iva_porcentaje'],
        'servicios'=>$data['servicio_porcentaje'],
        'noches_gratis_meta'=> $noches_gratis_meta,
        'noches_gratis'=>0,
        'noches_canje'=>0,
        'id_tbl_usuario' => $_SESSION['siIdUsuario']
        // ''=>,
        );        


    $laKardex[]= array(
        'cantidad'=> 1,
        'precio'=> $valorTotal,
        'id_producto'=> $idProducto,
        'id_tipo_pago'=>1
        );

/**
* Datos de rol usuario
*/

    $camposRol = array(
            'fecha_inicio'  => $desdeptFechaReserva,
            'fecha_fin'     => $hastaptFechaReserva,
            'id_tbl_rol'    => 5,
            'id_tbl_usuario'=> $idUsuarioCliente);


    if(!$id_tbl_cab_kardex>0 and $id>0)
    {
        //registrar kardex
        $laVectorKardex = fn_registrarKardex($idMovimiento,$idUsuarioCliente,$laKardex,$lbAplicaCanje,$idEstablecimiento,$id,1,0);

        // pr("$idMovimiento,$idUsuarioCliente,$laKardex,$lbAplicaCanje,$idEstablecimiento,$id,1,0");
        // pr($laVectorKardex);
        $id_tbl_cab_kardex = $laVectorKardex[0];

        if($id_tbl_cab_kardex < 1)
            throw new Exception("Error, por favor comunicar al administrador- error kardex.", 1);
    }


    if($id>0) //actualizar
    {   
        $msjok = 'El contrato #'.$id.' fue actualizado correctamente';
        $model->table = "tbl_contrato";
        $model->fields = $camposContrato;
        $model->where = "id_tbl_contrato = ".$id;
        if(! $model->update())
            throw new Exception("Error Processing Request", 1);


        /**
        * actualizar rol de usuario establecmientos    
        */
        $model->table   = "tbl_rol_usuario";
        $model->fields  = $camposRol;
        $model->where = 'id_tbl_rol_usuario='.$id_tbl_rol_usuario;

            //eliminar tipo beneficio establecimiento
        $deletetable = 'tbl_tipo_beneficio_establecimiento';
        $deletewhere = 'id_tbl_establecimiento='.$idEstablecimiento;
        $model->delete($deletetable,$deletewhere);
        // if(!$model->delete($deletetable,$deletewhere))
        //     throw new Exception("No se puede eliminar beneficios".'id_tbl_establecimiento='.$idEstablecimiento, 1);
            
            //eliminar remates
        $deletetable = 'tbl_recibir_remateyconsulta';
        $deletewhere = 'id_tbl_contrato='.$id;
        $model->delete($deletetable,$deletewhere);
        // if(!$model->delete($deletetable,$deletewhere))
        //     throw new Exception("No se puede eliminar remates", 1);

      ///eliminar documentos
        $deletetable = 'tbl_contrato_documento';
        $deletewhere = "id_tbl_contrato = ".$id;
        $model->delete($deletetable,$deletewhere);
        // if(!$model->delete($deletetable,$deletewhere))
        //     throw new Exception("Error no se eliminan documentos".$model->lastQuery.$model->error. " id_tbl_contrato  =".$id, 1);
        // echo "si lega a eliminar";

       //eliminar datos de pagos detalle
       if($idCarga>0){

            $deletetable = 'tbl_carga';
            $deletewhere = "id_tbl_carga = ".$idCarga;
            $model->delete($deletetable,$deletewhere);
       }
       if(!empty($idDescarga))
       {
       //eliminar datos de pagos detalle
            $deletetable = 'tbl_descarga';
            $deletewhere = "id_tbl_descarga in( ".$idDescarga.")";
           $model->delete($deletetable,$deletewhere);
       }
      

    }
    else //insertar
    {
        $model->table = "tbl_contrato";
        $model->fields = $camposContrato;
        if(!$id = $model->save())
            throw new Exception("Error Processing Request", 1);

        //registrar kardex
        $laVectorKardex = fn_registrarKardex($idMovimiento,$idUsuarioCliente,$laKardex,$lbAplicaCanje,$idEstablecimiento,$id,1,0);

        // pr("$idMovimiento,$idUsuarioCliente,$laKardex,$lbAplicaCanje,$idEstablecimiento,$id,1,0");
        // pr($laVectorKardex);
        $id_tbl_cab_kardex = $laVectorKardex[0];

        if($id_tbl_cab_kardex < 1)
            throw new Exception("Error, por favor comunicar al administrador- error kardex.", 1);

        /**
        * inseratar rol de usuario
        */

        $model->table = 'tbl_rol_usuario';
        $model->fields = $camposRol;
        if(!$id_tbl_rol_usuario = $model->save())
            throw new Exception("Error Processing Request", 1);

        // pr($laVectorKardex);
        //realizar reserva
        $model->table = 'tbl_contrato';
        $model->fields = array(
            'id_tbl_cab_kardex'         => $id_tbl_cab_kardex,
            'id_tbl_movimiento'         => $idMovimiento,
            'id_tbl_rol_usuario'        => $idRolUsuario,
        );
        $model->where = " id_tbl_contrato = ".$id;
        if(!$model->update())
            throw new Exception('No se pudo actualizar contrato. Intente Nuevamente .'.$model->error);   
            // echo $model->error;     
        
        //realizar kardex empresa
        $model->table = 'tbl_cab_kardex';
        $model->fields = array(
            'id_tbl_empresa'         => $empresa
        );
        $model->where = " id_tbl_movimiento = ".$idMovimiento." and id_tbl_cab_kardex = ".$id_tbl_cab_kardex;
        if(!$model->update())
            throw new Exception('No se pudo actualizar kardex. Intente Nuevamente .'.$model->error);   
            // echo $model->error;     
        

        $msjok = "El contrato fue creado correctamente, #".$id;
    }

if($valorTotal>0)
{

    //agregar carga y descarga
    $model->table = 'tbl_carga';
    $model->fields = array(
        'valor'=> $valorTotal,
        'id_tbl_movimiento'=> $idMovimiento ,
        'id_tbl_cab_kardex'=>$id_tbl_cab_kardex,
        );
    if(!$id_tbl_carga = $model->save())
        throw new Exception('No se pudo actualizar carga. Intente Nuevamente .'.$model->error);   

    //detalles de descarga
    foreach ($pago_valor as $key => $valorItem  ) {
        # code...
        $model->table = 'tbl_descarga';
        $model->fields = array(
            'cantidad'=> $valorItem,
            'id_tbl_tipo_pago'=> $pago_tipo[$key],
            'fecha'=> date('y-m-d H:i:s'),
            'id_tbl_carga'=> $id_tbl_carga,
            );
        if(!$id_tbl_descarga = $model->save())
            throw new Exception('No se pudo actualizar Descarga. Intente Nuevamente .'.$model->error);   
    }
}

if(count($infoArchivo)>0)
{

    //geation de archivos para almacenarlos
    foreach ($infoArchivo as $key => $arc) {
        # code...
        $arrayArc = explode(':',$arc);
      
        $archivosInsertar[] = array(
            'file'=>        $arrayArc[1],
            'mime_type'=>   $arrayArc[2],
            'id_tbl_contrato'=> $id
            );
    }
    
 
    //crear nuevos registros
    foreach ($archivosInsertar as $key => $arc) {
        # code...
        $model->table = 'tbl_contrato_documento';
        $model->fields = $arc;
        if(!$id_tbl_contrato_documento = $model->save())
            throw new Exception("Error no se crean documentos", 1);
            
    }
}

    //

    foreach ($tipoOfertas as $key => $tipo) {
        # code...
        $model->table = 'tbl_tipo_beneficio_establecimiento';
        $model->fields = array(
            'id_tbl_establecimiento' => $idEstablecimiento, 
            'id_tbl_tipo_beneficio_suscripcion' => $tipo, 
            );
        if(!$id_tbl_tipo_beneficio_establecimiento = $model->save())
            throw new Exception("Error crear tipo beneficio establecimiento".$model->error, 1);
            
    }

    //obtener las ciudades que seran contactadas dependiendo de la opcione
    // echo $preferencia_lugar;
    switch ($preferencia_lugar) {
        case '1': //todo el pais
            # code...
            $ciudades = $model->find("all",array(
                "select"=>"   c.id_tbl_lugar id, c.desc_lugar nombre",
                "from"  =>"tbl_lugar cy
                    join tbl_lugar c on SUBSTRING_INDEX(cy.cadenas, ',', -1) = SUBSTRING_INDEX(c.cadenas, ',', -1) and c.id_tbl_tipo_lugar = 4",
                "where" =>"cy.id_tbl_lugar = ".$idLugar
            )); 
            break;
        case '2': //en mi provincia
            # code...
            $ciudades = $model->find("all",array(
                "select"=>"pr.desc_lugar nombre , pr.id_tbl_lugar  id",
                "from"  =>"
                    tbl_lugar cy  
                    join tbl_lugar pr 
                    on pr.id_tbl_lugarpadre = cy.id_tbl_lugarpadre and cy.id_tbl_lugar =".$idLugar,
                 
            )); 
            // pr($model->error);
            break;
        case '3': //en mi ciudad
            # code...
            $ciudades[] = array('nombre'=>$nombreCiudad, 'id'=>$idLugar);
            break;
        
        default:
            # code...
            break;
    }
    // pr($preferencia_lugar);
    // pr($ciudades);


    foreach ($clasificacionOferta as $key => $tip) {
        # code...
        foreach ($ciudades as $key => $ciudad) {
            # code...
            $model->table = 'tbl_recibir_remateyconsulta';
            $model->fields = array(
                'id_tbl_lugar' => $ciudad['id'] , 
                'id_tbl_contrato' => $id, 
                'id_tbl_clasificacion_oferta' => $tip, 
                );
            if(!$id_tbl_recibir_remateyconsulta = $model->save())
                throw new Exception("Error crear remate consulta", 1);
        }
            
    }
    /**
    * Enviar eemail con contrato
    *
    */
    include('cuerpoMensajeContrato.php');

    /**
    * Devolver informacion en json cuando todo esta ok
    */

	echo json_encode(array(
		'estado' 	=> true,
		'msj' 		=> $msjok ,
        'id'        => $id,
        'id_tbl_rol_usuario' => $id_tbl_rol_usuario,
        'id_tbl_cab_kardex'  => $id_tbl_cab_kardex,
        'cantidad'  => $disponibilidad[1]
		));

} catch (phpmailerException $e) {
    /**
    * Devolver informacion json cuando existe un problema en el email
    */
$errores['email'] = array('msj'=>$e->errorMessage());
    echo json_encode(array(
        'estado'    => false,
        'msj'       => $e->errorMessage(), 
        'errores'   => $errores,
        'id'   => $id_tbl_reserva,

        ));

} catch (Exception $e) {
    /**
    * Devolver informacion en json cuando exista añgún problema
    */
	echo json_encode(array(
		'estado' 	=> false,
		'msj' 		=> $e->getMessage(),
        'errores'   => $errores,
        'erro'  => $model->error,
		// 'que' 	=> $model->lastQuery,
        'cantidad'  => $disponibilidad[1],
        'id_reserva'=> $id_tbl_reserva,
        'edad'      => $arrayCamposReserva
		));
	
} 