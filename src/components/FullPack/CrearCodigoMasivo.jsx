import React, { useState, useEffect } from 'react';
import { crearCodigosPrepagoMasivo, comprobarCodigoPromocional, listarProductosFullPack } from '../../controllers/fulpack/FullPackController';

const CrearCodigosMasivo = ({ onCodigosCreados }) => {
    const [cantidad, setCantidad] = useState(1);
    const [descripcion, setDescripcion] = useState('');
    const [idGrupo, setIdGrupo] = useState(12);
    const [creando, setCreando] = useState(false);
    const [progreso, setProgreso] = useState({ actual: 0, total: 0 });
    const [resultado, setResultado] = useState(null);

    // Codigo promocional
    const [codigoPromo, setCodigoPromo] = useState('');
    const [comprobando, setComprobando] = useState(false);
    const [datosPromo, setDatosPromo] = useState(null);
    const [errorPromo, setErrorPromo] = useState('');

    // Productos
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cargandoProductos, setCargandoProductos] = useState(false);
    const [idListaPrecio, setIdListaPrecio] = useState(140);

    const GRUPOS = [
        { id: 12, nombre: 'FullPack Automatico' },
        { id: 13, nombre: 'FullPack Manual' },
        { id: 14, nombre: 'Pack Personalizado' },
    ];

    // Cargar productos al montar y cuando cambie la lista de precios
    const cargarProductos = async (lista) => {
        setCargandoProductos(true);
        setProductoSeleccionado(null);
        const prods = await listarProductosFullPack(lista);
        setProductos(prods || []);
        setCargandoProductos(false);
    };

    useEffect(() => {
        cargarProductos(idListaPrecio);
    }, [idListaPrecio]);

    const handleComprobarCodigo = async () => {
        if (!codigoPromo.trim()) return;
        setComprobando(true);
        setErrorPromo('');
        setDatosPromo(null);

        const res = await comprobarCodigoPromocional(codigoPromo);
        if (res) {
            setDatosPromo(res);
        } else {
            setErrorPromo('Codigo promocional no valido');
        }
        setComprobando(false);
    };

    const handleSeleccionarProducto = (e) => {
        const idx = parseInt(e.target.value);
        if (idx >= 0 && productos[idx]) {
            const prod = productos[idx];
            setProductoSeleccionado(prod);
            if (prod.id_grupo) setIdGrupo(parseInt(prod.id_grupo));
        } else {
            setProductoSeleccionado(null);
        }
    };

    const handleCrear = async () => {
        if (cantidad < 1 || cantidad > 500) {
            alert('La cantidad debe estar entre 1 y 500');
            return;
        }
        setCreando(true);
        setProgreso({ actual: 0, total: cantidad });
        setResultado(null);

        const params = { id_grupo: idGrupo, descripcion };
        if (productoSeleccionado) {
            params.id_tbl_lista_precio_producto = productoSeleccionado.id_lista_precio_producto;
        }

        const res = await crearCodigosPrepagoMasivo(
            cantidad, params,
            (actual, total) => { setProgreso({ actual, total }); }
        );
        setResultado(res);
        setCreando(false);
        if (onCodigosCreados && res.exitosos.length > 0) onCodigosCreados(res.exitosos);
    };

    const porcentaje = progreso.total > 0 ? Math.round((progreso.actual / progreso.total) * 100) : 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Crear Codigos Prepago</h2>

            {/* Seccion: Codigo Promocional */}
            <div className="mb-4 p-4 bg-gray-50 rounded-md border">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Codigo Promocional (opcional)</label>
                <div className="flex gap-2">
                    <input type="text" value={codigoPromo}
                        onChange={(e) => setCodigoPromo(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComprobarCodigo()}
                        placeholder="Ingrese codigo promocional"
                        disabled={comprobando}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <button onClick={handleComprobarCodigo} disabled={comprobando || !codigoPromo.trim()}
                        className={'px-4 py-2 rounded-md text-white text-sm font-semibold ' + (comprobando || !codigoPromo.trim() ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700')}>
                        {comprobando ? 'Comprobando...' : 'Comprobar'}
                    </button>
                </div>
                {errorPromo && <p className="text-xs text-red-500 mt-1">{errorPromo}</p>}
                {datosPromo && (
                    <div className="mt-2 text-xs text-green-600">
                        Codigo valido - ID: {datosPromo.id_codigo_promocional}
                        {datosPromo.vendedor && datosPromo.vendedor.nombre_vendedor && <span> - Vendedor: {datosPromo.vendedor.nombre_vendedor}</span>}
                    </div>
                )}
            </div>

            {/* Seccion: Producto */}
            <div className="mb-4 p-4 bg-gray-50 rounded-md border">
                <div className="flex gap-4 items-end mb-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Lista de Precios</label>
                        <input type="number" value={idListaPrecio}
                            onChange={(e) => setIdListaPrecio(parseInt(e.target.value) || 140)}
                            disabled={creando}
                            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Producto / Suscripcion
                            {!cargandoProductos && productos.length > 0 && <span className="text-gray-400 font-normal"> ({productos.length} productos)</span>}
                        </label>
                        {cargandoProductos ? (
                            <div className="text-sm text-gray-400 py-2">Cargando productos...</div>
                        ) : productos.length > 0 ? (
                            <select onChange={handleSeleccionarProducto} disabled={creando}
                                value={productoSeleccionado ? productos.indexOf(productoSeleccionado) : ''}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">-- Seleccione un producto --</option>
                                {productos.map((p, idx) => (
                                    <option key={idx} value={idx}>
                                        {p.titulo} - ${p.precio_producto} 
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-sm text-gray-400 py-2">No hay productos en la lista {idListaPrecio}</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Seccion: Parametros de creacion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad</label>
                    <input type="number" min="1" max="500" value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)} disabled={creando}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Grupo</label>
                    <select value={idGrupo} onChange={(e) => setIdGrupo(parseInt(e.target.value))} disabled={creando}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        {GRUPOS.map((g) => (<option key={g.id} value={g.id}>{g.nombre}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Descripcion</label>
                    <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                        disabled={creando} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
            </div>

            <button onClick={handleCrear} disabled={creando}
                className={'px-6 py-2 rounded-md text-white text-sm font-semibold ' + (creando ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700')}>
                {creando ? 'Creando...' : 'Crear ' + cantidad + ' codigo' + (cantidad > 1 ? 's' : '')}
            </button>

            {creando && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso: {progreso.actual} de {progreso.total}</span>
                        <span>{porcentaje}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: porcentaje + '%' }}></div>
                    </div>
                </div>
            )}

            {resultado && !creando && (
                <div className="mt-4 p-4 rounded-md bg-gray-50 border">
                    <div className="flex gap-4 text-sm">
                        <span className="text-green-600 font-semibold">Exitosos: {resultado.exitosos.length}</span>
                        {resultado.fallidos.length > 0 && <span className="text-red-600 font-semibold">Fallidos: {resultado.fallidos.length}</span>}
                        <span className="text-gray-500">Total: {resultado.total}</span>
                    </div>
                    {resultado.fallidos.length > 0 && (
                        <div className="mt-2">
                            <p className="text-xs text-red-500">Errores:</p>
                            {resultado.fallidos.slice(0, 5).map((f, i) => (
                                <p key={i} className="text-xs text-red-400">#{f.index}: {f.error}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CrearCodigosMasivo;