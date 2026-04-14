import React, { useEffect, useState } from 'react';
import {
    crearTicket,
    TIPOS_TICKET,
    obtenerSuscripcionesUsuario,
} from '../../controllers/ticket/TicketController';
import BuscadorUsuario from './BuscadorUsuario';
import BuscadorEstablecimiento from './BuscadorEstablecimiento';

const CrearTicketModal = ({ onClose, onCreated }) => {
    const [tipo, setTipo] = useState(1);

    // Usuario
    const [inputUsuario, setInputUsuario] = useState('');
    const [usuario, setUsuario] = useState(null);

    // Suscripciones
    const [suscripciones, setSuscripciones] = useState([]);
    const [loadingSuscs, setLoadingSuscs] = useState(false);
    const [idSuscripcion, setIdSuscripcion] = useState('');

    // Establecimiento y oferta
    const [inputEst, setInputEst] = useState('');
    const [establecimiento, setEstablecimiento] = useState(null);
    const [idOferta, setIdOferta] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [creado, setCreado] = useState(null);

    // Cargar suscripciones al seleccionar usuario
    useEffect(() => {
        if (!usuario?.id_tbl_usuario) {
            setSuscripciones([]);
            setIdSuscripcion('');
            return;
        }
        setLoadingSuscs(true);
        obtenerSuscripcionesUsuario(usuario.id_tbl_usuario).then((subs) => {
            setSuscripciones(subs || []);
            setLoadingSuscs(false);
            const activa = (subs || []).find((s) => s.estado === 'activo');
            if (activa) setIdSuscripcion(activa.id_tbl_suscripcion);
        });
    }, [usuario]);

    // Al cambiar de establecimiento, resetear oferta
    useEffect(() => {
        setIdOferta('');
    }, [establecimiento]);

    const handleSelectUsuario = (u) => {
        setUsuario(u);
        setInputUsuario(u.nombres || u.usuario || '');
    };

    const handleClearUsuario = () => {
        setUsuario(null);
        setInputUsuario('');
        setSuscripciones([]);
        setIdSuscripcion('');
    };

    const handleSelectEst = (e) => {
        setEstablecimiento(e);
        setInputEst(e.titulo || '');
    };

    const handleClearEst = () => {
        setEstablecimiento(null);
        setInputEst('');
        setIdOferta('');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        const payload = {
            id_tbl_type: tipo,
            id_tbl_usuario: usuario?.id_tbl_usuario || '',
            id_tbl_suscripcion: idSuscripcion || '',
            id_tbl_oferta: idOferta || '',
            id_tbl_establecimiento: establecimiento?.id_establecimiento || '',
        };

        const res = await crearTicket(payload);
        setLoading(false);

        if (res.ok) {
            setCreado(res.data.ticket || {
                codigo: '—',
                id_tbl_certificado: res.data.id_tbl_certificado,
            });
            if (onCreated) onCreated();
        } else {
            setError(res.error);
        }
    };

    const handleCerrar = () => {
        setCreado(null);
        onClose();
    };

    const handleCrearOtro = () => {
        setCreado(null);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                    <h3 className="text-sm font-semibold text-gray-800">
                        {creado ? 'Ticket creado' : 'Nuevo Ticket / Certificado'}
                    </h3>
                    <button onClick={handleCerrar}
                            className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
                </div>

                {creado ? (
                    <div className="px-5 py-6">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Código generado</p>
                            <p className="font-mono font-bold text-2xl text-gray-800 tracking-wider">
                                {creado.codigo}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                ID: {creado.id_tbl_certificado}
                            </p>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t">
                            <button onClick={handleCrearOtro}
                                    className="px-3 py-1.5 text-xs border rounded text-gray-600 hover:bg-gray-50">
                                Crear otro
                            </button>
                            <button onClick={handleCerrar}
                                    className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="px-5 py-4 space-y-4 overflow-y-auto">
                            {/* Tipo */}
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {TIPOS_TICKET.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setTipo(t.id)}
                                            className={`flex-1 px-3 py-2 text-xs rounded border transition-colors ${
                                                tipo === t.id
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}>
                                            {t.nombre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Usuario */}
                            <BuscadorUsuario
                                value={inputUsuario}
                                onChange={setInputUsuario}
                                onSelect={handleSelectUsuario}
                                onClear={handleClearUsuario}
                                label="Usuario (opcional)"
                                placeholder="Nombres, cédula o ID..."
                            />

                            {usuario && (
                                <div className="bg-green-50 border border-green-200 rounded p-3 text-xs">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {usuario.nombres || '—'}
                                            </p>
                                            <p className="text-gray-600 mt-0.5">
                                                CI: {usuario.ci_ruc || '—'} · ID: {usuario.usuario || usuario.id_tbl_usuario}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                                            usuario.estado === 'activo'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {usuario.estado}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Suscripción */}
                            {usuario && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Suscripción relacionada
                                    </label>
                                    {loadingSuscs ? (
                                        <div className="text-xs text-gray-400 py-2">Cargando suscripciones...</div>
                                    ) : suscripciones.length === 0 ? (
                                        <div className="text-xs text-gray-400 bg-gray-50 border rounded px-3 py-2">
                                            Este usuario no tiene suscripciones
                                        </div>
                                    ) : (
                                        <select
                                            value={idSuscripcion}
                                            onChange={(e) => setIdSuscripcion(e.target.value)}
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400">
                                            <option value="">— Sin suscripción —</option>
                                            {suscripciones.map((s) => (
                                                <option
                                                    key={s.id_tbl_suscripcion}
                                                    value={s.id_tbl_suscripcion}>
                                                    {s.titulo || 'Suscripción'} · {s.fecha_inicio} → {s.fecha_fin} ({s.estado})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {/* Establecimiento */}
                            <div className="pt-2 border-t">
                                <BuscadorEstablecimiento
                                    value={inputEst}
                                    onChange={setInputEst}
                                    onSelect={handleSelectEst}
                                    onClear={handleClearEst}
                                    label="Establecimiento (opcional)"
                                    placeholder="Nombre del establecimiento..."
                                />
                            </div>

                            {establecimiento && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {establecimiento.titulo}
                                            </p>
                                            <p className="text-gray-600 mt-0.5">
                                                {[establecimiento.ciudad, establecimiento.provincia].filter(Boolean).join(', ') || '—'}
                                            </p>
                                            {establecimiento.direccion && (
                                                <p className="text-gray-500 mt-0.5">{establecimiento.direccion}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">
                                            ID: {establecimiento.id_establecimiento}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Oferta (habilitado solo si hay establecimiento) */}
                            {establecimiento && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Oferta
                                    </label>
                                    {establecimiento.ofertas.length === 0 ? (
                                        <div className="text-xs text-gray-400 bg-gray-50 border rounded px-3 py-2">
                                            Este establecimiento no tiene ofertas activas
                                        </div>
                                    ) : (
                                        <select
                                            value={idOferta}
                                            onChange={(e) => setIdOferta(e.target.value)}
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400">
                                            <option value="">— Sin oferta —</option>
                                            {establecimiento.ofertas.map((o) => (
                                                <option key={o.id_oferta} value={o.id_oferta}>
                                                    {o.tituloOferta} · {o.dias}d/{o.noches}n · {o.acomodacion} · ${o.final}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-gray-400 italic">
                                El código se generará automáticamente al crear el registro.
                            </p>

                            {error && (
                                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 px-5 py-4 border-t justify-end shrink-0">
                            <button onClick={handleCerrar}
                                    className="px-3 py-1.5 text-xs border rounded text-gray-600 hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} disabled={loading}
                                    className="px-4 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                {loading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CrearTicketModal;