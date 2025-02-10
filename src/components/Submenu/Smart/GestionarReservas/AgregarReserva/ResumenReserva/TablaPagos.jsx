import React, { useState } from 'react';
import Config from '../../../../../../global/config';

const TablaPagos = ({setFormaPago, formaPago}) => {
    const [pagosList, setPagosList] = useState([]);

    const handleChangePago = (item) => {
        setFormaPago(item)
        /*var tmpItem = pagos[item];
        tmpItem.valor = 0
        setPagosList(prevPagosList => [...prevPagosList, tmpItem]);
        console.log(pagosList)*/
    };

    const handleDeletePago = (index) => {
        setPagosList(prevPagosList => prevPagosList.filter((_, i) => i !== index));
    };

    const handleUpdatePago = (index, newValue) => {
        setPagosList(prevPagosList =>
            prevPagosList.map((pago, i) =>
                i === index ? { ...pago, valor: newValue } : pago
            )
        );
    };

    return (
        <div className='flex flex-col w-6/12 pr-2 pt-4 gap-2'>
            <label className='font-semibold text-xs'>FORMA DE PAGO</label>
            <label className='font-medium text-[10px] '>Agregar una o varias formas de pago</label>
            <div className='flex'>
                <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                    <span className="icon-[entypo--flag] text-blue-600"></span>
                </div>
                <div className='w-4/12'>
                    <select
                        value={formaPago}
                        onChange={(event) => handleChangePago(event.target.value)}
                        className='text-xs w-full'>
                        {
                            Config.PAGOS.map((item, index) => (
                                <option key={index} value={item.id}>{item.nombre}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            {
                pagosList.length > 0
                && <table>
                    <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                        <tr className='flex  justify-between '>
                            <th scope="col" className="flex justify-center items-center w-3/12">Acción</th>
                            <th scope="col" className="flex justify-center items-center w-6/12">Tipo de Pago</th>
                            <th scope="col" className="flex justify-center items-center w-3/12">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pagosList.map((item, index) => (
                                <tr className="odd:bg-white even:bg-gray-50 text-[10px] flex" key={index}>
                                    <td className="flex justify-center items-center w-3/12"><span onClick={() => { handleDeletePago(index) }} className="icon-[material-symbols--delete] h-5 w-5 text-red-500 cursor-pointer"></span></td>
                                    <td className="flex justify-center items-center w-6/12 text-center">{item.nombre}</td>
                                    <td className="flex justify-center items-center w-3/12"><input className='w-6/12 h-6 my-1 text-xs text-center' value={item.valor} onChange={(event) => {handleUpdatePago(index, event.target.value) }}></input></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    );
};

export default TablaPagos;