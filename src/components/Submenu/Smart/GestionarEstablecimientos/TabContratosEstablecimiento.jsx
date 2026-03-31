import React, { useState, useEffect } from "react";
import { getContratos, setContrato } from "../../../../controllers/establecimientos/EstablecimientosController";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Spin = ({ size = 4 }) => (
    <svg className={`w-${size} h-${size} animate-spin text-green-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
);
const MsgOk  = ({ txt }) => <p className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 mb-2">✓ {txt}</p>;
const MsgErr = ({ txt }) => <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mb-2">{txt}</p>;

const Campo = ({ label, children, requerido }) => (
    <div className="mb-3">
        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
            {label}{requerido && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);
const iCls = (err = false) =>
    `w-full border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

// ─── Badge de estado ──────────────────────────────────────────────────────────
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

// ─── Formulario crear / editar ────────────────────────────────────────────────
const FormContrato = ({ idEstablecimiento, contrato, onGuardado, onCancelar }) => {
    const esNuevo = !contrato?.id_contrato;

    // Pre-completar fecha_fin: si es nuevo, sugiere 1 año desde hoy
    const hoy    = new Date().toISOString().substring(0, 10);
    const unAnio = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);

    const [fechaIni, setFechaIni] = useState(contrato?.fecha_ini?.substring(0, 10) ?? hoy);
    const [fechaFin, setFechaFin] = useState(contrato?.fecha_fin?.substring(0, 10) ?? unAnio);
    const [iva,      setIva]      = useState(String(contrato?.iva       ?? 12));
    const [servs,    setServs]    = useState(String(contrato?.servicios ?? 10));
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);

    const guardar = async () => {
        if (!fechaIni || !fechaFin) { setError("Las fechas son obligatorias"); return; }
        if (fechaFin <= fechaIni)   { setError("La fecha fin debe ser posterior al inicio"); return; }
        setLoading(true); setError(null);
        const res = await setContrato({
            id_establecimiento: idEstablecimiento,
            id_contrato:        contrato?.id_contrato ?? 0,
            fecha_ini:          fechaIni,
            fecha_fin:          fechaFin,
            iva:                parseInt(iva)   || 0,
            servicios:          parseInt(servs) || 0,
        });
        setLoading(false);
        if (res) onGuardado(res);
        else setError("No se pudo guardar el contrato. Intente nuevamente.");
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${esNuevo ? "bg-green-500" : "bg-blue-500"}`}/>
                <h4 className="text-xs font-bold text-gray-700">
                    {esNuevo ? "Nuevo contrato" : `Editando contrato #${contrato.id_contrato}`}
                </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Campo label="Fecha inicio" requerido>
                    <input type="date" className={iCls()} value={fechaIni} onChange={e => setFechaIni(e.target.value)}/>
                </Campo>
                <Campo label="Fecha fin" requerido>
                    <input type="date" className={iCls()} value={fechaFin} onChange={e => setFechaFin(e.target.value)}/>
                </Campo>
                <Campo label="IVA (%)">
                    <input type="number" min="0" max="99" className={iCls()} value={iva} onChange={e => setIva(e.target.value)}/>
                </Campo>
                <Campo label="Servicios (%)">
                    <input type="number" min="0" max="99" className={iCls()} value={servs} onChange={e => setServs(e.target.value)}/>
                </Campo>
            </div>

            {error && <MsgErr txt={error}/>}

            <div className="flex gap-2 mt-2">
                <button onClick={onCancelar}
                    className="flex-1 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancelar
                </button>
                <button onClick={guardar} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                    {loading ? <><Spin size={3}/> Guardando...</> : "Guardar contrato"}
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
                {/* Badge + id */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-400">#{c.id_contrato}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeCls(c.estado)}`}>
                        {labelEstado(c)}
                    </span>
                </div>
                {/* Fechas */}
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
                {/* Impuestos */}
                {(c.iva > 0 || c.servicios > 0) && (
                    <div className="flex gap-3 text-[10px] text-gray-400 mt-0.5">
                        {c.iva > 0      && <span>IVA <strong className="text-gray-600">{c.iva}%</strong></span>}
                        {c.servicios > 0 && <span>Servicios <strong className="text-gray-600">{c.servicios}%</strong></span>}
                    </div>
                )}
            </div>
            {/* Botón editar */}
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
const TabContratosEstablecimiento = ({ idEstablecimiento }) => {
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
        const msg = contratoEdit ? "Contrato actualizado" : "Contrato creado correctamente";
        setFormVisible(false);
        setContratoEdit(null);
        setExito(msg);
        setTimeout(() => setExito(null), 3000);
        cargar();
    };

    const abrirNuevo  = ()  => { setContratoEdit(null); setFormVisible(true); };
    const abrirEditar = (c) => { setContratoEdit(c);    setFormVisible(true); };
    const cancelar    = ()  => { setFormVisible(false); setContratoEdit(null); };

    return (
        <div>
            {/* Botón nuevo */}
            {!formVisible && (
                <button onClick={abrirNuevo}
                    className="w-full flex items-center justify-center gap-2 py-2 mb-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Nuevo contrato
                </button>
            )}

            {/* Formulario */}
            {formVisible && (
                <FormContrato
                    idEstablecimiento={idEstablecimiento}
                    contrato={contratoEdit}
                    onGuardado={handleGuardado}
                    onCancelar={cancelar}
                />
            )}

            {exito && <MsgOk txt={exito}/>}

            {/* Lista */}
            {cargando ? (
                <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                    <Spin size={4}/><span className="text-xs">Cargando contratos...</span>
                </div>
            ) : error ? (
                <MsgErr txt={error}/>
            ) : contratos?.length === 0 ? (
                <div className="text-center py-10">
                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="text-xs text-gray-400">Sin contratos registrados.</p>
                    <p className="text-[10px] text-gray-300 mt-1">Usa el botón de arriba para crear el primero.</p>
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