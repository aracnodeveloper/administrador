import React, { useState, useEffect, useRef } from "react";
import { getContratos } from "../../../../controllers/establecimientos/EstablecimientosController";
import Config from "../../../../global/config";

// ─── URLs ─────────────────────────────────────────────────────────────────────
const URL_GESTIONAR   = "https://visitaecuador.com/ve/views/establecimiento/gestionarContrato.php";
const URL_DOCS        = "https://visitaecuador.com/ve/views/subirArchivos.php";
const URL_DATOS       = `${Config.URL_SERVICIOS}${Config.VEREST}getDatosContrato/`;

// ─── Helpers UI ───────────────────────────────────────────────────────────────
const Spin = ({ size = 4 }) => (
    <svg className={`w-${size} h-${size} animate-spin text-green-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
);
const MsgOk  = ({ txt }) => <p className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 mb-2">✓ {txt}</p>;
const MsgErr = ({ txt }) => <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mb-2">{txt}</p>;

const iCls = (err = false) =>
    `w-full border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

const Campo = ({ label, children, requerido, ayuda }) => (
    <div className="mb-3">
        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
            {label}{requerido && <span className="text-red-400 ml-0.5">*</span>}
            {ayuda && <span className="ml-1 text-gray-400 font-normal">({ayuda})</span>}
        </label>
        {children}
    </div>
);

const SeccionTitulo = ({ titulo }) => (
    <div className="flex items-center gap-2 mb-3 mt-4">
        <div className="h-px flex-1 bg-gray-200"/>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{titulo}</span>
        <div className="h-px flex-1 bg-gray-200"/>
    </div>
);

// ─── Badge de estado de contrato ─────────────────────────────────────────────
const badgeCls = (estado) => ({
    activo:     "bg-green-100 text-green-700",
    por_vencer: "bg-amber-100 text-amber-700",
    caducado:   "bg-red-100 text-red-600",
    inactivo:   "bg-gray-100 text-gray-500",
}[estado] ?? "bg-gray-100 text-gray-500");

const labelEstado = (c) => {
    if (c.estado === "activo")     return `Activo · vence en ${c.dias_restantes}d`;
    if (c.estado === "por_vencer") return `Vence en ${c.dias_restantes}d`;
    if (c.estado === "caducado")   return `Caducado hace ${Math.abs(c.dias_restantes)}d`;
    return "Inactivo";
};

// ─── Formulario completo ──────────────────────────────────────────────────────
const FormContrato = ({ idEstablecimiento, idUsuario, idCiudad, contrato, onGuardado, onCancelar }) => {
    const esNuevo = !contrato?.id_contrato;
    const fileRef = useRef();

    // Catálogos (cargados por el padre)
    const [tiposPago,      setTiposPago]      = useState([]);
    const [tiposBeneficio, setTiposBeneficio] = useState([]);
    const [clasificaciones,setClasificaciones]= useState([]);
    const [cargandoCat,    setCargandoCat]    = useState(true);

    // ── Sección Inicio ────────────────────────────────────────────────────
    const hoy    = new Date().toISOString().substring(0, 10);
    const unAnio = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);
    const [fechaIni,     setFechaIni]     = useState(contrato?.fecha_ini?.substring(0,10) ?? hoy);
    const [fechaFin,     setFechaFin]     = useState(contrato?.fecha_fin?.substring(0,10) ?? unAnio);
    const [iva,          setIva]          = useState(String(contrato?.iva            ?? 12));
    const [servicios,    setServicios]    = useState(String(contrato?.servicios       ?? 10));
    const [comentario,   setComentario]   = useState(contrato?.comentario            ?? "");
    const [terminos,     setTerminos]     = useState(contrato?.terminosycondiciones  ?? "");

    // ── Sección Políticas ─────────────────────────────────────────────────
    const [nochesMeta,   setNochesMeta]   = useState(String(contrato?.noches_gratis_meta ?? 0));
    const [nochesGratis, setNochesGratis] = useState(String(contrato?.x_noches_gratis   ?? 0));
    const [nochesCanje,  setNochesCanje]  = useState(String(contrato?.x_noches_canje    ?? 0));
    const [maxDias,      setMaxDias]      = useState(String(contrato?.max_dias_cancelar  ?? 0));
    const [minPct,       setMinPct]       = useState(String(contrato?.minimo_porcentaje  ?? 0));
    const [edadNino,     setEdadNino]     = useState(String(contrato?.edad_nino          ?? 12));

    // ── Sección Permisos ──────────────────────────────────────────────────
    const [beneficiosSelec, setBeneficiosSelec] = useState(
        new Set((contrato?.beneficiosActivos ?? []).map(String))
    );
    const [clasifSelec, setClasifSelec] = useState(
        new Set((contrato?.clasificacionesActivas ?? []).map(String))
    );
    const [prefLugar, setPrefLugar] = useState(String(contrato?.preferencia_lugar ?? 3));

    // ── Sección Negociación / Pagos ───────────────────────────────────────
    const [pagos, setPagos] = useState(
        (contrato?.pagos ?? []).map((p, i) => ({
            key:    i,
            id:     String(p.id_tbl_tipo_pago),
            nombre: p.nombre,
            imagen: p.imagen,
            valor:  String(p.cantidad),
        }))
    );
    const [tipoPagoSel, setTipoPagoSel] = useState("");

    // ── Documentos ────────────────────────────────────────────────────────
    const [documentos,    setDocumentos]    = useState(contrato?.documentos ?? []);
    const [subiendoDocs,  setSubiendoDocs]  = useState(false);
    const [infoArchivos,  setInfoArchivos]  = useState([]); // {nombre, mime}

    // ── Estado general ────────────────────────────────────────────────────
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [exito,    setExito]    = useState(null);

    // Cargar catálogos
    useEffect(() => {
        const fetchCat = async () => {
            try {
                const res = await fetch(URL_DATOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_establecimiento: idEstablecimiento, id_contrato: contrato?.id_contrato ?? 0 }),
                });
                const data = await res.json();
                if (data?.estado) {
                    setTiposPago(data.data.tiposPago ?? []);
                    setTiposBeneficio(data.data.tiposBeneficio ?? []);
                    setClasificaciones(data.data.clasificaciones ?? []);
                }
            } catch {}
            setCargandoCat(false);
        };
        fetchCat();
    }, [idEstablecimiento]);

    // ── Helpers de pagos ──────────────────────────────────────────────────
    const agregarPago = () => {
        if (!tipoPagoSel) return;
        const tipo = tiposPago.find(t => t.id === tipoPagoSel);
        if (!tipo) return;
        setPagos(prev => [...prev, { key: Date.now(), id: tipoPagoSel, nombre: tipo.nombre, imagen: tipo.imagen, valor: "0" }]);
        setTipoPagoSel("");
    };
    const eliminarPago = (key) => setPagos(prev => prev.filter(p => p.key !== key));
    const cambiarValorPago = (key, val) => setPagos(prev => prev.map(p => p.key === key ? { ...p, valor: val } : p));
    const totalPagos = pagos.reduce((s, p) => s + (parseFloat(p.valor) || 0), 0);

    const toggleBeneficio = (id) => {
        setBeneficiosSelec(prev => {
            const next = new Set(prev);
            next.has(String(id)) ? next.delete(String(id)) : next.add(String(id));
            return next;
        });
    };
    const toggleClasif = (id) => {
        setClasifSelec(prev => {
            const next = new Set(prev);
            next.has(String(id)) ? next.delete(String(id)) : next.add(String(id));
            return next;
        });
    };

    // ── Subir documentos ──────────────────────────────────────────────────
    const subirDocs = async (files) => {
        if (!files?.length) return;
        setSubiendoDocs(true);
        try {
            const fd = new FormData();
            Array.from(files).forEach(f => fd.append('file[]', f));
            fd.append('db',   'true');
            fd.append('tipo', '4');
            fd.append('url',  'convenios/contratos/');
            const res  = await fetch(URL_DOCS, { method: 'POST', body: fd });
            const data = await res.json();
            if (data?.ids?.length) {
                const nuevos = data.ids.map(i => ({ nombre: i.nombre, mime: i.mime }));
                setInfoArchivos(prev => [...prev, ...nuevos]);
                setDocumentos(prev => [...prev, ...nuevos.map(n => ({ file: n.nombre, mime_type: n.mime }))]);
            }
        } catch {}
        setSubiendoDocs(false);
        if (fileRef.current) fileRef.current.value = '';
    };

    // ── Validaciones básicas ──────────────────────────────────────────────
    const validar = () => {
        if (!fechaIni || !fechaFin)       return "Las fechas de contrato son obligatorias";
        if (fechaFin <= fechaIni)         return "La fecha fin debe ser posterior al inicio";
        if (beneficiosSelec.size === 0)   return "Seleccione al menos un tipo de oferta permitido";
        if (clasifSelec.size === 0)       return "Seleccione al menos una clasificación de oferta";
        if (!prefLugar || prefLugar === "0") return "Seleccione una preferencia de lugar";
        if (pagos.length === 0)           return "Agregue al menos un tipo de negociación (pago)";
        for (const p of pagos) {
            if (!p.valor || parseFloat(p.valor) <= 0) return "Todos los pagos deben tener un valor mayor a 0";
        }
        return null;
    };

    // ── Guardar → FormData igual al PHP antiguo ───────────────────────────
    const guardar = async () => {
        const err = validar();
        if (err) { setError(err); return; }

        setLoading(true); setError(null);
        try {
            const fd = new FormData();

            // Campos del contrato
            fd.append('id',                    contrato?.id_contrato        ?? 0);
            fd.append('idEstablecimiento',     idEstablecimiento);
            fd.append('idUsuarioCliente',      idUsuario);
            fd.append('idLugar',               idCiudad);
            fd.append('desdeptFechaReserva',   fechaIni);
            fd.append('hastaptFechaReserva',   fechaFin);
            fd.append('iva_porcentaje',         iva);
            fd.append('servicio_porcentaje',    servicios);
            fd.append('comentarios',            comentario);
            fd.append('terminos',               terminos);
            fd.append('noches_gratis_meta',     nochesMeta);
            fd.append('x_noches_gratis',        nochesGratis);
            fd.append('x_noches_canje',         nochesCanje);
            fd.append('max_dias_reserva',       maxDias);
            fd.append('minimo_porcentaje',      minPct);
            fd.append('edad_nino',              edadNino);
            fd.append('preferencia_lugar',      prefLugar);
            fd.append('empresa',                '1');
            fd.append('idTipoContrato',         '1');
            fd.append('idMovimiento',           '2');
            fd.append('idProducto',             '5590');
            fd.append('lbAplicaCanje',          '0');
            fd.append('valorTotal',             String(totalPagos));
            fd.append('id_tbl_cab_kardex',      contrato?.id_tbl_cab_kardex   ?? '');
            fd.append('id_tbl_rol_usuario',     contrato?.id_tbl_rol_usuario  ?? '');
            fd.append('idCarga',                '');
            fd.append('idDescarga',             '');

            // Beneficios
            [...beneficiosSelec].forEach(id => fd.append('tipoOfertas[]', id));

            // Clasificaciones
            [...clasifSelec].forEach(id => fd.append('clasificacionOferta[]', id));

            // Pagos
            pagos.forEach(p => {
                fd.append('pago_tipo[]',  p.id);
                fd.append('pago_valor[]', p.valor);
            });

            // Documentos nuevos subidos
            infoArchivos.forEach(doc => {
                fd.append('infoArchivo[]', `0:${doc.nombre}:${doc.mime}`);
            });

            const res  = await fetch(URL_GESTIONAR, { method: 'POST', body: fd });
            const data = await res.json();

            if (data?.estado) {
                setExito(esNuevo ? `Contrato #${data.id} creado correctamente` : "Contrato actualizado correctamente");
                setTimeout(() => { setExito(null); onGuardado?.(); }, 2500);
            } else {
                setError(data?.msj ?? "No se pudo guardar el contrato");
            }
        } catch (e) {
            setError("Error de conexión. Verifica CORS en visitaecuador.com");
        }
        setLoading(false);
    };

    if (cargandoCat) return (
        <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
            <Spin size={5}/><span className="text-xs">Cargando formulario...</span>
        </div>
    );

    const nums = (n) => Array.from({ length: n }, (_, i) => i);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${esNuevo ? "bg-green-500" : "bg-blue-500"}`}/>
                <h4 className="text-xs font-bold text-gray-700">
                    {esNuevo ? "Nuevo contrato" : `Editando contrato #${contrato.id_contrato}`}
                </h4>
            </div>

            {/* ── INICIO: Fechas e Impuestos ─────────────────────────── */}
            <SeccionTitulo titulo="Fechas e Impuestos"/>
            <div className="grid grid-cols-2 gap-2">
                <Campo label="Inicio de contrato" requerido>
                    <input type="date" className={iCls()} value={fechaIni} onChange={e => setFechaIni(e.target.value)}/>
                </Campo>
                <Campo label="Fin de contrato" requerido>
                    <input type="date" className={iCls()} value={fechaFin} onChange={e => setFechaFin(e.target.value)}/>
                </Campo>
                <Campo label="% IVA">
                    <select className={iCls()} value={iva} onChange={e => setIva(e.target.value)}>
                        {nums(100).map(n => <option key={n} value={n}>{n}%</option>)}
                    </select>
                </Campo>
                <Campo label="% Servicios">
                    <select className={iCls()} value={servicios} onChange={e => setServicios(e.target.value)}>
                        {nums(100).map(n => <option key={n} value={n}>{n}%</option>)}
                    </select>
                </Campo>
            </div>
            <Campo label="Comentarios">
                <textarea rows={2} className={iCls()} value={comentario} onChange={e => setComentario(e.target.value)}/>
            </Campo>

            {/* ── POLÍTICAS ─────────────────────────────────────────── */}
            <SeccionTitulo titulo="Políticas de Gratuidad y Canje"/>
            <div className="grid grid-cols-3 gap-2">
                <Campo label="Meta noches gratis" ayuda="desde cuántas">
                    <input type="number" min="0" className={iCls()} value={nochesMeta} onChange={e => setNochesMeta(e.target.value)} placeholder="ej: 800"/>
                </Campo>
                <Campo label="Noches gratis (x noches = 1 gratis)">
                    <select className={iCls()} value={nochesGratis} onChange={e => setNochesGratis(e.target.value)}>
                        {nums(31).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </Campo>
                <Campo label="Frecuencia canje">
                    <select className={iCls()} value={nochesCanje} onChange={e => setNochesCanje(e.target.value)}>
                        {nums(31).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </Campo>
            </div>

            <SeccionTitulo titulo="Políticas de Reservas"/>
            <div className="grid grid-cols-3 gap-2">
                <Campo label="Máx. días cancelar reserva">
                    <select className={iCls()} value={maxDias} onChange={e => setMaxDias(e.target.value)}>
                        {nums(31).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </Campo>
                <Campo label="Mín. % descuento en ofertas">
                    <select className={iCls()} value={minPct} onChange={e => setMinPct(e.target.value)}>
                        {nums(100).map(n => <option key={n} value={n}>{n}%</option>)}
                    </select>
                </Campo>
                <Campo label="Edad niño menor a">
                    <select className={iCls()} value={edadNino} onChange={e => setEdadNino(e.target.value)}>
                        {nums(16).map(n => <option key={n} value={n}>{n} años</option>)}
                    </select>
                </Campo>
            </div>

            {/* ── PERMISOS: Beneficios ───────────────────────────────── */}
            <SeccionTitulo titulo="Tipos de oferta permitidos"/>
            <div className="grid grid-cols-2 gap-1 mb-3">
                {tiposBeneficio.map(t => (
                    <label key={t.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors">
                        <input type="checkbox"
                            checked={beneficiosSelec.has(String(t.id))}
                            onChange={() => toggleBeneficio(t.id)}
                            className="rounded text-green-600"/>
                        <span className="text-gray-600">{t.nombre}</span>
                    </label>
                ))}
            </div>

            {/* ── PERMISOS: Clasificación ────────────────────────────── */}
            <SeccionTitulo titulo="Remate y consulta"/>
            <div className="grid grid-cols-2 gap-1 mb-3">
                {clasificaciones.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors">
                        <input type="checkbox"
                            checked={clasifSelec.has(String(c.id))}
                            onChange={() => toggleClasif(c.id)}
                            className="rounded text-green-600"/>
                        <span className="text-gray-600">{c.nombre}</span>
                    </label>
                ))}
            </div>

            {/* Preferencia de lugar */}
            <SeccionTitulo titulo="Preferencia de lugar de contacto"/>
            <div className="flex gap-4 mb-3">
                {[
                    { v: "1", label: "Todo el país" },
                    { v: "2", label: "Mi provincia" },
                    { v: "3", label: "Mi ciudad" },
                ].map(op => (
                    <label key={op.v} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="radio" name="prefLugar" value={op.v}
                            checked={prefLugar === op.v}
                            onChange={() => setPrefLugar(op.v)}
                            className="text-green-600"/>
                        <span className="text-gray-600">{op.label}</span>
                    </label>
                ))}
            </div>

            {/* ── NEGOCIACIÓN: Pagos ─────────────────────────────────── */}
            <SeccionTitulo titulo="Negociación / Formas de pago"/>
            <div className="flex gap-2 mb-2">
                <select className={iCls() + " flex-1"} value={tipoPagoSel} onChange={e => setTipoPagoSel(e.target.value)}>
                    <option value="">Seleccione forma de pago...</option>
                    {tiposPago.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
                <button onClick={agregarPago}
                    className="px-3 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    + Agregar
                </button>
            </div>
            {pagos.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-2 py-1.5 font-semibold text-gray-500">Tipo</th>
                                <th className="text-left px-2 py-1.5 font-semibold text-gray-500 w-28">Valor $</th>
                                <th className="w-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagos.map(p => (
                                <tr key={p.key}>
                                    <td className="px-2 py-1.5 text-gray-700">{p.nombre}</td>
                                    <td className="px-2 py-1.5">
                                        <input type="number" min="0" step="0.01"
                                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                                            value={p.valor}
                                            onChange={e => cambiarValorPago(p.key, e.target.value)}/>
                                    </td>
                                    <td className="px-2 py-1.5">
                                        <button onClick={() => eliminarPago(p.key)}
                                            className="text-red-400 hover:text-red-600 transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td className="px-2 py-1.5 font-semibold text-gray-600">Total</td>
                                <td className="px-2 py-1.5 font-bold text-green-700">${totalPagos.toFixed(2)}</td>
                                <td/>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── DOCUMENTOS ────────────────────────────────────────── */}
            <SeccionTitulo titulo="Términos, Condiciones y Documentos"/>
            <Campo label="Términos y condiciones">
                <textarea rows={3} className={iCls()} value={terminos} onChange={e => setTerminos(e.target.value)}
                    placeholder="Texto de términos y condiciones del contrato..."/>
            </Campo>

            <Campo label="Documentos escaneados (PDF, imágenes)">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); subirDocs(e.dataTransfer.files); }}>
                    {subiendoDocs
                        ? <div className="flex items-center justify-center gap-2 text-green-600"><Spin size={4}/><span className="text-xs">Subiendo...</span></div>
                        : <p className="text-xs text-gray-400">Clic o arrastra archivos (PDF, JPG, PNG · Máx. 5)</p>
                    }
                </div>
                <input ref={fileRef} type="file" multiple accept=".pdf,image/jpeg,image/png,.doc,.xls"
                    className="hidden" onChange={e => subirDocs(e.target.files)}/>

                {documentos.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {documentos.map((doc, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600 bg-white border border-gray-200 rounded px-2 py-1">
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span className="truncate">{doc.file ?? doc.nombre}</span>
                                <span className="text-gray-400 shrink-0">{doc.mime_type ?? doc.mime}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Campo>

            {/* Mensajes */}
            {error && <MsgErr txt={error}/>}
            {exito && <MsgOk  txt={exito}/>}

            {/* Botones */}
            <div className="flex gap-2 mt-3">
                <button onClick={onCancelar}
                    className="flex-1 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancelar
                </button>
                <button onClick={guardar} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                    {loading ? <><Spin size={3}/> Guardando...</> : esNuevo ? "Crear contrato" : "Actualizar contrato"}
                </button>
            </div>
        </div>
    );
};

// ─── Tarjeta de contrato ──────────────────────────────────────────────────────
const TarjetaContrato = ({ contrato: c, onEditar }) => (
    <div className={`border rounded-xl p-3 transition-colors ${
        c.estado === "activo"     ? "border-green-200 bg-green-50/60" :
        c.estado === "por_vencer" ? "border-amber-200 bg-amber-50/60" :
        "border-gray-200 bg-white"
    }`}>
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-400">#{c.id_contrato}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeCls(c.estado)}`}>
                        {labelEstado(c)}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 text-[11px] text-gray-600 mb-1">
                    <div>
                        <span className="text-gray-400 text-[10px]">Inicio</span>
                        <p className="font-semibold">{c.fecha_ini?.substring(0, 10)}</p>
                    </div>
                    <div>
                        <span className="text-gray-400 text-[10px]">Fin</span>
                        <p className="font-semibold">{c.fecha_fin?.substring(0, 10)}</p>
                    </div>
                </div>
                {(c.iva > 0 || c.servicios > 0) && (
                    <div className="flex gap-3 text-[10px] text-gray-400 mt-0.5">
                        {c.iva > 0       && <span>IVA <strong className="text-gray-600">{c.iva}%</strong></span>}
                        {c.servicios > 0 && <span>Servicios <strong className="text-gray-600">{c.servicios}%</strong></span>}
                    </div>
                )}
            </div>
            <button onClick={() => onEditar(c)}
                className="shrink-0 p-1.5 rounded-lg bg-white border border-gray-200 hover:border-green-400 hover:text-green-600 text-gray-400 transition-colors"
                title="Editar contrato">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
            </button>
        </div>
    </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const TabContratosEstablecimiento = ({ idEstablecimiento, establecimiento }) => {
    const [contratos,    setContratos]    = useState(null);
    const [cargando,     setCargando]     = useState(true);
    const [error,        setError]        = useState(null);
    const [formVisible,  setFormVisible]  = useState(false);
    const [contratoEdit, setContratoEdit] = useState(null);
    const [exito,        setExito]        = useState(null);

    const cargar = async () => {
        setCargando(true); setError(null);
        const data = await getContratos(idEstablecimiento);
        setCargando(false);
        if (data) setContratos(data);
        else setError("No se pudieron cargar los contratos.");
    };

    useEffect(() => { cargar(); }, [idEstablecimiento]);

    const handleGuardado = () => {
        setFormVisible(false);
        setContratoEdit(null);
        setExito(contratoEdit ? "Contrato actualizado" : "Contrato creado correctamente");
        setTimeout(() => setExito(null), 3000);
        cargar();
    };

    const abrirNuevo  = ()  => { setContratoEdit(null); setFormVisible(true); };
    const abrirEditar = (c) => { setContratoEdit(c);    setFormVisible(true); };
    const cancelar    = ()  => { setFormVisible(false); setContratoEdit(null); };

    return (
        <div>
            {!formVisible && (
                <button onClick={abrirNuevo}
                    className="w-full flex items-center justify-center gap-2 py-2 mb-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Nuevo contrato
                </button>
            )}

            {formVisible && (
                <FormContrato
                    idEstablecimiento={idEstablecimiento}
                    idUsuario={establecimiento?.id_tbl_usuario ?? 0}
                    idCiudad={establecimiento?.id_ciudad ?? 0}
                    contrato={contratoEdit}
                    onGuardado={handleGuardado}
                    onCancelar={cancelar}
                />
            )}

            {exito && <MsgOk txt={exito}/>}

            {cargando ? (
                <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                    <Spin size={4}/><span className="text-xs">Cargando contratos...</span>
                </div>
            ) : error ? (
                <p className="text-xs text-red-500 text-center py-6">{error}</p>
            ) : contratos?.length === 0 ? (
                <div className="text-center py-10">
                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="text-xs text-gray-400">Sin contratos registrados.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {contratos.map(c => (
                        <TarjetaContrato key={c.id_contrato} contrato={c} onEditar={abrirEditar}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TabContratosEstablecimiento;