import React, { useEffect, useState, useCallback } from "react";
import { listarEstablecimientosAdmin } from "../../../../controllers/establecimientos/EstablecimientosController";
import PanelEdicionEstablecimiento from "./PanelEdicionEstablecimiento";

const getToken = () => {
    const session = JSON.parse(localStorage.getItem("datos"));
    return session?.token ?? "";
};

const URL_FOTOS = "https://visitaecuador.com/ve/img/contenido/informacion/thum500x500/";

// ── Helpers ──────────────────────────────────────────────────────────────────
const badgeContrato = (estado, dias) => {
    if (estado === "activo")     return { cls: "bg-green-100 text-green-700",  txt: `Activo · ${dias}d` };
    if (estado === "por_vencer") return { cls: "bg-amber-100 text-amber-700",  txt: `Vence en ${dias}d` };
    return                              { cls: "bg-red-100 text-red-600",      txt: `Caducado ${Math.abs(dias)}d` };
};

const ESTADOS = [
    { value: "",           label: "Todos" },
    { value: "activo",     label: "Activos" },
    { value: "por_vencer", label: "Por vencer" },
    { value: "caducado",   label: "Caducados" },
];

// ── Botón de acción reutilizable ──────────────────────────────────────────────
const BtnAccion = ({ title, activo, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
            disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" :
            activo   ? "bg-green-600 text-white" :
                       "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
        }`}
    >
        {children}
    </button>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const ListarEstablecimientos = () => {
    const [establecimientos, setEstablecimientos] = useState([]);
    const [resumenGlobal, setResumenGlobal]       = useState({ activo: 0, por_vencer: 0, caducado: 0 });
    const [cargando, setCargando]                 = useState(false);
    const [errorMsg, setErrorMsg]                 = useState(null);

    // Filtros
    const [estado, setEstado]           = useState("");
    const [busqueda, setBusqueda]       = useState("");
    const [fechaDesde, setFechaDesde]   = useState("");
    const [fechaHasta, setFechaHasta]   = useState("");
    const [pag, setPag]                 = useState(1);
    const [cantidad, setCantidad]       = useState(20);
    const [hayMas, setHayMas]           = useState(false);

    // Panel — qué establecimiento y en qué tab
    const [panelEst, setPanelEst]   = useState(null);   // objeto establecimiento
    const [panelTab, setPanelTab]   = useState("info"); // "info" | "contratos"

    const cargar = useCallback(async (pagNum = 1, resetResumen = false) => {
        setCargando(true);
        setErrorMsg(null);
        const params = {
            token:            getToken(),
            estado_contrato:  estado || undefined,
            txtBusqueda:      busqueda || undefined,
            fecha_desde:      fechaDesde || undefined,
            fecha_hasta:      fechaHasta || undefined,
            nitems:           cantidad,
            pag:              pagNum,
            dias_alerta:      30,
        };
        const data = await listarEstablecimientosAdmin(params);
        setCargando(false);
        if (!data) { setErrorMsg("No se pudo cargar el listado."); return; }

        setEstablecimientos(data.establecimientos ?? []);
        setHayMas((data.establecimientos ?? []).length === cantidad);
        if (resetResumen && data.resumen) setResumenGlobal(data.resumen);
    }, [estado, busqueda, fechaDesde, fechaHasta, cantidad]);

    // Reset página al cambiar filtros
    useEffect(() => { setPag(1); }, [estado, busqueda, fechaDesde, fechaHasta, cantidad]);

    // Cargar datos
    useEffect(() => { cargar(pag, pag === 1); }, [cargar, pag]);

    const limpiarFechas = () => { setFechaDesde(""); setFechaHasta(""); };

    const handleActualizado = (cambios) => {
        setEstablecimientos(prev =>
            prev.map(e =>
                e.id_tbl_establecimiento === panelEst?.id_tbl_establecimiento
                    ? { ...e, nombreEstablecimiento: cambios.nombre ?? e.nombreEstablecimiento }
                    : e
            )
        );
    };

    // Abrir panel en un tab específico.
    // Si ya está abierto en el mismo est + mismo tab → cerrar.
    const abrirPanel = (est, tab) => {
        const mismoEst = panelEst?.id_tbl_establecimiento === est.id_tbl_establecimiento;
        if (mismoEst && panelTab === tab) {
            setPanelEst(null);
        } else {
            setPanelEst(est);
            setPanelTab(tab);
        }
    };

    const hayFechasActivas = fechaDesde || fechaHasta;

    return (
        <div className="flex-1 p-4 w-full relative">
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                {/* Búsqueda */}
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Buscar establecimiento, ciudad..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />

                {/* Estado contrato */}
                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={estado}
                    onChange={e => setEstado(e.target.value)}
                >
                    {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>

                {/* ── Filtro de fechas ── */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 shrink-0">Fin contrato:</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fechaDesde}
                        max={fechaHasta || undefined}
                        onChange={e => setFechaDesde(e.target.value)}
                        title="Desde"
                    />
                    <span className="text-gray-300 text-xs">—</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fechaHasta}
                        min={fechaDesde || undefined}
                        onChange={e => setFechaHasta(e.target.value)}
                        title="Hasta"
                    />
                    {hayFechasActivas && (
                        <button onClick={limpiarFechas} className="ml-1 text-gray-400 hover:text-red-500 transition-colors" title="Limpiar fechas">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Items por página */}
                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={cantidad}
                    onChange={e => { setCantidad(Number(e.target.value)); setPag(1); }}
                >
                    {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} por pág.</option>)}
                </select>
            </div>

            {/* ── Tabla ─────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {cargando ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando...</span>
                    </div>
                ) : errorMsg ? (
                    <p className="text-center text-xs text-red-500 py-10">{errorMsg}</p>
                ) : establecimientos.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-10">No hay establecimientos con estos filtros.</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600 w-10"></th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Establecimiento</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Ubicación</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Contrato</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Ofertas</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {establecimientos.map((est, idx) => {
                                const badge    = badgeContrato(est.estadoContrato, est.diasRestantes);
                                const esSel    = panelEst?.id_tbl_establecimiento === est.id_tbl_establecimiento;
                                const tabInfo  = esSel && panelTab === "info";
                                const tabCont  = esSel && panelTab === "contratos";
                                const tabOfer  = esSel && panelTab === "ofertas";

                                return (
                                    <tr
                                        key={`${est.id_tbl_establecimiento}-${idx}`}
                                        className={`transition-colors ${esSel ? "bg-green-50" : "hover:bg-gray-50"}`}
                                    >
                                        {/* Logo */}
                                        <td className="px-3 py-2">
                                            <img
                                                src={est.logo ? URL_FOTOS + est.logo : "https://visitaecuador.com/ve/img/iconos/hotel.png"}
                                                alt=""
                                                className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                                                onError={e => { e.target.src = "https://visitaecuador.com/ve/img/iconos/hotel.png"; }}
                                            />
                                        </td>

                                        {/* Nombre */}
                                        <td className="px-3 py-2">
                                            <p className="font-semibold text-gray-800 leading-tight">
                                                {est.nombreEstablecimiento}
                                            </p>
                                            {est.catalogacion > 0 && (
                                                <span className="text-amber-400 text-[10px]">
                                                    {"★".repeat(est.catalogacion)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Ubicación */}
                                        <td className="px-3 py-2 text-gray-500 hidden md:table-cell">
                                            <p>{est.ciudad}</p>
                                            <p className="text-[10px] text-gray-400">{est.provincia}</p>
                                        </td>

                                        {/* Contrato */}
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.cls}`}>
                                                {badge.txt}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {est.finContrato}
                                            </p>
                                        </td>

                                        {/* Ofertas activas */}
                                        <td className="px-3 py-2 text-gray-600 hidden sm:table-cell">
                                            <span className={`font-semibold ${est.ofertasActivas > 0 ? "text-green-600" : "text-gray-400"}`}>
                                                {est.ofertasActivas}
                                            </span>
                                        </td>

                                        {/* ── Acciones ── */}
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1.5">

                                                {/* 1. Editar info + galería */}
                                                <BtnAccion
                                                    title="Editar establecimiento"
                                                    activo={tabInfo}
                                                    onClick={() => abrirPanel(est, "info")}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </BtnAccion>

                                                {/* 2. Contratos */}
                                                <BtnAccion
                                                    title="Gestionar contratos"
                                                    activo={tabCont}
                                                    onClick={() => abrirPanel(est, "contratos")}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </BtnAccion>

                                                {/* 3. Ofertas */}
                                                <BtnAccion
                                                    title="Gestionar ofertas"
                                                    activo={tabOfer}
                                                    onClick={() => abrirPanel(est, "ofertas")}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                                                    </svg>
                                                </BtnAccion>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Paginación ─────────────────────────────────────────────── */}
            {!cargando && !errorMsg && (
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>Página {pag}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={pag === 1}
                            onClick={() => setPag(p => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            ← Anterior
                        </button>
                        <button
                            disabled={!hayMas}
                            onClick={() => setPag(p => p + 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}

            {/* ── Panel lateral ───────────────────────────────────────────── */}
            {panelEst && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setPanelEst(null)} />
                    <PanelEdicionEstablecimiento
                        establecimiento={panelEst}
                        tabInicial={panelTab}
                        onCerrar={() => setPanelEst(null)}
                        onActualizado={handleActualizado}
                    />
                </>
            )}
        </div>
    );
};

export default ListarEstablecimientos;