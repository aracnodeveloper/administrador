import React, { useEffect, useState } from 'react';
import Config from '../../../../../global/config';
import { listarCanalesVenta } from '../../../../../controllers/info/InfoController';
import { buscarUsuarios } from '../../../../../controllers/smart/SmartController';
import ClickAwayListener from 'react-click-away-listener';

const InformacionSuscripcion = ({ suscripciones }) => {
    const [canales, setCanales] = useState();
    const [suggestion, setSuggestion] = useState();
    const [inputValue, setInputValue] = useState();
    useEffect(() => {
        listarCanalesVenta().then((res) => {
            if (res) {
                setCanales(res)

            }
        })
    }, []);
    console.log(suscripciones)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue) {
                //setLoading(true)
                buscarUsuarios(inputValue).then((res) => {
                    //setLoading(false)
                    setSuggestion(res)
                    console.log("respuesta", res)
                });
            } else {
                //setLoading(false)
                setSuggestion(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleClickAway = () => {
        setSuggestion();
    }

    const onClickSuggestion = (item) => {
        setSuggestion()
    }

    return (
        <div className='w-full border-2 rounded-md mt-5 flex'>
            <label className='absolute -mt-3 ml-5 rounded-full bg-greenVE-500 text-white px-4'>Información de la suscripción</label>
            <div className='flex flex-col items-center justify-center w-full mt-5'>
                <table className='w-full'>
                    <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 w-full">
                        <tr className='flex  justify-between '>
                            <th scope="col" className="flex justify-center items-center w-[5%]">#</th>
                            <th scope="col" className="flex justify-center items-center w-[15%]">Suscripción</th>
                            <th scope="col" className="flex justify-center items-center w-[10%]">Fecha Inicio</th>
                            <th scope="col" className="flex justify-center items-center w-[10%]">Fecha Fin</th>
                            <th scope="col" className="flex justify-center items-center w-[10%]">Estado de Pago</th>
                            <th scope="col" className="flex justify-center items-center w-[10%]">Detalle Pago</th>
                            <th scope="col" className="flex justify-center items-center w-[15%]">Observación</th>
                            <th scope="col" className="flex justify-center items-center w-[15%]">Vendedor</th>
                            <th scope="col" className="flex justify-center items-center w-[10%]">Canal</th>
                            <th scope="col" className="flex justify-center items-center w-[5%]">Acción</th>
                        </tr>
                    </thead>
                    <tbody className='text-[11px] text-gray-700 bg-gray-50 w-full'>
                        {
                            suscripciones.map((item, index) => (
                                <tr className='odd:bg-white even:bg-gray-50 text-[12px] flex justify-between border-y py-1'>
                                    <td scope="col" className="flex justify-center items-center w-[5%]">{index + 1}</td>
                                    <td scope="col" className="flex justify-center items-center w-[15%]">{item.titulo}</td>
                                    <td scope="col" className="flex justify-center items-center w-[10%]">
                                        <input value={item.fecha_inicio} type='date' className='h-6 w-28 text-[10px] py-0' />
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[10%]">
                                        <input value={item.fecha_fin} type='date' className='h-6 w-28 text-[10px] py-0' />
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[10%] ">
                                        <select value={item.id_estado_pago} className='h-6 py-0 text-[10px] w-28'>
                                            {
                                                Config.ESTADOPAGO.map((item) => (
                                                    <option value={item.id}>{item.nombre}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[10%]">Detalle Pago</td>
                                    <td scope="col" className="flex justify-center items-center w-[15%]">
                                        <input type='text' className='h-6 w-28 text-[10px] py-0' />
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[15%]">
                                        <input value={item.vendedor} type='text' className='h-6 w-36 text-[10px] py-0' onChange={(event) => setInputValue(event.target.value)} />
                                        {suggestion && (
                                            <ClickAwayListener onClickAway={handleClickAway}>
                                                <div className=" absolute mt-28 max-h-[17rem] w-[34.5rem] bg-white z-50 shadow-2xl p-2 overflow-y-auto  rounded-lg">
                                                    {
                                                        suggestion ? (
                                                            suggestion.map((item, key) => (
                                                                <div key={key} className={`flex items-center p-1 ${key !== suggestion.length - 1 ? 'border-b' : ''} cursor-pointer gap-2`} onClick={() => { }/*() => (setDestination(item), setSuggestion(null))*/}>
                                                                    <div className="flex justify-between w-full p-1 cursor-pointer" onClick={() => onClickSuggestion(item)} >
                                                                        <label key={key} className="text-sm cursor-pointer text-xs" >
                                                                            {`ID: ${item.usuario} CI: ${item.ci_ruc} ${item.nombres}`}
                                                                        </label>
                                                                        {
                                                                            item.estado == "activo"
                                                                                ? <span className="icon-[mdi--check-circle] text-greenVE-600 h-4 w-4"></span>
                                                                                : <span className="icon-[material-symbols--cancel] text-red-500 h-4 w-4"></span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (<p></p>)
                                                    }
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[10%]">
                                        <select className='h-6 py-0 text-[10px] w-28'>
                                            {
                                                canales && canales.map((item) => (
                                                    <option value={item.id_tbl_tipo_canal}>{item.nombre}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td scope="col" className="flex justify-center items-center w-[5%]">
                                        <span className="icon-[material-symbols--cancel] text-gray-500 h-5 w-5"></span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default InformacionSuscripcion;