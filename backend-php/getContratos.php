<?php
/**
 * getContratos.php
 * Retorna todos los contratos de un establecimiento.
 * POST: { "id_establecimiento": 123 }
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
    if (!$post)
        throw new Exception("No existen parámetros", 1001);

    $id_establecimiento = intval($post['id_establecimiento'] ?? 0);
    if ($id_establecimiento <= 0)
        throw new Exception("Se requiere id_establecimiento válido", 1002);

    $contratos = $model->find('all', array(
        'select' => 'c.id_tbl_contrato, c.fecha, c.fecha_ini, c.fecha_fin, c.iva, c.servicios, c.id_tbl_activacion, CASE WHEN c.id_tbl_activacion != 1 THEN "inactivo" WHEN DATE(c.fecha_fin) < CURDATE() THEN "caducado" WHEN DATE(c.fecha_fin) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN "por_vencer" ELSE "activo" END AS estado, DATEDIFF(c.fecha_fin, CURDATE()) AS dias_restantes',
        'from'   => 'tbl_contrato c',
        'where'  => 'c.id_tbl_establecimiento = ' . $id_establecimiento,
        'order'  => 'c.id_tbl_contrato DESC',
    ));

    $lista = array();
    if ($contratos) {
        foreach ($contratos as $c) {
            $lista[] = array(
                'id_contrato'    => intval($c['id_tbl_contrato']),
                'fecha'          => $c['fecha'],
                'fecha_ini'      => $c['fecha_ini'],
                'fecha_fin'      => $c['fecha_fin'],
                'iva'            => intval($c['iva'] ?? 0),
                'servicios'      => intval($c['servicios'] ?? 0),
                'activo'         => intval($c['id_tbl_activacion']) === 1,
                'estado'         => $c['estado'],
                'dias_restantes' => intval($c['dias_restantes']),
            );
        }
    }

    ob_clean();
    echo json_encode(
        array('estado' => true, 'codigo' => 0, 'data' => array('contratos' => $lista)),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

} catch (Exception $e) {
    ob_clean();
    echo json_encode(
        array('estado' => false, 'codigo' => $e->getCode(), 'msj' => $e->getMessage()),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}