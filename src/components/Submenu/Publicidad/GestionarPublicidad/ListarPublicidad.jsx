import React, { useEffect, useState } from "react";
import {
    listarPublicidades,
    eliminarPublicidad,
    getCatalogosPublicidad,
} from "../../../../controllers/publicidad/PublicidadController";
import AgregarPublicidad from "./AgregarPublicidad";

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

const ListarPublicidad = () => {
    const [data, setData] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [change, setChange] = useState(0);
    const [catalogos, setCatalogos] = useState({ objetos: [], tipos_publicidad: [] });

    // Filtros
    const [filtroObjeto, setFiltroObjeto] = useState("");
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [soloVigentes, setSoloVigentes] = useState(true);

    useEffect(() => {
        getCatalogosPublicidad().then(setCatalogos);
    }, []);

    useEffect(() => {
        setCargando(true);
        const filtros = {
            id_tbl_objeto: filtroObjeto ? parseInt(filtroObjeto) : 0,
            titulo: filtroTitulo,
            solo_vigentes: soloVigentes,
        };
        listarPublicidades(filtros).then((res) => {
            setData(Array.isArray(res) ? res : []);
            setCargando(false);
        });
    }, [change, filtroObjeto, filtroTitulo, soloVigentes]);

    const handleSetChange = () => setChange((p) => p + 1);

    const onEliminar = async (item) => {
        if (
            !window.confirm(
                `¿Eliminar la publicidad "${item.descripcion}"? Esta accion la marca como eliminada.`
            )
        )
            return;
        const ok = await eliminarPublicidad(item.id_tbl_publicidad_dirigida);
        if (ok) handleSetChange();
        else alert("No se pudo eliminar");
    };

    const nombreObjeto = (id) =>
        catalogos.objetos.find((o) => o.id === parseInt(id))?.nombre || id;

    return (
        <div className="flex-1 p-4 w-full relative">
            {/* Filtros inline */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Buscar por descripción..."
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                />

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={filtroObjeto}
                    onChange={(e) => setFiltroObjeto(e.target.value)}
                >
                    <option value="">Todos los objetos</option>
                    {catalogos.objetos.map((o) => (
                        <option key={o.id} value={o.id}>
                            {o.nombre}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer">
                    <input
                        type="checkbox"
                        checked={soloVigentes}
                        onChange={(e) => setSoloVigentes(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-300"
                    />
                    Solo vigentes
                </label>

                <AgregarPublicidad setChange={handleSetChange} key={change} />
            </div>

            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {cargando ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando...</span>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-10">Sin publicidades</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Imagen</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Descripción</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Tipo</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Vínculo</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Vigencia</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Posición</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Estado</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr
                                    key={item.id_tbl_publicidad_dirigida}
                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}
                                >
                                    <td className="px-3 py-2">
                                        <img
                                            src={item.url_foto}
                                            alt=""
                                            className="h-10 w-16 object-cover rounded-lg border border-gray-200"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://visitaecuador.com/ve/img/iconos/imagen.png")
                                            }
                                        />
                                    </td>
                                    <td className="px-3 py-2 max-w-xs truncate text-gray-800">
                                        {item.descripcion}
                                    </td>
                                    <td className="px-3 py-2 text-gray-500">
                                        {nombreObjeto(item.id_tbl_objeto)}
                                    </td>
                                    <td className="px-3 py-2 truncate max-w-[160px]">
                                        {item.vinculo ? (
                                            <a
                                                href={item.vinculo}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {item.vinculo}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-gray-500">
                                        {item.fecha_inicio} a {item.fecha_fin}
                                    </td>
                                    <td className="px-3 py-2 text-gray-500">{item.posicion}</td>
                                    <td className="px-3 py-2">
                                        {item.eliminado == 1 ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600">
                                                Eliminada
                                            </span>
                                        ) : item.vigente ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                                                Vigente
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                                                Fuera de fecha
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1.5">
                                            <AgregarPublicidad
                                                setChange={handleSetChange}
                                                editar={true}
                                                data={item}
                                                key={`${item.id_tbl_publicidad_dirigida}-${change}`}
                                            />
                                            <BtnAccion
                                                title="Eliminar"
                                                onClick={() => onEliminar(item)}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </BtnAccion>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ListarPublicidad;
