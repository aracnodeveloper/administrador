import PublicidadService from "../../services/publicidad/PublicidadService";

const publicidadService = new PublicidadService();

const getToken = () => {
    const session = JSON.parse(localStorage.getItem("datos"));
    return session?.token;
};

export const listarPublicidades = async function (filtros = {}) {
    try {
        const params = { token: getToken(), ...filtros };
        const res = await publicidadService.listarPublicidades(params);
        if (res && res.estado) return res.data;
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const obtenerPublicidad = async function (id_tbl_publicidad_dirigida) {
    try {
        const params = { token: getToken(), id_tbl_publicidad_dirigida };
        const res = await publicidadService.obtenerPublicidad(params);
        if (res && res.estado) return res.data;
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const guardarPublicidad = async function (data) {
    try {
        const params = { token: getToken(), ...data };
        const res = await publicidadService.guardarPublicidad(params);
        if (res && res.estado) return { ok: true, data: res.data, msj: res.msj };
        return { ok: false, msj: res?.msj || "Error al guardar" };
    } catch (e) {
        console.error(e);
        return { ok: false, msj: e.message };
    }
};

export const eliminarPublicidad = async function (id_tbl_publicidad_dirigida) {
    try {
        const params = { token: getToken(), id_tbl_publicidad_dirigida };
        const res = await publicidadService.eliminarPublicidad(params);
        return res && res.estado;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const getCatalogosPublicidad = async function () {
    try {
        const params = { token: getToken() };
        const res = await publicidadService.getCatalogos(params);
        if (res && res.estado) return res.data;
        return { objetos: [], tipos_publicidad: [] };
    } catch (e) {
        console.error(e);
        return { objetos: [], tipos_publicidad: [] };
    }
};

/**
 * Sube imagen y devuelve { id_tbl_foto, direccion_foto, url } o null en error.
 */
export const subirImagenPublicidad = async function (file) {
    try {
        const res = await publicidadService.subirImagen(file, getToken());
        if (res && res.estado) return res.data;
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
};
