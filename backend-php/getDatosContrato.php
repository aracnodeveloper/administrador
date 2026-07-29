<?php
/**
 * getDatosContrato.php
 * Catálogos + datos del contrato para el formulario React.
 * POST: { "id_establecimiento": 123, "id_contrato": 0 }
 */

ob_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Headers: *');
include('configuraciones.php');

try {
    if ($_SERVER['REQUEST_METHOD'] != 'POST')
        throw new Exception("Método de conexión equivocado", 1004);

    $post = json_decode(file_get_contents("php://input"), true);
    if (!$post) throw new Exception("No existen parámetros", 1001);

    $id_est  = intval($post['id_establecimiento'] ?? 0);
    $id_cont = intval($post['id_contrato']        ?? 0);
    if ($id_est <= 0) throw new Exception("Se requiere id_establecimiento", 1002);

    // ── Datos del establecimiento ─────────────────────────────────────────
    $est = $model->find('first', array(
        'select' => 'est.id_tbl_establecimiento, est.id_tbl_usuario, ii.titulo, ii.id_tbl_lugar id_ciudad, lug.desc_lugar ciudad',
        'from'   => 'tbl_establecimiento est JOIN tbl_info_indice ii USING(id_tbl_info_indice) JOIN tbl_lugar lug ON lug.id_tbl_lugar = ii.id_tbl_lugar',
        'where'  => 'est.id_tbl_establecimiento = ' . $id_est,
    ));
    if (!$est) throw new Exception("Establecimiento no encontrado", 4040);

    // ── Catálogos ─────────────────────────────────────────────────────────
    $tiposPago = $model->find('all', array(
        'select' => 'id_tbl_tipo_pago id, descripcion nombre, dir_imagen imagen',
        'from'   => 'tbl_tipo_pago',
        'where'  => 'id_tbl_activacion_smart = 1',
        'order'  => 'descripcion',
    )) ?: [];

    $tiposBeneficio = $model->find('all', array(
        'select' => 'id_tbl_tipo_beneficio_suscripcion id, nombre_tipo_beneficio_suscripcion nombre',
        'from'   => 'tbl_tipo_beneficio_suscripcion',
        'order'  => 'nombre_tipo_beneficio_suscripcion',
    )) ?: [];

    $clasificaciones = $model->find('all', array(
        'select' => 'id_tbl_clasificacion_oferta id, nombre_clasificacion_oferta nombre',
        'from'   => 'tbl_clasificacion_oferta',
        'where'  => 'id_tbl_tipo_informacion = 1',
        'order'  => 'nombre_clasificacion_oferta',
    )) ?: [];

    // ── Contrato existente (edición) ──────────────────────────────────────
    $contrato = null;
    if ($id_cont > 0) {
        $c = $model->find('first', array(
            'select' => 'c.*',
            'from'   => 'tbl_contrato c',
            'where'  => 'c.id_tbl_contrato = ' . $id_cont . ' AND c.id_tbl_establecimiento = ' . $id_est,
        ));
        if ($c) {
            // Beneficios activos
            $bens = $model->find('all', array(
                'select' => 'id_tbl_tipo_beneficio_suscripcion id',
                'from'   => 'tbl_tipo_beneficio_establecimiento',
                'where'  => 'id_tbl_establecimiento = ' . $id_est,
            )) ?: [];

            // Clasificaciones activas
            $clases = $model->find('all', array(
                'select' => 'id_tbl_clasificacion_oferta id',
                'from'   => 'tbl_recibir_remateyconsulta',
                'where'  => 'id_tbl_contrato = ' . $id_cont,
            )) ?: [];

            // Pagos del kardex
            $pagos = [];
            if (!empty($c['id_tbl_cab_kardex'])) {
                $pagos = $model->find('all', array(
                    'select' => 'des.cantidad, des.id_tbl_tipo_pago, tp.descripcion nombre, tp.dir_imagen imagen',
                    'from'   => 'tbl_carga car JOIN tbl_descarga des USING(id_tbl_carga) JOIN tbl_tipo_pago tp USING(id_tbl_tipo_pago)',
                    'where'  => 'car.id_tbl_cab_kardex = ' . intval($c['id_tbl_cab_kardex']) . ' AND car.id_tbl_movimiento = ' . intval($c['id_tbl_movimiento']),
                )) ?: [];
            }

            // Documentos
            $docs = $model->find('all', array(
                'select' => 'id_tbl_contrato_documento id, file, mime_type',
                'from'   => 'tbl_contrato_documento',
                'where'  => 'id_tbl_contrato = ' . $id_cont,
            )) ?: [];

            $contrato = array(
                'id_contrato'           => intval($c['id_tbl_contrato']),
                'fecha_ini'             => $c['fecha_ini'],
                'fecha_fin'             => $c['fecha_fin'],
                'iva'                   => intval($c['iva']),
                'servicios'             => intval($c['servicios']),
                'minimo_porcentaje'     => intval($c['minimo_porcentaje']),
                'max_dias_cancelar'     => intval($c['max_dias_cancelar_reserva']),
                'edad_nino'             => intval($c['edad_nino']),
                'x_noches_gratis'       => intval($c['x_noches_gratis']),
                'x_noches_canje'        => intval($c['x_noches_canje']),
                'noches_gratis_meta'    => intval($c['noches_gratis_meta']),
                'preferencia_lugar'     => intval($c['preferencia_lugar']),
                'comentario'            => $c['comentario'] ?? '',
                'terminosycondiciones'  => $c['terminosycondiciones'] ?? '',
                'id_tbl_cab_kardex'     => $c['id_tbl_cab_kardex'] ?? '',
                'id_tbl_movimiento'     => $c['id_tbl_movimiento'] ?? '',
                'id_tbl_rol_usuario'    => $c['id_tbl_rol_usuario'] ?? '',
                'beneficiosActivos'     => array_map('intval', array_column($bens,   'id')),
                'clasificacionesActivas'=> array_map('intval', array_column($clases, 'id')),
                'pagos'                 => $pagos,
                'documentos'            => $docs,
            );
        }
    }

    // ── Normalizar encoding ───────────────────────────────────────────────
    foreach ([$tiposBeneficio, $clasificaciones, $tiposPago] as &$lista) {
        foreach ($lista as &$item) {
            foreach (['nombre', 'descripcion'] as $campo) {
                if (!empty($item[$campo])) {
                    $enc = mb_detect_encoding($item[$campo], ['UTF-8','ISO-8859-1','Windows-1252'], true);
                    if ($enc && $enc !== 'UTF-8')
                        $item[$campo] = mb_convert_encoding($item[$campo], 'UTF-8', $enc);
                }
            }
        }
    }

    $retornar = array(
        'estado' => true, 'codigo' => 0,
        'data'   => array(
            'establecimiento' => array(
                'id'         => intval($est['id_tbl_establecimiento']),
                'nombre'     => $est['titulo'],
                'id_ciudad'  => intval($est['id_ciudad']),
                'ciudad'     => $est['ciudad'],
                'id_usuario' => intval($est['id_tbl_usuario']),
            ),
            'tiposPago'      => $tiposPago,
            'tiposBeneficio' => $tiposBeneficio,
            'clasificaciones'=> $clasificaciones,
            'contrato'       => $contrato,
        )
    );

    $json = json_encode($retornar, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // Si falla el encode (bytes Latin-1/Windows-1252 en texto legacy), sanear y reintentar
    if ($json === false) {
        array_walk_recursive($retornar, function (&$val) {
            if (is_string($val)) {
                $enc = mb_detect_encoding($val, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
                if ($enc && $enc !== 'UTF-8')
                    $val = mb_convert_encoding($val, 'UTF-8', $enc);
                $val = iconv('UTF-8', 'UTF-8//IGNORE', $val);
            }
        });
        $json = json_encode($retornar, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    ob_clean();
    echo ($json === false)
        ? json_encode(array('estado' => false, 'codigo' => 9999, 'msj' => 'json_encode falló: ' . json_last_error_msg()))
        : $json;

} catch (\Throwable $e) {
    ob_clean();
    echo json_encode(
        array(
            'estado' => false,
            'codigo' => $e->getCode(),
            'msj'    => $e->getMessage(),
            'tipo'   => get_class($e),
            'linea'  => $e->getLine(),
            'archivo'=> basename($e->getFile()),
        ),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
} 