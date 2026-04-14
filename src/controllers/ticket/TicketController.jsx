import TicketService from "../../services/ticket/TicketService";
import SmartService from "../../services/smart/SmartService";
import EstablecimientosService from "../../services/establecimientos/EstablecimientosService";

const ticketService = new TicketService();
const smartService = new SmartService();
const establecimientosService = new EstablecimientosService();

const getSession = () => {
    try { return JSON.parse(localStorage.getItem("datos")) || {}; }
    catch { return {}; }
};

/* ─────────── Catálogo de tipos ─────────── */

export const TIPOS_TICKET = [
    { id: 1, nombre: "Certificado" },
    { id: 2, nombre: "Ticket" },
];

export const obtenerNombreTipo = (id) => {
    const t = TIPOS_TICKET.find((x) => x.id == id);
    return t ? t.nombre : "Desconocido";
};

const limpiarFiltros = (filtros = {}) => {
    const out = {};
    Object.entries(filtros).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) out[k] = v;
    });
    return out;
};

/* ─────────── CRUD Tickets ─────────── */

export const listarTickets = async ({
                                        filtros = {},
                                        pagina = 1,
                                        cantidad = 20,
                                    } = {}) => {
    try {
        const res = await ticketService.listarTickets({
            filtros: limpiarFiltros(filtros),
            pagina,
            cantidad,
        });
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true, data: res.data };
        }
        return { ok: false, error: res?.msj || "Error al consultar tickets" };
    } catch (e) {
        console.error("Error en listarTickets:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

export const crearTicket = async (data = {}) => {
    try {
        if (!data.id_tbl_type || ![1, 2, "1", "2"].includes(data.id_tbl_type)) {
            return { ok: false, error: "Debe especificar un tipo válido (Certificado o Ticket)" };
        }

        const payload = { id_tbl_type: parseInt(data.id_tbl_type) };
        ["id_tbl_usuario", "id_tbl_suscripcion", "id_tbl_oferta", "id_tbl_establecimiento"].forEach((k) => {
            if (data[k] !== "" && data[k] !== null && data[k] !== undefined) {
                const v = parseInt(data[k]);
                if (!isNaN(v) && v > 0) payload[k] = v;
            }
        });

        const res = await ticketService.crearTicket(payload);
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true, data: res.data };
        }
        return { ok: false, error: res?.msj || "No se pudo crear el ticket" };
    } catch (e) {
        console.error("Error en crearTicket:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

export const obtenerTicket = async (id_tbl_certificado) => {
    try {
        if (!id_tbl_certificado || id_tbl_certificado <= 0) {
            return { ok: false, error: "ID inválido" };
        }
        const res = await ticketService.obtenerTicket({ id_tbl_certificado });
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true, data: res.data };
        }
        return { ok: false, error: res?.msj || "No se pudo obtener el ticket" };
    } catch (e) {
        console.error("Error en obtenerTicket:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

export const actualizarTicket = async (id_tbl_certificado, data = {}) => {
    try {
        if (!id_tbl_certificado || id_tbl_certificado <= 0) {
            return { ok: false, error: "ID inválido" };
        }
        const res = await ticketService.actualizarTicket({
            id_tbl_certificado,
            ...data,
        });
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true, data: res.data };
        }
        return { ok: false, error: res?.msj || "No se pudo actualizar" };
    } catch (e) {
        console.error("Error en actualizarTicket:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

export const eliminarTicket = async (id_tbl_certificado) => {
    try {
        if (!id_tbl_certificado || id_tbl_certificado <= 0) {
            return { ok: false, error: "ID inválido" };
        }
        const res = await ticketService.eliminarTicket({ id_tbl_certificado });
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true };
        }
        return { ok: false, error: res?.msj || "No se pudo eliminar" };
    } catch (e) {
        console.error("Error en eliminarTicket:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

export const marcarTicketUsado = async (id_tbl_certificado) => {
    try {
        if (!id_tbl_certificado || id_tbl_certificado <= 0) {
            return { ok: false, error: "ID inválido" };
        }
        const res = await ticketService.marcarTicketUsado({ id_tbl_certificado });
        if (res != null && res.estado && res.codigo == 0) {
            return { ok: true };
        }
        return { ok: false, error: res?.msj || "No se pudo marcar como usado" };
    } catch (e) {
        console.error("Error en marcarTicketUsado:", e);
        return { ok: false, error: "Error de conexión" };
    }
};

/* ─────────── Autocompletado de usuarios ─────────── */

export const buscarUsuariosTicket = async (termino) => {
    try {
        const session = getSession();
        if (!termino || !termino.trim()) return [];
        const params = {
            token: session.token,
            tipo: "listado",
            txtBusqueda: termino.trim(),
        };
        const res = await smartService.buscarUsuario(params);
        if (res != null && res.estado) {
            return Array.isArray(res.data) ? res.data : [];
        }
    } catch (e) {
        console.error("Error en buscarUsuariosTicket:", e);
    }
    return [];
};

export const obtenerDetalleUsuario = async (id_tbl_usuario) => {
    try {
        const session = getSession();
        if (!id_tbl_usuario || id_tbl_usuario <= 0) return null;
        const params = {
            token: session.token,
            tipo: "detalle",
            id_tbl_usuario,
        };
        const res = await smartService.buscarUsuario(params);
        if (res != null && res.estado) return res.data;
    } catch (e) {
        console.error("Error en obtenerDetalleUsuario:", e);
    }
    return null;
};

export const obtenerSuscripcionesUsuario = async (id_tbl_usuario) => {
    const det = await obtenerDetalleUsuario(id_tbl_usuario);
    if (det && Array.isArray(det.suscripcion)) {
        return det.suscripcion;
    }
    return [];
};

/* ─────────── Autocompletado de establecimientos ─────────── */

/**
 * Busca establecimientos por texto libre usando el endpoint de filtro
 * (filtroEstablecimientos — Hotels::verOfertas con mode='filtro').
 *
 * Como el endpoint requiere fechas, se envía un rango default de los
 * próximos 30 días. Esto es solo para que la consulta funcione; las
 * ofertas devueltas son las activas del establecimiento.
 *
 * @param {string} termino
 * @returns array de establecimientos simplificados con sus ofertas:
 *   [{ id_establecimiento, titulo, ciudad, provincia, direccion, ofertas: [...] }]
 */
export const buscarEstablecimientosConOfertas = async (termino) => {
    try {
        const session = getSession();
        if (!termino || !termino.trim()) return [];

        // Fechas default: hoy → +30 días (formato yyyy-mm-dd)
        const hoy = new Date();
        const fin = new Date();
        fin.setDate(fin.getDate() + 30);
        const fmt = (d) => d.toISOString().slice(0, 10);

        const params = {
            token: session.token,
            txtBusqueda: termino.trim(),
            fechas: { inicio: fmt(hoy), fin: fmt(fin) },
        };

        const res = await establecimientosService.filtro(params);
        if (res != null && res.estado && res.codigo === 0) {
            const ests = res.data?.establecimientos || [];
            // Aplanar solo lo que necesitamos
            return ests.map((e) => ({
                id_establecimiento: e.id_establecimiento,
                titulo: e.titulo,
                ciudad: e.ciudad || "",
                provincia: e.provincia || e.pais || "",
                direccion: e.direccion || "",
                ofertas: e.ofertas
                    ? Object.values(e.ofertas).map((o) => ({
                        id_oferta: o.id_oferta,
                        tituloOferta: o.tituloOferta,
                        dias: o.dias,
                        noches: o.noches,
                        adultos: o.adultos,
                        ninos: o.ninos,
                        rack: o.rack,
                        final: o.final,
                        acomodacion: o.acomodacion,
                    }))
                    : [],
            }));
        }
    } catch (e) {
        console.error("Error en buscarEstablecimientosConOfertas:", e);
    }
    return [];
};