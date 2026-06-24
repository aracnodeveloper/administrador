import React, { useEffect, useState } from "react";
import {
    listarEstablecimientosRevision,
    aprobarEstablecimiento,
} from "../../../../controllers/establecimientos/EstablecimientosController";
import PanelEdicionEstablecimiento from "./PanelEdicionEstablecimiento";

// ─── Helpers UI ────────────────────────────────────────────────────────────
const Spin = ({ size = 4 }) => (
    <svg className={`w-${size} h-${size} animate-spin text-green-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
);

const IconEye = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
);

const IconCheck = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
    </svg>
);

// ─── Componente principal ──────────────────────────────────────────────────
const ListarAprobaciones = () => {
    const [cargando,    setCargando]    = useState(true);
    const [items,       setItems]       = useState([]);
    const [panelEst,    setPanelEst]    = useState(null);
    const [aprobandoId, setAprobandoId] = useState(null);
    const [busqueda,    setBusqueda]    = useState("");
    const [mensaje,     setMensaje]     = useState(null);

    const cargar = async () => {
        setCargando(true);
        const lista = await listarEstablecimientosRevision();
        setItems(Array.isArray(lista) ? lista : []);
        setCargando(false);
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleAprobar = async (est) => {
        const nombre = est.nombreEstablecimiento || est.titulo || `id ${est.id_tbl_establecimiento}`;
        if (!window.confirm(`¿Aprobar "${nombre}" y publicarlo?`)) return;
        setAprobandoId(est.id_tbl_establecimiento);
        const res = await aprobarEstablecimiento(est.id_tbl_establecimiento);
        setAprobandoId(null);
        if (res) {
            setMensaje({ tipo: "ok", txt: `${nombre} aprobado y publicado.` });
            // Quitar de la lista localmente
            setItems(prev => prev.filter(x => x.id_tbl_establecimiento !== est.id_tbl_establecimiento));
            // Cerrar panel si era el que estaba abierto
            if (panelEst?.id_tbl_establecimiento === est.id_tbl_establecimiento) {
                setPanelEst(null);
            }
        } else {
            setMensaje({ tipo: "err", txt: `No se pudo aprobar ${nombre}.` });
        }
        // Auto-ocultar mensaje
        setTimeout(() => setMensaje(null), 4000);
    };

    const filtrados = items.filter(e => {
        if (!busqueda.trim()) return true;
        const q = busqueda.toLowerCase();
        return (
            (e.nombreEstablecimiento ?? "").toLowerCase().includes(q) ||
            (e.ciudad ?? "").toLowerCase().includes(q) ||
            (e.provincia ?? "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Aprobaciones pendientes</h2>
                    <p className="text-xs text-gray-500">Establecimientos en revisión esperando aprobación para ser publicados.</p>
                </div>
                <button
                    onClick={cargar}
                    className="text-xs font-semibold text-green-700 hover:bg-green-50 rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Recargar
                </button>
            </div>

            {mensaje && (
                <div className={`mb-3 text-xs rounded-lg px-3 py-2 ${
                    mensaje.tipo === "ok"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                    {mensaje.txt}
                </div>
            )}

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Buscar por nombre, ciudad o provincia..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                />
            </div>

            {cargando ? (
                <div className="flex items-center justify-center h-40 gap-2 text-gray-400">
                    <Spin size={5}/><span className="text-xs">Cargando establecimientos en revisión...</span>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-16 border border-dashed border-gray-200 rounded-lg">
                    {items.length === 0
                        ? "No hay establecimientos pendientes de aprobación."
                        : "Ningún establecimiento coincide con la búsqueda."}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-500">
                                <th className="px-3 py-2 font-semibold">Establecimiento</th>
                                <th className="px-3 py-2 font-semibold">Ubicación</th>
                                <th className="px-3 py-2 font-semibold">Estrellas</th>
                                <th className="px-3 py-2 font-semibold">Fecha</th>
                                <th className="px-3 py-2 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(est => {
                                const esSel = panelEst?.id_tbl_establecimiento === est.id_tbl_establecimiento;
                                const fecha = est.fecha ? String(est.fecha).substring(0, 10) : "";
                                return (
                                    <tr key={est.id_tbl_establecimiento}
                                        className={`border-t border-gray-100 hover:bg-gray-50 ${esSel ? "bg-green-50" : ""}`}>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                {est.foto ? (
                                                    <img
                                                        src={`https://visitaecuador.com/ve/img/contenido/informacion/thum500x500/${est.foto}`}
                                                        alt=""
                                                        className="w-8 h-8 rounded object-cover"
                                                        onError={e => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{est.nombreEstablecimiento || "Sin nombre"}</p>
                                                    {est.direccion_establecimiento && (
                                                        <p className="text-[10px] text-gray-500 truncate">{est.direccion_establecimiento}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                            {est.ciudad || "—"}
                                            {est.provincia && <span className="block text-[10px] text-gray-400">{est.provincia}</span>}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                            {est.catalogacion > 0 ? "★".repeat(est.catalogacion) : "—"}
                                        </td>
                                        <td className="px-3 py-2 text-gray-500">{fecha}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => setPanelEst(est)}
                                                    title="Ver detalle"
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        esSel ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                                    }`}>
                                                    <IconEye/>
                                                </button>
                                                <button
                                                    onClick={() => handleAprobar(est)}
                                                    disabled={aprobandoId === est.id_tbl_establecimiento}
                                                    title="Aprobar y publicar"
                                                    className="px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold flex items-center gap-1 transition-colors">
                                                    {aprobandoId === est.id_tbl_establecimiento
                                                        ? <Spin size={3}/>
                                                        : <IconCheck/>}
                                                    Aprobar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Panel lateral con el detalle completo (mismo que el listado) */}
            {panelEst && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setPanelEst(null)} />
                    <PanelEdicionEstablecimiento
                        establecimiento={panelEst}
                        tabInicial="info"
                        onCerrar={() => setPanelEst(null)}
                        onActualizado={() => { /* el listado no necesita refrescarse hasta aprobar */ }}
                    />
                </>
            )}
        </div>
    );
};

export default ListarAprobaciones;
