import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../../global/utils';
import { getCuentaGratis } from '../../../../controllers/callcenter/CallcenterController';
import TablaCuentasGratis from './ListarCuentasGratis/TablaCuentasGratis';
import Config from '../../../../global/config';
import DescargarGratis from './DescargarGratis';

const ListarCuentasGratis = () => {
    const [fInicio, setFInicio] = useState(formatDate(new Date().setMonth(new Date().getMonth() - 1)));
    const [fFin, setFFin] = useState(formatDate(new Date()))
    const [selPagina, setSelPagina] = useState(0);
    const [loading, setLoading]=useState();
    const [data, setData]=useState();
    const [numPaginas, setNumPaginas] = useState();
    const [cantidad, setCantidad]=useState("20");
    const [total, setTotal]=useState();
    const [nombre, setNombre]=useState();
    const [correo, setCorreo]=useState();
    const [cedula, setCedula]=useState();

    const handleClicAplicar=({filtros=false})=>{
        setData();
        setNumPaginas();
        setTotal();
        if(filtros){
            setSelPagina(0)
        }
        setLoading(true);
        const filtro={
            pagina:filtros?1:(selPagina+1),
            fechas:{
                inicio: fInicio,
                fin: fFin
            },
            nombre: nombre,
            correo: correo,
            ci:cedula,
            cantidad:cantidad!="1"?cantidad:""
        };

        getCuentaGratis(filtro).then((res)=>{
            setLoading(false);
            if(res){
                setData(res.listado);
                setNumPaginas(cantidad=="1"?1:Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(parseInt(res.cantidad))
            }
        });

    }

    useEffect(()=>{
        setData();
        handleClicAplicar({});
    }, [selPagina])

    const handleOnPageChange = (newPage) => {
        setSelPagina(newPage);
    };

    const handleUpdateData = (index, item) => {
        console.log(index, item)
        setData(prevData =>
            prevData.map((cuenta) =>
                cuenta.id_tbl_usuario === index ? { ...cuenta, callcenter: item } : cuenta
            )
        );
    };

    return (
        <div className='flex-1 p-4 w-full relative'>
            {/* Filtros inline */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                {/* Filtro de fechas */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 shrink-0">Fecha:</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fInicio}
                        onChange={e => setFInicio(e.target.value)}
                        title="Desde"
                    />
                    <span className="text-gray-300 text-xs">—</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fFin}
                        onChange={e => setFFin(e.target.value)}
                        title="Hasta"
                    />
                </div>

                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Nombres"
                    value={nombre || ''}
                    onChange={e => setNombre(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Cédula"
                    value={cedula || ''}
                    onChange={e => setCedula(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Correo electrónico"
                    value={correo || ''}
                    onChange={e => setCorreo(e.target.value)}
                />

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={cantidad}
                    onChange={(event) => setCantidad(event.target.value)}
                >
                    {Config.ELEMENTOSHOJAS.map((item) => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))}
                </select>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                    onClick={() => handleClicAplicar({filtros:true})}
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Aplicar'}
                </button>

                <DescargarGratis params={{
                    fechas:{ inicio: fInicio, fin: fFin },
                    nombre: nombre,
                    correo: correo,
                    ci:cedula,
                }}/>
            </div>

            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {total != null && (
                    <div className="flex items-center justify-between px-4 py-2.5 border-b bg-gray-50">
                        <div className="text-xs text-gray-500">
                            Total: <strong className="text-gray-800">{total}</strong> resultado{total !== 1 ? 's' : ''}
                        </div>
                        <span className="text-xs text-gray-400">Página {selPagina + 1}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando...</span>
                    </div>
                ) : (!loading && !data) ? (
                    <p className="text-center text-xs text-gray-400 py-10">Sin resultados disponibles</p>
                ) : (
                    <TablaCuentasGratis listado={data} handleUpdateData={handleUpdateData}/>
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

export default ListarCuentasGratis;
