import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';

const TablaSuscriptores = ({ suscriptores, handleClickEdit }) => {
    const fActual = new Date();
    const [loadingId,setLoadingId]=useState();

    const handleClickEditar = (id)=>{
        setLoadingId(id)
        listarSuscriptores({idUsuario:id}).then((res)=>{
            handleClickEdit(res)
            setLoadingId()
        })
    }

    return (
        <div className="overflow-x-auto">
            <table className='w-full border-collapse'>
                <thead className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-4 py-4 text-center w-[5%]">#</th>
                        <th className="px-4 py-4 text-center w-[10%]">Acción</th>
                        <th className="px-4 py-4 text-left w-[10%]">Código</th>
                        <th className="px-4 py-4 text-left w-[12%]">Identificación</th>
                        <th className="px-4 py-4 text-left w-[18%]">Nombre Suscriptor</th>
                        <th className="px-4 py-4 text-center w-[15%]">Vigencia (I/F)</th>
                        <th className="px-4 py-4 text-left w-[15%]">Vendedor</th>
                        <th className="px-4 py-4 text-center w-[10%]">Estado</th>
                        <th className="px-4 py-4 text-left w-[5%]">Empresa</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-slate-50'>
                    {
                        suscriptores && suscriptores.map((item, index) => {
                            const estaVencido = (new Date(item.fecha_fin.split(" ")[0])) < fActual;
                            
                            return (
                                <tr 
                                    key={item.id_tbl_usuario} 
                                    className={`group hover:bg-slate-50/80 transition-colors text-[13px] ${estaVencido ? "bg-red-50/30" : ""}`}
                                >
                                    <td className="px-4 py-4 text-center font-medium text-slate-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className='flex justify-center'>
                                            {loadingId === item.id_tbl_usuario ? (
                                                <span className="icon-[eos-icons--loading] h-5 w-5 text-greenVE-600"></span>
                                            ) : (
                                                <button 
                                                    onClick={() => handleClickEditar(item.id_tbl_usuario)}
                                                    className='p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-greenVE-100 hover:text-greenVE-700 transition-all flex items-center justify-center'
                                                    title="Editar registro"
                                                >
                                                    <span className="icon-[material-symbols--edit-square-outline-rounded] text-lg"></span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-left font-bold text-slate-700">
                                        {item.codigo}
                                    </td>
                                    <td className="px-4 py-4 text-left text-slate-600 font-medium">
                                        {item.ci_ruc}
                                    </td>
                                    <td className="px-4 py-4 text-left">
                                        <div className='flex flex-col'>
                                            <span className={`font-bold ${estaVencido ? "text-red-600" : "text-slate-800"}`}>
                                                {item.usuario}
                                            </span>
                                            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-tighter'>Usuario Activo</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center text-slate-500 font-medium">
                                        <div className='flex flex-col gap-0.5'>
                                            <span className='text-xs'>{item.fecha_inicio.split(" ")[0]}</span>
                                            <div className='h-[1px] w-4 bg-slate-200 mx-auto'></div>
                                            <span className={`text-xs font-bold ${estaVencido ? "text-red-500" : "text-green-600"}`}>{item.fecha_fin.split(" ")[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-left text-slate-600 text-[12px]">
                                        {item.vendedor}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                            ${item.estado_pago === 'PAGADO' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                            {item.estado_pago}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-left text-slate-500 font-medium">
                                        {item.nombre}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TablaSuscriptores;