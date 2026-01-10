import { useState } from "react";
import {
  comprobarCodigoPromocional,
  importarSuscripciones,
  listarProductos,
} from "../../../../../controllers/suscriptores/SuscriptoresController";
import { construirSuscripcionPayload } from "./formatearData";
import { leerExcel } from "./LeerExcel";

const ImportarSuscriptores = () => {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadindgImport, setLoadingImport] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [archivo, setArchivo] = useState(null);

  const handleComprobar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    try {
      const res = await comprobarCodigoPromocional(codigo);
      if (res) {
        setResultado(res);

        // Llamar a listarProductos con el id_codigo_promocional
        const productosRes = await listarProductos(res.id_codigo_promocional);
        if (productosRes) {
          setProductos(productosRes);
        }
      }
    } catch (err) {
      console.error("Error comprobando código:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchivoChange = (e) => {
    if (e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleImportar = async () => {
    setLoadingImport(true);
    if (!archivo || !productoSeleccionado || !resultado) return;

    await importarSuscripciones(archivo, productoSeleccionado, resultado);
    setLoadingImport(false);
    alert("Importación completada 🚀");
  };

  return (
    <div className="pl-3 w-full">
      <div className="w-full bg-gray-100 rounded-md px-4 py-4">
        {/* Fila 1: título y botón plantilla */}
        <div className="flex justify-between items-center mb-4">
          <label className="text-greenVE-700 text-xl font-semibold">
            Importar suscriptores
          </label>

          <a
            href="https://visitaecuador.com/src/assets/plantillas/plantilla_carga_masiva.xlsx"
            download
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Descargar plantilla
          </a>
        </div>

        {/* Fila 2: grid 2 columnas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Columna 1: input código + botón */}
          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ingrese código promocional"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={handleComprobar}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-greenVE-700 hover:bg-greenVE-800"
              }`}
            >
              {loading ? "Comprobando..." : "Comprobar"}
            </button>
          </div>

          {/* Columna 2: selector de producto + tipo de pago */}
          {resultado && productos.length > 0 && (
            <div className="flex gap-2">
              {/* Selector de producto */}
              <select
                onChange={(e) => {
                  const prod = productos.find(
                    (p) => p.id_producto === e.target.value
                  );
                  setProductoSeleccionado(prod);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un producto
                </option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.titulo} - ${(p.precio_producto * 1.12).toFixed(2)}
                  </option>
                ))}
              </select>

              {/* Nuevo selector de método de pago */}
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Método de pago
                </option>
                <option value="Cortesia">Cortesía</option>
                <option value="Credito">Crédito</option>
                <option value="Debito">Débito</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          )}
        </div>

        {/* Fila 3: input archivo y botón importar (condicional) */}
        {resultado && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between gap-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleArchivoChange}
                className="block "
              />

              {archivo && productoSeleccionado && (
                <button
                  onClick={handleImportar}
                  disabled={loadindgImport}
                  className={`px-4 py-2 rounded-md  text-white ${
                    loadindgImport
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-400 hover:bg-orange-500"
                  }`}
                >
                  {loadindgImport ? "Importando..." : "Importar"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportarSuscriptores;
