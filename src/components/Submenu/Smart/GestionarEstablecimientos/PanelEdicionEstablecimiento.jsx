import React, { useState, useEffect } from "react";
import {
    getEstablecimientoDetalle,
    getCiudades,
    getTiposEstablecimiento,
} from "../../../../controllers/establecimientos/EstablecimientosController";
import TabInfoEstablecimiento from "./TabInfoEstablecimiento";
import TabContratosEstablecimiento from "./TabContratosEstablecimiento";
import TabOfertasEstablecimiento from "./TabOfertasEstablecimiento";

// ─── Helpers UI compartidos ───────────────────────────────────────────────────
const Spin = ({ size = 4 }) => (
    <svg className={`w-${size} h-${size} animate-spin text-green-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
);

const TabBtn = ({ label, activo, onClick, badge }) => (
    <button onClick={onClick}
        className={`flex-1 py-2 text-[11px] font-semibold border-b-2 transition-colors ${
            activo ? "border-green-600 text-green-700" : "border-transparent text-gray-400 hover:text-gray-600"
        }`}>
        {label}
        {badge != null && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {badge}
            </span>
        )}
    </button>
);

// ─── Panel principal ──────────────────────────────────────────────────────────
/**
 * Props:
 *   establecimiento  — objeto del listado (id_tbl_establecimiento, nombreEstablecimiento, ...)
 *   tabInicial       — "info" | "contratos"  (default "info")
 *   onCerrar         — callback al cerrar el panel
 *   onActualizado    — callback cuando se guarda info básica
 */
const PanelEdicionEstablecimiento = ({ establecimiento, tabInicial = "info", onCerrar, onActualizado }) => {
    const [expandido,    setExpandido]    = useState(false);
    const [tab,          setTab]          = useState(tabInicial);
    const [cargando,     setCargando]     = useState(true);
    const [detalle,      setDetalle]      = useState(null);
    const [error,        setError]        = useState(null);
    const [ciudades,     setCiudades]     = useState([]);
    const [cargCiudades, setCargCiudades] = useState(false);
    const [tipos,        setTipos]        = useState([]);

    // Cuando cambia el establecimiento abierto, reiniciar tab al valor inicial
    useEffect(() => {
        setTab(tabInicial);
    }, [establecimiento?.id_tbl_establecimiento, tabInicial]);

    useEffect(() => {
        if (!establecimiento?.id_tbl_establecimiento) return;
        setCargando(true); setError(null); setDetalle(null);
        Promise.all([
            getEstablecimientoDetalle(establecimiento.id_tbl_establecimiento),
            getTiposEstablecimiento(),
        ]).then(([det, tips]) => {
            if (det) {
                setDetalle(det);
                setCargCiudades(true);
                getCiudades(239).then(cs => { setCiudades(cs ?? []); setCargCiudades(false); });
            } else {
                setError("No se pudo cargar el establecimiento.");
            }
            if (tips) setTipos(tips);
            setCargando(false);
        });
    }, [establecimiento?.id_tbl_establecimiento]);

    const panelCls   = expandido
        ? "fixed inset-0 z-50 bg-white flex flex-col"
        : "fixed top-0 right-0 h-full z-50 bg-white shadow-2xl border-l border-gray-200 flex flex-col";
    const panelStyle = expandido ? {} : { width: "440px" };

    const nombre = detalle?.establecimiento?.nombre
        ?? establecimiento?.nombreEstablecimiento
        ?? "Establecimiento";

    return (
        <div className={panelCls} style={panelStyle}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shrink-0">
                <button onClick={onCerrar}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Cerrar panel">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{nombre}</p>
                    <p className="text-[10px] text-gray-400">
                        {detalle?.establecimiento?.ciudad ?? ""}
                        {detalle?.establecimiento?.provincia ? ` · ${detalle.establecimiento.provincia}` : ""}
                    </p>
                </div>

                {/* Expandir / contraer */}
                <button onClick={() => setExpandido(v => !v)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    title={expandido ? "Panel lateral" : "Pantalla completa"}>
                    {expandido
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6"/>
                          </svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                          </svg>
                    }
                </button>
            </div>

            {/* ── Tabs ────────────────────────────────────────────────── */}
            <div className="flex border-b border-gray-200 px-2 shrink-0">
                <TabBtn
                    label="Info / Galería"
                    activo={tab === "info"}
                    onClick={() => setTab("info")}
                    badge={detalle?.galeria?.length > 0 ? detalle.galeria.length : null}
                />
                <TabBtn
                    label="Contratos"
                    activo={tab === "contratos"}
                    onClick={() => setTab("contratos")}
                />
                <TabBtn
                    label="Ofertas"
                    activo={tab === "ofertas"}
                    onClick={() => setTab("ofertas")}
                />
            </div>

            {/* ── Contenido ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4">
                {cargando ? (
                    <div className="flex items-center justify-center h-32 gap-2 text-gray-400">
                        <Spin size={5}/><span className="text-xs">Cargando...</span>
                    </div>
                ) : error ? (
                    <p className="text-center text-xs text-red-500 py-10">{error}</p>
                ) : (
                    <>
                        {tab === "info" && (
                            <TabInfoEstablecimiento
                                detalle={detalle}
                                ciudades={ciudades}
                                cargandoCiudades={cargCiudades}
                                tipos={tipos}
                                onGuardado={cambios => {
                                    setDetalle(prev => ({
                                        ...prev,
                                        establecimiento: { ...prev.establecimiento, ...cambios }
                                    }));
                                    onActualizado?.(cambios);
                                }}
                                onGaleriaChange={nueva => setDetalle(prev => ({ ...prev, galeria: nueva }))}
                            />
                        )}
                        {tab === "contratos" && (
                            <TabContratosEstablecimiento
                                idEstablecimiento={establecimiento.id_tbl_establecimiento}
                                establecimiento={detalle?.establecimiento}
                            />
                        )}
                        {tab === "ofertas" && (
                            <TabOfertasEstablecimiento
                                idEstablecimiento={establecimiento.id_tbl_establecimiento}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PanelEdicionEstablecimiento;