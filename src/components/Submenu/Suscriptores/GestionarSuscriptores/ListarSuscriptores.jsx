import React, { useEffect, useState } from "react";
import TablaSuscriptores from "./TablaSuscriptores";
import { listarSuscriptores } from "../../../../controllers/suscriptores/SuscriptoresController";
import ReactPaginate from "react-paginate";
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

  const handleOnPageChange = (page) => {
    setSelPagina(page.selected);
    handleUpdateSuscriptores({ pagina: page.selected + 1 });
  };

  const handleClickAplicar = () => {
    setSelPagina(0);
    handleUpdateSuscriptores({ pagina: 1 });
  };

  return (
      <div className="pl-3 w-full">
        <div className="w-full bg-gray-100 rounded-md px-4 py-2 pb-6">
          <div className="flex gap-2 items-center mb-3">
            <label className="text-greenVE-700 text-xl font-semibold">
              Listar suscriptores
            </label>
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

          <div className="bg-greenVE-400 p-3 rounded-lg">
            <label className="text-sm text-greenVE-800 font-medium mb-2 block">
              Filtrar por:
            </label>

            <div className="flex gap-2 flex-wrap">
              <input
                  value={idUsuario || ''}
                  onChange={(event) => setIdUsuario(event.target.value)}
                  placeholder="ID suscripción"
                  className="flex-1 min-w-[150px] h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
              />
              <input
                  value={ciUsuario || ''}
                  onChange={(event) => setCiUsuario(event.target.value)}
                  placeholder="Cédula"
                  className="flex-1 min-w-[150px] h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
              />
              <input
                  value={nombreCliente || ''}
                  onChange={(event) => setNombreCliente(event.target.value)}
                  placeholder="Nombre cliente"
                  className="flex-1 min-w-[150px] h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
              />
              <input
                  value={idVendedor || ''}
                  onChange={(event) => setIdVendedor(event.target.value)}
                  placeholder="ID Vendedor"
                  className="flex-1 min-w-[150px] h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
              />
              <input
                  value={nombreVendedor || ''}
                  onChange={(event) => setNombreVendedor(event.target.value)}
                  placeholder="Nombre vendedor"
                  className="flex-1 min-w-[150px] h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
              />
              <select
                  className="h-8 rounded-full px-3 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-600"
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
                  className="bg-greenVE-600 hover:bg-greenVE-700 text-white px-6 rounded-full h-8 font-medium transition-colors"
                  onClick={handleClickAplicar}
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
                <div className="w-full flex flex-col items-center justify-center py-12">
                  <span className="icon-[line-md--loading-twotone-loop] w-12 h-12 text-greenVE-600"></span>
                  <p className="mt-3 text-gray-600">Cargando suscriptores...</p>
                </div>
            ) : !loading && !data ? (
                <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <span className="icon-[material-symbols--inbox-outline] h-16 w-16 text-gray-400 mb-3"></span>
                  <label className="text-gray-600 font-medium">Sin resultados disponibles</label>
                  <p className="text-sm text-gray-400 mt-1">Intenta ajustar tus filtros</p>
                </div>
            ) : (
                <div className="flex flex-col w-full">
                  <TablaSuscriptores
                      handleClickEdit={handleClickEdit}
                      suscriptores={data}
                  />
                  {numPaginas > 1 && (
                      <ReactPaginate
                          forcePage={selPagina}
                          breakLabel="..."
                          nextLabel="Siguiente ›"
                          onPageChange={handleOnPageChange}
                          pageRangeDisplayed={5}
                          pageCount={numPaginas}
                          previousLabel="‹ Anterior"
                          renderOnZeroPageCount={null}
                          containerClassName={"flex justify-center p-4 gap-1"}
                          pageClassName={""}
                          pageLinkClassName={
                            "px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100"
                          }
                          previousClassName={""}
                          previousLinkClassName={
                            "px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100"
                          }
                          nextClassName={""}
                          nextLinkClassName={
                            "px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100"
                          }
                          breakClassName={""}
                          breakLinkClassName={
                            "px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100"
                          }
                          activeClassName={"bg-greenVE-600 !text-white rounded"}
                      />
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ListarSuscriptores;
