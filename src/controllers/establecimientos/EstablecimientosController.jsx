import EstablecimientosService from "../../services/establecimientos/EstablecimientosService";
import Config from "../../global/config";

export const getEstablecimientos = async function () {
    try {
        const s = new EstablecimientosService;
        const res = await s.gestionarEstablecimientos({ "tipo": "listar" });
        if (res != null && res.estado) return res.data;
    } catch {}
    return {};
};

export const setEstablecimiento = async function (params) {
    try {
        const s = new EstablecimientosService;
        const res = await s.gestionarEstablecimientos(params);
        if (res != null && res.estado) return true;
    } catch { return false; }
    return false;
};

export const getLugares = async function () {
    try {
        const s = new EstablecimientosService;
        const res = await s.gestionarLugares({ "tipo": "listar" });
        if (res != null && res.estado) return res.data;
    } catch { return false; }
    return false;
};

export const listarEstablecimientosAdmin = async function (params = {}) {
    try {
        const s = new EstablecimientosService;
        const res = await s.listarEstablecimientosAdmin(params);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getPaises = async function () {
    try {
        const s = new EstablecimientosService;
        const res = await s.getPaises();
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getCiudades = async function (id_pais) {
    try {
        const s = new EstablecimientosService;
        const res = await s.getCiudades(id_pais);
        if (res != null && res.estado) {
            const ciudades = [];
            Object.entries(res.data).forEach(([provincia, lista]) => {
                lista.forEach(c => {
                    ciudades.push({
                        id_lugar:  c.id_tbl_lugar,
                        nombre:    c.nombre,
                        provincia: provincia,
                    });
                });
            });
            ciudades.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
            return ciudades;
        }
    } catch { return null; }
    return null;
};

export const verificarUsuario = async function (email) {
    try {
        const s = new EstablecimientosService;
        const res = await s.verificarUsuario(email);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const crearEstablecimiento = async function (params = {}) {
    /**
     * El PHP de setEstablecimiento tiene pr() en subscriber.php que contamina el output.
     * Leemos como texto y extraemos el JSON saltando cualquier basura previa.
     */
    try {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setEstablecimiento/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(params),
        });
        const text = await response.text();
        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) {
            try {
                const data = JSON.parse(text.substring(jsonStart));
                if (data.estado) return data.data ?? true;
                console.error('setEstablecimiento error:', data.msj);
                return null;
            } catch {}
        }
        if (response.ok) return true;
    } catch (e) {
        console.error('crearEstablecimiento error:', e);
    }
    return null;
};

export const getTiposEstablecimiento = async function () {
    try {
        const s = new EstablecimientosService;
        const res = await s.getTiposEstablecimiento();
        if (res != null && res.estado) return res.data.tipos;
    } catch { return null; }
    return null;
};

export const getEstablecimientoDetalle = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService;
        const res = await s.getEstablecimientoDetalle(id_establecimiento);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const updateEstablecimiento = async function (params = {}) {
    try {
        const s = new EstablecimientosService;
        const res = await s.updateEstablecimiento(params);
        if (res != null && res.estado) return true;
    } catch { return null; }
    return null;
};

export const getContratos = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService;
        const res = await s.getContratos(id_establecimiento);
        if (res != null && res.estado) return res.data.contratos;
    } catch { return null; }
    return null;
};

export const setContrato = async function (params = {}) {
    try {
        const s = new EstablecimientosService;
        const res = await s.setContrato(params);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getDatosContrato = async function (id_establecimiento, id_contrato = 0) {
    try {
        const s = new EstablecimientosService;
        const res = await s.getDatosContrato(id_establecimiento, id_contrato);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};