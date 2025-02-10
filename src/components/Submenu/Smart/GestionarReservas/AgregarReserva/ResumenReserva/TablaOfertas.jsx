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
        <div className='flex flex-col w-full pr-2'>
            <label className='font-semibold text-xs'>DETALLE DE RESERVA</label>
            <div className='h-4'></div>
            <table className='border shadow-lg'>
                <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                    <tr className='flex  justify-between '>
                        <th scope="col" className="flex justify-center items-center w-1/12">Acción</th>
                        <th scope="col" className="flex justify-center items-center w-1/12">Cantidad</th>
                        <th scope="col" className="flex justify-center items-center w-4/12">Descripción/Producto</th>
                        <th scope="col" className="flex justify-center items-center w-1/12">Precio/unit. $</th>
                        <th scope="col" className="flex justify-center items-center w-3/12">Tipo Pago</th>
                        <th scope="col" className="flex justify-center items-center w-2/12">Precio Total $</th>
                    </tr>
                </thead>
                <tbody className="text-[10px] text-gray-700 uppercase bg-gray-50">
                    {
                        ofertas.map((oferta, index) => {
                            return <>
                                <tr className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                    <td className="flex justify-center items-center w-1/12"><span className="icon-[material-symbols--delete] h-5 w-5 text-red-500 cursor-pointer" onClick={() => eliminar(index)}></span></td>
                                    <td className="flex justify-center items-center w-1/12">
                                        <select className='text-xs py-0 ' onChange={(event) => actualizarCantidad(index, event.target.value)} value={oferta.cantidadOfertas}>
                                            {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                <option key={number + 1} value={number + 1}>
                                                    {`${number + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="flex justify-start items-center w-4/12 px-4">{oferta.tituloOferta}</td>
                                    <td className="flex justify-center items-center w-1/12">$ {calcularPrecio(oferta)}</td>
                                    <td className="flex justify-center items-center w-3/12">
                                        <select
                                            value={oferta.forma_pago_oferta}
                                            onChange={(event) => { actualizarTipoPago(index, event.target.value.toString()) }}
                                            className='text-xs '>
                                            {
                                                Config.PAGOS.map((item, index) => (
                                                    <option key={index} value={item.id}>{item.nombre}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td className="flex justify-center items-center w-2/12">$ {(calcularPrecio(oferta) * oferta.cantidadOfertas).toFixed(2)}</td>
                                </tr>
                                {
                                    oferta.adicionalAdulto > 0
                                        ? <tr className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                            <td className="flex justify-center items-center w-1/12"><span className="icon-[material-symbols--delete] h-5 w-5 text-red-500 cursor-pointer" onClick={() => actualizarAdultos(index, 0)}></span></td>
                                            <td className="flex justify-center items-center w-1/12">
                                                <select className='text-xs py-0' onChange={(event) => actualizarAdultos(index, event.target.value)} value={oferta.adicionalAdulto}>
                                                    {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                        <option key={number + 1} value={number + 1}>
                                                            {`${number + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="flex justify-start items-center w-4/12 text-start px-4">{`${oferta.tituloOferta} / Adulto adicional`}</td>
                                            <td className="flex justify-center items-center w-1/12 ">
                                                <input className='w-10/12 h-6 my-1 text-[10px] text-center' value={oferta.costoAdulto} onChange={(event) => actualizarCostoAdulto(index, event.target.value)} />
                                            </td>
                                            <td className='flex items-center justify-center w-3/12'>Directa al establecimiento</td>
                                            <td className="flex justify-center items-center w-2/12">$ {parseFloat((oferta.costoAdulto ? oferta.costoAdulto : 0) * oferta.adicionalAdulto).toFixed(2)}</td>
                                        </tr>
                                        : <></>
                                }
                                {
                                    oferta.adicionalNino > 0
                                        ? <tr className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                            <td className="flex justify-center items-center w-1/12"><span className="icon-[material-symbols--delete] h-5 w-5 text-red-500 cursor-pointer" onClick={() => actualizarNinos(index, 0)}></span></td>
                                            <td className="flex justify-center items-center w-1/12">
                                                <select className='text-xs py-0' onChange={(event) => actualizarNinos(index, event.target.value)} value={oferta.adicionalNino}>
                                                    {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                        <option key={number + 1} value={number + 1}>
                                                            {`${number + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="flex justify-start items-center w-4/12 text-start px-4">{`${oferta.tituloOferta} / Niño adicional`}</td>
                                            <td className="flex justify-center items-center w-1/12"><input className='w-10/12 h-6 my-1 text-[10px] text-center' value={oferta.costoNino} onChange={(event) => actualizarCostoNino(index, event.target.value)} /></td>
                                            <td className='flex items-center justify-center w-3/12'>Directa al establecimiento</td>
                                            <td className="flex justify-center items-center w-2/12">$ {parseFloat((oferta.costoNino ? oferta.costoNino : 0) * oferta.adicionalNino).toFixed(2)}</td>
                                        </tr>
                                        : <></>
                                }
                            </>
                        })
                    }
                    <tr className="bg-white  text-[10px] flex justify-end">
                        <td className="flex items-center w-1/12 font-semibold">Subtotal:</td>
                        <td className="flex justify-center items-center w-1/12">$ {subtotal.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-white  text-[10px] flex justify-end">
                        <td className="flex items-center w-1/12  font-semibold">Comisión:</td>
                        <td className="flex justify-center items-center w-1/12">$ 0.00</td>
                    </tr>
                    <tr className="bg-white  text-[10px] flex justify-end">
                        <td className="flex items-center  w-1/12  font-semibold">Incremento:</td>
                        <td className="flex justify-center items-center w-1/12">$ 0.00</td>
                    </tr>
                    <tr className="bg-white  text-[10px] flex justify-end">
                        <td className="flex items-center w-1/12  font-semibold">Total:</td>
                        <td className="flex justify-center items-center w-1/12"> $ {subtotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TablaOfertas;