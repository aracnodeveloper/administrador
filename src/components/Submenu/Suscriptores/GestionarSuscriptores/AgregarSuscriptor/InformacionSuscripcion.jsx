import React, { useEffect, useState } from "react";
import Config from "../../../../../global/config";
import { listarCanalesVenta } from "../../../../../controllers/info/InfoController";
import { buscarUsuarios } from "../../../../../controllers/smart/SmartController";
import {
  comprobarCodigoPromocional,
  listarProductos,
} from "../../../../../controllers/suscriptores/SuscriptoresController";
import ClickAwayListener from "react-click-away-listener";

const InformacionSuscripcion = ({
  suscripciones,
  setSuscripciones,
  isEdit = false,
}) => {
  const [canales, setCanales] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [codigoPromo, setCodigoPromo] = useState("");
  const [datosVendedor, setDatosVendedor] = useState(null);
  const [idCodigoPromocional, setIdCodigoPromocional] = useState(null);

  useEffect(() => {
    listarCanalesVenta().then((res) => {
      if (res) {
        setCanales(res);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && inputValue.length > 2) {
        buscarUsuarios(inputValue).then((res) => {
          setSuggestion(res);
        });
      } else {
        setSuggestion(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSuscripcionChange = (index, field, value) => {
    const nuevasSuscripciones = [...suscripciones];
    nuevasSuscripciones[index] = {
      ...nuevasSuscripciones[index],
      [field]: value,
    };
    setSuscripciones(nuevasSuscripciones);
  };

  const handleProductoChange = (index, productoSeleccionado) => {
    if (productoSeleccionado) {
      const nuevasSuscripciones = [...suscripciones];
      nuevasSuscripciones[index] = {
        ...nuevasSuscripciones[index],
        titulo: productoSeleccionado.titulo,
        precio: productoSeleccionado.precio_producto,
        id_producto: productoSeleccionado.id_producto,
        id_prod_suscripcion: productoSeleccionado.id_prod_suscripcion,
        id_lista_precio_producto: productoSeleccionado.id_lista_precio_producto,
        id_codigo_promocional:
          idCodigoPromocional ||
          productoSeleccionado.id_codigo_promocional ||
          0,
        id_vendedor:
          datosVendedor?.id_usuario_vendedor ||
          nuevasSuscripciones[index].id_vendedor,
        id_suscripcion_vendedor:
          datosVendedor?.id_suscripcion_vendedor ||
          nuevasSuscripciones[index].id_suscripcion_vendedor,
        vendedor:
          datosVendedor?.nombre_vendedor || nuevasSuscripciones[index].vendedor,
      };
      setSuscripciones(nuevasSuscripciones);
    }
  };

  const handleBuscarProductos = async () => {
    if (!codigoPromo.trim()) {
      alert("Por favor ingrese un código promocional");
      return;
    }

    setLoadingProductos(true);
    try {
      const res = await comprobarCodigoPromocional(codigoPromo);
      if (res) {
        // Guardar el ID del código promocional
        setIdCodigoPromocional(res.id_codigo_promocional);

        // Extraer datos del vendedor del código promocional
        if (res.vendedor) {
          const vendedorInfo = {
            id_usuario_vendedor: res.vendedor.id_usuario_vendedor,
            id_suscripcion_vendedor: res.vendedor.id_suscripcion_vendedor,
            nombre_vendedor: res.vendedor.nombre_vendedor,
          };
          setDatosVendedor(vendedorInfo);
          console.log("Datos del vendedor extraídos:", vendedorInfo);
          console.log("ID Código Promocional:", res.id_codigo_promocional);
        }

        const productosRes = await listarProductos(res.id_codigo_promocional);
        if (productosRes) {
          setProductos(productosRes);
        } else {
          alert("No se encontraron productos para este código");
          setProductos([]);
        }
      } else {
        alert("Código promocional no válido");
        setProductos([]);
        setDatosVendedor(null);
        setIdCodigoPromocional(null);
      }
    } catch (err) {
      console.error("Error buscando productos:", err);
      alert("Error al buscar productos");
    } finally {
      setLoadingProductos(false);
    }
  };

  const handleClickAway = () => {
    setSuggestion(null);
  };

  const onClickSuggestion = (item, index) => {
    handleSuscripcionChange(
      index,
      "vendedor",
      `${item.usuario} - ${item.nombres}`
    );
    handleSuscripcionChange(index, "id_vendedor", item.usuario);
    setSuggestion(null);
    setInputValue("");
    setSelectedIndex(null);
  };

  const agregarSuscripcion = () => {
    setSuscripciones([
      ...suscripciones,
      {
        titulo: "",
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_fin: "",
        id_estado_pago: 2,
        observacion: "",
        vendedor: datosVendedor?.nombre_vendedor || "",
        id_vendedor: datosVendedor?.id_usuario_vendedor || "",
        id_suscripcion_vendedor: datosVendedor?.id_suscripcion_vendedor || "",
        id_canal: canales[0]?.id_tbl_tipo_canal || 13,
        precio: 0,
        id_producto: "",
        id_prod_suscripcion: "",
        id_lista_precio_producto: "",
        id_codigo_promocional: idCodigoPromocional || 0,
      },
    ]);
  };

  const eliminarSuscripcion = (index) => {
    setSuscripciones(suscripciones.filter((_, i) => i !== index));
  };

  const handleVendedorInputChange = (value, index) => {
    setInputValue(value);
    setSelectedIndex(index);
    handleSuscripcionChange(index, "vendedor", value);
  };

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg mt-5 relative bg-white shadow-sm">
      <label className="absolute -top-3 left-6 bg-greenVE-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
        Información de la Suscripción
      </label>

      <div className="p-6 pt-8">
        {/* Sección de búsqueda de productos */}
        {!isEdit && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Buscar Productos por Código Promocional
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={codigoPromo}
                onChange={(e) => setCodigoPromo(e.target.value)}
                placeholder="Ingrese código promocional"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
              />
              <button
                onClick={handleBuscarProductos}
                disabled={loadingProductos}
                className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
                  loadingProductos
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingProductos ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {productos.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-green-700 bg-green-50 p-2 rounded mb-2">
                  ✓ {productos.length} producto(s) encontrado(s)
                </div>
                {datosVendedor && (
                  <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                    <span className="font-semibold">Vendedor asignado:</span>{" "}
                    {datosVendedor.nombre_vendedor}
                    <span className="ml-2 text-gray-600">
                      (ID: {datosVendedor.id_usuario_vendedor})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={agregarSuscripcion}
            className="px-4 py-2 bg-greenVE-600 text-white rounded-md hover:bg-greenVE-700 flex items-center gap-2 transition-colors"
          >
            <span className="icon-[gridicons--add] h-5 w-5"></span>
            Agregar Suscripción
          </button>
        </div>

        {suscripciones && suscripciones.length > 0 ? (
          <div className="space-y-4">
            {suscripciones.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative"
              >
                {/* Botón eliminar */}
                <button
                  onClick={() => eliminarSuscripcion(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Eliminar suscripción"
                >
                  <span className="icon-[material-symbols--close] h-6 w-6"></span>
                </button>

                {/* Número de suscripción */}
                <div className="mb-4">
                  <span className="text-sm font-semibold text-greenVE-700">
                    Suscripción #{index + 1}
                  </span>
                </div>

                {/* Grid de campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Selector de Producto */}
                  {productos.length > 0 && (
                    <div className="flex flex-col md:col-span-3">
                      <label className="text-xs font-medium text-gray-700 mb-1">
                        Producto <span className="text-red-500">*</span>
                      </label>
                      <select
                        onChange={(e) => {
                          const prod = productos.find(
                            (p) => p.id_producto === e.target.value
                          );
                          handleProductoChange(index, prod);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Seleccione un producto
                        </option>
                        {productos.map((p) => (
                          <option key={p.id_producto} value={p.id_producto}>
                            {p.titulo} - $
                            {(p.precio_producto * 1.12).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Nombre/Título - Solo lectura si hay producto seleccionado */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Nombre Suscripción <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={item.titulo || ""}
                      onChange={(e) =>
                        handleSuscripcionChange(index, "titulo", e.target.value)
                      }
                      type="text"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500 bg-gray-100"
                      placeholder="Seleccione un producto"
                      readOnly={productos.length > 0}
                    />
                  </div>

                  {/* Precio - Solo lectura si hay producto seleccionado */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Precio
                    </label>
                    <input
                      value={item.precio || ""}
                      onChange={(e) =>
                        handleSuscripcionChange(index, "precio", e.target.value)
                      }
                      type="number"
                      step="0.01"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500 bg-gray-100"
                      placeholder="0.00"
                      readOnly={productos.length > 0}
                    />
                  </div>

                  {/* Fecha Inicio */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      value={item.fecha_inicio || ""}
                      onChange={(e) =>
                        handleSuscripcionChange(
                          index,
                          "fecha_inicio",
                          e.target.value
                        )
                      }
                      type="date"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                    />
                  </div>

                  {/* Fecha Fin */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      value={item.fecha_fin || ""}
                      onChange={(e) =>
                        handleSuscripcionChange(
                          index,
                          "fecha_fin",
                          e.target.value
                        )
                      }
                      type="date"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                    />
                  </div>

                  {/* Estado de Pago */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Estado de Pago
                    </label>
                    <select
                      value={item.id_estado_pago || 2}
                      onChange={(e) =>
                        handleSuscripcionChange(
                          index,
                          "id_estado_pago",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                    >
                      {Config.ESTADOPAGO.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                          {estado.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Canal */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Canal de Venta
                    </label>
                    <select
                      value={item.id_canal || 13}
                      onChange={(e) =>
                        handleSuscripcionChange(
                          index,
                          "id_canal",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                    >
                      {canales &&
                        canales.map((canal) => (
                          <option
                            key={canal.id_tbl_tipo_canal}
                            value={canal.id_tbl_tipo_canal}
                          >
                            {canal.nombre}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Vendedor - Solo lectura si viene del código promocional */}
                  <div className="flex flex-col relative md:col-span-2">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Vendedor{" "}
                      {datosVendedor && (
                        <span className="text-blue-600">
                          (Asignado automáticamente)
                        </span>
                      )}
                    </label>
                    <input
                      value={item.vendedor || ""}
                      onChange={(e) =>
                        handleVendedorInputChange(e.target.value, index)
                      }
                      type="text"
                      className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500 ${
                        datosVendedor ? "bg-blue-50" : ""
                      }`}
                      placeholder="Buscar vendedor..."
                      readOnly={!!datosVendedor}
                    />
                    {suggestion &&
                      selectedIndex === index &&
                      !datosVendedor && (
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div className="absolute top-full mt-1 max-h-64 w-full bg-white z-50 shadow-lg border border-gray-300 rounded-md overflow-y-auto">
                            {suggestion.map((vendedor, key) => (
                              <div
                                key={key}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                onClick={() =>
                                  onClickSuggestion(vendedor, index)
                                }
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">
                                    ID: {vendedor.usuario} | CI:{" "}
                                    {vendedor.ci_ruc} | {vendedor.nombres}
                                  </span>
                                  {vendedor.estado === "activo" ? (
                                    <span className="icon-[mdi--check-circle] text-greenVE-600 h-5 w-5"></span>
                                  ) : (
                                    <span className="icon-[material-symbols--cancel] text-red-500 h-5 w-5"></span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ClickAwayListener>
                      )}
                  </div>

                  {/* Observación */}
                  <div className="flex flex-col md:col-span-3">
                    <label className="text-xs font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      value={item.observacion || ""}
                      onChange={(e) =>
                        handleSuscripcionChange(
                          index,
                          "observacion",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500"
                      placeholder="Observaciones adicionales..."
                      rows={2}
                    />
                  </div>

                  {/* IDs ocultos - Solo informativos */}
                  {(item.id_producto ||
                    item.id_prod_suscripcion ||
                    item.id_lista_precio_producto ||
                    item.id_suscripcion_vendedor) && (
                    <div className="md:col-span-3 p-3 bg-gray-100 rounded border border-gray-300">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        IDs (automáticos):
                      </p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-700">
                        {item.id_producto && (
                          <span>
                            ID Producto: <strong>{item.id_producto}</strong>
                          </span>
                        )}
                        {item.id_prod_suscripcion && (
                          <span>
                            ID Prod. Susc.:{" "}
                            <strong>{item.id_prod_suscripcion}</strong>
                          </span>
                        )}
                        {item.id_lista_precio_producto && (
                          <span>
                            ID Lista Precio:{" "}
                            <strong>{item.id_lista_precio_producto}</strong>
                          </span>
                        )}
                        {item.id_suscripcion_vendedor && (
                          <span className="text-blue-700">
                            ID Susc. Vendedor:{" "}
                            <strong>{item.id_suscripcion_vendedor}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="icon-[material-symbols--subscription-outline] h-16 w-16 mx-auto mb-3 text-gray-400"></span>
            <p className="text-sm font-medium">
              No hay suscripciones agregadas
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Busca productos con un código promocional y luego agrega una
              suscripción
            </p>
          </div>
        )}

        {/* Nota informativa */}
        {suscripciones.length > 0 && (
          <div className="mt-6 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Importante:</span> Los IDs de
              producto y vendedor se asignan automáticamente al buscar con un
              código promocional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformacionSuscripcion;
