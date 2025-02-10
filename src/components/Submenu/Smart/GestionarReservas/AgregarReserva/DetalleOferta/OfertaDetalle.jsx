import React, { useEffect, useState } from 'react';
import { getEstSmart, getOfertas } from '../../../../../../controllers/smart/SmartController';
import ClickAwayListener from 'react-click-away-listener';
import EstablecimientoOferta from './EstablecimientoOferta';
import Config from '../../../../../../global/config';
var selected = false;

const OfertaDetalle = ({
    ofertas,
    eliminar,
    actualizar,
    adicionalAdulto,
    adicionalNino,
    fechaIngreso,
    fechaSalida,
    actualizarEdades,
    setContactos,
    contactos,
    inputEst,
    setInputEst,
    setOfertas,
    selectedOfer,
    setSelectedOfer,
    setSelectedEst,
    setComReserva,
    comReserva,
    setComCliente,
    comCliente,
    estadoRes,
    setEstadoRes,
    handleAddOferta,
    actualizarFeriado
}) => {
    const [loadingEst, setLoadingEst] = useState();
    const [selectedIndexOfer, setSelectedIndexOfer] = useState();
    const [suggestion, setSuggestion] = useState();


    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputEst !== '' && !selected) {
                setLoadingEst(true)
                getEstSmart(inputEst).then((res) => {
                    setLoadingEst(false)
                    setSuggestion(res)
                });
            } else {
                setLoadingEst(false)
                setSuggestion(null);
            }
        }, 500);
        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el valor cambia
    }, [inputEst]);

    const handleClickAway = () => {
        if (suggestion) {
            setSuggestion(null)
        }
    };

    const handleClickCancel = () => {
        setInputEst('');
        setOfertas();
        setContactos();
        setSelectedOfer([]);
        setSelectedIndexOfer(-1)
    }

    const onClickSuggestion = (item) => {
        selected = true;
        setInputEst(`${item.titulo}`)
        setSuggestion(null)
        setSelectedOfer([])
        setSelectedIndexOfer(-1)
        setSelectedEst(item)
        getOfertas(item.id).then((res) => {
            setOfertas(res.ofertas)
            setContactos(res.contactos)
        });
    }

    const handleChangeEst = (value) => {
        selected = false;
        setInputEst(value);
    }

    const handleChangeOfer = (value) => {
        setSelectedIndexOfer(value)
        handleAddOferta(ofertas[value])
    }



    return (
        <div className='flex flex-col p-4 z-10 gap-8'>
            <div className='w-full flex gap-4'>
                <div className='w-5/12 flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label className='font-semibold text-xs'>Buscar Establecimiento</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[icon-park-solid--hotel] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <input
                                    value={inputEst} onChange={(e) => handleChangeEst(e.target.value)}
                                    className='text-xs w-full'
                                    placeholder='Ingrese nombre de establecimiento'
                                ></input>
                            </div>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-l-0 cursor-pointer' onClick={loadingEst ? () => { } : () => handleClickCancel()}>
                                {
                                    !loadingEst
                                        ? <span className="icon-[game-icons--cancel] text-blue-600" ></span>
                                        : <span className="icon-[line-md--loading-twotone-loop]"></span>
                                }
                            </div>
                        </div>
                        {suggestion && (
                            <ClickAwayListener onClickAway={handleClickAway} >
                                <div className=" absolute mt-14 max-h-[17rem] w-[34.5rem] bg-white z-50 shadow-2xl p-2 overflow-y-auto  rounded-lg">
                                    {
                                        suggestion ? (
                                            suggestion.map((item, key) => (
                                                <div key={key} className={`flex items-center p-1 ${key !== suggestion.length - 1 ? 'border-b' : ''} cursor-pointer gap-2`} onClick={() => { }/*() => (setDestination(item), setSuggestion(null))*/}>
                                                    <div className="flex  w-full p-1 cursor-pointer" onClick={() => onClickSuggestion(item)} >
                                                        <label key={key} className=" cursor-pointer text-xs text-blue-500" >
                                                            {item.descripcion.split(",")[0].replace("en ", "")}
                                                        </label>

                                                        <label key={key} className=" cursor-pointer text-xs" >
                                                            {`, ${item.titulo}`}

                                                        </label>


                                                    </div>
                                                </div>
                                            ))
                                        ) : (<p></p>)
                                    }
                                </div>
                            </ClickAwayListener>
                        )}
                    </div>
                </div>
                <div className='w-5/12 flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label className='font-semibold text-xs'>Buscar Oferta</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[material-symbols--hotel] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <select
                                    value={selectedIndexOfer}
                                    onChange={(event) => handleChangeOfer(event.target.value)}
                                    className='text-xs w-full'>
                                    <option value="-1" disabled selected>Seleccione oferta</option>
                                    {
                                        ofertas && ofertas.map((item, index) => (
                                            <option value={index} >{`$${parseFloat(item.precioOferta).toFixed(2)} - ${item.tituloOferta} (${item.estado})`} <label></label></option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-2/12 flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label className='font-semibold text-xs'>Seleccionar estado reserva</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[material-symbols--hotel] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <select
                                    value={estadoRes}
                                    onChange={(event) => setEstadoRes(event.target.value)}
                                    className='text-xs w-full'>
                                    {
                                        Config.ESTADOS.map((item, index) => (
                                            <option value={item.id} >{`${item.nombre} `}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                contactos &&
                <EstablecimientoOferta
                    ofertas={selectedOfer}
                    eliminar={eliminar}
                    actualizar={actualizar}
                    adicionalAdulto={adicionalAdulto}
                    adicionalNino={adicionalNino}
                    fechaIngreso={fechaIngreso}
                    fechaSalida={fechaSalida}
                    actualizarEdades={actualizarEdades}
                    setComReserva={setComReserva}
                    comReserva={comReserva}
                    setComCliente={setComCliente}
                    comCliente={comCliente}
                    actualizarFeriado={actualizarFeriado}
                />
            }
        </div>
    );
};

export default OfertaDetalle;