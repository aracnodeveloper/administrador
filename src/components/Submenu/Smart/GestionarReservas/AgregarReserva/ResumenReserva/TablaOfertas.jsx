import React, { useEffect, useState } from 'react';
import Config from '../../../../../../global/config';

const TablaOfertas = ({ ofertas, actualizarCantidad, actualizarNinos, actualizarAdultos, actualizarCostoNino, actualizarCostoAdulto, actualizarTipoPago, eliminar, subtotal, setSubtotal }) => {

    

    const calcularPrecio = (item) => {
        const precioPorNoche = parseFloat(item.precio_feriado || item.precioOferta);
        const noches = parseInt(item.noches);
        const diasTotales = (((new Date(item.fechaSalida).getTime()) - (new Date(item.fechaIngreso).getTime())) / (1000 * 3600 * 24));

        function calcularFactor() {
            if (noches > 1) {
                const moduloNoches = diasTotales % noches;
                if (moduloNoches === 0) {
                    return diasTotales / noches;
                } else {
                    return (diasTotales + 1) / noches;
                }
            } else {
                return diasTotales;
            }
        }

        const factor = calcularFactor();
        const precioTotal = precioPorNoche * factor;

        return precioTotal.toFixed(2);
    }

    useEffect(() => {
        let tempSubTotal = 0;
        ofertas.forEach((element) => {
            tempSubTotal += (calcularPrecio(element) * element.cantidadOfertas);
            tempSubTotal += ((element.costoAdulto ? element.costoAdulto : 0) * element.adicionalAdulto)
            tempSubTotal += ((element.costoNino ? element.costoNino : 0) * element.adicionalNino)
        });

        setSubtotal(parseFloat(tempSubTotal));
    }, [ofertas]);
    console.log(ofertas)

    return (
        <div className='flex flex-col w-full gap-4 animate-fadeIn'>
            <div className='flex items-center gap-3 border-b border-slate-100 pb-3'>
                <div className='w-8 h-8 rounded-lg bg-greenVE-100 text-greenVE-600 flex items-center justify-center'>
                    <span className="icon-[material-symbols--list-alt-outline-rounded] text-xl"></span>
                </div>
                <h3 className='text-sm font-bold text-slate-700 uppercase tracking-widest'>Detalle de Reserva</h3>
            </div>

            <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm'>
                <table className='w-full'>
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className='flex'>
                            <th scope="col" className="flex justify-center items-center w-[8%] py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                            <th scope="col" className="flex justify-center items-center w-[10%] py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cant.</th>
                            <th scope="col" className="flex justify-start items-center w-[40%] px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descripción / Producto</th>
                            <th scope="col" className="flex justify-center items-center w-[12%] py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">P. Unitario</th>
                            <th scope="col" className="flex justify-center items-center w-[15%] py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipo Pago</th>
                            <th scope="col" className="flex justify-center items-center w-[15%] py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {ofertas.map((oferta, index) => (
                            <React.Fragment key={index}>
                                {/* Fila Principal de la Oferta */}
                                <tr className="flex hover:bg-slate-50/50 transition-colors group">
                                    <td className="flex justify-center items-center w-[8%] py-4">
                                        <button 
                                            onClick={() => eliminar(index)}
                                            className='px-2 py-1 rounded text-[9px] font-bold text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-tighter border border-slate-100 hover:border-red-100'
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                    <td className="flex justify-center items-center w-[10%] py-4">
                                        <select 
                                            className='w-14 h-8 text-[11px] font-bold text-slate-600 border-slate-200 rounded-lg focus:ring-greenVE-500 focus:border-greenVE-500'
                                            onChange={(event) => actualizarCantidad(index, event.target.value)} 
                                            value={oferta.cantidadOfertas}
                                        >
                                            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="flex justify-start items-center w-[40%] px-6 py-4">
                                        <div className='flex flex-col'>
                                            <span className='text-[11px] font-bold text-slate-700 tracking-tight'>{oferta.tituloOferta}</span>
                                            <span className='text-[10px] text-slate-400 font-medium'>Código de oferta Smart</span>
                                        </div>
                                    </td>
                                    <td className="flex justify-center items-center w-[12%] py-4 text-[11px] font-bold text-slate-600">
                                        $ {calcularPrecio(oferta)}
                                    </td>
                                    <td className="flex justify-center items-center w-[15%] py-4">
                                        <select
                                            value={oferta.forma_pago_oferta}
                                            onChange={(event) => actualizarTipoPago(index, event.target.value.toString())}
                                            className='w-full max-w-[120px] h-8 text-[10px] font-bold uppercase text-slate-500 border-slate-200 rounded-lg focus:ring-greenVE-500 focus:border-greenVE-500'
                                        >
                                            {Config.PAGOS.map((item, idx) => (
                                                <option key={idx} value={item.id}>{item.nombre}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="flex justify-center items-center w-[15%] py-4 text-[12px] font-bold text-greenVE-700 bg-greenVE-50/20">
                                        $ {(calcularPrecio(oferta) * oferta.cantidadOfertas).toFixed(2)}
                                    </td>
                                </tr>

                                {/* Filas de Adicionales */}
                                {oferta.adicionalAdulto > 0 && (
                                    <tr className="flex bg-slate-50/30 border-t border-slate-100">
                                        <td className="flex justify-center items-center w-[8%] py-3 opacity-50">
                                            <button 
                                                onClick={() => actualizarAdultos(index, 0)} 
                                                className='text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase'
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                        <td className="flex justify-center items-center w-[10%] py-3">
                                            <select 
                                                className='w-12 h-7 text-[10px] font-bold text-slate-500 border-slate-200 rounded-md'
                                                onChange={(event) => actualizarAdultos(index, event.target.value)} 
                                                value={oferta.adicionalAdulto}
                                            >
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="flex justify-start items-center w-[40%] px-6 py-3 ml-4">
                                            <div className='flex items-center gap-2'>
                                                <div className='w-1 h-3 bg-blue-200 rounded-full'></div>
                                                <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wider'>Adulto adicional</span>
                                            </div>
                                        </td>
                                        <td className="flex justify-center items-center w-[12%] py-3">
                                            <div className='flex items-center h-8 px-2 border border-slate-200 rounded-lg bg-white group-focus-within:border-green-400 transition-all'>
                                                <span className='text-[9px] text-slate-300 font-bold mr-1'>$</span>
                                                <input 
                                                    className='w-full text-[11px] font-bold text-slate-600 outline-none text-center bg-transparent' 
                                                    value={oferta.costoAdulto} 
                                                    onChange={(event) => actualizarCostoAdulto(index, event.target.value)} 
                                                />
                                            </div>
                                        </td>
                                        <td className='flex items-center justify-center w-[15%] py-3 italic text-[9px] text-slate-400 font-bold'>Al Establecimiento</td>
                                        <td className="flex justify-center items-center w-[15%] py-3 text-[11px] font-bold text-slate-600">
                                            $ {parseFloat((oferta.costoAdulto ? oferta.costoAdulto : 0) * oferta.adicionalAdulto).toFixed(2)}
                                        </td>
                                    </tr>
                                )}

                                {oferta.adicionalNino > 0 && (
                                    <tr className="flex bg-slate-50/30 border-t border-slate-100">
                                        <td className="flex justify-center items-center w-[8%] py-3 opacity-50">
                                            <button 
                                                onClick={() => actualizarNinos(index, 0)} 
                                                className='text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase'
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                        <td className="flex justify-center items-center w-[10%] py-3">
                                            <select 
                                                className='w-12 h-7 text-[10px] font-bold text-slate-500 border-slate-200 rounded-md'
                                                onChange={(event) => actualizarNinos(index, event.target.value)} 
                                                value={oferta.adicionalNino}
                                            >
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="flex justify-start items-center w-[40%] px-6 py-3 ml-4">
                                            <div className='flex items-center gap-2'>
                                                <div className='w-1 h-3 bg-amber-200 rounded-full'></div>
                                                <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wider'>Niño adicional</span>
                                            </div>
                                        </td>
                                        <td className="flex justify-center items-center w-[12%] py-3">
                                            <div className='flex items-center h-8 px-2 border border-slate-200 rounded-lg bg-white group-focus-within:border-green-400 transition-all'>
                                                <span className='text-[9px] text-slate-300 font-bold mr-1'>$</span>
                                                <input 
                                                    className='w-full text-[11px] font-bold text-slate-600 outline-none text-center bg-transparent' 
                                                    value={oferta.costoNino} 
                                                    onChange={(event) => actualizarCostoNino(index, event.target.value)} 
                                                />
                                            </div>
                                        </td>
                                        <td className='flex items-center justify-center w-[15%] py-3 italic text-[9px] text-slate-400 font-bold'>Al Establecimiento</td>
                                        <td className="flex justify-center items-center w-[15%] py-3 text-[11px] font-bold text-slate-600">
                                            $ {parseFloat((oferta.costoNino ? oferta.costoNino : 0) * oferta.adicionalNino).toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* Totales Section */}
                <div className='bg-slate-50/80 p-6 flex flex-col items-end gap-3'>
                    <div className='flex items-center justify-between w-64 px-4 py-2 bg-white rounded-lg border border-slate-100 shadow-sm'>
                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Subtotal</span>
                        <span className='text-xs font-bold text-slate-700'>$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className='flex items-center justify-between w-64 px-4 py-2 bg-white rounded-lg border border-slate-100 shadow-sm'>
                        <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Comisiones</span>
                        <span className='text-xs font-bold text-slate-700'>$ 0.00</span>
                    </div>
                    <div className='flex items-center justify-between w-64 px-6 py-4 bg-greenVE-600 rounded-xl shadow-lg shadow-greenVE-100 translate-y-1 relative group overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer'></div>
                        <span className='text-[11px] font-bold text-white uppercase tracking-widest z-10'>Total Reserva</span>
                        <span className='text-lg font-bold text-white drop-shadow-sm z-10'>$ {subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaOfertas;