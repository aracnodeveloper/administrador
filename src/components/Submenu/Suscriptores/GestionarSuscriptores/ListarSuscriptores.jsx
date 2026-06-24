import React, { useEffect, useState } from "react";
import TablaSuscriptores from "./TablaSuscriptores";
import { listarSuscriptores } from "../../../../controllers/suscriptores/SuscriptoresController";
import DescargarSuscriptores from "./DescargarSuscriptores";
import Config from "../../../../global/config";

const ListarSuscriptores = ({ handleClickEdit }) => {
  const [numPaginas, setNumPaginas] = useState();
  const [selPagina, setSelPagina] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [idUsuario, setIdUsuario] = useState();
  const [ciUsuario, setCiUsuario] = useState();
  const [nombreCliente, setNombreCliente] = useState();
  const [idVendedor, setIdVendedor] = useState();
  const [nombreVendedor, setNombreVendedor] = useState();
  const [cantidad, setCantidad] = useState("20");

  const handleUpdateSuscriptores = ({ pagina = 1 }) => {
    setData();
    setLoading(true);
    var filtros = {
      cod_vendedor: idVendedor,
      nombre_vendedor: nombreVendedor,
      ci_cliente: ciUsuario,
      cod_cliente: idUsuario,
      nombre_cliente: nombreCliente,
      cantidad: cantidad != "1" ? cantidad : "",
    };

    listarSuscriptores({ pagina: pagina, filtros: filtros }).then((res) => {
      setLoading(false);
      if (res) {
        setData(res.suscripciones);
        setNumPaginas(
            cantidad == "1"
                ? 1
                : Math.ceil(parseInt(res.cantidad) / parseInt(cantidad))
        );
      }
    });
  };

  useEffect(() => {
    handleUpdateSuscriptores({});
  }, []);

  const handleOnPageChange = (newPage) => {
    setSelPagina(newPage);
    handleUpdateSuscriptores({ pagina: newPage + 1 });
  };

  const handleClickAplicar = () => {
    setSelPagina(0);
    handleUpdateSuscriptores({ pagina: 1 });
  };

  return (
      <div className="flex-1 p-4 w-full relative">
        {/* Filtros inline */}
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="ID suscripción"
              value={idUsuario || ''}
              onChange={(event) => setIdUsuario(event.target.value)}
          />
          <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Cédula"
              value={ciUsuario || ''}
              onChange={(event) => setCiUsuario(event.target.value)}
          />
          <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Nombre cliente"
              value={nombreCliente || ''}
              onChange={(event) => setNombreCliente(event.target.value)}
          />
          <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="ID Vendedor"
              value={idVendedor || ''}
              onChange={(event) => setIdVendedor(event.target.value)}
          />
          <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Nombre vendedor"
              value={nombreVendedor || ''}
              onChange={(event) => setNombreVendedor(event.target.value)}
          />

          <select
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
              value={cantidad}
              onChange={(event) => setCantidad(event.target.value)}
          >
            {Config.ELEMENTOSHOJAS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
            ))}
          </select>

          <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              onClick={handleClickAplicar}
              disabled={loading}
          >
            {loading ? 'Buscando...' : 'Aplicar'}
          </button>

          <DescargarSuscriptores
              params={{
                cod_vendedor: idVendedor,
                nombre_vendedor: nombreVendedor,
                ci_cliente: ciUsuario,
                cod_cliente: idUsuario,
                nombre_cliente: nombreCliente,
              }}
          />
        </div>

        {/* Tabla */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm">Cargando suscriptores...</span>
              </div>
          ) : !loading && !data ? (
              <p className="text-center text-xs text-gray-400 py-10">Sin resultados disponibles</p>
          ) : (
              <TablaSuscriptores
                  handleClickEdit={handleClickEdit}
                  suscriptores={data}
              />
          )}
        </div>

        {/* Paginación */}
        {!loading && data && numPaginas > 1 && (
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
              <span>Página {selPagina + 1} de {numPaginas}</span>
              <div className="flex gap-2">
                <button
                    disabled={selPagina === 0}
                    onClick={() => handleOnPageChange(selPagina - 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  ← Anterior
                </button>
                <button
                    disabled={selPagina >= numPaginas - 1}
                    onClick={() => handleOnPageChange(selPagina + 1)}
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

export default ListarSuscriptores;
