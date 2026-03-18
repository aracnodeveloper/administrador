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
        <div className='flex flex-col gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 animate-fadeIn'>
            <div className='flex items-center gap-3 border-b border-slate-100 pb-3'>
                <div className='w-1.5 h-6 bg-greenVE-600 rounded-full'></div>
                <h3 className='text-sm font-bold text-slate-700 uppercase tracking-widest'>Gestión de FEE</h3>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Valor Estimado */}
                <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        Valor Estimado
                    </label>
                    <div className='flex'>
                        <input
                            value={totalFee}
                            readOnly
                            className='w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none cursor-default'
                        />
                    </div>
                </div>

                {/* Facturación */}
                <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        Estado de Facturación
                    </label>
                    <div className='flex group'>
                        <select
                            value={facturar}
                            onChange={(event) => handleChangeFacturar(event.target.value)}
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-greenVE-500 transition-all shadow-sm'
                        >
                            {fee.map((item, index) => (
                                <option key={index} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Campo Dinámico (Referencia/Motivo) */}
                {facturar !== "1" && (
                    <div className='flex flex-col gap-2 animate-slideLeft'>
                        <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                            {facturar === "2" ? "Referencia de Reserva" : "Razón / Motivo"}
                        </label>
                        <div className='flex group'>
                            <input
                                value={facturar === "2" ? referenciaFee : comentarioFee}
                                onChange={(event) => facturar === "2" ? setReferenciaFee(event.target.value) : setComentarioFee(event.target.value)}
                                className='w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-greenVE-500 transition-all shadow-sm'
                                placeholder={facturar === "2" ? "Ingrese # Reserva..." : "Especifique motivo..."}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeReserva;