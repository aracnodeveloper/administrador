import React, { useEffect, useState } from "react";
import TablaPorVencer from "./TablaPorVencer";
import { listarPorVencer } from "../../../../../controllers/suscriptores/SuscriptoresController";
import Config from "../../../../../global/config";

const OPCIONES_DIAS = [
    { id: "7", nombre: "Próximos 7 días" },
    { id: "15", nombre: "Próximos 15 días" },
    { id: "30", nombre: "Próximos 30 días" },
    { id: "60", nombre: "Próximos 60 días" },
];

const ListarPorVencer = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [numPaginas, setNumPaginas] = useState(1);
    const [selPagina, setSelPagina] = useState(0);

    // filtros
    const [ciUsuario, setCiUsuario] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [dias, setDias] = useState("30");
    const [incluirVencidas, setIncluirVencidas] = useState(true);
    const [cantidad, setCantidad] = useState("20");

    const construirFiltros = () => ({
        ci_cliente: ciUsuario,
        nombre_cliente: nombreCliente,
        dias: dias,
        // si se incluyen vencidas, mira los últimos 30 días vencidos; si no, 0
        dias_vencidas: incluirVencidas ? "30" : "0",
        cantidad: cantidad !== "1" ? cantidad : "",
    });

    const cargar = ({ pagina = 1 } = {}) => {
        setData();
        setLoading(true);
        listarPorVencer({ pagina, filtros: construirFiltros() })
            .then((res) => {
                setLoading(false);
                if (res) {
                    setData(res.suscripciones || []);
                    setNumPaginas(
                        cantidad === "1"
                            ? 1
                            : Math.max(1, Math.ceil(parseInt(res.cantidad || 0) / parseInt(cantidad)))
                    );
                }
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        cargar({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAplicar = () => {
        setSelPagina(0);
        cargar({ pagina: 1 });
    };

    const handlePagina = (nueva) => {
        setSelPagina(nueva);
        cargar({ pagina: nueva + 1 });
    };

    // resumen
    const resumen = React.useMemo(() => {
        if (!data) return { total: 0, vencidas: 0, urgentes: 0 };
        let vencidas = 0;
        let urgentes = 0;
        data.forEach((it) => {
            const d = it.dias_restantes !== undefined && it.dias_restantes !== null && it.dias_restantes !== ""
                ? parseInt(it.dias_restantes, 10)
                : null;
            if (d !== null) {
                if (d < 0) vencidas++;
                else if (d <= 7) urgentes++;
            }
        });
        return { total: data.length, vencidas, urgentes };
    }, [data]);

    return (
        <div className="flex-1 p-4 w-full relative">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Cédula"
                    value={ciUsuario}
                    onChange={(e) => setCiUsuario(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Nombre cliente"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                />
                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={dias}
                    onChange={(e) => setDias(e.target.value)}
                >
                    {OPCIONES_DIAS.map((o) => (
                        <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-gray-600 select-none">
                    <input
                        type="checkbox"
                        className="accent-green-600"
                        checked={incluirVencidas}
                        onChange={(e) => setIncluirVencidas(e.target.checked)}
                    />
                    Incluir vencidas (30 d)
                </label>

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                >
                    {Config.ELEMENTOSHOJAS.map((item) => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))}
                </select>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                    onClick={handleAplicar}
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Aplicar"}
                </button>
            </div>

            {/* Resumen */}
            {!loading && data && (
                <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                        Total en pantalla: {resumen.total}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-medium">
                        Vencidas: {resumen.vencidas}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-medium">
                        Urgentes (≤7 d): {resumen.urgentes}
                    </span>
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando suscripciones por vencer...</span>
                    </div>
                ) : !data ? (
                    <p className="text-center text-xs text-gray-400 py-10">Sin resultados disponibles</p>
                ) : (
                    <TablaPorVencer suscripciones={data} />
                )}
            </div>

            {/* Paginación */}
            {!loading && data && numPaginas > 1 && (
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>Página {selPagina + 1} de {numPaginas}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={selPagina === 0}
                            onClick={() => handlePagina(selPagina - 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            ← Anterior
                        </button>
                        <button
                            disabled={selPagina >= numPaginas - 1}
                            onClick={() => handlePagina(selPagina + 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarPorVencer;
