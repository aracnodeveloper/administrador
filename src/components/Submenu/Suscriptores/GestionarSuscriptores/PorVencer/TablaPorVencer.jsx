import React from "react";

/**
 * Calcula los días restantes hasta la caducidad.
 * Usa el dias_restantes que envía el backend (DATEDIFF con la caducidad real)
 * y, si no viene, lo calcula desde fecha_fin en el cliente.
 */
const calcularDiasRestantes = (item) => {
    if (item.dias_restantes !== undefined && item.dias_restantes !== null && item.dias_restantes !== "") {
        return parseInt(item.dias_restantes, 10);
    }
    if (!item.fecha_fin) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fin = new Date(item.fecha_fin.split(" ")[0] + "T00:00:00");
    if (isNaN(fin.getTime())) return null;
    return Math.round((fin - hoy) / (1000 * 60 * 60 * 24));
};

const BadgeDias = ({ dias }) => {
    if (dias === null) {
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">Sin fecha</span>;
    }
    let clase = "bg-green-100 text-green-700";
    let texto = `${dias} días`;
    if (dias < 0) {
        clase = "bg-red-100 text-red-700";
        texto = `Vencida hace ${Math.abs(dias)} d`;
    } else if (dias === 0) {
        clase = "bg-red-100 text-red-700";
        texto = "Caduca hoy";
    } else if (dias <= 7) {
        clase = "bg-red-100 text-red-700";
    } else if (dias <= 15) {
        clase = "bg-amber-100 text-amber-700";
    } else {
        clase = "bg-emerald-100 text-emerald-700";
    }
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${clase}`}>{texto}</span>;
};

const TablaPorVencer = ({ suscripciones }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600 w-10">#</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">ID</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Cédula</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Nombres</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Producto</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Caduca</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Estado</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Patrocinador</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Pago</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Empresa</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {suscripciones && suscripciones.length > 0 ? (
                    suscripciones.map((item, index) => {
                        const dias = calcularDiasRestantes(item);
                        const vencida = dias !== null && dias < 0;
                        return (
                            <tr
                                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}
                                key={`porvencer-${item.id_tbl_suscripcion_renovacion || item.id_tbl_usuario}-${index}`}
                            >
                                <td className="px-3 py-2 text-gray-400">{index + 1}</td>
                                <td className="px-3 py-2 font-mono text-gray-700">{item.codigo}</td>
                                <td className="px-3 py-2 text-gray-500">{item.ci_ruc}</td>
                                <td className="px-3 py-2 font-semibold text-gray-800">{item.usuario}</td>
                                <td className="px-3 py-2 text-gray-600">{item.producto}</td>
                                <td className="px-3 py-2">
                                    <span className={`text-[11px] font-medium ${vencida ? "text-red-600" : "text-orange-600"}`}>
                                        {item.fecha_fin ? item.fecha_fin.split(" ")[0] : "—"}
                                    </span>
                                </td>
                                <td className="px-3 py-2"><BadgeDias dias={dias} /></td>
                                <td className="px-3 py-2 text-gray-500">{item.vendedor}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        item.estado_pago === "Pagado" || item.estado_pago === "Cortesía"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}>
                                        {item.estado_pago}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-gray-500">{item.nombre}</td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="10" className="text-center py-10 text-gray-400">
                            No hay suscripciones en este rango
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaPorVencer;
