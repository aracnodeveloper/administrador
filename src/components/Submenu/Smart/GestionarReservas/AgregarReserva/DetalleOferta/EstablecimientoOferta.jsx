import React from 'react';
import { Datepicker } from 'flowbite-react';
import { formatDate } from '../../../../../../global/utils';

const EstablecimientoOferta = ({ ofertas, eliminar, actualizar, adicionalNino, adicionalAdulto, fechaIngreso, fechaSalida, actualizarEdades, comCliente, setComCliente, comReserva, setComReserva, actualizarFeriado }) => {
    console.log("ofertas",ofertas)


    const calcularPrecio=(item)=>{
        const precioPorNoche = parseFloat(item.precio_feriado || item.precioOferta);
        const noches = parseInt(item.noches);
        const diasTotales = (((new Date(item.fechaSalida).getTime()) - (new Date(item.fechaIngreso).getTime()))/(1000 * 3600 * 24));
      
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
    
    return (
        <div className='shadow-lg bg-white p-4 flex  gap-4'>
            <div className='w-full flex flex-col gap-2'>
                {
                    (ofertas && ofertas.length > 0) &&
                    <div className='flex flex-col w-full gap-8'>
                        <table>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr className='flex  justify-between '>
                                    <th scope="col" className="flex justify-center items-center w-1/12">Acción</th>
                                    <th scope="col" className="flex justify-center items-center w-4/12">Oferta</th>
                                    <th scope="col" className="flex justify-center items-center w-1/12">Cantidad</th>
                                    <th scope="col" className="flex justify-center items-center w-2/12">Personas</th>
                                    <th scope="col" className="flex justify-center items-center w-1/12">Edades niños</th>
                                    <th scope="col" className="flex justify-center items-center w-2/12">Fechas</th>
                                    <th scope="col" className="flex justify-center items-center w-1/12">Valor<br></br>noche</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ofertas.map((item, index) => (
                                        <tr className="odd:bg-white even:bg-gray-50 text-[10px] flex border-y" key={index}>
                                            <td className="flex justify-center items-center w-1/12 border-x px-2 py-4"><span onClick={() => { eliminar(index) }} className="icon-[material-symbols--delete] h-5 w-5 text-red-500 cursor-pointer"></span></td>
                                            <td className="flex justify-center items-center w-4/12 text-center border-x px-2 py-4">
                                                <div className='w-full flex flex-col justify-start items-start'>
                                                    <label className='text-xs font-semibold text-start'>{item.tituloOferta}</label>
                                                    <div className='flex items-center gap-2'>
                                                        <span className="icon-[bx--calendar] text-blue-600 h-4 w-4"></span>
                                                        <label className='text-xs'>{`Aplica ${item.aplicaEn.toLowerCase()}`}</label>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <span className="icon-[majesticons--sun] text-blue-600 h-4 w-4"></span>
                                                        <label className='text-xs'>{`${item.dias} ${parseInt(item.dias) == 1 ? "día" : "dias"}`}</label>
                                                    </div>
                                                    {
                                                        parseInt(item.noches) != 0 &&
                                                        <div className='flex items-center gap-2'>
                                                            <span className="icon-[bxs--moon] text-blue-600 h-3 w-4"></span>
                                                            <label className='text-xs'>{`${item.noches} ${parseInt(item.noches) == 1 ? "noche" : "noches"}`}</label>
                                                        </div>
                                                    }
                                                     <div className='flex items-center gap-2'>
                                                        <span className="icon-[icon-park-outline--vacation] text-blue-600 h-4 w-4"></span>
                                                        <label className='text-xs'>Tarifa Feriado:</label>
                                                        <input value={item.precio_feriado} onChange={(event)=>actualizarFeriado(index, event.target.value)} className='text-xs p-0 w-14'></input>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="flex justify-center items-center w-1/12 text-center border-x px-2 py-4">
                                                <select className='text-xs py-0' onChange={(event) => actualizar(index, event.target.value)} value={item.cantidadOfertas}>
                                                    {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                        <option key={number + 1} value={number + 1}>
                                                            {`${number + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="flex justify-start items-center w-2/12 text-center border-x px-2 py-4">
                                                <div className='flex flex-col gap-1 w-full'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className="icon-[octicon--person] text-blue-600 h-4 w-4"></span>
                                                        <label className='text-xs'>{`${item.adultos} ${parseInt(item.adultos) == 1 ? "adulto" : "adultos"}`}</label>
                                                    </div>
                                                    {
                                                        parseInt(item.ninos) != 0 &&
                                                        <div className='flex items-center gap-2'>
                                                            <span className="icon-[material-symbols--child-care] text-blue-600 h-4 w-4"></span>
                                                            <label className='text-xs'>{`${item.ninos} ${parseInt(item.ninos) == 1 ? "niño" : "niños"}`}</label>
                                                        </div>
                                                    }

                                                    <div className='flex gap-1 items-center justify-between'>
                                                        <label>Adulto adicional:</label>
                                                        <select className='text-xs px-1 py-0' onChange={(event) => adicionalAdulto(index, event.target.value)} value={item.adicionalAdulto}>
                                                            {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                                <option key={number} value={number}>
                                                                    {`${number}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className='flex justify-between gap-1 items-center'>
                                                        <label>Niño adicional:</label>
                                                        <select className='text-xs py-0 px-1' onChange={(event) => adicionalNino(index, event.target.value)} value={item.adicionalNino}>
                                                            {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                                <option key={number} value={number}>
                                                                    {`${number}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="flex flex-col gap-1 items-center w-1/12 text-center border-x px-2 py-4">
                                                {
                                                    item.edades.map((item2, index2) => (
                                                        <select className='text-xs py-0 px-1' onChange={(event) => actualizarEdades(index, index2, event.target.value)} value={item.edades[index2]}>
                                                            {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                                                                <option key={number} value={number}>
                                                                    {`${number}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ))
                                                }
                                            </td>
                                            <td className="flex justify-center items-center w-2/12 text-center border-x px-2 flex-col py-4 gap-2">
                                                <div className='flex flex-col items-center w-full'>
                                                    <label className='font-bold text-[10px] text-slate-400 uppercase tracking-tighter mb-1'>Ingreso</label>
                                                    <Datepicker 
                                                        language="es-ES"
                                                        labelTodayButton="Hoy"
                                                        labelClearButton="Limpiar"
                                                        minDate={new Date("2020-01-01")}
                                                        maxDate={new Date("2036-12-31")}
                                                        value={new Date(item.fechaIngreso + "T12:00:00")}
                                                        onSelectedDateChanged={(date) => fechaIngreso(index, formatDate(date))}
                                                        theme={{
                                                            root: {
                                                                input: {
                                                                    field: {
                                                                        input: {
                                                                            base: "w-full h-8 px-2 rounded-lg border-slate-200 text-[10px] font-bold focus:ring-greenVE-500 transition-all bg-white"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className='flex flex-col items-center w-full'>
                                                    <label className='font-bold text-[10px] text-slate-400 uppercase tracking-tighter mb-1'>Salida</label>
                                                    <Datepicker 
                                                        language="es-ES"
                                                        labelTodayButton="Hoy"
                                                        labelClearButton="Limpiar"
                                                        minDate={new Date("2020-01-01")}
                                                        maxDate={new Date("2036-12-31")}
                                                        value={new Date(item.fechaSalida + "T12:00:00")}
                                                        onSelectedDateChanged={(date) => fechaSalida(index, formatDate(date))}
                                                        theme={{
                                                            root: {
                                                                input: {
                                                                    field: {
                                                                        input: {
                                                                            base: "w-full h-8 px-2 rounded-lg border-slate-200 text-[10px] font-bold focus:ring-greenVE-500 transition-all bg-white"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="flex justify-center items-center w-1/12 text-center border-x px-2">{`$ ${calcularPrecio(item)} USD`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className='w-full flex gap-4'>
                            <div className='flex flex-col w-1/2'>
                                <label className='font-semibold text-xs'>Comentario de cliente</label>
                                <div className='flex'>
                                    <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0 mb-0.5'>
                                        <span className="icon-[majesticons--message] text-blue-600"></span>
                                    </div>
                                    <div className='w-full'>
                                        <textarea
                                            value={comCliente}
                                            onChange={(event)=>setComCliente(event.target.value)}
                                            rows="4"
                                            className='text-xs w-full'>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <label className='font-semibold text-xs'>Comentario de reservas</label>
                                <div className='flex'>
                                    <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0 mb-0.5'>
                                        <span className="icon-[majesticons--message] text-blue-600"></span>
                                    </div>
                                    <div className='w-full'>
                                        <textarea
                                            value={comReserva}
                                            onChange={(event)=>setComReserva(event.target.value)}
                                            rows="4"
                                            className='text-xs w-full'>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default EstablecimientoOferta;