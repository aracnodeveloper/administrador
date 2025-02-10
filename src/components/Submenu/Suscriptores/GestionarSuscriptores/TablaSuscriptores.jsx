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
        <table className='w-full'>
            <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 w-full">
                <tr className='flex  justify-between '>
                    <th scope="col" className="flex justify-center items-center w-[5%]">#</th>
                    <th scope="col" className="flex justify-center items-center w-[5%]">Opciones</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">ID</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Cedula</th>
                    <th scope="col" className="flex justify-center items-center w-[15%]">Nombres</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Inicio / Fin</th>
                    <th scope="col" className="flex justify-center items-center w-[15%]">Patrocinador</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Pago</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Empresa</th>
                </tr>
            </thead>
            <tbody>
                {
                    suscriptores && suscriptores.map((item, index) => (
                        <tr className={`odd:bg-white even:bg-gray-50 text-[12px] flex justify-between border-y ${((new Date(item.fecha_fin.split(" ")[0])) < fActual) ? "text-red-500" : ""}`} key={item.id_tbl_usuario} >
                            <td className="flex justify-center items-center w-[5%] text-center">{index + 1}</td>
                            <td className="flex justify-center items-center text-center w-[5%] gap-2">
                                <Tooltip className='bg-gray-700 text-[10px] py-1' content="Editar Reserva" arrow={false}>
                                    {
                                        loadingId==item.id_tbl_usuario
                                        ?<span className="icon-[eos-icons--loading] h-5 w-5"></span>
                                        :<span className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600  cursor-pointer text-gray-500" onClick={()=>handleClickEditar(item.id_tbl_usuario)}></span>
                                    }
                                </Tooltip>

                            </td>
                            <td className="flex justify-center items-center w-[10%] text-center">{item.codigo}</td>
                            <td className="flex justify-center items-center w-[10%] text-center py-1">{item.ci_ruc}</td>
                            <td className="flex justify-center items-center w-[15%] text-center py-1 ">{item.usuario}</td>
                            <td className="flex justify-center items-center w-[10%] text-center py-1">{`${item.fecha_inicio.split(" ")[0]} / ${item.fecha_fin.split(" ")[0]}`}</td>
                            <td className="flex justify-center items-center w-[15%] text-center py-1">{item.vendedor}</td>
                            <td className="flex justify-center items-center w-[10%] text-center py-1">{item.estado_pago}</td>
                            <td className="flex justify-center items-center w-[10%] text-center py-1">{item.nombre}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default TablaSuscriptores;