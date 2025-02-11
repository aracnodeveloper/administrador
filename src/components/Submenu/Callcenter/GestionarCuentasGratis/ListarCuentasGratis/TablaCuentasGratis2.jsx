    import React, { useState } from 'react';
import { verificarPermiso } from '../../../../../global/utils';
import Config from '../../../../../global/config';

const TablaCuentasGratis = ({listado}) => {
    const [loadingId, setLoadingId] = useState();
    const [editId, setEditId]=useState(0);
    return (
        <table className='w-full'>
            <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 w-full">
                <tr className='flex  justify-between '>
                    <th scope="col" className="flex justify-center items-center w-[2%]">#</th>
                    <th scope="col" className="flex justify-center items-center w-[7%]">Opc.</th>
                    <th scope="col" className="flex justify-center items-center w-[22%]">Nombre</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Cédula</th>
                    <th scope="col" className="flex justify-center items-center w-[22%]">Correo</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Teléfono</th>
                    <th scope="col" className="flex justify-center items-center w-[8%]">Fecha</th>
                    <th scope="col" className="flex justify-center items-center w-[12%]">Llamada</th>
                    <th scope="col" className="flex justify-center items-center w-[7%]">Venta</th>
                </tr>
            </thead>
            <tbody>
            {
                    listado && listado.map((item, index) => (
                        <tr className="odd:bg-white even:bg-gray-50 text-[12px] flex justify-between border-y" key={item.id_tbl_usuario} >
                            <td className="flex justify-center items-center w-[2%] text-center">{index + 1}</td>
                            <td className="flex justify-center items-center text-center w-[7%] gap-2">
                                {
                                    loadingId == item.id_tbl_usuario
                                        ? <span className="icon-[line-md--loading-twotone-loop] h-5 w-5"></span>
                                        : editId==item.id_tbl_usuario
                                        ?<div title='Editar reserva' onClick={()=>setEditId()}><a className="icon-[lucide--save] w-5 h-5 hover:bg-greenVE-600 cursor-pointer text-gray-500"/></div>
                                        :<div title='Editar reserva' onClick={()=>setEditId(item.id_tbl_usuario)}><a className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500"/></div>
                                }   
                                <span className="icon-[icon-park-outline--info] h-5 w-5 hover:bg-blue-600 cursor-pointer text-gray-500"></span>
                            </td>
                            <td className="flex justify-center items-center w-[22%] text-center py-1 capitalize">{item.nombre.toLowerCase()}</td>
                            <td className="flex justify-center items-center w-[10%] text-center py-1 capitalize">{item.ci}</td>
                            <td className="flex justify-center items-center w-[22%] text-center py-1"><label className='w-full overflow-hidden overflow-ellipsis'>{item.mail}</label></td>
                            <td className="flex flex-col justify-center items-center w-[10%] text-center py-1 " >
                                {
                                    item.telefono.split(",").map((element) => (
                                        <a className='hover:text-blue-500 hover:underline' href={`tel:${element.replaceAll(" ","")}`}>{element.replaceAll(" ","")}</a>
                                    ))
                                }
                            </td>
                            <td className="flex justify-center items-center w-[8%] text-center py-1">{item.fecha.split(" ")[0]}</td>
                            <td className="flex justify-center items-center w-[12%] text-center py-1">
                                {
                                    editId==item.id_tbl_usuario
                                    ?<select className='text-xs p-0 pl-1 mx-1'>
                                        {
                                            Config.LLAMADA.map((item2)=>(
                                                <option value={item2.id}>{item2.nombre}</option>
                                            ))
                                        }
                                    </select>
                                    :<label>Sin llamar</label>
                                }
                            </td>
                            <td className="flex justify-center items-center w-[7%] text-center py-1">
                                {
                                    editId==item.id_tbl_usuario
                                    ?<select className='text-xs p-0 pl-1 mx-1'>
                                    {
                                        Config.VENTA.map((item3)=>(
                                            <option value={item3.id}>{item3.nombre}</option>
                                        ))
                                    }
                                    </select>
                                    :<label>NO</label>
                                }
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default TablaCuentasGratis;
