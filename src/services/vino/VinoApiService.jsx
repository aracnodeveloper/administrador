/**
 * VinoApiService
 * --------------------------------------------------------------
 * Cliente minimo de la API de vinos (https://vinos.visitaecuador.com/vino_api).
 * Solo GETs publicos para resolver UUIDs de establecimientos y ofertas
 * que vienen referenciados en los Tickets del administrador.
 *
 * No usa axios para no agregar dependencia: fetch nativo + cache en memoria.
 */

const API_BASE = "https://vinos.visitaecuador.com/vino_api";
const IMAGE_BASE = "https://vinos.visitaecuador.com/vino_api";

// Cache simple en memoria por sesion del navegador — evita N peticiones
// si el mismo UUID se renderiza varias veces (paginas, paneles, etc.)
const cache = {
    establishments: new Map(), // uuid -> data
    offerts:        new Map(), // uuid -> data
    inFlight:       new Map(), // uuid -> Promise
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Detecta si un string parece un UUID v4 (validacion suave) */
export const isUuid = (s) => {
    if (!s || typeof s !== 'string') return false;
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s.trim());
};

/** Construye una URL absoluta a la imagen si viene como path relativo */
export const wineImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/'))    return `${IMAGE_BASE}${img}`;
    return `${IMAGE_BASE}/img/${img}`;
};

const fetchJson = async (url) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return res.json();
};

// ── Establecimientos ───────────────────────────────────────────────────────

export const getWineEstablishment = async (uuid) => {
    if (!isUuid(uuid)) return null;
    if (cache.establishments.has(uuid)) return cache.establishments.get(uuid);

    // Si ya hay una peticion en curso para este uuid, esperarla
    const inFlightKey = `est:${uuid}`;
    if (cache.inFlight.has(inFlightKey)) return cache.inFlight.get(inFlightKey);

    const promise = fetchJson(`${API_BASE}/establishments/${uuid}`)
        .then((data) => {
            // El service devuelve directamente la entity o { data: entity }
            const est = data?.data ?? data;
            cache.establishments.set(uuid, est);
            return est;
        })
        .catch((err) => {
            console.warn(`vino_api establishment ${uuid}:`, err.message);
            cache.establishments.set(uuid, null); // negative cache
            return null;
        })
        .finally(() => {
            cache.inFlight.delete(inFlightKey);
        });

    cache.inFlight.set(inFlightKey, promise);
    return promise;
};

export const getAllWineEstablishments = async () => {
    try {
        const data = await fetchJson(`${API_BASE}/establishments`);
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        // Precargar cache
        list.forEach((e) => { if (e?.id) cache.establishments.set(e.id, e); });
        return list;
    } catch (err) {
        console.warn('vino_api establishments list:', err.message);
        return [];
    }
};

// ── Ofertas ────────────────────────────────────────────────────────────────

export const getWineOffert = async (uuid) => {
    if (!isUuid(uuid)) return null;
    if (cache.offerts.has(uuid)) return cache.offerts.get(uuid);

    const inFlightKey = `oft:${uuid}`;
    if (cache.inFlight.has(inFlightKey)) return cache.inFlight.get(inFlightKey);

    const promise = fetchJson(`${API_BASE}/offerts/${uuid}`)
        .then((data) => {
            const off = data?.data ?? data;
            cache.offerts.set(uuid, off);
            return off;
        })
        .catch((err) => {
            console.warn(`vino_api offert ${uuid}:`, err.message);
            cache.offerts.set(uuid, null);
            return null;
        })
        .finally(() => {
            cache.inFlight.delete(inFlightKey);
        });

    cache.inFlight.set(inFlightKey, promise);
    return promise;
};

export const getAllWineOfferts = async () => {
    try {
        const data = await fetchJson(`${API_BASE}/offerts`);
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        list.forEach((o) => { if (o?.id) cache.offerts.set(o.id, o); });
        return list;
    } catch (err) {
        console.warn('vino_api offerts list:', err.message);
        return [];
    }
};

// ── Util: resolver ambos en paralelo dado un ticket ───────────────────────
export const resolveTicketVino = async (ticket) => {
    const idEst = ticket?.id_tbl_establecimiento;
    const idOf  = ticket?.id_tbl_oferta;
    const [establishment, offert] = await Promise.all([
        isUuid(idEst) ? getWineEstablishment(idEst) : Promise.resolve(null),
        isUuid(idOf)  ? getWineOffert(idOf)        : Promise.resolve(null),
    ]);
    return { establishment, offert };
};

// ── Reset del cache (util para tests / desarrollo) ────────────────────────
export const clearVinoCache = () => {
    cache.establishments.clear();
    cache.offerts.clear();
    cache.inFlight.clear();
};

export default {
    isUuid,
    wineImageUrl,
    getWineEstablishment,
    getAllWineEstablishments,
    getWineOffert,
    getAllWineOfferts,
    resolveTicketVino,
    clearVinoCache,
};
