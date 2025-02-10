import React, { useState } from 'react';

const FeeReserva = (
    {   
        referenciaFee,
        setReferenciaFee,
        comentarioFee,
        setComentarioFee,
        facturar,
        handleChangeFacturar,
        totalFee
    }
) => {
    const fee = [
        {
            "id": "1",
            "nombre": "Fee facturado a esta reserva"
        },
        {
            "id": "2",
            "nombre": "Fee facturado con otra reserva"
        },
        {
            "id": "3",
            "nombre": "Fee no facturado"
        }
    ]

    return (
        <div>
            <div className='flex flex-col w-8/12 pr-2 pt-4 gap-2'>
                <label className='font-semibold text-xs'>FEE</label>
                <label className='font-medium text-[10px] '>Valor Estimado</label>
                <div className='flex w-full gap-4'>
                    <div className='flex w-[31%]'>
                        <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                            <span className="icon-[entypo--flag] text-blue-600"></span>
                        </div>
                        <div className='w-full'>
                            <input
                                value={totalFee}
                                readOnly
                                onChange={(event) => { }}
                                className='text-xs w-full bg-gray-100'>
                            </input>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div className='flex w-full '>
                <div className='flex flex-col w-[21.5%]  pr-2 pt-4 gap-2'>
                    <label className='font-medium text-[10px] '>Facturar</label>
                    <div className='flex w-full gap-4'>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[entypo--flag] text-blue-600"></span>
                            </div>
                            <div className='w-full mr-2'>
                                <select
                                    value={facturar}
                                    onChange={(event) => handleChangeFacturar(event.target.value)}
                                    className='text-xs w-full'>
                                    {
                                        fee.map((item, index) => (
                                            <option key={index} value={item.id}>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    facturar != "1"
                    ? <div className='flex flex-col w-[25.5%] pt-4 gap-2'>
                        <label className='font-medium text-[10px] '>{facturar=="2"?"# de Reserva":"Razón / Motivo"}</label>
                        <div className='flex w-full gap-4'>
                            <div className='flex'>
                                <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                    <span className="icon-[entypo--flag] text-blue-600"></span>
                                </div>
                                <div className='w-full mr-2'>
                                    <input
                                        value={facturar=="2"?referenciaFee:comentarioFee}
                                        onChange={(event) => facturar=="2"?setReferenciaFee(event.target.value):setComentarioFee(event.target.value)}
                                        className='text-xs w-full'>
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <></>
                }
            </div>

        </div>
    );
};

export default FeeReserva;