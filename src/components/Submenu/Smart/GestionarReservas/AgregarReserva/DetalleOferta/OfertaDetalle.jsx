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
        <div className='flex flex-col gap-8 animate-fadeIn'>
            {/* Controles de Selección de Oferta */}
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100'>
                {/* Buscar Establecimiento */}
                <div className='md:col-span-12 lg:col-span-5 flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        1. Seleccionar Establecimiento
                    </label>
                    <div className='relative flex items-stretch group'>
                        <input
                            value={inputEst}
                            onChange={(e) => handleChangeEst(e.target.value)}
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-l-xl text-sm font-semibold text-slate-700 outline-none focus:border-greenVE-500 focus:ring-4 focus:ring-greenVE-500/5 transition-all shadow-sm placeholder:text-slate-300'
                            placeholder='Ingrese nombre del hotel...'
                        />
                        <button
                            className='flex items-center px-4 bg-white border border-slate-200 border-l-0 rounded-r-xl hover:bg-slate-50 active:scale-95 group transition-all'
                            onClick={loadingEst ? () => { } : () => handleClickCancel()}
                        >
                            <span className='text-[10px] font-bold text-slate-400 group-hover:text-red-500 uppercase transition-colors'>Limpiar</span>
                        </button>
                    </div>

                    {suggestion && (
                        <ClickAwayListener onClickAway={handleClickAway} >
                            <div className="absolute mt-20 w-full max-w-[500px] bg-white z-[60] shadow-2xl rounded-xl border border-slate-100 overflow-hidden animate-slideUp">
                                <div className='bg-slate-50 px-4 py-2 border-b border-slate-100'>
                                    <span className='text-[9px] font-bold text-slate-400 uppercase'>Establecimientos encontrados</span>
                                </div>
                                <div className='max-h-64 overflow-y-auto'>
                                    {suggestion.map((item, key) => (
                                        <div
                                            key={key}
                                            className='flex items-center justify-between p-4 hover:bg-greenVE-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 group'
                                            onClick={() => onClickSuggestion(item)}
                                        >
                                            <div className='flex flex-col'>
                                                <span className='text-xs font-bold text-slate-700 group-hover:text-greenVE-800 transition-colors'>
                                                    {item.titulo}
                                                </span>
                                                <span className='text-[10px] text-slate-400 font-medium'>
                                                    {item.descripcion.split(",")[0].replace("en ", "")}
                                                </span>
                                            </div>
                                            <span className='text-[10px] font-bold text-greenVE-600 uppercase'>Elegir</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ClickAwayListener>
                    )}
                </div>

                {/* Buscar Oferta */}
                <div className='md:col-span-12 lg:col-span-4 flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        2. Elegir Oferta Disponible
                    </label>
                    <div className='relative flex'>
                        <select
                            value={selectedIndexOfer}
                            onChange={(event) => handleChangeOfer(event.target.value)}
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-greenVE-500 transition-all shadow-sm'
                        >
                            <option value="-1" disabled>Seleccione una oferta disponible</option>
                            {ofertas && ofertas.map((item, index) => (
                                <option value={index} key={index}>
                                    {`$${parseFloat(item.precioOferta).toFixed(2)} - ${item.tituloOferta} (${item.estado})`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Estado de la Reserva */}
                <div className='md:col-span-12 lg:col-span-3 flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        3. Estado Actual
                    </label>
                    <div className='relative flex'>
                        <select
                            value={estadoRes}
                            onChange={(event) => setEstadoRes(event.target.value)}
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-greenVE-500 transition-all shadow-sm'
                        >
                            {Config.ESTADOS.map((item, index) => (
                                <option value={item.id} key={index}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Listado de Ofertas*/}
            {contactos && (
                <div className='animate-slideDown'>
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
                </div>
            )}
        </div>
    );
};

export default OfertaDetalle;