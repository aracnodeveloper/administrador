/**
 * offerTypeConfig.js
 * --------------------------------------------------------------
 * Config de tipos y subtypes de ofertas de vino_api.
 * Copia simplificada del config del frontend vinos (solo metadatos
 * relevantes para filtros del administrador).
 */

export const OFFER_TYPES = {
    rutas: {
        key: 'rutas',
        label: 'Rutas',
        subTypes: [
            { value: 'ruta_del_vino',        label: 'Ruta del vino' },
            { value: 'ruta_de_los_volcanes', label: 'Ruta de los Volcanes' },
            { value: 'ruta_del_spondylus',   label: 'Ruta del Spondylus' },
            { value: 'ruta_de_las_cascadas', label: 'Ruta de las Cascadas' },
        ],
    },
    promociones: {
        key: 'promociones',
        label: 'Promociones',
        subTypes: [
            { value: 'burgerKing', label: 'BurgerKing' },
            { value: 'bares',      label: 'Bares & Lounges' },
            { value: 'vinotecas',  label: 'Vinotecas' },
        ],
    },
    tours: {
        key: 'tours',
        label: 'Tours',
        subTypes: [
            { value: 'tour',          label: 'Tours' },
            { value: 'gastronomico',  label: 'Gastronómicos' },
            { value: 'aventura',      label: 'Aventura' },
            { value: 'cultural',      label: 'Cultural' },
        ],
    },
    experiencias: {
        key: 'experiencias',
        label: 'Experiencias',
        subTypes: [
            { value: 'cata',         label: 'Catas' },
            { value: 'maridaje',     label: 'Maridajes' },
            { value: 'clase_cocina', label: 'Clases de Cocina' },
            { value: 'spa',          label: 'Spa & Bienestar' },
        ],
    },
};

/** Lista de types para selectores */
export const OFFER_TYPE_OPTIONS = Object.values(OFFER_TYPES).map((cfg) => ({
    value: cfg.key,
    label: cfg.label,
}));

/** Lista de subTypes para un type dado (vacia si no existe) */
export const getSubTypeOptions = (type) => {
    if (!type) return [];
    const key = String(type).toLowerCase().trim();
    const norm = key === 'vinos' ? 'rutas' : key;
    return OFFER_TYPES[norm]?.subTypes ?? [];
};

/** Label bonito para un type (capitalize fallback) */
export const labelForType = (type) => {
    if (!type) return '';
    const cfg = OFFER_TYPES[String(type).toLowerCase().trim()];
    return cfg?.label ?? type;
};

/** Label bonito para un subType dentro de un type */
export const labelForSubType = (type, subType) => {
    if (!subType) return '';
    const opts = getSubTypeOptions(type);
    const hit = opts.find((s) => s.value === subType);
    return hit?.label ?? subType;
};

export default OFFER_TYPES;
