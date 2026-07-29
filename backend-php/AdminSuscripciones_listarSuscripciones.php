<?php
/**
 * ============================================================================
 *  REEMPLAZO DEL MÉTODO listarSuscripciones() DENTRO DE LA CLASE AdminSuscripciones
 *  (archivo: administrador/suscripcionesClass.php)
 *
 *  NO copies la etiqueta <?php ni este comentario: solo el método
 *  function listarSuscripciones(...) { ... } completo, reemplazando la versión
 *  actual dentro de la clase.
 * ============================================================================
 *
 *  Qué cambia respecto a la versión anterior:
 *  - Se agrega `email` y `telefono` del cliente (tbl_directorio -> tbl_contacto_directorio),
 *    mismo criterio que ya se usa en listarPorVencer():
 *      email    = id_tbl_tipo_contacto = 1 ("Email")
 *      telefono = prioriza WhatsApp (14), luego Celular Personal (4),
 *                 Celular Trabajo (3) y Telefono (2)
 *  - Se agrega `ciudad` (tbl_lugar.desc_lugar, unido por tbl_directorio.id_tbl_lugar).
 *  - Ambos usan subconsultas correlacionadas en el SELECT (no JOIN) para no duplicar
 *    filas de suscripción cuando el cliente tiene varios contactos del mismo tipo.
 *  - La rama que busca por id_tbl_usuario (buscarUsuarioDetalle) no se toca: ya trae
 *    sus propios contactos desde UsuarioClass.
 */

function listarSuscripciones($post)
{
    try {

        if (!empty($post['id_tbl_usuario']) && isset($post['id_tbl_usuario'])) {
            $datoUsuario = $this->usuario->buscarUsuarioDetalle($post);

            return ($datoUsuario);
        } else {
            if (empty($post['pagina']) || !isset($post['pagina']))
                throw new Exception("No se existe página", '404');

            $wher = "";
            if (!empty($post['cod_vendedor']) && isset($post['cod_vendedor']))
                $wher = 'uv.usu_o_email =' . $post['cod_vendedor'] . ' and ';

            if (!empty($post['nombre_vendedor']) && isset($post['nombre_vendedor']))
                $wher = $wher . "UPPER(concat_ws(' ',TRIM(dv.nom1),TRIM(dv.nom2),TRIM(dv.ape1),TRIM(dv.ape2))) like UPPER('%" . $post['nombre_vendedor'] . "%') and ";

            if (!empty($post['cod_cliente']) && isset($post['cod_cliente']))
                $wher = $wher . 'u.usu_o_email =' . $post['cod_cliente'] . ' and ';

            if (!empty($post['nombre_cliente']) && isset($post['nombre_cliente']))
                $wher = $wher . "UPPER(concat_ws(' ',TRIM(d.nom1),TRIM(d.nom2),TRIM(d.ape1),TRIM(d.ape2))) like UPPER('%" . $post['nombre_cliente'] . "%') and ";

            if (!empty($post['ci_cliente']) && isset($post['ci_cliente']))
                $wher = $wher . "d.ci_ruc='" . $post['ci_cliente'] . "' and ";

            $pag = $post['pagina'] - 1;
            $cantidad = 20000;

            if (!empty($post['cantidad']) && isset($post['cantidad']))
                $cantidad = $post['cantidad'];

            $lim = $pag * $cantidad;
            # $lim = $pag * 20;
            $wher = $wher . ' 1=1';

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

            $suscripciones = $this->find("all", array(
                'select'  => 's.codigo, u.id_tbl_usuario, d.ci_ruc,
                            CONCAT_WS(" ", TRIM(d.nom1), TRIM(d.nom2), TRIM(d.ape1)) as usuario,
                            ' . $subEmail . ' as email,
                            ' . $subTelefono . ' as telefono,
                            lug.desc_lugar as ciudad,
                            ps.titulo as producto,
                            ep.nombre_estado_pago_suscripcion as estado_pago,
                            CONCAT(uv.usu_o_email, " - ", dv.nom1, " ", dv.ape1) AS vendedor,
                            sr.fecha_inicio, sr.fecha_fin,
                            ms.nombre,
                            sr.id_tbl_suscripcion_renovacion',

                'from'    => 'tbl_suscripcion s
                            JOIN tbl_usuario u USING(id_tbl_usuario)
                            JOIN tbl_directorio d USING(id_tbl_directorio)
                            JOIN tbl_suscripcion_renovacion sr
                                ON sr.id_tbl_suscripcion_renovacion = (
                                    SELECT MAX(sr2.id_tbl_suscripcion_renovacion)
                                    FROM tbl_suscripcion_renovacion sr2
                                    WHERE sr2.id_tbl_suscripcion = s.id_tbl_suscripcion
                                )
                            JOIN tbl_prod_suscripcion ps ON ps.id_tbl_prod_suscripcion = sr.id_tbl_prod_suscripcion
                            JOIN tbl_estado_pago_suscripcion ep ON ep.id_tbl_estado_pago_suscripcion = sr.id_tbl_estado_pago_suscripcion
                            JOIN tbl_suscripcion sv ON sv.id_tbl_suscripcion = s.id_tbl_suscripcion1
                            JOIN tbl_usuario uv ON sv.id_tbl_usuario = uv.id_tbl_usuario
                            JOIN tbl_directorio dv ON uv.id_tbl_directorio = dv.id_tbl_directorio
                            LEFT OUTER JOIN tbl_lugar lug ON lug.id_tbl_lugar = d.id_tbl_lugar
                            LEFT OUTER JOIN tbl_metodo_servicio ms ON ms.id_tbl_metodo_servicio = sr.id_tbl_metodo_servicio',

                'where'   => $wher,
                'order'   => 's.id_tbl_suscripcion DESC',
                'limit'   => $lim . "," . $cantidad
            ));


            //pr($this->lastQuery);
            //pr($suscripciones);
            //echo $this->error;
            if (!$suscripciones)
                throw new Exception("No se existe suscripciones", '404');

            $cant = $this->find("first", array(
                'select'  => 'count(*) as cant',
                'from'    => 'tbl_suscripcion s
                            join tbl_usuario u using( id_tbl_usuario)
                            join tbl_directorio d using(id_tbl_directorio)
                            join tbl_suscripcion sv on (sv.id_tbl_suscripcion=s.id_tbl_suscripcion1)
                            join tbl_usuario uv on(sv.id_tbl_usuario=uv.id_tbl_usuario)
                            join tbl_directorio dv on(uv.id_tbl_directorio=dv.id_tbl_directorio)',
                'where'   => $wher
            ));
            //pr($this->lastQuery);

            return $this->utf8_transform_array(array("cantidad" => $cant['cant'], "suscripciones" => $suscripciones));
        }
    } catch (Exception $e) {
        $this->error = $e->getMessage();
        $this->codeerror = $e->getCode();
        return false;
    }
}
