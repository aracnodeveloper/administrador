import React, { useEffect, useState } from 'react';
import TablaSuscriptores from './TablaSuscriptores';
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';
import ReactPaginate from 'react-paginate';

const ListarSuscriptores = ({handleClickEdit}) => {
    const [numPaginas, setNumPaginas]=useState();
    const [selPagina, setSelPagina] = useState(0);
    const [loading, setLoading]=useState(false);
    const [data,setData]=useState();
    const [idUsuario, setIdUsuario]=useState();
    const [ciUsuario, setCiUsuario]=useState();
    const [nombreCliente, setNombreCliente]=useState();
    const [idVendedor, setIdVendedor]=useState();
    const [nombreVendedor, setNombreVendedor]=useState();
    const handleUpdateSuscriptores = ({pagina=1}) => {
        setData()
        setLoading(true);
        var filtros={
            cod_vendedor:idVendedor,
            nombre_vendedor:nombreVendedor,
            ci_cliente:ciUsuario,
            cod_cliente: idUsuario,
            nombre_cliente: nombreCliente
        }

        listarSuscriptores({pagina:pagina,filtros:filtros}).then((res) => {
            setLoading(false);
            if (res) {
                setData(res.suscripciones);
                setNumPaginas(Math.ceil(parseInt(res.cantidad) / 20));
            }
        });
    };

    useEffect(()=>{
        handleUpdateSuscriptores({});
    }, []);

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected); 
        handleUpdateSuscriptores({pagina: page.selected + 1 });
    };

    const handleClickAplicar=()=>{
        handleUpdateSuscriptores({});
    }

    return (
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center'>
                    <label className='text-greenVE-700 text-xl border-0'>Listar suscriptores</label>
                </div>
                <div className='bg-greenVE-400 p-2 rounded-t-md flex flex-col '>
                    <div>
                        <div className='flex gap-2'>
                            <div className='w-4/12'>
                                <label className='text-sm text-greenVE-800 '>Filtrar por:</label>
                            </div>
                        </div>
                        <div className='flex gap-2 my-2'>
                            <input value={idUsuario} onChange={(event)=>{setIdUsuario(event.target.value)}} placeholder='Id suscripción' className='w-2/12 h-7 rounded-full'></input>
                            <input value={ciUsuario} onChange={(event)=>{setCiUsuario(event.target.value)}} placeholder='Cédula' className='w-2/12 h-7 rounded-full'></input>
                            <input value={nombreCliente} onChange={(event)=>{setNombreCliente(event.target.value)}} placeholder='Nombre cliente' className='w-2/12 h-7 rounded-full'></input>
                            <input value={idVendedor} onChange={(event)=>{setIdVendedor(event.target.value)}} placeholder='Id Vendedor' className='w-2/12 h-7 rounded-full'></input>
                            <input value={nombreVendedor} onChange={(event)=>{setNombreVendedor(event.target.value)}} placeholder='Nombre vendedor' className='w-2/12 h-7 rounded-full'></input>
                            <button className='bg-greenVE-200 border-2 border-greenVE-600 px-4 rounded-full h-7' onClick={() => {handleClickAplicar()}}>Aplicar</button>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        loading
                        ?<div className='w-full flex items-center justify-center mt-5'>
                            <span className="icon-[line-md--loading-twotone-loop] w-10 h-10 text-greenVE-600"></span>
                        </div>
                        :(!loading&&!data)
                        ?<div className='w-full flex items-center justify-center mt-5'>
                           <label>Sin resultados disponibles</label>
                        </div>
                        :<div className='flex flex-col w-full'>
                            <TablaSuscriptores handleClickEdit={handleClickEdit} suscriptores={data}/>
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
        </div>
    );
};

export default ListarSuscriptores;