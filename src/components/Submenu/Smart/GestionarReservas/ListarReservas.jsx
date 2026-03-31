import { Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import TablaReservas from './ListarReserva/TablaReservas';
import { listarGestoresReservas, listarReservas, listarReservasFiltro } from '../../../../controllers/smart/SmartController';
import Config from '../../../../global/config';
import { formatDate, verificarPermiso } from '../../../../global/utils';
import ReactPaginate from 'react-paginate';
import DescargarReservas from './DescargarReservas';


const ListarReservas = ({ handleClickEdit }) => {
    const [change, setChange] = useState();
    const [data, setData] = useState();
    const [numPaginas, setNumPaginas] = useState();
    const [total, setTotal]=useState();
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
    const [ciRuc, setCiRuc] = useState();
    const [loading, setLoading] = useState();
    const [cantidad, setCantidad]=useState("20");
    const handleSetChange = () => {
        setChange(prev => prev + 1);
    };

    useEffect(() => {
        setLoading(true);
        listarReservas({}).then((res) => {
            setLoading(false)
            if (res && res.reservas) {
                setData(res.reservas)
                setNumPaginas(cantidad=="1"?1:Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
            }
        });
        if (verificarPermiso(87)) {
            listarGestoresReservas({}).then((res) => {
                if (res) {
                    setGestores(res)
                    console.log(res)
                }
            });
        }
    }, []);

    const handleClicAplicar = ({ pagina = 1, aplicar = true }) => {
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
            ciRuc: ciRuc,
            cantidad:cantidad!="1"?cantidad:""
        };
        listarReservasFiltro(params, false).then((res) => {
            setLoading(false);
            if (res && res.reservas) {
                setData(res.reservas);
                setNumPaginas(cantidad=="1"?1:Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
                if (aplicar) {
                    console.log("resetear");
                    setSelPagina(0);
                }
            }
        });
    };

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected); // Cambiar el estado de la página seleccionada
        handleClicAplicar({ aplicar: false, pagina: page.selected + 1 });
    };



    return (
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center mb-2'>
                    <label className='text-greenVE-700 text-xl border-0'>Listar reservas</label>
                    <DescargarReservas params={{
                        id_tbl_usuario: parseInt(selGestor),
                        id_tbl_estado_reserva: parseInt(selEstado),
                        tipoPago: selPago,
                        fechas: {
                            inicio: fInicio,
                            fin: fFin
                        },
                        codCliente: idSuscriptor,
                        nomEstablecimiento: nomEstablecimiento,
                        nroReserva: idReserva,
                        ciRuc: ciRuc,
                    }} />
                </div>
                <div className='bg-greenVE-400 p-2 rounded-t-md flex flex-col '>
                    <div>
                        <div className='flex gap-2'>
                            <div className='w-4/12'>
                                <label className='text-sm text-greenVE-800 '>Filtrar por:</label>
                            </div>
                            <div className='w-2/12 ml-2'>
                                <label className='text-sm text-greenVE-800 '>Desde:</label>
                            </div>
                            <div className='w-2/12'>
                                <label className='text-sm text-greenVE-800 '>Hasta:</label>
                            </div>
                            {
                                total&&
                                <div className='w-[30%] flex items-center justify-end'>
                                    <label className='text-base font-semibold text-greenVE-500 text-pretty bg-white rounded-md px-2'>Total: {total}</label>
                                </div>
                            }
                        </div>
                        <div className='flex gap-2 my-2'>
                            {verificarPermiso(87) &&
                                <select className='w-2/12 rounded-full h-7 py-0 text-xs capitalize' value={selGestor} onChange={(event) => setSelGestor(event.target.value)}>
                                    <option value="-2" disabled selected>Gestor de reserva</option>
                                    <option value="-1">Todos los gestores</option>
                                    {gestores && gestores.map((item, index) => (
                                        <option key={index} value={item.id_tbl_usuario}>{item.nombre}</option>
                                    ))}
                                </select>
                            }
                            <select className='w-2/12 rounded-full h-7 py-0 text-xs' value={selEstado} onChange={(event) => setSelEstado(event.target.value)}>
                                <option value="-2" disabled selected>Estado de reserva</option>
                                <option value="-1">Todos los estados</option>
                                {Config.ESTADOS.map((item, index) => (
                                    <option key={index} value={item.id}>{`${item.nombre} `}</option>
                                ))}
                            </select>
                            <input value={fInicio} type='date' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setFInicio(event.target.value) }}></input>
                            <input value={fFin} type='date' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setFFin(event.target.value) }}></input>
                            <div className="flex gap-1">
                                <select className='p-0 text-xs h-7 rounded-full px-2' value={cantidad} onChange={(event)=>setCantidad(event.target.value)}>
                                    {
                                        Config.ELEMENTOSHOJAS.map((item)=>(
                                            <option value={item.id}>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                                <button className='bg-greenVE-200 border-2 border-greenVE-600 px-4 rounded-full h-7' onClick={() => handleClicAplicar({filtros:true})}>Aplicar</button>
                            </div>
                        </div>
                        <div className='flex gap-2 my-2'>
                            <input placeholder='Id Suscriptor' value={idSuscriptor} type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setIdSuscriptor(event.target.value) }}></input>
                            <input placeholder='Establecimiento' value={nomEstablecimiento} type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setNomEstablecimiento(event.target.value) }}></input>
                            <input placeholder='Id Reserva' value={idReserva} type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setIdReserva(event.target.value) }}></input>
                            <input placeholder='Cédula / RUC' value={ciRuc} type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center rounded-full' onChange={(event) => { setCiRuc(event.target.value) }}></input>
                            <select className='w-2/12 rounded-full h-7 py-0 text-xs' value={selPago} onChange={(event) => setSelPago(event.target.value)}>
                                <option value="-3" disabled selected>Tipo de pago</option>
                                <option value="-2">Todos los tipos</option>
                                {Config.PAGOS.map((item, index) => (
                                    <option key={index} value={item.id}>{`${item.nombre} `}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {
                    loading
                        ? <div className='w-full flex items-center justify-center mt-5'>
                            <span className="icon-[line-md--loading-twotone-loop] w-10 h-10 text-greenVE-600"></span>
                        </div>
                        : (!loading && !data)
                            ? <div className='w-full flex items-center justify-center mt-5'>
                                <label>Sin resultados disponibles</label>
                            </div>
                            : <div className="relative overflow-x-auto shadow-md rounded-b-lg ">
                                <TablaReservas handleClickEdit={handleClickEdit} reservas={data} />
                                <ReactPaginate
                                    forcePage={selPagina}
                                    breakLabel="..."
                                    nextLabel="Siguiente"
                                    onPageChange={handleOnPageChange}
                                    pageRangeDisplayed={5}
                                    pageCount={numPaginas}
                                    previousLabel="Anterior"
                                    renderOnZeroPageCount={null}
                                    containerClassName={'flex justify-center p-4'}
                                    pageClassName={'mx-1'}
                                    pageLinkClassName={'px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100'}
                                    previousClassName={'mx-1'}
                                    previousLinkClassName={'px-3 py-1  border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100'}
                                    nextClassName={'mx-1'}
                                    nextLinkClassName={'px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100'}
                                    breakClassName={'mx-1'}
                                    breakLinkClassName={'px-3 py-1 border border-gray-300 text-greenVE-600 rounded cursor-pointer transition duration-200 hover:bg-greenVE-100'}
                                    activeClassName={'bg-greenVE-300 rounded py-1 -mt-1'}
                                />
                            </div>
                }
            </div>
        </div>
    );
};

export default ListarReservas;