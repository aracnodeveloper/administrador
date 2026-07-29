public function getEstablecimientosAdmin($data)
{
    try {
        $diasAlerta = isset($data['dias_alerta']) && $data['dias_alerta'] > 0
            ? intval($data['dias_alerta'])
            : 30;
 
        // ── WHERE dinámico ────────────────────────────────────────────────
        $whereExtra = [];
 
        // Solo establecimientos aprobados
        $whereExtra[] = "est.id_tbl_estado_modificacion = 3";
 
        // Filtro por estado de contrato
        $estadoContrato = $data['estado_contrato'] ?? null;
        switch ($estadoContrato) {
            case 'activo':
                $whereExtra[] = "DATE(cont.fecha_fin) > DATE_ADD(CURDATE(), INTERVAL $diasAlerta DAY)";
                $whereExtra[] = "CURDATE() BETWEEN DATE(cont.fecha_ini) AND DATE(cont.fecha_fin)";
                break;
            case 'por_vencer':
                $whereExtra[] = "CURDATE() BETWEEN DATE(cont.fecha_ini) AND DATE(cont.fecha_fin)";
                $whereExtra[] = "DATE(cont.fecha_fin) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL $diasAlerta DAY)";
                break;
            case 'caducado':
                $whereExtra[] = "cont.fecha_fin < CURDATE()";
                break;
        }
 
        // Filtro por texto
        if (!empty($data['txtBusqueda'])) {
            $txt = $this->sanearString($data['txtBusqueda']);
            $whereExtra[] = "CONCAT_WS(' ', infest.titulo, lug.desc_lugar, prov.desc_lugar) LIKE '%$txt%'";
        }
 
        // Filtro por id específico
        if (!empty($data['id_establecimiento']) && intval($data['id_establecimiento']) > 0)
            $whereExtra[] = "est.id_tbl_establecimiento = " . intval($data['id_establecimiento']);
 
        // Filtro por empresa — omitir EXISTS para caducado porque esos
        // establecimientos antiguos pueden no tener registros en oferta_empresa
        if (!empty($this->configApp['id_empresa']) && $estadoContrato !== 'caducado') {
            $ids = implode(',', array_map('intval', $this->configApp['id_empresa']));
            $whereExtra[] = "EXISTS (
                SELECT 1 FROM tbl_oferta_empresa oe_e
                JOIN tbl_oferta of_e ON of_e.id_tbl_oferta = oe_e.id_tbl_oferta
                JOIN tbl_producto prd_e ON prd_e.id_tbl_producto = of_e.id_tbl_producto
                WHERE prd_e.id_tbl_establecimiento = est.id_tbl_establecimiento
                AND oe_e.id_tbl_empresa IN ($ids)
            )";
        }
		// Filtro por rango de fecha de fin de contrato
		if (!empty($data['fecha_desde'])) {
			$whereExtra[] = "DATE(cont.fecha_fin) >= '" . date('Y-m-d', strtotime($data['fecha_desde'])) . "'";
		}
		if (!empty($data['fecha_hasta'])) {
			$whereExtra[] = "DATE(cont.fecha_fin) <= '" . date('Y-m-d', strtotime($data['fecha_hasta'])) . "'";
		}
 
        // ── Paginación ────────────────────────────────────────────────────
        $nPorPagina = isset($data['nitems']) && $data['nitems'] > 0 ? intval($data['nitems']) : 20;
        $pagina     = isset($data['pag'])    && $data['pag']    > 1 ? intval($data['pag'])    : 1;
        $desde      = ($pagina - 1) * $nPorPagina;
 
        $whereFinal = count($whereExtra) > 0 ? implode(' AND ', $whereExtra) : '1=1';

        // ── Ordenamiento ──────────────────────────────────────────────────
        // Mapeo seguro (whitelist) de las columnas ordenables desde la tabla del
        // admin. Así el orden se aplica sobre TODO el resultado antes de paginar,
        // y no solo sobre la página actual.
        $dir = (isset($data['dir']) && strtolower($data['dir']) === 'desc') ? 'DESC' : 'ASC';
        switch ($data['orden'] ?? '') {
            case 'nombre':    $orderSQL = "infest.titulo $dir";                    break;
            case 'ubicacion': $orderSQL = "prov.desc_lugar $dir, lug.desc_lugar $dir"; break;
            case 'contrato':  $orderSQL = "cont.fecha_fin $dir";                   break;
            case 'ofertas':   $orderSQL = "ofertasActivas $dir";                   break;
            case 'reservas':  $orderSQL = "nReservas $dir";                        break;
            case 'noches':    $orderSQL = "nNoches $dir";                          break;
            default:
                // Sin orden explícito: los caducados se muestran del más reciente
                // al más antiguo (fecha_fin descendente); el resto se agrupa por
                // estado y proximidad a vencer.
                $orderSQL = ($estadoContrato === 'caducado')
                    ? "cont.fecha_fin DESC"
                    : "estadoContrato ASC, diasRestantes ASC";
                break;
        }

        // ── SQL compacto ──────────────────────────────────────────────────
        $selectSQL = 'est.id_tbl_establecimiento, est.catalogacion, est.direccion_establecimiento, est.id_tbl_estado_modificacion, infest.titulo AS nombreEstablecimiento, infest.latitud, infest.longitud, lug.desc_lugar AS ciudad, prov.desc_lugar AS provincia, pais.desc_lugar AS pais, fo.direccion_foto AS logo, cont.id_tbl_contrato, cont.fecha_ini AS inicioContrato, cont.fecha_fin AS finContrato, CASE WHEN DATE(cont.fecha_fin) < CURDATE() THEN "caducado" WHEN DATE(cont.fecha_fin) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ' . $diasAlerta . ' DAY) THEN "por_vencer" ELSE "activo" END AS estadoContrato, DATEDIFF(cont.fecha_fin, NOW()) AS diasRestantes, COALESCE(oa.ofertasActivas, 0) AS ofertasActivas, COALESCE(rv.nReservas, 0) AS nReservas, COALESCE(rv.nNoches, 0) AS nNoches';
 
        $fromSQL = "tbl_establecimiento est JOIN tbl_info_indice infest ON infest.id_tbl_info_indice = est.id_tbl_info_indice JOIN ( SELECT id_tbl_establecimiento, MAX(id_tbl_contrato) id_tbl_contrato FROM tbl_contrato GROUP BY id_tbl_establecimiento ) cont_max ON cont_max.id_tbl_establecimiento = est.id_tbl_establecimiento JOIN tbl_contrato cont ON cont.id_tbl_contrato = cont_max.id_tbl_contrato LEFT JOIN tbl_foto fo ON fo.id_tbl_foto = est.id_tbl_foto JOIN tbl_lugar lug ON lug.id_tbl_lugar = infest.id_tbl_lugar JOIN tbl_lugar prov ON prov.id_tbl_lugar = lug.id_tbl_lugarpadre JOIN tbl_lugar reg ON reg.id_tbl_lugar = prov.id_tbl_lugarpadre JOIN tbl_lugar pais ON pais.id_tbl_lugar = reg.id_tbl_lugarpadre LEFT JOIN ( SELECT DISTINCT prd.id_tbl_establecimiento FROM tbl_oferta_empresa oe JOIN tbl_oferta of3 ON of3.id_tbl_oferta = oe.id_tbl_oferta JOIN tbl_producto prd ON prd.id_tbl_producto = of3.id_tbl_producto ) oe_est ON oe_est.id_tbl_establecimiento = est.id_tbl_establecimiento LEFT JOIN ( SELECT prd2.id_tbl_establecimiento, COUNT(*) AS ofertasActivas FROM tbl_oferta of2 JOIN tbl_producto prd2 ON prd2.id_tbl_producto = of2.id_tbl_producto WHERE of2.id_tbl_activacion = 1 AND CURDATE() BETWEEN DATE(of2.fecha_inicio) AND DATE(of2.fecha_fin) GROUP BY prd2.id_tbl_establecimiento ) oa ON oa.id_tbl_establecimiento = est.id_tbl_establecimiento LEFT JOIN ( SELECT ro.id_tbl_establecimiento, COUNT(DISTINCT ro.id_tbl_reserva) AS nReservas, COALESCE(SUM(DATEDIFF(ro.fecha_fin, ro.fecha_inicio)), 0) AS nNoches FROM tbl_reserva_oferta ro JOIN tbl_reserva_new r ON r.id_tbl_reserva = ro.id_tbl_reserva WHERE r.id_tbl_estado_reserva = 2 GROUP BY ro.id_tbl_establecimiento ) rv ON rv.id_tbl_establecimiento = est.id_tbl_establecimiento";
 
        $groupSQL = "est.id_tbl_establecimiento, est.catalogacion, est.direccion_establecimiento, est.id_tbl_estado_modificacion, infest.titulo, infest.latitud, infest.longitud, lug.desc_lugar, prov.desc_lugar, pais.desc_lugar, fo.direccion_foto, cont.id_tbl_contrato, cont.fecha_ini, cont.fecha_fin";
 
        // ── Consulta ──────────────────────────────────────────────────────
        $establecimientos = $this->find('all', array(
            'select' => $selectSQL,
            'from'   => $fromSQL,
            'where'  => $whereFinal,
            'group'  => $groupSQL,
            'order'  => $orderSQL,
            'limit'  => "$desde, $nPorPagina",
        ));
 
        // Sin resultados — respuesta válida con lista vacía
        if (empty($establecimientos)) {
            $this->establecimientos = [];
            $this->resumenContratos = ['activo' => 0, 'por_vencer' => 0, 'caducado' => 0];
            return true;
        }
 
        // ── Normalizar encoding y tipos ───────────────────────────────────
        $resumen = ['activo' => 0, 'por_vencer' => 0, 'caducado' => 0];
 
        foreach ($establecimientos as &$est) {
            // Campos de texto — normalizar a UTF-8 limpio
            // Los registros legacy (2008) pueden estar en Latin-1 o Windows-1252
            $camposTexto = ['nombreEstablecimiento', 'ciudad', 'provincia', 'pais', 'direccion_establecimiento'];
            foreach ($camposTexto as $campo) {
                if (!empty($est[$campo])) {
                    $enc = mb_detect_encoding($est[$campo], ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
                    if ($enc && $enc !== 'UTF-8') {
                        $est[$campo] = mb_convert_encoding($est[$campo], 'UTF-8', $enc);
                    } elseif (!$enc) {
                        $est[$campo] = mb_convert_encoding($est[$campo], 'UTF-8', 'ISO-8859-1');
                    }
                    // Eliminar bytes inválidos que puedan quedar
                    $est[$campo] = iconv('UTF-8', 'UTF-8//IGNORE', $est[$campo]);
                }
            }
 
            $est['diasRestantes'] = intval($est['diasRestantes']);
            $est['ofertasActivas']= intval($est['ofertasActivas']);
            $est['catalogacion']  = intval($est['catalogacion']);
            $est['nReservas']     = intval($est['nReservas']);
            $est['nNoches']       = intval($est['nNoches']);
 
            if (isset($resumen[$est['estadoContrato']]))
                $resumen[$est['estadoContrato']]++;
        }
        unset($est);
 
        $this->establecimientos = $establecimientos;
        $this->resumenContratos = $resumen;
 
        return true;
 
    } catch (Exception $e) {
        $this->error     = $e->getMessage();
        $this->codeerror = $e->getCode();
        return false;
    }
}
 