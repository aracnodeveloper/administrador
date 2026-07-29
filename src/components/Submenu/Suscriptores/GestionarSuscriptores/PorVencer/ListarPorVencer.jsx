import React, { useEffect, useState } from "react";
import TablaPorVencer from "./TablaPorVencer";
import {
    listarPorVencer,
    convertirPorVencerALeads,
} from "../../../../../controllers/suscriptores/SuscriptoresController";
import Config from "../../../../../global/config";

const OPCIONES_DIAS = [
    { id: "7", nombre: "Próximos 7 días" },
    { id: "15", nombre: "Próximos 15 días" },
    { id: "30", nombre: "Próximos 30 días" },
    { id: "60", nombre: "Próximos 60 días" },
];

const OPCIONES_DIAS_VENCIDAS = [
    { id: "0", nombre: "Sin vencidas" },
    { id: "7", nombre: "Vencidas 7 días" },
    { id: "15", nombre: "Vencidas 15 días" },
    { id: "30", nombre: "Vencidas 30 días" },
    { id: "60", nombre: "Vencidas 60 días" },
    { id: "90", nombre: "Vencidas 90 días" },
    { id: "180", nombre: "Vencidas 180 días" },
    { id: "365", nombre: "Vencidas 1 año" },
    { id: "730", nombre: "Vencidas 2 años" },
    { id: "1095", nombre: "Vencidas 3 años" },
    { id: "1460", nombre: "Vencidas 4 años" },
    { id: "1825", nombre: "Vencidas 5 años" },
    { id: "2190", nombre: "Vencidas 6 años" },
    { id: "2555", nombre: "Vencidas 7 años" },
    { id: "2920", nombre: "Vencidas 8 años" },
    { id: "3285", nombre: "Vencidas 9 años" },
    { id: "3650", nombre: "Vencidas 10 años" },
];

const ListarPorVencer = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [numPaginas, setNumPaginas] = useState(1);
    const [selPagina, setSelPagina] = useState(0);

    // filtros
    const [ciUsuario, setCiUsuario] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [dias, setDias] = useState("30");
    const [diasVencidas, setDiasVencidas] = useState("30");
    const [cantidad, setCantidad] = useState("20");

    // conversión a leads RISE
    const [convirtiendo, setConvirtiendo] = useState(false);
    const [resultadoConv, setResultadoConv] = useState(null);

    const construirFiltros = () => ({
        ci_cliente: ciUsuario,
        nombre_cliente: nombreCliente,
        ciudad: ciudad,
        dias: dias,
        // ventana hacia atrás de ya vencidas (0 = no incluir vencidas)
        dias_vencidas: diasVencidas,
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

    const handleConvertirLeads = async () => {
        if (!data || data.length === 0) return;
        const ok = window.confirm(
            `¿Convertir las ${data.length} suscripción(es) en pantalla a leads de RISE?`
        );
        if (!ok) return;

        setConvirtiendo(true);
        setResultadoConv(null);
        try {
            const res = await convertirPorVencerALeads(data);
            const rows = res?.rows || [];
            // Con upsert=true ya no debería haber "duplicados" por cédula (se actualizan en
            // vez de fallar), pero se deja el conteo por si el backend rechaza alguno igual.
            const duplicados = rows.filter(
                (r) => !r.success && /ya existe/i.test(r.error || "")
            ).length;
            const fallidos = (res?.failedCount || 0) - duplicados;
            setResultadoConv({
                creados: res?.createdCount || 0,
                actualizados: res?.updatedCount || 0,
                duplicados,
                errores: fallidos > 0 ? fallidos : 0,
                total: res?.totalRows || 0,
            });
        } catch (e) {
            setResultadoConv({
                error: "No se pudo conectar con RISE. Verifique la URL/disponibilidad del servicio.",
            });
        } finally {
            setConvirtiendo(false);
        }
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
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
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

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={diasVencidas}
                    onChange={(e) => setDiasVencidas(e.target.value)}
                >
                    {OPCIONES_DIAS_VENCIDAS.map((o) => (
                        <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                </select>

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

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                    onClick={handleConvertirLeads}
                    disabled={loading || convirtiendo || !data || data.length === 0}
                    title="Crea leads en RISE a partir de las suscripciones listadas (deduplica por cédula)"
                >
                    {convirtiendo ? "Convirtiendo..." : "Convertir a leads (RISE)"}
                </button>
            </div>

            {/* Resultado de conversión a leads */}
            {resultadoConv && (
                <div className="mb-3 text-[11px]">
                    {resultadoConv.error ? (
                        <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-medium">
                            {resultadoConv.error}
                        </span>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium">
                                Leads creados: {resultadoConv.creados}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-medium">
                                Actualizados: {resultadoConv.actualizados}
                            </span>
                            {resultadoConv.duplicados > 0 && (
                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                                    Ya existían: {resultadoConv.duplicados}
                                </span>
                            )}
                            {resultadoConv.errores > 0 && (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-medium">
                                    Con error: {resultadoConv.errores}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

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
