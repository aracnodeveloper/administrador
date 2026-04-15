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
        setUsuario(null);
        setInputUsuario('');
        setSuscripciones([]);
        setIdSuscripcion('');
        setEstablecimiento(null);
        setInputEst('');
        setIdOferta('');
        setBeneficiarios('');
        setUbicacion('');
        setLatitud('');
        setLongitud('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            {creado ? '¡Listo!' : 'Nuevo registro'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {creado ? 'Se generó correctamente' : 'Crea un ticket o certificado'}
                        </p>
                    </div>
                    <button
                        onClick={handleCerrar}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
                        ✕
                    </button>
                </div>

                {creado ? (
                    /* ───────── Vista de éxito ───────── */
                    <div className="px-6 py-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4 ring-8 ring-emerald-50/40">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

                        <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={handleCrearOtro}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Crear otro
                            </button>
                            <button
                                onClick={handleCerrar}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm">
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ───────── Vista de formulario ───────── */
                    <>
                        <div className="px-6 py-5 space-y-5 overflow-y-auto">
                            {/* Tipo */}
                            <Field label="Tipo" required>
                                <div className="grid grid-cols-2 gap-2">
                                    {TIPOS_TICKET.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setTipo(t.id)}
                                            className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition ${
                                                tipo === t.id
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            {t.nombre}
                                        </button>
                                    ))}
                                </div>
                            </Field>

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
                                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                {usuario.nombres || '—'}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                CI: {usuario.ci_ruc || '—'} · ID: {usuario.usuario || usuario.id_tbl_usuario}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                            usuario.estado === 'activo'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {usuario.estado}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Suscripción */}
                            {usuario && (
                                <Field label="Suscripción relacionada">
                                    {loadingSuscs ? (
                                        <div className="text-sm text-gray-400 py-2">Cargando suscripciones...</div>
                                    ) : suscripciones.length === 0 ? (
                                        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
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
                                </Field>
                            )}

                            {/* Establecimiento */}
                            <div className="pt-5 border-t border-gray-100">
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
                                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                {establecimiento.titulo}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                {[establecimiento.ciudad, establecimiento.provincia].filter(Boolean).join(', ') || '—'}
                                            </p>
                                            {establecimiento.direccion && (
                                                <p className="text-xs text-gray-500 mt-0.5 truncate">{establecimiento.direccion}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
                                            ID: {establecimiento.id_establecimiento}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {establecimiento && (
                                <Field label="Oferta">
                                    {establecimiento.ofertas.length === 0 ? (
                                        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
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
                                </Field>
                            )}

                            {/* ───────── Detalles adicionales ───────── */}
                            <div className="pt-5 border-t border-gray-100 space-y-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Detalles adicionales
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Beneficiarios">
                                        <input
                                            type="number"
                                            min="1"
                                            value={beneficiarios}
                                            onChange={(e) => setBeneficiarios(e.target.value)}
                                            placeholder="Ej: 4"
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Ubicación">
                                        <input
                                            type="text"
                                            value={ubicacion}
                                            onChange={(e) => setUbicacion(e.target.value)}
                                            placeholder="Ej: Cuenca, Ecuador"
                                            maxLength={255}
                                            className={inputCls}
                                        />
                                    </Field>
                                </div>

                                <Field label="Coordenadas" hint="opcional">
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={latitud}
                                            onChange={(e) => setLatitud(e.target.value)}
                                            placeholder="Latitud"
                                            className={inputCls}
                                        />
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={longitud}
                                            onChange={(e) => setLongitud(e.target.value)}
                                            placeholder="Longitud"
                                            className={inputCls}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleObtenerUbicacion}
                                            disabled={geoLoading}
                                            title="Usar mi ubicación actual"
                                            className="shrink-0 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-700 hover:border-emerald-300 transition disabled:opacity-50 inline-flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {geoLoading ? '...' : 'GPS'}
                                        </button>
                                    </div>
                                </Field>
                            </div>

                            <p className="text-xs text-gray-400 italic flex items-start gap-1.5 pt-1">
                                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                El código se generará automáticamente al crear el registro.
                            </p>

                            {error && (
                                <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 px-6 py-4 border-t border-gray-100 justify-end shrink-0 bg-gray-50/50">
                            <button
                                onClick={handleCerrar}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-5 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm">
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