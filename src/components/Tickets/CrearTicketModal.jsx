import React, { useEffect, useState } from 'react';
import {
    crearTicket,
    TIPOS_TICKET,
    obtenerSuscripcionesUsuario,
} from '../../controllers/ticket/TicketController';
import BuscadorUsuario from './BuscadorUsuario';
import BuscadorEstablecimiento from './BuscadorEstablecimiento';

/* ───────── Inputs reutilizables ───────── */

const inputCls =
    'w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white ' +
    'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition';

const labelCls = 'text-xs font-medium text-gray-600 mb-1.5 block';

const Field = ({ label, required, children, hint }) => (
    <div>
        <label className={labelCls}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
            {hint && <span className="text-gray-400 font-normal ml-1">· {hint}</span>}
        </label>
        {children}
    </div>
);

/* ───────── Componente principal ───────── */

const CrearTicketModal = ({ onClose, onCreated }) => {
    const [expandido, setExpandido] = useState(false);
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

    // Campos nuevos
    const [beneficiarios, setBeneficiarios] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);

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

    const handleObtenerUbicacion = () => {
        if (!navigator.geolocation) {
            setError('Tu navegador no soporta geolocalización');
            return;
        }
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitud(pos.coords.latitude.toFixed(6));
                setLongitud(pos.coords.longitude.toFixed(6));
                setGeoLoading(false);
            },
            (err) => {
                setError('No se pudo obtener la ubicación: ' + err.message);
                setGeoLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
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
            beneficiarios: beneficiarios || '',
            ubicacion: ubicacion.trim() || '',
            latitud: latitud !== '' ? latitud : '',
            longitud: longitud !== '' ? longitud : '',
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
        // Reset todo excepto el tipo seleccionado
        setCreado(null);
        setError('');
    };

    const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300";

    const panelCls = expandido
        ? "fixed inset-0 z-50 bg-white flex flex-col"
        : "fixed top-0 right-0 h-full z-50 bg-white shadow-2xl border-l border-gray-200 flex flex-col";
    const panelStyle = expandido ? {} : { width: "440px" };

    return (
        <div className={panelCls} style={panelStyle}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shrink-0">
                <button onClick={handleCerrar}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Cerrar panel">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                        {creado ? 'Ticket creado' : 'Nuevo Ticket / Certificado'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                        {creado ? `Código: ${creado.codigo}` : 'Complete los campos para crear'}
                    </p>
                </div>

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
                {creado ? (
                    <div className="py-6">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Código generado</p>
                            <p className="font-mono font-bold text-3xl text-gray-900 tracking-wider">
                                {creado.codigo}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                ID: {creado.id_tbl_certificado}
                            </p>

                            {creado.urlencriptado && (
                                <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={creado.urlencriptado}
                                        alt={`Código ${creado.codigo}`}
                                        className="mx-auto"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t">
                            <button onClick={handleCrearOtro}
                                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                Crear otro
                            </button>
                            <button onClick={handleCerrar}
                                className="px-3 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
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
                                        className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${tipo === t.id
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
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
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {usuario.nombres || '—'}
                                        </p>
                                        <p className="text-gray-600 mt-0.5">
                                            CI: {usuario.ci_ruc || '—'} · ID: {usuario.usuario || usuario.id_tbl_usuario}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${usuario.estado === 'activo'
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
                                    <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                        Este usuario no tiene suscripciones
                                    </div>
                                ) : (
                                    <select
                                        value={idSuscripcion}
                                        onChange={(e) => setIdSuscripcion(e.target.value)}
                                        className={inputCls}>
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
                        <div className="pt-2 border-t border-gray-100">
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
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
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
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
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
                                    <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                        Este establecimiento no tiene ofertas activas
                                    </div>
                                ) : (
                                    <select
                                        value={idOferta}
                                        onChange={(e) => setIdOferta(e.target.value)}
                                        className={inputCls}>
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
                            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer (solo en modo creación) ──────────────────────── */}
            {!creado && (
                <div className="flex gap-2 px-4 py-3 border-t border-gray-200 justify-end shrink-0">
                    <button onClick={handleCerrar}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="px-4 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                        {loading ? 'Creando...' : 'Crear'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CrearTicketModal;