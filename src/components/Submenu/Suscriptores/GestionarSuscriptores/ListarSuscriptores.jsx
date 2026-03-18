import React, { useEffect, useState } from 'react';
import TablaSuscriptores from './TablaSuscriptores';
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';
import ReactPaginate from 'react-paginate';


const ListarSuscriptores = ({ handleClickEdit }) => {
    const [numPaginas, setNumPaginas] = useState();
    const [selPagina, setSelPagina] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [idUsuario, setIdUsuario] = useState();
    const [ciUsuario, setCiUsuario] = useState();
    const [nombreCliente, setNombreCliente] = useState();
    const [idVendedor, setIdVendedor] = useState();
    const [nombreVendedor, setNombreVendedor] = useState();

    const handleUpdateSuscriptores = ({ pagina = 1 }) => {
        setData()
        setLoading(true);
        var filtros = {
            cod_vendedor: idVendedor,
            nombre_vendedor: nombreVendedor,
            ci_cliente: ciUsuario,
            cod_cliente: idUsuario,
            nombre_cliente: nombreCliente
        }

        listarSuscriptores({ pagina: pagina, filtros: filtros }).then((res) => {
            setLoading(false);
            if (res) {
                setData(res.suscripciones);
                setNumPaginas(Math.ceil(parseInt(res.cantidad) / 20));
            }
        });
    };

    useEffect(() => {
        handleUpdateSuscriptores({});
    }, []);

    const handleOnPageChange = (page) => {
        setSelPagina(page.selected);
        handleUpdateSuscriptores({ pagina: page.selected + 1 });
    };

    const handleClickAplicar = () => {
        handleUpdateSuscriptores({});
    }

    return (
        <div className='w-full p-6'>
            <div className='flex flex-col gap-6'>
                {/* Header Sub-diseño */}
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Consulta de Suscriptores</h2>
                        <p className='text-sm text-slate-500 font-medium'>Filtre y gestione la base de afiliados del sistema.</p>
                    </div>
                </div>

                {/* Sección de Filtros */}
                <div className='bg-slate-50 border border-slate-200 rounded-2xl p-6'>
                    <div className='flex items-center gap-2 mb-6'>
                        <span className='icon-[material-symbols--filter-list-rounded] text-greenVE-600 text-xl'></span>
                        <label className='text-xs font-black uppercase tracking-widest text-slate-400'>Parámetros de Búsqueda</label>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>ID Suscripción</label>
                            <input
                                value={idUsuario}
                                onChange={(e) => setIdUsuario(e.target.value)}
                                placeholder='Ingresar ID Suscripción'
                                className='w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Cédula / RUC</label>
                            <input
                                value={ciUsuario}
                                onChange={(e) => setCiUsuario(e.target.value)}
                                placeholder='Ingresar Cédula / RUC'
                                className='w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Cliente</label>
                            <input
                                value={nombreCliente}
                                onChange={(e) => setNombreCliente(e.target.value)}
                                placeholder='Ingresar nombre completo'
                                className='w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>ID Vendedor</label>
                            <input
                                value={idVendedor}
                                onChange={(e) => setIdVendedor(e.target.value)}
                                placeholder='Ingresar ID Vendedor'
                                className='w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[11px] font-bold text-slate-500 ml-3 uppercase'>Vendedor</label>
                            <input
                                value={nombreVendedor}
                                onChange={(e) => setNombreVendedor(e.target.value)}
                                placeholder='Ingresar nombre vendedor'
                                className='w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-greenVE-500 focus:border-greenVE-500 transition-all'
                            />
                        </div>
                    </div>

                    <div className='flex justify-end mt-6'>
                        <button
                            className='bg-greenVE-600 hover:bg-greenVE-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-all shadow-lg shadow-greenVE-100 flex items-center gap-2'
                            onClick={handleClickAplicar}
                        >
                            <span className='icon-[material-symbols--search-rounded] text-lg'></span>
                            Actualizar Resultados
                        </button>
                    </div>
                </div>

                {/* Resultados */}
                <div className='relative'>
                    {loading ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 gap-4'>
                            <span className="icon-[line-md--loading-twotone-loop] w-12 h-12 text-greenVE-600"></span>
                            <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Sincronizando base de datos...</p>
                        </div>
                    ) : (!data || data.length === 0) ? (
                        <div className='w-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200'>
                            <span className='icon-[material-symbols--search-off-rounded] text-4xl text-slate-300 mb-3'></span>
                            <p className='text-sm text-slate-500 font-medium'>No se encontraron registros activos</p>
                        </div>
                    ) : (
                        <div className='flex flex-col w-full gap-4'>
                            <div className='overflow-hidden rounded-2xl border border-slate-100 shadow-sm'>
                                <TablaSuscriptores handleClickEdit={handleClickEdit} suscriptores={data} />
                            </div>

                            <div className='mt-4'>
                                <ReactPaginate
                                    forcePage={selPagina}
                                    breakLabel="..."
                                    nextLabel={<span className='icon-[material-symbols--chevron-right-rounded] text-xl'></span>}
                                    onPageChange={handleOnPageChange}
                                    pageRangeDisplayed={3}
                                    pageCount={numPaginas}
                                    previousLabel={<span className='icon-[material-symbols--chevron-left-rounded] text-xl'></span>}
                                    renderOnZeroPageCount={null}
                                    containerClassName={'flex justify-center items-center gap-2 p-4'}
                                    pageClassName={'flex'}
                                    pageLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition-all hover:bg-greenVE-50 hover:text-greenVE-700 hover:border-greenVE-200'}
                                    previousClassName={'flex'}
                                    previousLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all'}
                                    nextClassName={'flex'}
                                    nextLinkClassName={'w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all'}
                                    breakClassName={'text-slate-300'}
                                    activeClassName={'!bg-greenVE-600 !border-greenVE-600 rounded-xl'}
                                    activeLinkClassName={'!text-white'}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListarSuscriptores;
