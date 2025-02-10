import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { getCertificadoReserva, listarReservas } from '../../../../../controllers/smart/SmartController';
import Config from '../../../../../global/config';
import { verificarPermiso } from '../../../../../global/utils';

const TablaReservas = ({ handleClickEdit, reservas }) => {
    const [loadingId, setLoadingId] = useState();
    const [loadingCertId, setLoadingCertId]=useState();
    const estados = [
        <div className='flex gap-1 items-center text-amber-600'>
            <span className="icon-[lucide--clock] h-3 w-3"></span>
            <label>Pendiente</label>
        </div>,
        <div className='flex gap-1 items-center text-greenVE-600'>
            <span className="icon-[material-symbols--check-circle-outline] h-3 w-3"></span>
            <label>Confirmado</label>
        </div>,
        <div className='flex gap-1 items-center text-red-600'>
            <span className="icon-[f7--xmark-circle] h-3 w-3"></span>
            <label>Cancelado</label>
        </div>,
        <div className='flex gap-1 items-center text-blue-600'>
            <span className="icon-[icons8--document] h-3 w-3"></span>
            <label>Cotización</label>
        </div>,
    ]

    const handleClickEditRes = (id) => {
        setLoadingId(id)
        listarReservas({id:id}).then((res) => {
            setLoadingId()
            if (res) {
                
                handleClickEdit(res)
            }
        })
    }

    const handleClickPrint = (id) => {
        window.open(`/administrador/imprimir-reserva?id=${id}`)
    }

    const handleClickCert = (id) => {
        setLoadingCertId(id)
        try {
            getCertificadoReserva(id).then((res) => {
                setLoadingCertId()
                if (res) {
                    const searchParams = new URLSearchParams();
                    for (const key in res) {
                        if (Object.hasOwnProperty.call(res, key)) {
                            const value = typeof res[key] === 'object' ? JSON.stringify(res[key]) : res[key];
                            searchParams.append(key, value);
                        }
                    }
                    console.log(searchParams)
                    window.open(`https://visitaecuador.com/#/certificado?${searchParams.toString()}`, '_blank');
                }
            })
        } catch (e) {

        }
    }


    return (
        <table className='w-full'>
            <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 w-full">
                <tr className='flex  justify-between '>
                    <th scope="col" className="flex justify-center items-center w-[2%]">#</th>
                    <th scope="col" className="flex justify-center items-center w-[7%]">Opc.</th>
                    <th scope="col" className="flex justify-center items-center w-[5%]"># Reserva</th>
                    <th scope="col" className="flex justify-center items-center w-[8%]">Fecha</th>
                    <th scope="col" className="flex justify-center items-center w-[10%]">Estado</th>
                    <th scope="col" className="flex justify-center items-center w-[6%]">Id Sus.</th>
                    <th scope="col" className="flex justify-center items-center w-[15%]">Suscriptor</th>
                    <th scope="col" className="flex justify-center items-center w-[15%]">Gestionado por</th>
                    <th scope="col" className="flex justify-center items-center w-[20%]">Establecimiento</th>
                    <th scope="col" className="flex justify-center items-center w-[5%]"># Paquetes</th>
                    <th scope="col" className="flex justify-center items-center w-[6%]">Total</th>
                </tr>
            </thead>
            <tbody>
                {
                    reservas && reservas.map((item, index) => (
                        <tr className="odd:bg-white even:bg-gray-50 text-[12px] flex justify-between border-y" key={item.id_tbl_reserva} >
                            <td className="flex justify-center items-center w-[2%] text-center">{index + 1}</td>
                            <td className="flex justify-center items-center text-center w-[7%] gap-2">
                                {
                                    verificarPermiso(68)&&
                                            loadingId == item.id_tbl_reserva
                                                ? <span className="icon-[line-md--loading-twotone-loop] h-5 w-5"></span>
                                                : <div title='Editar reserva' onClick={(e) => { e.preventDefault(); e.button === 0&&handleClickEditRes(item.id_tbl_reserva)}}><a className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500" href={`${window.location}reserva/${item.id_tbl_reserva}`}/></div>
                                }
                                {
                                    verificarPermiso(73)&&
                                        <span title='Imprimir reserva'  className="icon-[uil--print] w-5 h-5 hover:bg-blue-600  cursor-pointer text-gray-500" onClick={() => handleClickPrint(item.id_tbl_reserva)}></span>
                                }
                                {
                                    verificarPermiso(73)&&
                                        loadingCertId==item.id_tbl_reserva
                                        ?<span className="icon-[line-md--loading-twotone-loop] h-5 w-5"></span>
                                        :<span title='Imprimir certificado'  className="icon-[iconamoon--certificate-badge] w-5 h-5 hover:bg-greenVE-600  cursor-pointer text-gray-500" onClick={() => handleClickCert(item.id_tbl_reserva)}></span>
                                }
                                {/*
                                    <Tooltip className='bg-gray-700 text-[10px] py-1' content="Borrar Reserva" arrow={false}>
                                        <span className="icon-[material-symbols--delete] w-5 h-5 hover:text-red-600 cursor-pointer text-gray-500"></span>
                                    </Tooltip>*/
                                }
                            </td>
                            <td className="flex justify-center items-center w-[5%] text-center">{item.id_tbl_reserva}</td>
                            <td className="flex justify-center items-center w-[8%] text-center py-1">{item.fecha_creacion}</td>
                            <td className="flex flex-col justify-center items-center w-[10%]  py-1">{estados[parseInt(item.id_tbl_estado_reserva) - 1]}</td>
                            <td className="flex flex-col justify-start items-center w-[6%] text-center py-1 overflow-hidden whitespace-nowrap text-ellipsis">
                                <label className={`${item.tipoUsuario=="gratis"?"text-greenVE-600":item.tipoUsuario=="suscriptor"?"text-blue-500":"text-orange-500"}`}>{item.tipoUsuario}</label>
                                <label className='w-full overflow-hidden whitespace-nowrap text-ellipsis truncate' title={item.idCliSuscripcion}>{item.idCliSuscripcion}</label>
                            </td>
                            <td className="flex justify-center items-center w-[15%] text-center py-1 capitalize">{item.usuarioCliente.toLowerCase()}</td>
                            <td className="flex justify-center items-center w-[15%] text-center py-1 capitalize">{item.usuarioCreacion.toLowerCase()}</td>
                            <td className="flex justify-center items-center w-[20%] text-center py-1 capitalize">{item.establecimiento.toLowerCase()}</td>
                            <td className="flex justify-center items-center w-[5%] text-center py-1">{item.totalCantidadOfertas}</td>
                            <td className="flex justify-center items-center w-[6%] text-center py-1">$ {item.total_reserva}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default TablaReservas;