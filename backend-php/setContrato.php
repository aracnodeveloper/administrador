<?php
/**
 * setContrato.php
 * Crea un contrato nuevo (id_contrato=0) o actualiza uno existente (id_contrato>0).
 *
 * POST: { "id_establecimiento":123, "id_contrato":0,
 *          "fecha_ini":"2025-01-01", "fecha_fin":"2026-01-01",
 *          "iva":12, "servicios":10 }
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

    $fecha_ini = trim($post['fecha_ini'] ?? '');
    $fecha_fin = trim($post['fecha_fin'] ?? '');
    if (empty($fecha_ini) || empty($fecha_fin))
        throw new Exception("Fecha de inicio y fin son obligatorias", 1003);

    if (strtotime($fecha_fin) <= strtotime($fecha_ini))
        throw new Exception("La fecha de fin debe ser posterior a la de inicio", 1004);

    $id_contrato = intval($post['id_contrato'] ?? 0);
    $iva         = intval($post['iva']       ?? 0);
    $servicios   = intval($post['servicios'] ?? 0);

    if ($id_contrato > 0) {
        // ── Editar ────────────────────────────────────────────────────────
        $existe = $model->find('first', array(
            'select' => 'id_tbl_contrato',
            'from'   => 'tbl_contrato',
            'where'  => 'id_tbl_contrato = ' . $id_contrato . ' AND id_tbl_establecimiento = ' . $id_establecimiento,
        ));
        if (!$existe)
            throw new Exception("Contrato no encontrado", 4041);

        $model->table  = 'tbl_contrato';
        $model->fields = array('fecha_ini' => $fecha_ini, 'fecha_fin' => $fecha_fin, 'iva' => $iva, 'servicios' => $servicios);
        $model->where  = 'id_tbl_contrato = ' . $id_contrato;
        if (!$model->update())
            throw new Exception("Error al actualizar: " . $model->error, 5001);

        $msj = "Contrato actualizado correctamente";
        $id_resultado = $id_contrato;

    } else {
        // ── Crear ─────────────────────────────────────────────────────────
        $model->table  = 'tbl_contrato';
        $model->fields = array(
            'id_tbl_establecimiento' => $id_establecimiento,
            'fecha_ini'              => $fecha_ini,
            'fecha_fin'              => $fecha_fin,
            'iva'                    => $iva,
            'servicios'              => $servicios,
            'id_tbl_activacion'      => 1,
            'fecha'                  => date('Y-m-d H:i:s'),
        );
        $id_resultado = $model->save();
        if (!$id_resultado)
            throw new Exception("Error al crear contrato: " . $model->error, 5002);

        $msj = "Contrato creado correctamente";
    }

    ob_clean();
    echo json_encode(
        array('estado' => true, 'codigo' => 0, 'msj' => $msj, 'data' => array('id_contrato' => intval($id_resultado))),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

} catch (Exception $e) {
    ob_clean();
    echo json_encode(
        array('estado' => false, 'codigo' => $e->getCode(), 'msj' => $e->getMessage()),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}