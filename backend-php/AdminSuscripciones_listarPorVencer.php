<?php
/**
 * ============================================================================
 *  MÉTODO PARA PEGAR DENTRO DE LA CLASE AdminSuscripciones
 *  (archivo: administrador/suscripcionesClass.php)
 *
 *  NO copies la etiqueta <?php ni este comentario: solo el método
 *  function listarPorVencer(...) { ... } va dentro de la clase, junto a
 *  listarSuscripciones().
 * ============================================================================
 *
 *  Lógica de fecha CORRECTA (evita el error de caducidad):
 *  - La caducidad real de cada suscripción NO es la renovación con el id más
 *    alto, sino la renovación con la fecha_fin MÁS LEJANA y que esté vigente
 *    (no anulada=4, no bloqueada=8). Eso es lo que selecciona la subconsulta.
 *  - Se descartan fechas nulas y '0000-00-00'.
 *  - El filtro "le falta 1 mes" se hace en SQL con CURDATE() para no depender
 *    de la zona horaria de PHP.
 *
 *  Parámetros que acepta $post:
 *   - pagina         (requerido)
 *   - cantidad       (opcional, por defecto 20000)
 *   - dias           (opcional, ventana hacia adelante; por defecto 30)
 *   - dias_vencidas  (opcional, ventana hacia atrás de ya vencidas; por defecto 30; 0 = no incluir vencidas)
 *   - ci_cliente, cod_cliente, nombre_cliente, cod_vendedor, nombre_vendedor, ciudad (filtros opcionales)
 */

function listarPorVencer($post)
{
    try {
        if (empty($post['pagina']) || !isset($post['pagina']))
            throw new Exception("No se existe página", '404');

        // Ventana hacia adelante (por vencer). Por defecto 30 días.
        $diasPorVencer = 30;
        if (isset($post['dias']) && (int)$post['dias'] > 0)
            $diasPorVencer = (int)$post['dias'];

        // Ventana hacia atrás (ya vencidas). Por defecto 30 días. 0 = no incluir vencidas.
        $diasVencidas = 30;
        if (isset($post['dias_vencidas']) && $post['dias_vencidas'] !== '')
            $diasVencidas = (int)$post['dias_vencidas'];

        // ---- Filtros opcionales (mismo estilo que listarSuscripciones) ----
        $wher = "";
        if (!empty($post['cod_vendedor']) && isset($post['cod_vendedor']))
            $wher .= "uv.usu_o_email = '" . $post['cod_vendedor'] . "' and ";

        if (!empty($post['nombre_vendedor']) && isset($post['nombre_vendedor']))
            $wher .= "UPPER(concat_ws(' ',TRIM(dv.nom1),TRIM(dv.nom2),TRIM(dv.ape1),TRIM(dv.ape2))) like UPPER('%" . $post['nombre_vendedor'] . "%') and ";

        if (!empty($post['cod_cliente']) && isset($post['cod_cliente']))
            $wher .= "u.usu_o_email = '" . $post['cod_cliente'] . "' and ";

        if (!empty($post['nombre_cliente']) && isset($post['nombre_cliente']))
            $wher .= "UPPER(concat_ws(' ',TRIM(d.nom1),TRIM(d.nom2),TRIM(d.ape1),TRIM(d.ape2))) like UPPER('%" . $post['nombre_cliente'] . "%') and ";

        if (!empty($post['ci_cliente']) && isset($post['ci_cliente']))
            $wher .= "d.ci_ruc='" . $post['ci_cliente'] . "' and ";

        // Filtro por ciudad del cliente (tbl_lugar.desc_lugar, alias lug).
        if (!empty($post['ciudad']) && isset($post['ciudad']))
            $wher .= "UPPER(lug.desc_lugar) like UPPER('%" . $post['ciudad'] . "%') and ";

        // Ventana de caducidad: desde hace $diasVencidas días hasta dentro de $diasPorVencer días.
        // sr ya apunta a la renovación de fecha_fin más lejana y vigente (ver subconsulta).
        $wher .= "DATE(sr.fecha_fin) BETWEEN DATE_SUB(CURDATE(), INTERVAL " . $diasVencidas . " DAY) "
               . "AND DATE_ADD(CURDATE(), INTERVAL " . $diasPorVencer . " DAY)";

        // ---- Paginación ----
        $pag = $post['pagina'] - 1;
        $cantidad = 20000;
        if (!empty($post['cantidad']) && isset($post['cantidad']))
            $cantidad = (int)$post['cantidad'];
        $lim = $pag * $cantidad;

        // ---- Subconsulta: caducidad real = renovación vigente con fecha_fin más lejana ----
        $subRenovacion = "(
            SELECT sr2.id_tbl_suscripcion_renovacion
            FROM tbl_suscripcion_renovacion sr2
            WHERE sr2.id_tbl_suscripcion = s.id_tbl_suscripcion
              AND sr2.fecha_fin IS NOT NULL
              AND sr2.fecha_fin <> '0000-00-00'
              AND sr2.fecha_fin <> '0000-00-00 00:00:00'
              AND sr2.id_tbl_estado_pago_suscripcion NOT IN (4, 8)
            ORDER BY sr2.fecha_fin DESC, sr2.id_tbl_suscripcion_renovacion DESC
            LIMIT 1
        )";

        // ---- Subconsultas: contacto del cliente (tbl_directorio -> tbl_contacto_directorio) ----
        // Email: id_tbl_tipo_contacto = 1 ("Email"). Si hay varios, se toma el último agregado.
        $subEmail = "(
            SELECT cd.contacto
            FROM tbl_contacto_directorio cd
            WHERE cd.id_tbl_directorio = d.id_tbl_directorio
              AND cd.id_tbl_tipo_contacto = 1
            ORDER BY cd.id_tbl_contacto_directorio DESC
            LIMIT 1
        )";

        // Teléfono: prioriza WhatsApp (14), luego Celular Personal (4), Celular Trabajo (3) y Telefono (2).
        $subTelefono = "(
            SELECT cd.contacto
            FROM tbl_contacto_directorio cd
            WHERE cd.id_tbl_directorio = d.id_tbl_directorio
              AND cd.id_tbl_tipo_contacto IN (14, 4, 3, 2)
            ORDER BY FIELD(cd.id_tbl_tipo_contacto, 14, 4, 3, 2), cd.id_tbl_contacto_directorio DESC
            LIMIT 1
        )";

        $from = "tbl_suscripcion s
                JOIN tbl_usuario u USING(id_tbl_usuario)
                JOIN tbl_directorio d USING(id_tbl_directorio)
                JOIN tbl_suscripcion_renovacion sr
                    ON sr.id_tbl_suscripcion_renovacion = " . $subRenovacion . "
                JOIN tbl_prod_suscripcion ps ON ps.id_tbl_prod_suscripcion = sr.id_tbl_prod_suscripcion
                JOIN tbl_estado_pago_suscripcion ep ON ep.id_tbl_estado_pago_suscripcion = sr.id_tbl_estado_pago_suscripcion
                JOIN tbl_suscripcion sv ON sv.id_tbl_suscripcion = s.id_tbl_suscripcion1
                JOIN tbl_usuario uv ON sv.id_tbl_usuario = uv.id_tbl_usuario
                JOIN tbl_directorio dv ON uv.id_tbl_directorio = dv.id_tbl_directorio
                LEFT OUTER JOIN tbl_lugar lug ON lug.id_tbl_lugar = d.id_tbl_lugar
                LEFT OUTER JOIN tbl_metodo_servicio ms ON ms.id_tbl_metodo_servicio = sr.id_tbl_metodo_servicio";

        $suscripciones = $this->find("all", array(
            'select'  => "s.codigo, u.id_tbl_usuario, d.ci_ruc,
                        CONCAT_WS(' ', TRIM(d.nom1), TRIM(d.nom2), TRIM(d.ape1)) as usuario,
                        " . $subEmail . " as email,
                        " . $subTelefono . " as telefono,
                        lug.desc_lugar as ciudad,
                        ps.titulo as producto,
                        ps.anios, ps.tiempo,
                        ep.nombre_estado_pago_suscripcion as estado_pago,
                        sr.id_tbl_estado_pago_suscripcion as id_estado_pago,
                        CONCAT(uv.usu_o_email, ' - ', dv.nom1, ' ', dv.ape1) AS vendedor,
                        sr.fecha_inicio, sr.fecha_fin,
                        DATEDIFF(DATE(sr.fecha_fin), CURDATE()) as dias_restantes,
                        ms.nombre,
                        sr.id_tbl_suscripcion_renovacion",
            'from'    => $from,
            'where'   => $wher,
            // Primero las VIGENTES por vencer (las más próximas a caducar arriba),
            // luego las ya vencidas (las más recientes primero).
            'order'   => "(DATE(sr.fecha_fin) < CURDATE()) ASC, ABS(DATEDIFF(DATE(sr.fecha_fin), CURDATE())) ASC",
            'limit'   => $lim . "," . $cantidad
        ));

        // pr($this->lastQuery);

        if (!$suscripciones)
            throw new Exception("No existen suscripciones por vencer", '404');

        $cant = $this->find("first", array(
            'select'  => 'count(*) as cant',
            'from'    => $from,
            'where'   => $wher
        ));

        return $this->utf8_transform_array(array(
            "cantidad"      => $cant['cant'],
            "dias"          => $diasPorVencer,
            "dias_vencidas" => $diasVencidas,
            "suscripciones" => $suscripciones
        ));
    } catch (Exception $e) {
        $this->error = $e->getMessage();
        $this->codeerror = $e->getCode();
        return false;
    }
}
