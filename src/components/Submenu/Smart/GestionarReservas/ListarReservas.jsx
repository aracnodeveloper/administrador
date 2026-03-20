import { Datepicker, Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import TablaReservas from './ListarReserva/TablaReservas';
import { listarGestoresReservas, listarReservas, listarReservasFiltro } from '../../../../controllers/smart/SmartController';
import Config from '../../../../global/config';
import { formatDate, verificarPermiso } from '../../../../global/utils';
import ReactPaginate from 'react-paginate';
import DescargarReservas from './DescargarReservas';

const ListarReservas = ({ handleClickEdit }) => {
    const [data, setData] = useState();
    const [numPaginas, setNumPaginas] = useState();
    const [total, setTotal] = useState();
    const [selPagina, setSelPagina] = useState(0);
    const [gestores, setGestores] = useState();
    const [selGestor, setSelGestor] = useState("-2");
    const [selEstado, setSelEstado] = useState("-2");
    const [selPago, setSelPago] = useState("-3");
    const [fInicio, setFInicio] = useState(formatDate(new Date().setMonth(new Date().getMonth() - 1)));
    const [fFin, setFFin] = useState(formatDate(new Date()))
    const [idSuscriptor, setIdSuscriptor] = useState();
    const [nomEstablecimiento, setNomEstablecimiento] = useState();
    const [idReserva, setIdReserva] = useState();
    const [loading, setLoading] = useState();
    const [cantidad, setCantidad] = useState("20");

    useEffect(() => {
        setLoading(true);
        listarReservas({}).then((res) => {
            setLoading(false)
            if (res && res.reservas) {
                setData(res.reservas)
                setNumPaginas(cantidad == "1" ? 1 : Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
            }
        });
        if (verificarPermiso(87)) {
            listarGestoresReservas({}).then((res) => {
                if (res) {
                    setGestores(res)
                }
            });
        }
    }, []);

    const handleClicAplicar = ({ pagina = 1, aplicar = true, filtros = false }) => {
        setData();
        setLoading(true);
        const params = {
            id_tbl_usuario: parseInt(selGestor),
            id_tbl_estado_reserva: parseInt(selEstado),
            tipoPago: selPago,
            pagina: pagina,
            fechas: {
                inicio: fInicio,
                fin: fFin
            },
            codCliente: idSuscriptor,
            nomEstablecimiento: nomEstablecimiento,
            nroReserva: idReserva,
            cantidad: cantidad != "1" ? cantidad : ""
        };
        listarReservasFiltro(params, false).then((res) => {
            setLoading(false);
            if (res && res.reservas) {
                setData(res.reservas);
                setNumPaginas(cantidad == "1" ? 1 : Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
                if (aplicar || filtros) {
                    setSelPagina(0);
                }
            }
        });
    };

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected);
        handleClicAplicar({ aplicar: false, pagina: page.selected + 1 });
    };

    return (
        <div className='w-full p-6'>
            <div className='flex flex-col gap-4'>
                {/* Header  */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Consulta de Reservas</h2>
                        <p className='text-sm text-slate-500 font-medium'>Gestione y filtre el historial de reservas activas.</p>
                    </div>
                    <div className='hover:scale-105 transition-transform'>
                        <DescargarReservas params={{
                            id_tbl_usuario: parseInt(selGestor),
                            id_tbl_estado_reserva: parseInt(selEstado),
                            tipoPago: selPago,
                            fechas: { inicio: fInicio, fin: fFin },
                            codCliente: idSuscriptor,
                            nomEstablecimiento: nomEstablecimiento,
                            nroReserva: idReserva,
                        }} />
                    </div>
                </div>

                <div className='flex flex-col'>
                    {/* Parámetros de Búsqueda */}
                    <div className='bg-slate-50 border border-slate-200 rounded-t-2xl p-4'>
                        <div className='flex items-center gap-2 mb-3'>
                            <span className='icon-[material-symbols--filter-list-rounded] text-greenVE-600 text-xl'></span>
                            <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Criterios de búsqueda</label>
                        </div>
    
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>ID Suscriptor</label>
                                <input value={idSuscriptor} placeholder='Ingresar ID Suscriptor' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setIdSuscriptor(event.target.value) }} />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Establecimiento</label>
                                <input value={nomEstablecimiento} placeholder='Ingresar nombre establecimiento' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setNomEstablecimiento(event.target.value) }} />
                            </div>
                        </div>
    
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Gestor de reserva</label>
                                <select className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' value={selGestor} onChange={(event) => setSelGestor(event.target.value)}>
                                    <option value="-2" disabled>Seleccionar gestor</option>
                                    <option value="-1">Todos los gestores</option>
                                    {gestores && gestores.map((item, index) => (
                                        <option key={index} value={item.id_tbl_usuario}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Estado de reserva</label>
                                <select className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' value={selEstado} onChange={(event) => setSelEstado(event.target.value)}>
                                    <option value="-2" disabled>Seleccionar estado</option>
                                    <option value="-1">Todos los estados</option>
                                    {Config.ESTADOS.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>ID Reserva</label>
                                <input value={idReserva} placeholder='Ingresar ID Reserva' type='text' className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' onChange={(event) => { setIdReserva(event.target.value) }} />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Tipo de pago</label>
                                <select className='w-full h-10 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all' value={selPago} onChange={(event) => setSelPago(event.target.value)}>
                                    <option value="-3" disabled>Seleccionar pago</option>
                                    <option value="-2">Todos los tipos</option>
                                    {Config.PAGOS.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end items-center gap-4 mt-6 pt-4 border-t border-slate-100'>
                            <div className='flex gap-2'>
                                <select className='h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 focus:ring-greenVE-500' value={cantidad} onChange={(event) => setCantidad(event.target.value)}>
                                    {Config.ELEMENTOSHOJAS.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nombre} pág.</option>
                                    ))}
                                </select>
                                <button
                                    className='bg-greenVE-600 hover:bg-greenVE-700 text-white font-bold text-xs uppercase tracking-widest px-8 h-10 rounded-xl transition-all shadow-lg shadow-greenVE-100 flex items-center justify-center gap-2'
                                    onClick={() => handleClicAplicar({ filtros: true })}
                                >
                                    <span className='icon-[material-symbols--search-rounded] text-lg'></span>
                                    Actualizar Resultados
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* Listado de Resultados */}
                    <div className='relative border-x border-b border-slate-200 rounded-b-2xl bg-white'>
                        {total && (
                            <div className='flex justify-end p-4'>
                                <div className='flex items-center gap-2 bg-[#fdfde1] text-[#8b9531] border border-[#f8f8d0] px-4 py-1.5 rounded-full shadow-sm'>
                                    <span className='text-[10px] font-black uppercase tracking-widest'>Total: {total} Registros</span>
                                </div>
                            </div>
                        )}
                    {loading ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 gap-4'>
                            <span className="icon-[line-md--loading-twotone-loop] w-12 h-12 text-greenVE-600"></span>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Cargando registros...</p>
                        </div>
                    ) : (!data || data.length === 0) ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-b-2xl border-t border-dashed border-slate-200'>
                            <span className='icon-[material-symbols--search-off-rounded] text-4xl text-slate-300 mb-3'></span>
                            <p className='text-sm text-slate-500 font-medium'>No hay reservas registradas</p>
                        </div>
                    ) : (
                        <div className='flex flex-col w-full'>
                            <div className='border-slate-100'>
                                <TablaReservas handleClickEdit={handleClickEdit} reservas={data} />
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

export default ListarReservas;
