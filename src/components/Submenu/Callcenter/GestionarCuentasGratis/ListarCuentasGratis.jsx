import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../../global/utils';
import { getCuentaGratis } from '../../../../controllers/callcenter/CallcenterController';
import TablaCuentasGratis from './ListarCuentasGratis/TablaCuentasGratis';
import ReactPaginate from 'react-paginate';
import Config from '../../../../global/config';
import DescargarGratis from './DescargarGratis';
import { get } from 'react-hook-form';

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

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected); // Cambiar el estado de la página seleccionada
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
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center mb-2'>
                    <label className='text-greenVE-700 text-xl border-0'>Cuentas Gratis</label>
                    <DescargarGratis params={{
                        fechas:{
                            inicio: fInicio,
                            fin: fFin
                        },
                        nombre: nombre,
                        correo: correo,
                        ci:cedula,
                    }}/>
                </div>
                <div className='bg-greenVE-400 p-2  flex flex-col '>
                    <div>
                        <div className='flex gap-2'>
                            <div className='w-2/12 ml-2'>
                                <label className='text-sm text-greenVE-950 '>Desde:</label>
                            </div>
                            <div className='w-2/12'>
                                <label className='text-sm text-greenVE-950 '>Hasta:</label>
                            </div>
                            {
                                total&&
                                <div className='w-[64.5%] flex items-center justify-end'>
                                    <label className='text-base font-semibold text-greenVE-500 text-pretty bg-white rounded-md px-2'>Total: {total}</label>
                                </div>
                            }
                        </div>
                        <div className='flex gap-2 my-2'>
                            <input value={fInicio} type='date' className='text-xs px-1 py-1  mb-2 w-2/12 text-center ' onChange={(event) => { setFInicio(event.target.value) }}></input>
                            <input value={fFin} type='date' className='text-xs px-1 py-1  mb-2 w-2/12 text-center ' onChange={(event) => { setFFin(event.target.value) }}></input>
                            <input value={nombre} placeholder='Nombres' type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center ' onChange={(event) => { setNombre(event.target.value) }}></input>
                            <input value={cedula} placeholder='Cédula' type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center ' onChange={(event) => { setCedula(event.target.value) }}></input>
                            <div className="flex gap-1">
                                <select className='p-0 text-xs h-7  px-2' value={cantidad} onChange={(event)=>setCantidad(event.target.value)}>
                                    {
                                        Config.ELEMENTOSHOJAS.map((item)=>(
                                            <option value={item.id}>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                                <button className='bg-greenVE-200 border-2 border-greenVE-600 px-4  h-7' onClick={() => handleClicAplicar({filtros:true})}>Aplicar</button>
                            </div>
                        </div>
                        <div className='flex gap-2 my-2'>
                            <input value={correo} placeholder='Correo electrónico' type='text' className='text-xs px-1 py-1  mb-2 w-2/12 text-center ' onChange={(event) => { setCorreo(event.target.value) }}></input>
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
                            : <div className="relative overflow-x-auto shadow-md  ">
                                <TablaCuentasGratis listado={data} handleUpdateData={handleUpdateData}/>
                                {<ReactPaginate
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
                                />}
                            </div>
                }
            </div>
        </div>
    );
};

export default ListarCuentasGratis;
