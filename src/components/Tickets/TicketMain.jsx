import React, { useState, useCallback, useEffect } from 'react';
import {
    listarTickets,
    marcarTicketUsado,
    eliminarTicket,
    TIPOS_TICKET,
    obtenerNombreTipo,
} from '../../controllers/ticket/TicketController';
import CrearTicketModal from './CrearTicketModal';

const TIPO = [
    { id: '', nombre: 'Todos' },
    ...TIPOS_TICKET.map(t => ({ id: String(t.id), nombre: t.nombre })),
];

const ACTIVO = [
    { id: '1', nombre: 'Activos' },
    { id: '0', nombre: 'Eliminados' },
    { id: '',  nombre: 'Todos' },
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
};

const inputCls =
    'w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white ' +
    'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition';

/* ───────── Componentes visuales reutilizables ───────── */

const Badge = ({ usado }) =>
    usado ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Usado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Disponible
        </span>
    );

const TipoBadge = ({ tipo }) =>
    tipo == 1 ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Certificado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
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
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium ${styles[tipo]}`}>
            {mensaje}
        </div>
    );
};

const StatCard = ({ label, value, color = 'gray' }) => {
    const colors = {
        gray:    'bg-white border-gray-200',
        emerald: 'bg-white border-emerald-100',
        amber:   'bg-white border-amber-100',
        slate:   'bg-white border-slate-200',
    };
    const valueColors = {
        gray:    'text-gray-900',
        emerald: 'text-emerald-600',
        amber:   'text-amber-600',
        slate:   'text-slate-700',
    };
    return (
        <div className={`rounded-lg border ${colors[color]} px-4 py-3`}>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-semibold mt-0.5 ${valueColors[color]}`}>{value}</p>
        </div>
    );
};

/* ───────── Modal de detalle ───────── */

const ModalDetalle = ({ ticket, onClose, onMarcarUsado, onEliminar }) => {
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

    const tieneCoordenadas =
        ticket.latitud !== null && ticket.latitud !== '' && ticket.latitud !== undefined &&
        ticket.longitud !== null && ticket.longitud !== '' && ticket.longitud !== undefined;

    const mapsUrl = tieneCoordenadas
        ? `https://www.google.com/maps?q=${ticket.latitud},${ticket.longitud}`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <TipoBadge tipo={ticket.id_tbl_type} />
                        <span className="font-mono font-bold text-base text-gray-900 truncate">
                            {ticket.codigo}
                        </span>
                        <Badge usado={!!ticket.used_at} />
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition shrink-0">
                        ✕
                    </button>
                </div>

                <div className="px-6 py-5 overflow-y-auto">
                    {/* Imagen del barcode */}
                    {ticket.urlencriptado && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-5 flex justify-center">
                            <img
                                src={ticket.urlencriptado}
                                alt={`Código ${ticket.codigo}`}
                                className="max-h-24"
                            />
                        </div>
                    )}

                    {/* Datos */}
                    <div className="space-y-0">
                        <Row label="ID" value={<span className="font-mono">{ticket.id_tbl_certificado}</span>} />
                        <Row label="Usuario" value={ticket.nombre_usuario || '—'} />
                        <Row label="CI / RUC" value={<span className="font-mono">{ticket.ci_ruc || '—'}</span>} />
                        <Row label="Suscripción" value={<span className="font-mono">{ticket.codigo_suscripcion || '—'}</span>} />
                        <Row label="Establecimiento" value={<span className="font-mono text-xs">{ticket.id_tbl_establecimiento || '—'}</span>} />
                        <Row label="Oferta" value={<span className="font-mono text-xs">{ticket.id_tbl_oferta || '—'}</span>} />
                        <Row
                            label="Beneficiarios"
                            value={ticket.beneficiarios && ticket.beneficiarios > 0 ? ticket.beneficiarios : '—'}
                        />
                        <Row label="Ubicación" value={ticket.ubicacion || '—'} />
                        <Row
                            label="Coordenadas"
                            value={
                                tieneCoordenadas ? (
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 hover:underline">
                                        <span className="font-mono text-xs">
                                            {Number(ticket.latitud).toFixed(6)}, {Number(ticket.longitud).toFixed(6)}
                                        </span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : '—'
                            }
                        />
                        <Row label="Creado" value={<span className="font-mono text-xs">{ticket.created_at || '—'}</span>} />
                        <Row label="Usado el" value={<span className="font-mono text-xs">{ticket.used_at || '—'}</span>} />
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex gap-2 px-6 py-4 border-t border-gray-100 justify-end flex-wrap shrink-0 bg-gray-50/50">
                    {!ticket.used_at && ticket.is_active == 1 && (
                        confirm === 'uso' ? (
                            <>
                                <span className="text-xs text-gray-600 self-center mr-1">¿Confirmar?</span>
                                <button onClick={() => setConfirm(null)} className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                <button onClick={handleMarcarUsado} disabled={loadingUso}
                                        className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm">
                                    {loadingUso ? 'Guardando...' : 'Sí, marcar usado'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setConfirm('uso')}
                                    className="px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm">
                                Marcar como usado
                            </button>
                        )
                    )}
                    {ticket.is_active == 1 && (
                        confirm === 'eliminar' ? (
                            <>
                                <span className="text-xs text-gray-600 self-center mr-1">¿Eliminar?</span>
                                <button onClick={() => setConfirm(null)} className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                <button onClick={handleEliminar} disabled={loadingElim}
                                        className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition shadow-sm">
                                    {loadingElim ? 'Eliminando...' : 'Sí, eliminar'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setConfirm('eliminar')}
                                    className="px-3 py-2 text-sm font-medium rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition">
                                Eliminar
                            </button>
                        )
                    )}
                    <button
                        onClick={onClose}
                        className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">
                        Cerrar
                    </button>
                </div>
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
    const [toast, setToast] = useState(null);
    const [showFiltros, setShowFiltros] = useState(true);

    const notify = (tipo, mensaje) => setToast({ tipo, mensaje });

    const buscar = useCallback(async (pagina = 1) => {
        setLoading(true);
        const res = await listarTickets({ filtros, pagina, cantidad });
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
    }, [filtros, cantidad]);

    useEffect(() => {
        buscar(1);
        // eslint-disable-next-line
    }, []);

    const handleFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
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

    const disponibles = lista.filter(t => !t.used_at).length;
    const usados = lista.filter(t => t.used_at).length;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Tickets y Certificados</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona los códigos emitidos a usuarios</p>
                </div>
                <button
                    onClick={() => setShowCrear(true)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo
                </button>
            </div>

            {/* Stats */}
            {buscado && lista.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <StatCard label="Total" value={paginacion.items} color="slate" />
                    <StatCard label="Disponibles" value={disponibles} color="emerald" />
                    <StatCard label="Usados" value={usados} color="amber" />
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
                <button
                    onClick={() => setShowFiltros(!showFiltros)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Filtros</p>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showFiltros ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showFiltros && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Código</label>
                                <input name="codigo" value={filtros.codigo} onChange={handleFiltro}
                                       placeholder="ABCD123..." className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Código suscripción</label>
                                <input name="codigo_suscripcion" value={filtros.codigo_suscripcion} onChange={handleFiltro}
                                       placeholder="SUS-..." className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">CI / RUC</label>
                                <input name="ci_ruc" value={filtros.ci_ruc} onChange={handleFiltro}
                                       placeholder="1234567890" className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Tipo</label>
                                <select name="id_tbl_type" value={filtros.id_tbl_type} onChange={handleFiltro} className={inputCls}>
                                    {TIPO.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Ubicación</label>
                                <input name="ubicacion" value={filtros.ubicacion} onChange={handleFiltro}
                                       placeholder="Ej: Cuenca" className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Fecha desde</label>
                                <input type="date" name="fecha_desde" value={filtros.fecha_desde} onChange={handleFiltro}
                                       className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Fecha hasta</label>
                                <input type="date" name="fecha_hasta" value={filtros.fecha_hasta} onChange={handleFiltro}
                                       className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Estado</label>
                                <select name="is_active" value={filtros.is_active} onChange={handleFiltro} className={inputCls}>
                                    {ACTIVO.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleLimpiar}
                                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Limpiar
                            </button>
                            <button onClick={() => buscar(1)} disabled={loading}
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition shadow-sm">
                                {loading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            {buscado && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60 flex-wrap gap-2">
                        <span className="text-sm text-gray-600">
                            <strong className="text-gray-900">{paginacion.items}</strong> resultado{paginacion.items !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-400">
                            Página {paginacion.pagina} de {paginacion.paginas}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Código</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">CI / RUC</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ubicación</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Benef.</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Creado</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : lista.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            ) : (
                                lista.map((t) => (
                                    <tr key={t.id_tbl_certificado}
                                        className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/40 transition cursor-pointer"
                                        onClick={() => setSelTicket(t)}>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{t.id_tbl_certificado}</td>
                                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{t.codigo}</td>
                                        <td className="px-4 py-3"><TipoBadge tipo={t.id_tbl_type} /></td>
                                        <td className="px-4 py-3"><Badge usado={!!t.used_at} /></td>
                                        <td className="px-4 py-3 text-gray-700">{t.nombre_usuario || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{t.ci_ruc || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">{t.ubicacion || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 text-center">{t.beneficiarios > 0 ? t.beneficiarios : '—'}</td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{t.created_at?.slice(0, 10) || '—'}</td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => setSelTicket(t)}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition">
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {paginacion.paginas > 1 && (
                        <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                            <button onClick={() => irPagina(paginacion.pagina - 1)}
                                    disabled={paginacion.pagina === 1}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition">
                                ‹ Ant
                            </button>
                            {Array.from({ length: Math.min(paginacion.paginas, 7) }, (_, i) => {
                                const p = i + 1;
                                return (
                                    <button key={p} onClick={() => irPagina(p)}
                                            className={`px-3 py-1.5 text-sm border rounded-md transition ${
                                                p === paginacion.pagina
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                        {p}
                                    </button>
                                );
                            })}
                            <button onClick={() => irPagina(paginacion.pagina + 1)}
                                    disabled={paginacion.pagina === paginacion.paginas}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition">
                                Sig ›
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modales */}
            {selTicket && (
                <ModalDetalle
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