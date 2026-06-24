import React, { useState, useCallback, useEffect } from 'react';
import {
    listarTickets,
    marcarTicketUsado,
    eliminarTicket,
    TIPOS_TICKET,
    obtenerNombreTipo,
} from '../../controllers/ticket/TicketController';
import CrearTicketModal from './CrearTicketModal';
import {
    isUuid,
    wineImageUrl,
    resolveTicketVino,
    getAllWineOfferts,
} from '../../services/vino/VinoApiService';
import {
    OFFER_TYPE_OPTIONS,
    getSubTypeOptions,
    labelForType,
    labelForSubType,
} from '../../services/vino/offerTypeConfig';

const TIPO = [
    { id: '', nombre: 'Todos' },
    ...TIPOS_TICKET.map(t => ({ id: String(t.id), nombre: t.nombre })),
];

const ACTIVO = [
    { id: '1', nombre: 'Activos' },
    { id: '0', nombre: 'Eliminados' },
    { id: '', nombre: 'Todos' },
];

const initialFiltros = {
    codigo: '',
    codigo_suscripcion: '',
    ci_ruc: '',
    id_tbl_type: '',
    fecha_desde: '',
    fecha_hasta: '',
    ubicacion: '',
    is_active: '1',
    // Filtros client-side sobre vino_api (no van al backend de tickets)
    wine_type: '',
    wine_subType: '',
};

const inputCls =
    'w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white ' +
    'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition';

/* ───────── Componentes visuales reutilizables ───────── */

const Badge = ({ usado }) =>
    usado ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
            Usado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
            Disponible
        </span>
    );

const TipoBadge = ({ tipo }) =>
    tipo == 1 ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
            Certificado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
            Ticket
        </span>
    );

const Row = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="col-span-2 text-sm text-gray-800 break-words">{value}</span>
    </div>
);

const Toast = ({ tipo, mensaje, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const styles = {
        ok: 'bg-emerald-600 text-white',
        error: 'bg-red-600 text-white',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-xs ${styles[tipo]}`}>
            {mensaje}
        </div>
    );
};

const StatCard = ({ label, value, color = 'gray' }) => {
    const colors = {
        gray: 'bg-white border-gray-200',
        emerald: 'bg-white border-emerald-100',
        amber: 'bg-white border-amber-100',
        slate: 'bg-white border-slate-200',
    };
    const valueColors = {
        gray: 'text-gray-900',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600',
        slate: 'text-slate-700',
    };
    return (
        <div className={`rounded-lg border ${colors[color]} px-4 py-3`}>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-semibold mt-0.5 ${valueColors[color]}`}>{value}</p>
        </div>
    );
};

// ── Botón de acción reutilizable ──────────────────────────────────────────────
const BtnAccion = ({ title, activo, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-lg text-xs transition-colors ${disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" :
            activo ? "bg-green-600 text-white" :
                "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
            }`}
    >
        {children}
    </button>
);

/* ───────── Bloque de Establecimiento+Oferta resuelto desde vino_api ───── */

const VinoBlocks = ({ ticket }) => {
    const idEst = ticket?.id_tbl_establecimiento;
    const idOf = ticket?.id_tbl_oferta;
    const estEsUuid = isUuid(idEst);
    const ofEsUuid = isUuid(idOf);

    const [loading, setLoading] = useState(estEsUuid || ofEsUuid);
    const [vino, setVino] = useState({ establishment: null, offert: null });

    useEffect(() => {
        let cancelado = false;
        if (estEsUuid || ofEsUuid) {
            setLoading(true);
            resolveTicketVino(ticket).then((res) => {
                if (!cancelado) {
                    setVino(res);
                    setLoading(false);
                }
            });
        } else {
            setVino({ establishment: null, offert: null });
            setLoading(false);
        }
        return () => { cancelado = true; };
    }, [idEst, idOf]); // eslint-disable-line

    // Helper que arma el value de cada Row segun el caso
    const renderEstablecimiento = () => {
        if (!idEst) return '—';
        if (!estEsUuid) return idEst; // legacy entero
        if (loading) return <span className="text-gray-400 italic">cargando…</span>;
        if (!vino.establishment) return (
            <span className="text-xs text-gray-400 break-all" title={idEst}>
                {idEst.slice(0, 8)}… <span className="text-red-400">(no encontrado)</span>
            </span>
        );
        const e = vino.establishment;
        return (
            <div className="flex items-center gap-2 justify-end">
                {e.logo && (
                    <img src={wineImageUrl(e.logo)} alt="" className="w-6 h-6 rounded object-cover"
                        onError={(ev) => { ev.target.style.display = 'none'; }} />
                )}
                <div className="text-right min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{e.name || '(sin nombre)'}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                        {[e.city, e.country].filter(Boolean).join(', ') || '—'}
                    </p>
                </div>
            </div>
        );
    };

    const renderOferta = () => {
        if (!idOf) return '—';
        if (!ofEsUuid) return idOf; // legacy entero
        if (loading) return <span className="text-gray-400 italic">cargando…</span>;
        if (!vino.offert) return (
            <span className="text-xs text-gray-400 break-all" title={idOf}>
                {idOf.slice(0, 8)}… <span className="text-red-400">(no encontrada)</span>
            </span>
        );
        const o = vino.offert;
        return (
            <div className="flex items-center gap-2 justify-end">
                {o.image && (
                    <img src={wineImageUrl(o.image)} alt="" className="w-8 h-8 rounded object-cover"
                        onError={(ev) => { ev.target.style.display = 'none'; }} />
                )}
                <div className="text-right min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{o.title || '(sin título)'}</p>
                    <p className="text-[10px] text-gray-400">
                        {o.price && <span className="text-emerald-700 font-semibold mr-1">${o.price}</span>}
                        {o.type && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{o.type}</span>}
                        {o.subType && <span className="ml-1 text-gray-500">/ {o.subType}</span>}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Row label="Establecimiento" value={renderEstablecimiento()} />
            <Row label="Oferta" value={renderOferta()} />
        </>
    );
};

/* ───────── Panel lateral de detalle ───────── */

const PanelDetalle = ({ ticket, onClose, onMarcarUsado, onEliminar }) => {
    const [expandido, setExpandido] = useState(false);
    const [loadingUso, setLoadingUso] = useState(false);
    const [loadingElim, setLoadingElim] = useState(false);
    const [confirm, setConfirm] = useState(null);

    const handleMarcarUsado = async () => {
        setLoadingUso(true);
        await onMarcarUsado(ticket.id_tbl_certificado);
        setLoadingUso(false);
        setConfirm(null);
        onClose();
    };

    const handleEliminar = async () => {
        setLoadingElim(true);
        await onEliminar(ticket.id_tbl_certificado);
        setLoadingElim(false);
        setConfirm(null);
        onClose();
    };

    const panelCls = expandido
        ? "fixed inset-0 z-50 bg-white flex flex-col"
        : "fixed top-0 right-0 h-full z-50 bg-white shadow-2xl border-l border-gray-200 flex flex-col";
    const panelStyle = expandido ? {} : { width: "440px" };

    const tieneCoordenadas =
        ticket.latitud !== null && ticket.latitud !== '' && ticket.latitud !== undefined &&
        ticket.longitud !== null && ticket.longitud !== '' && ticket.longitud !== undefined;

    const mapsUrl = tieneCoordenadas
        ? `https://www.google.com/maps?q=${ticket.latitud},${ticket.longitud}`
        : null;

    return (
        <div className={panelCls} style={panelStyle}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shrink-0">
                <button onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Cerrar panel">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                        {obtenerNombreTipo(ticket.id_tbl_type)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                        Código: <span className="font-mono font-bold">{ticket.codigo}</span>
                    </p>
                </div>

                <Badge usado={!!ticket.used_at} />

                <button onClick={() => setExpandido(v => !v)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    title={expandido ? "Panel lateral" : "Pantalla completa"}>
                    {expandido
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6" />
                        </svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    }
                </button>
            </div>

            {/* ── Contenido ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-center items-center pb-8">
                    <img src={ticket.url} width={300} height={300} alt="codigo de barras" />
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                    <Row label="ID" value={ticket.id_tbl_certificado} />
                    <Row label="Código" value={<span className="font-mono font-bold text-gray-900">{ticket.codigo}</span>} />
                    <Row label="Tipo" value={<TipoBadge tipo={ticket.id_tbl_type} />} />
                    <Row label="Estado" value={<Badge usado={!!ticket.used_at} />} />
                    <Row label="Usuario" value={ticket.nombre_usuario || '—'} />
                    <Row label="CI / RUC" value={ticket.ci_ruc || '—'} />
                    <Row label="Suscripción" value={ticket.codigo_suscripcion || '—'} />
                    <VinoBlocks ticket={ticket} />
                    <Row label="Ubicación" value={ticket.ubicacion || '—'} />
                    <Row label="Creado" value={ticket.created_at || '—'} />
                    <Row label="Usado el" value={ticket.used_at || '—'} />
                </div>
            </div>

            {/* ── Footer con acciones ─────────────────────────────────── */}
            <div className="flex gap-2 px-4 py-3 border-t border-gray-200 justify-end flex-wrap shrink-0">
                {!ticket.used_at && ticket.is_active == 1 && (
                    confirm === 'uso' ? (
                        <>
                            <span className="text-xs text-gray-500 self-center">¿Confirmar?</span>
                            <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
                            <button onClick={handleMarcarUsado} disabled={loadingUso}
                                className="px-3 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                                {loadingUso ? 'Guardando...' : 'Sí, marcar usado'}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setConfirm('uso')}
                            className="px-3 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                            Marcar como usado
                        </button>
                    )
                )}
                {ticket.is_active == 1 && (
                    confirm === 'eliminar' ? (
                        <>
                            <span className="text-xs text-gray-500 self-center">¿Eliminar?</span>
                            <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
                            <button onClick={handleEliminar} disabled={loadingElim}
                                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                                {loadingElim ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setConfirm('eliminar')}
                            className="px-3 py-1.5 text-xs rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                            Eliminar
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

/* ───────── Componente principal ───────── */

const TicketMain = () => {
    const [filtros, setFiltros] = useState(initialFiltros);
    const [lista, setLista] = useState([]);
    const [paginacion, setPaginacion] = useState({ pagina: 1, paginas: 1, items: 0 });
    const [cantidad] = useState(20);
    const [loading, setLoading] = useState(false);
    const [selTicket, setSelTicket] = useState(null);
    const [buscado, setBuscado] = useState(false);
    const [showCrear, setShowCrear] = useState(false);
    const [toast, setToast] = useState(null); // { tipo: 'ok'|'error', mensaje }

    // Mapa uuid_oferta -> { type, subType } para poder filtrar tickets
    // por categoria de vinos en el cliente.
    const [vinoOfertasMap, setVinoOfertasMap] = useState({});
    const [cargandoCatalogoVino, setCargandoCatalogoVino] = useState(false);

    const notify = (tipo, mensaje) => setToast({ tipo, mensaje });

    const buscar = useCallback(async (pagina = 1) => {
        setLoading(true);

        // Si hay filtro vino activo, traducir a un array de UUIDs de oferta
        // y mandarlo al backend (id_tbl_oferta acepta array -> WHERE IN ...).
        // De esta forma la paginacion la hace el backend y no quedan paginas
        // dispares.
        const filtrosBackend = { ...filtros };
        delete filtrosBackend.wine_type;
        delete filtrosBackend.wine_subType;

        const hayFiltrosVino = filtros.wine_type || filtros.wine_subType;
        if (hayFiltrosVino) {
            const uuidsMatch = Object.entries(vinoOfertasMap)
                .filter(([_, info]) => {
                    if (filtros.wine_type && info.type !== filtros.wine_type) return false;
                    if (filtros.wine_subType && info.subType !== filtros.wine_subType) return false;
                    return true;
                })
                .map(([uuid]) => uuid);
            // Pasar siempre el array — si esta vacio el backend devuelve 0
            // (gracias al fallback "1=0" en el patch del PHP)
            filtrosBackend.id_tbl_oferta = uuidsMatch;
        }

        const res = await listarTickets({ filtros: filtrosBackend, pagina, cantidad });
        if (res.ok) {
            setLista(res.data.lista || []);
            setPaginacion({
                pagina: res.data.pagina,
                paginas: res.data.paginas,
                items: res.data.items,
            });
        } else {
            notify('error', res.error);
            setLista([]);
        }
        setLoading(false);
        setBuscado(true);
    }, [filtros, cantidad, vinoOfertasMap]);

    useEffect(() => {
        buscar(1);
        // eslint-disable-next-line
    }, []);

    // Pre-cargar el catalogo de ofertas de vinos para resolver UUIDs y filtrar
    useEffect(() => {
        let cancelado = false;
        setCargandoCatalogoVino(true);
        getAllWineOfferts().then((list) => {
            if (cancelado) return;
            const map = {};
            (Array.isArray(list) ? list : []).forEach((o) => {
                if (o?.id) {
                    map[o.id] = {
                        type: o.type || '',
                        subType: o.subType || '',
                        title: o.title || '',
                    };
                }
            });
            setVinoOfertasMap(map);
            setCargandoCatalogoVino(false);
        });
        return () => { cancelado = true; };
    }, []);

    // Re-buscar automaticamente cuando cambian los filtros de vino. Requiere
    // que el catalogo este cargado para poder calcular el array de UUIDs que
    // se manda al backend como id_tbl_oferta. La primera carga se cubre en el
    // useEffect inicial; este solo se dispara cuando ya hubo buscado.
    useEffect(() => {
        if (cargandoCatalogoVino) return;
        if (!buscado) return;
        buscar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros.wine_type, filtros.wine_subType, cargandoCatalogoVino]);

    const handleFiltro = (e) => {
        const { name, value } = e.target;
        // Si cambia wine_type, resetear wine_subType
        if (name === 'wine_type') {
            setFiltros(prev => ({ ...prev, wine_type: value, wine_subType: '' }));
        } else {
            setFiltros(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMarcarUsado = async (id) => {
        const res = await marcarTicketUsado(id);
        if (res.ok) {
            notify('ok', 'Ticket marcado como usado');
            buscar(paginacion.pagina);
        } else {
            notify('error', res.error);
        }
    };

    const handleEliminar = async (id) => {
        const res = await eliminarTicket(id);
        if (res.ok) {
            notify('ok', 'Ticket eliminado');
            buscar(paginacion.pagina);
        } else {
            notify('error', res.error);
        }
    };

    const handleCreated = () => {
        notify('ok', 'Ticket creado correctamente');
        buscar(1);
    };

    const irPagina = (p) => {
        if (p >= 1 && p <= paginacion.paginas) buscar(p);
    };

    const handleLimpiar = () => {
        setFiltros(initialFiltros);
        setTimeout(() => buscar(1), 0);
    };

    const handleLimpiarVino = () => {
        setFiltros(prev => ({ ...prev, wine_type: '', wine_subType: '' }));
    };

    // El filtro vino ahora viaja al backend como id_tbl_oferta:[uuid,...]
    // asi que la lista ya viene paginada correctamente desde el server.
    const listaFiltrada = lista;

    // Stats calculados sobre la lista paginada (no aplica filtrado local)
    const disponibles = listaFiltrada.filter(t => !t.used_at).length;
    const usados = listaFiltrada.filter(t => t.used_at).length;

    const hayFechasActivas = filtros.fecha_desde || filtros.fecha_hasta;
    const hayFiltrosVino = filtros.wine_type || filtros.wine_subType;
    const subTypeOptionsForUI = getSubTypeOptions(filtros.wine_type);

    return (
        <div className="flex-1 p-4 w-full relative">
            {/* Filtros inline */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <input
                    name="codigo"
                    value={filtros.codigo}
                    onChange={handleFiltro}
                    placeholder="Código..."
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <input
                    name="codigo_suscripcion"
                    value={filtros.codigo_suscripcion}
                    onChange={handleFiltro}
                    placeholder="Cód. suscripción..."
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <input
                    name="ci_ruc"
                    value={filtros.ci_ruc}
                    onChange={handleFiltro}
                    placeholder="CI / RUC..."
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-300"
                />

                <select
                    name="id_tbl_type"
                    value={filtros.id_tbl_type}
                    onChange={handleFiltro}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    {TIPO.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>

                <select
                    name="is_active"
                    value={filtros.is_active}
                    onChange={handleFiltro}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    {ACTIVO.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>

                {/* Filtros de Vinos (cliente-side sobre vino_api) */}
                <select
                    name="wine_type"
                    value={filtros.wine_type}
                    onChange={handleFiltro}
                    title={cargandoCatalogoVino ? "Cargando catalogo de vinos..." : "Filtrar por tipo de vino"}
                    className="border border-purple-200 bg-purple-50 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                    <option value="">Tipo (todos)</option>
                    {OFFER_TYPE_OPTIONS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>

                <select
                    name="wine_subType"
                    value={filtros.wine_subType}
                    onChange={handleFiltro}
                    disabled={!filtros.wine_type}
                    title={filtros.wine_type ? "Filtrar por subtipo" : "Elige un tipo de vino primero"}
                    className="border border-purple-200 bg-purple-50 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                >
                    <option value="">
                        {filtros.wine_type ? 'Subtipo (todos)' : 'Subtipo —'}
                    </option>
                    {subTypeOptionsForUI.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                {/* Filtro de fechas */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 shrink-0">Fecha:</span>
                    <input
                        type="date"
                        name="fecha_desde"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={filtros.fecha_desde}
                        onChange={handleFiltro}
                        title="Desde"
                    />
                    <span className="text-gray-300 text-xs">—</span>
                    <input
                        type="date"
                        name="fecha_hasta"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={filtros.fecha_hasta}
                        onChange={handleFiltro}
                        title="Hasta"
                    />
                    {hayFechasActivas && (
                        <button
                            onClick={() => setFiltros(prev => ({ ...prev, fecha_desde: '', fecha_hasta: '' }))}
                            className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Limpiar fechas"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    onClick={() => buscar(1)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Buscando...' : 'Aplicar'}
                </button>

                <button
                    onClick={() => setShowCrear(true)}
                    className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-4 rounded-lg shadow-sm transition-colors"
                >
                    <span className="text-base leading-none">+</span>
                    Nuevo
                </button>
            </div>

            {/* Tabla */}
            {buscado && (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 flex-wrap gap-2">
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-500">
                                <strong className="text-gray-800">{paginacion.items}</strong> resultado{paginacion.items !== 1 ? 's' : ''}
                            </span>
                            {lista.length > 0 && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-green-700">{disponibles} disponibles</span>
                                    <span className="text-gray-500">{usados} usados</span>
                                </>
                            )}
                        </div>
                        <span className="text-xs text-gray-400">
                            Página {paginacion.pagina} de {paginacion.paginas}
                        </span>
                    </div>
                    {hayFiltrosVino && (
                        <div className="px-4 py-2 bg-purple-50 border-b border-purple-100 flex items-center gap-2 text-xs">
                            <span className="text-purple-700">Filtro vino activo:</span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                                {labelForType(filtros.wine_type) || 'todos'}
                                {filtros.wine_subType && ` / ${labelForSubType(filtros.wine_type, filtros.wine_subType)}`}
                            </span>
                            <span className="text-gray-500">
                                ({paginacion.items} ticket{paginacion.items !== 1 ? 's' : ''} en total)
                            </span>
                            <button onClick={handleLimpiarVino}
                                className="ml-auto text-purple-600 hover:text-purple-800 hover:underline">
                                Quitar filtro
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">ID</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Código</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Tipo</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Estado</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Usuario</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">CI / RUC</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Suscripción</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Creado</th>
                                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16">
                                            <div className="flex items-center justify-center gap-2 text-gray-400">
                                                <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                <span className="text-sm">Cargando...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : listaFiltrada.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-10 text-gray-400">
                                            {hayFiltrosVino
                                                ? 'No hay tickets para este filtro de vino.'
                                                : 'No se encontraron registros'}
                                        </td>
                                    </tr>
                                ) : (
                                    listaFiltrada.map((t, i) => (
                                        <tr key={t.id_tbl_certificado}
                                            className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors cursor-pointer`}
                                            onClick={() => setSelTicket(t)}>
                                            <td className="px-3 py-2 text-gray-400">{t.id_tbl_certificado}</td>
                                            <td className="px-3 py-2 font-mono font-bold text-gray-800">{t.codigo}</td>
                                            <td className="px-3 py-2"><TipoBadge tipo={t.id_tbl_type} /></td>
                                            <td className="px-3 py-2"><Badge usado={!!t.used_at} /></td>
                                            <td className="px-3 py-2 text-gray-700">{t.nombre_usuario || '—'}</td>
                                            <td className="px-3 py-2 text-gray-500">{t.ci_ruc || '—'}</td>
                                            <td className="px-3 py-2 text-gray-500">{t.codigo_suscripcion || '—'}</td>
                                            <td className="px-3 py-2 text-gray-400">{t.created_at?.slice(0, 10) || '—'}</td>
                                            <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                                <BtnAccion title="Ver detalle" onClick={() => setSelTicket(t)}>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </BtnAccion>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Paginación */}
            {buscado && paginacion.paginas > 1 && (
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>Página {paginacion.pagina} de {paginacion.paginas}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => irPagina(paginacion.pagina - 1)}
                            disabled={paginacion.pagina === 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => irPagina(paginacion.pagina + 1)}
                            disabled={paginacion.pagina === paginacion.paginas}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}

            {/* Modales */}
            {selTicket && (
                <PanelDetalle
                    ticket={selTicket}
                    onClose={() => setSelTicket(null)}
                    onMarcarUsado={handleMarcarUsado}
                    onEliminar={handleEliminar}
                />
            )}
            {showCrear && (
                <CrearTicketModal
                    onClose={() => setShowCrear(false)}
                    onCreated={handleCreated}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast tipo={toast.tipo} mensaje={toast.mensaje} onClose={() => setToast(null)} />
            )}
        </div>
    );
};

export default TicketMain;