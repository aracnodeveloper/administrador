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
    is_active: '1',
};

/* ───────── Componentes visuales reutilizables ───────── */

const Badge = ({ usado }) =>
    usado ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            Usado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            Disponible
        </span>
    );

const TipoBadge = ({ tipo }) =>
    tipo == 1 ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
            Certificado
        </span>
    ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            Ticket
        </span>
    );

const Row = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-1">
        <span className="text-gray-400 w-36 shrink-0">{label}</span>
        <span className="text-right">{value}</span>
    </div>
);

const Toast = ({ tipo, mensaje, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const styles = {
        ok: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-xs ${styles[tipo]}`}>
            {mensaje}
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                            {obtenerNombreTipo(ticket.id_tbl_type)}
                        </h3>
                        <span className="font-mono font-bold text-xs text-gray-500">
                            {ticket.codigo}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
                </div>
                <div className="px-5 py-4 space-y-2 text-xs text-gray-700">
                    <Row label="ID" value={ticket.id_tbl_certificado} />
                    <Row label="Código" value={<span className="font-mono font-bold text-gray-900">{ticket.codigo}</span>} />
                    <Row label="Tipo" value={<TipoBadge tipo={ticket.id_tbl_type} />} />
                    <Row label="Estado" value={<Badge usado={!!ticket.used_at} />} />
                    <Row label="Usuario" value={ticket.nombre_usuario || '—'} />
                    <Row label="CI / RUC" value={ticket.ci_ruc || '—'} />
                    <Row label="Suscripción" value={ticket.codigo_suscripcion || '—'} />
                    <Row label="Establecimiento" value={ticket.id_tbl_establecimiento || '—'} />
                    <Row label="Oferta" value={ticket.id_tbl_oferta || '—'} />
                    <Row label="Creado" value={ticket.created_at || '—'} />
                    <Row label="Usado el" value={ticket.used_at || '—'} />
                </div>
                <div className="flex gap-2 px-5 py-4 border-t justify-end flex-wrap">
                    {!ticket.used_at && ticket.is_active == 1 && (
                        confirm === 'uso' ? (
                            <>
                                <span className="text-xs text-gray-500 self-center">¿Confirmar?</span>
                                <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs rounded border text-gray-600 hover:bg-gray-50">Cancelar</button>
                                <button onClick={handleMarcarUsado} disabled={loadingUso}
                                        className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                    {loadingUso ? 'Guardando...' : 'Sí, marcar usado'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setConfirm('uso')}
                                    className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                                Marcar como usado
                            </button>
                        )
                    )}
                    {ticket.is_active == 1 && (
                        confirm === 'eliminar' ? (
                            <>
                                <span className="text-xs text-gray-500 self-center">¿Eliminar?</span>
                                <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs rounded border text-gray-600 hover:bg-gray-50">Cancelar</button>
                                <button onClick={handleEliminar} disabled={loadingElim}
                                        className="px-3 py-1.5 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                                    {loadingElim ? 'Eliminando...' : 'Sí, eliminar'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setConfirm('eliminar')}
                                    className="px-3 py-1.5 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50">
                                Eliminar
                            </button>
                        )
                    )}
                    <button onClick={onClose} className="px-3 py-1.5 text-xs rounded border text-gray-600 hover:bg-gray-50">Cerrar</button>
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
    const [toast, setToast] = useState(null); // { tipo: 'ok'|'error', mensaje }

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

    // Cargar al entrar con filtros por defecto
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
        // Re-buscar con filtros iniciales
        setTimeout(() => buscar(1), 0);
    };

    // Stats calculados del resultado actual
    const disponibles = lista.filter(t => !t.used_at).length;
    const usados = lista.filter(t => t.used_at).length;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Tickets y Certificados</h2>
                    <p className="text-xs text-gray-500">Gestiona los códigos emitidos</p>
                </div>
                <button onClick={() => setShowCrear(true)}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-4 rounded shadow-sm transition-colors">
                    <span className="text-base leading-none">+</span>
                    Nuevo
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filtros</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Código</label>
                        <input name="codigo" value={filtros.codigo} onChange={handleFiltro}
                               placeholder="ABCD123..."
                               className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Código suscripción</label>
                        <input name="codigo_suscripcion" value={filtros.codigo_suscripcion} onChange={handleFiltro}
                               placeholder="SUS-..."
                               className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">CI / RUC</label>
                        <input name="ci_ruc" value={filtros.ci_ruc} onChange={handleFiltro}
                               placeholder="1234567890"
                               className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
                        <select name="id_tbl_type" value={filtros.id_tbl_type} onChange={handleFiltro}
                                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400">
                            {TIPO.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Fecha desde</label>
                        <input type="date" name="fecha_desde" value={filtros.fecha_desde} onChange={handleFiltro}
                               className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Fecha hasta</label>
                        <input type="date" name="fecha_hasta" value={filtros.fecha_hasta} onChange={handleFiltro}
                               className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Estado</label>
                        <select name="is_active" value={filtros.is_active} onChange={handleFiltro}
                                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400">
                            {ACTIVO.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button onClick={() => buscar(1)} disabled={loading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded disabled:opacity-50 transition-colors">
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                        <button onClick={handleLimpiar}
                                className="px-3 py-1.5 text-xs border rounded text-gray-500 hover:bg-gray-50">
                            Limpiar
                        </button>
                    </div>
                </div>
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
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
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8 text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : lista.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8 text-gray-400">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            ) : (
                                lista.map((t, i) => (
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
                                            <button onClick={() => setSelTicket(t)}
                                                    className="px-2 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
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
                        <div className="flex items-center justify-center gap-1 px-4 py-3 border-t">
                            <button onClick={() => irPagina(paginacion.pagina - 1)}
                                    disabled={paginacion.pagina === 1}
                                    className="px-2 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">
                                ‹ Ant
                            </button>
                            {Array.from({ length: Math.min(paginacion.paginas, 7) }, (_, i) => {
                                const p = i + 1;
                                return (
                                    <button key={p} onClick={() => irPagina(p)}
                                            className={`px-2 py-1 text-xs border rounded ${p === paginacion.pagina ? 'bg-green-600 text-white border-green-600' : 'hover:bg-gray-50'}`}>
                                        {p}
                                    </button>
                                );
                            })}
                            <button onClick={() => irPagina(paginacion.pagina + 1)}
                                    disabled={paginacion.pagina === paginacion.paginas}
                                    className="px-2 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">
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