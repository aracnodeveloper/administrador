import React, { useState, useEffect, useCallback } from 'react';
import { listarCodigosPrepago, desactivarCodigoPrepago, activarCodigoPrepago } from '../../controllers/fulpack/FullPackController';

const ListaCodigosPrepago = ({ recargar }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [cantidad, setCantidad] = useState(20);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroActivacion, setFiltroActivacion] = useState('');
    const [seleccionados, setSeleccionados] = useState([]);

    const cargarDatos = useCallback(async () => {
        setLoading(true);
        const filtro = {};
        if (filtroEstado) filtro.id_estado = parseInt(filtroEstado);
        if (filtroActivacion !== '') filtro.activacion = filtroActivacion === 'true';
        const params = { pagina, cantidad };
        if (Object.keys(filtro).length > 0) params.filtro = filtro;
        const res = await listarCodigosPrepago(params);
        if (res) setData(res);
        setLoading(false);
    }, [pagina, cantidad, filtroEstado, filtroActivacion]);

    useEffect(() => { cargarDatos(); }, [cargarDatos, recargar]);

    const obtenerItemsPlanos = () => {
        if (!data || !data.lista) return [];
        const items = [];
        Object.values(data.lista).forEach(estados => {
            Object.values(estados).forEach(arr => {
                arr.forEach(item => items.push(item));
            });
        });
        return items;
    };

    const toggleSeleccion = (id) => {
        setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const seleccionarTodos = () => {
        const todosIds = obtenerItemsPlanos().map(i => i.id);
        setSeleccionados(prev => prev.length === todosIds.length ? [] : todosIds);
    };

    const handleDesactivar = async (id) => {
        if (!window.confirm('Desactivar este codigo?')) return;
        const res = await desactivarCodigoPrepago(id);
        if (!res.error) cargarDatos(); else alert(res.msj);
    };

    const handleActivar = async (id) => {
        const res = await activarCodigoPrepago(id);
        if (!res.error) cargarDatos(); else alert(res.msj);
    };

    const [descargando, setDescargando] = useState(false);
    const [progresoDescarga, setProgresoDescarga] = useState({ actual: 0, total: 0 });

    const descargarImagen = async (url, nombre) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = nombre;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            return true;
        } catch (error) {
            console.error('Error descargando:', nombre, error);
            return false;
        }
    };

    const descargarImagenesSeleccionadas = async () => {
        if (seleccionados.length === 0) { alert('Selecciona al menos un codigo'); return; }
        const items = obtenerItemsPlanos();
        const selItems = items.filter(item => seleccionados.includes(item.id));
        setDescargando(true);
        setProgresoDescarga({ actual: 0, total: selItems.length });
        for (let i = 0; i < selItems.length; i++) {
            const item = selItems[i];
            if (item.urlimg) {
                const nombre = 'codigo_' + (item.codigo || item.id) + '.png';
                await descargarImagen(item.urlimg, nombre);
                await new Promise(r => setTimeout(r, 200));
            }
            setProgresoDescarga({ actual: i + 1, total: selItems.length });
        }
        setDescargando(false);
    };

    const exportarCSV = () => {
        const items = obtenerItemsPlanos();
        if (items.length === 0) { alert('No hay datos'); return; }
        const filtrados = seleccionados.length > 0 ? items.filter(i => seleccionados.includes(i.id)) : items;
        const headers = ['ID', 'Codigo', 'Estado', 'Fecha Creacion', 'URL Imagen', 'URL Compartir'];
        const rows = filtrados.map(i => [i.id, i.codigo||'', i.nombre_estado||'', i.fecha_creacion||'', i.urlimg||'', i.urlcompartirweb||'']);
        const csvStr = [headers.join(','), ...rows.map(r => r.map(c => '"'+c+'"').join(','))].join('\n');
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'codigos_prepago_' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getEstadoColor = (estado) => {
        if (estado === 'Activo') return 'bg-green-100 text-green-700';
        if (estado === 'Inactivo') return 'bg-red-100 text-red-700';
        if (estado === 'Usado') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    const allItems = obtenerItemsPlanos();

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <h2 className="text-lg font-bold text-gray-700">Codigos Prepago</h2>
                <div className="flex gap-2 flex-wrap">
                    <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }} className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                        <option value="">Todos los estados</option>
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                        <option value="3">Usado</option>
                    </select>
                    <select value={filtroActivacion} onChange={(e) => { setFiltroActivacion(e.target.value); setPagina(1); }} className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                        <option value="">Activacion: Todos</option>
                        <option value="true">Activados</option>
                        <option value="false">No activados</option>
                    </select>
                    <select value={cantidad} onChange={(e) => { setCantidad(parseInt(e.target.value)); setPagina(1); }} className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                        <option value="20">20/pag</option>
                        <option value="50">50/pag</option>
                        <option value="100">100/pag</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={seleccionarTodos} className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100">
                    {seleccionados.length > 0 ? 'Deseleccionar' : 'Seleccionar'} todos
                </button>
                <button onClick={descargarImagenesSeleccionadas} disabled={seleccionados.length === 0 || descargando}
                    className={'px-3 py-1 text-xs rounded text-white ' + (seleccionados.length > 0 && !descargando ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300')}>
                    {descargando ? 'Descargando ' + progresoDescarga.actual + '/' + progresoDescarga.total + '...' : 'Descargar imagenes (' + seleccionados.length + ')'}
                </button>
                <button onClick={exportarCSV} className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                    Exportar CSV {seleccionados.length > 0 ? '('+seleccionados.length+')' : '(todos)'}
                </button>
                <button onClick={cargarDatos} className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100">Recargar</button>
            </div>
            {loading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>
            ) : data && data.lista ? (
                <div>
                    <div className="text-xs text-gray-500 mb-2">Total: {data.items} codigos</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 font-semibold">
                                    <th className="px-2 py-2 text-left w-8"><input type="checkbox" onChange={seleccionarTodos} checked={seleccionados.length > 0 && seleccionados.length === allItems.length} /></th>
                                    <th className="px-2 py-2 text-left">ID</th>
                                    <th className="px-2 py-2 text-left">Codigo</th>
                                    <th className="px-2 py-2 text-left">Estado</th>
                                    <th className="px-2 py-2 text-left">Descripcion</th>
                                    <th className="px-2 py-2 text-left">Fecha</th>
                                    <th className="px-2 py-2 text-left">Suscriptor</th>
                                    <th className="px-2 py-2 text-center">Imagen</th>
                                    <th className="px-2 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allItems.map((item) => (
                                    <tr key={item.id} className={'border-b hover:bg-gray-50 ' + (seleccionados.includes(item.id) ? 'bg-blue-50' : '')}>
                                        <td className="px-2 py-2"><input type="checkbox" checked={seleccionados.includes(item.id)} onChange={() => toggleSeleccion(item.id)} /></td>
                                        <td className="px-2 py-2 font-mono">{item.id}</td>
                                        <td className="px-2 py-2 font-mono font-semibold">{item.codigo}</td>
                                        <td className="px-2 py-2"><span className={'px-2 py-0.5 rounded-full text-xs ' + getEstadoColor(item.nombre_estado)}>{item.nombre_estado}</span></td>
                                        <td className="px-2 py-2">{item.descripcion || '-'}</td>
                                        <td className="px-2 py-2">{item.fecha_creacion}</td>
                                        <td className="px-2 py-2">{item.suscriptor ? (item.suscriptor.nom1||'')+' '+(item.suscriptor.ape1||'') : '-'}</td>
                                        <td className="px-2 py-2 text-center">{item.urlimg && <a href={item.urlimg} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver</a>}</td>
                                        <td className="px-2 py-2 text-center">
                                            <div className="flex gap-1 justify-center">
                                                {item.id_estado === 1 && <button onClick={() => handleDesactivar(item.id)} className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200">Desactivar</button>}
                                                {item.id_estado === 2 && <button onClick={() => handleActivar(item.id)} className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-600 hover:bg-green-200">Activar</button>}
                                                {item.urlcompartirweb && <button onClick={() => navigator.clipboard.writeText(item.urlcompartirweb)} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Copiar link</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina <= 1} className={'px-3 py-1 text-xs rounded ' + (pagina <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200')}>Anterior</button>
                        <span className="text-xs text-gray-500">Pagina {pagina}</span>
                        <button onClick={() => setPagina(p => p + 1)} disabled={allItems.length < cantidad} className={'px-3 py-1 text-xs rounded ' + (allItems.length < cantidad ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200')}>Siguiente</button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">No hay codigos disponibles</p>
            )}
        </div>
    );
};

export default ListaCodigosPrepago;