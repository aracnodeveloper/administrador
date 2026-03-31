import FullPackService from "../../services/fullpack/FullPackService";

const service = new FullPackService();

const getSession = () => {
    const raw = JSON.parse(localStorage.getItem("datos"));
    const session = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
        token: session ? session.token : "",
        id_servicio: session && session.data ? session.data.id_servicio : 1,
        id_metodo: session && session.data ? (session.data.id_metodo || null) : null,
    };
};

export const listarCodigosPrepago = async (params = {}) => {
    try {
        const { token, id_servicio, id_metodo } = getSession();
        const body = {
            token, id_servicio,
            cantidad: params.cantidad || 100,
            pagina: params.pagina || 1,
            ...(id_metodo && { id_metodo }),
            ...(params.filtro && { filtro: params.filtro }),
        };
        const response = await service.getCodigosPrepago(body);
        if (response.estado) return response.data;
        return null;
    } catch (error) {
        return null;
    }
};

export const crearCodigoPrepago = async (params = {}) => {
    try {
        const { token, id_servicio, id_metodo } = getSession();
        const body = {
            token, id_servicio,
            id_grupo: params.id_grupo || 12,
            id_tbl_estado_prepago: 1,
            ...(id_metodo && { id_metodo }),
            ...(params.descripcion && { descripcion: params.descripcion }),
            ...(params.id && { id: params.id }),
        };
        const response = await service.setCodigosPrepago(body);
        if (response.estado) return response.data;
        return { error: true, msj: response.msj };
    } catch (error) {
        return { error: true, msj: error.message };
    }
};

export const crearCodigosPrepagoMasivo = async (cantidad, params = {}, onProgress = null) => {
    const resultados = { exitosos: [], fallidos: [], total: cantidad };
    for (let i = 0; i < cantidad; i++) {
        try {
            const { token, id_servicio, id_metodo } = getSession();
            const body = {
                token, id_servicio,
                id_grupo: params.id_grupo || 12,
                id_tbl_estado_prepago: 1,
                ...(id_metodo && { id_metodo }),
                ...(params.descripcion && { descripcion: params.descripcion }),
                ...(params.id_tbl_lista_precio_producto && { id_tbl_lista_precio_producto: params.id_tbl_lista_precio_producto }),
            };
            const response = await service.setCodigosPrepago(body);
            if (response.estado) {
                resultados.exitosos.push(response.data);
            } else {
                resultados.fallidos.push({ index: i + 1, error: response.msj });
            }
        } catch (error) {
            resultados.fallidos.push({ index: i + 1, error: error.message });
        }
        if (onProgress) onProgress(i + 1, cantidad, resultados);
    }
    return resultados;
};

export const desactivarCodigoPrepago = async (id) => {
    try {
        const { token, id_servicio } = getSession();
        const response = await service.desactivarCodigoPrepago({ token, id_servicio, id });
        return response.estado ? response.data : { error: true, msj: response.msj };
    } catch (error) {
        return { error: true, msj: error.message };
    }
};

export const activarCodigoPrepago = async (id) => {
    try {
        const { token, id_servicio } = getSession();
        const response = await service.activarCodigoPrepago({ token, id_servicio, id });
        return response.estado ? response.data : { error: true, msj: response.msj };
    } catch (error) {
        return { error: true, msj: error.message };
    }
};

export const listarProductos = async (tipo = 'visitapack', id_codigo_promocional = 4) => {
    try {
        const { token, id_servicio, id_metodo } = getSession();
        const body = {
            token, id_servicio,
            id_codigo_promocional,
            tipo,
            ...(id_metodo && { id_metodo }),
        };
        const response = await service.listarProductos(body);
        if (response.estado) return response.data.productos;
        return [];
    } catch (error) {
        return [];
    }
};

export const comprobarCodigoPromocional = async (codigo) => {
    try {
        const { id_servicio } = getSession();
        const body = {
            id_servicio,
            codigo,
        };
        const response = await service.comprobarCodigo(body);
        if (response.estado) return response.data;
        return null;
    } catch (error) {
        return null;
    }
};

export const listarProductosFullPack = async (id_lista_precio = 140) => {
    try {
        const { token, id_servicio } = getSession();
        const body = {
            token, id_servicio,
            id_lista_precio,
        };
        const response = await service.listarProductosFullPack(body);
        if (response.estado) return response.data.productos;
        return [];
    } catch (error) {
        return [];
    }
};