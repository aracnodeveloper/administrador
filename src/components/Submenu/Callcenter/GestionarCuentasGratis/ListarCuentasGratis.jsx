import React, { useEffect, useState } from 'react';
import { Datepicker } from 'flowbite-react';
import { formatDate } from '../../../../global/utils';
import { getCuentaGratis } from '../../../../controllers/callcenter/CallcenterController';
import TablaCuentasGratis from './ListarCuentasGratis/TablaCuentasGratis';
import ReactPaginate from 'react-paginate';
import Config from '../../../../global/config';
import DescargarGratis from './DescargarGratis';

const ListarCuentasGratis = () => {
    const [fInicio, setFInicio] = useState(formatDate(new Date().setMonth(new Date().getMonth() - 1)));
    const [fFin, setFFin] = useState(formatDate(new Date()))
    const [selPagina, setSelPagina] = useState(0);
    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const [numPaginas, setNumPaginas] = useState();
    const [cantidad, setCantidad] = useState("20");
    const [total, setTotal] = useState();
    const [nombre, setNombre] = useState();
    const [correo, setCorreo] = useState();
    const [cedula, setCedula] = useState();

    const handleClicAplicar = ({ filtros = false }) => {
        setData();
        setNumPaginas();
        setTotal();
        if (filtros) {
            setSelPagina(0)
        }
        setLoading(true);
        const filtro = {
            pagina: filtros ? 1 : (selPagina + 1),
            fechas: {
                inicio: fInicio,
                fin: fFin
            },
            nombre: nombre,
            correo: correo,
            ci: cedula,
            cantidad: cantidad != "1" ? cantidad : ""
        };

        getCuentaGratis(filtro).then((res) => {
            setLoading(false);
            if (res) {
                setData(res.listado);
                setNumPaginas(cantidad == "1" ? 1 : Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(parseInt(res.cantidad))
            }
        });

    }

    useEffect(() => {
        setData();
        handleClicAplicar({});
    }, [selPagina])

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected);
    };

    const handleUpdateData = (index, item) => {
        setData(prevData =>
            prevData.map((cuenta) =>
                cuenta.id_tbl_usuario === index ? { ...cuenta, callcenter: item } : cuenta
            )
        );
    };

    return (
        <div className='w-full p-6'>
            <div className='flex flex-col gap-6'>
                {/* Header  */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Cuentas Gratuitas</h2>
                        <p className='text-sm text-slate-500 font-medium'>Gestión y seguimiento de prospectos comerciales.</p>
                    </div>
                    <div className='hover:scale-105 transition-transform'>
                        <DescargarGratis params={{
                            fechas: { inicio: fInicio, fin: fFin },
                            nombre: nombre,
                            correo: correo,
                            ci: cedula,
                        }} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    {/* Filtros Limpios */}
                    <div className='bg-slate-50 border border-slate-200 rounded-t-2xl p-6'>
                        <div className='flex items-center gap-2 mb-3'>
                            <span className='icon-[material-symbols--filter-list-rounded] text-greenVE-600 text-xl'></span>
                            <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Parámetros de Búsqueda</label>
                        </div>
    
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Desde</label>
                                <div className='relative'>
                                    <input
                                        type='date'
                                        value={fInicio}
                                        onChange={(event) => setFInicio(event.target.value)}
                                        className='w-full h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-greenVE-500 focus:border-greenVE-500 transition-all outline-none cursor-pointer'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Hasta</label>
                                <div className='relative'>
                                    <input
                                        type='date'
                                        value={fFin}
                                        onChange={(event) => setFFin(event.target.value)}
                                        className='w-full h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-greenVE-500 focus:border-greenVE-500 transition-all outline-none cursor-pointer'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Nombres</label>
                                <input value={nombre} placeholder='Ingresar nombre' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setNombre(event.target.value) }} />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Identificación</label>
                                <input value={cedula} placeholder='Ingresar identificación' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setCedula(event.target.value) }} />
                            </div>
                        </div>
    
                        <div className='flex flex-col lg:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-100'>
                            <div className='flex flex-col gap-1.5 w-full lg:w-1/3'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Correo Electrónico</label>
                                <input value={correo} placeholder='Ingresar correo electrónico' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setCorreo(event.target.value) }} />
                            </div>
    
                            <div className='flex gap-2 w-full lg:w-auto mt-auto'>
                                <select className='h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 focus:ring-greenVE-500' value={cantidad} onChange={(event) => setCantidad(event.target.value)}>
                                    {Config.ELEMENTOSHOJAS.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre} pág.</option>
                                    ))}
                                </select>
                                <button
                                    className='flex-grow bg-[#8b9531] hover:bg-[#7a832a] text-white font-bold text-xs uppercase tracking-widest px-8 h-10 rounded-xl transition-all flex items-center justify-center gap-2'
                                    onClick={() => handleClicAplicar({ filtros: true })}
                                >
                                    <span className='icon-[material-symbols--search-rounded] text-lg'></span>
                                    Actualizar Resultados
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* Área de Resultados */}
                    <div className='relative border-x border-b border-slate-200 rounded-b-2xl bg-white'>
                    {loading ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 gap-4'>
                            <span className="icon-[line-md--loading-twotone-loop] w-12 h-12 text-greenVE-600"></span>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Sincronizando base de datos...</p>
                        </div>
                    ) : (!data || data.length === 0) ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-b-2xl border-t border-dashed border-slate-200'>
                            <span className='icon-[material-symbols--search-off-rounded] text-4xl text-slate-300 mb-3'></span>
                            <p className='text-sm text-slate-500 font-medium'>No hay prospectos registrados</p>
                        </div>
                    ) : (
                        <div className='flex flex-col w-full'>
                                {total && (
                                    <div className='flex justify-end p-6'>
                                        <div className='flex items-center gap-2 bg-[#fdfde1] text-[#8b9531] border border-[#f8f8d0] px-4 py-1.5 rounded-full shadow-sm'>
                                            <span className='text-[10px] font-black uppercase tracking-widest'>Total: {total} Registros</span>
                                        </div>
                                    </div>
                                )}
                            <div className='border-t border-slate-100'>
                                <TablaCuentasGratis listado={data} handleUpdateData={handleUpdateData} />
                            </div>
                            
                            <div className='bg-slate-50/30 border-t border-slate-100 mt-auto'>
                                <ReactPaginate
                                    forcePage={selPagina}
                                    breakLabel="..."
                                    nextLabel={<span className='icon-[material-symbols--chevron-right-rounded] text-xl'></span>}
                                    onPageChange={handleOnPageChange}
                                    pageRangeDisplayed={3}
                                    pageCount={numPaginas}
                                    previousLabel={<span className='icon-[material-symbols--chevron-left-rounded] text-xl'></span>}
                                    containerClassName={'flex justify-center items-center gap-2 p-4'}
                                    pageClassName={'flex'}
                                    pageLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all hover:bg-greenVE-50 hover:text-greenVE-700 hover:border-greenVE-200'}
                                    previousClassName={'flex'}
                                    previousLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all'}
                                    nextClassName={'flex'}
                                    nextLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all'}
                                    breakClassName={'text-slate-300'}
                                    activeClassName={'!bg-greenVE-600 !border-greenVE-600 rounded-xl shadow-md shadow-greenVE-100'}
                                    activeLinkClassName={'!text-white'}
                                />
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarCuentasGratis;
