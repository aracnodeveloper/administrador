import React, { useEffect, useState } from 'react';
import SuscriptorDetalle from './SuscriptorDetalle';
import { buscarCliente, buscarUsuarios, informacionUsuarios } from '../../../../../../controllers/smart/SmartController';
import ClickAwayListener from 'react-click-away-listener';
import ClienteDetalle from './ClienteDetalle';
var selected = false;
const SuscriptorReserva = ({
    inputValue,
    setInputValue,
    user, setUser,
    adicional,
    setAdicional,
    cedulaValue,
    setCedulaValue,
    clientes,
    setClientes,
    empresa,
    setEmpresa
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingCed, setLoadingCed] = useState(false);
    const [suggestion, setSuggestion] = useState();
    const [sugCedula, setSugCedula] = useState();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue !== '' && !selected) {
                setLoading(true)
                buscarUsuarios(inputValue).then((res) => {
                    setLoading(false)
                    setSuggestion(res)
                });
            } else {
                setLoading(false)
                setSuggestion(null);
            }
        }, 500);
        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el valor cambia
    }, [inputValue]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (cedulaValue !== '' && !selected) {
                setLoadingCed(true)
                buscarCliente(cedulaValue).then((res) => {
                    console.log(res)
                    setLoadingCed(false)
                    setSugCedula(res)
                });
            } else {
                setLoadingCed(false)
                setSugCedula(null);
            }
        }, 500);
        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el valor cambia
    }, [cedulaValue]);

    const handleChangeCedula = (value) => {
        selected = false;
        setCedulaValue(value);
    };

    const handleChange = (value) => {
        selected = false;
        setInputValue(value);
    };

    const handleClickAway = () => {
        if (suggestion || sugCedula) {
            setSuggestion(null)
            setSugCedula(null)
        }
    };

    const onClickSuggestion = (item) => {
        selected = true;
        informacionUsuarios(item.id_tbl_usuario).then((res) => {
            setUser(res)
            setInputValue(item.nombres)
            setSuggestion(null)
        });
    }

    const onClickSuggestionCed = (item) => {
        selected = true;
        handleAddCliente(item);
        setSugCedula(null)
        setCedulaValue('')
    }

    const handleCLickCancel = () => {
        setUser();
        setInputValue('');
    }

    const handleCLickCancelCed = () => {
        setCedulaValue('');
    }

    const handleAddCliente = (item) => {
        setClientes(prevClientes => [...prevClientes, item]);
    }

    const handleDeleteCliente = (index) => {
        setClientes(prevClientes => prevClientes.filter((_, i) => i !== index));
    };

    return (
        <div className='flex flex-col lg:flex-row w-full gap-8 animate-fadeIn'>
            {/* Columna Izquierda: Búsqueda y Configuración */}
            <div className='w-full lg:w-1/2 flex flex-col gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100'>
                <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                        1. Localizar Suscriptor
                    </label>
                    <div className='relative flex items-stretch group'>
                        <input
                            value={inputValue} 
                            onChange={(e) => handleChange(e.target.value)}
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-l-xl text-sm font-semibold text-slate-700 outline-none transition-all focus:border-greenVE-500 focus:ring-4 focus:ring-greenVE-500/5 shadow-sm placeholder:text-slate-300'
                            placeholder='Escriba nombres, cédula o ID...'
                        />
                        <button 
                            className='flex items-center px-4 bg-white border border-slate-200 border-l-0 rounded-r-xl transition-all hover:bg-slate-50 active:scale-95 group'
                            onClick={loading ? () => { } : () => handleCLickCancel()}
                        >
                            <span className='text-[10px] font-bold text-slate-400 group-hover:text-red-500 uppercase transition-colors'>Limpiar</span>
                        </button>
                    </div>

                    {suggestion && (
                        <ClickAwayListener onClickAway={handleClickAway} >
                            <div className="absolute mt-20 w-full max-w-[500px] bg-white z-[60] shadow-2xl rounded-xl border border-slate-100 overflow-hidden animate-slideUp">
                                <div className='bg-slate-50 px-4 py-2 border-b border-slate-100'>
                                    <span className='text-[9px] font-bold text-slate-400 uppercase'>Resultados de búsqueda</span>
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
                                                    {item.nombres}
                                                </span>
                                                <span className='text-[10px] text-slate-400 font-medium'>
                                                    {`ID: ${item.usuario}  •  CI: ${item.ci_ruc}`}
                                                </span>
                                            </div>
                                            {item.estado === "activo"
                                                ? <span className="text-[10px] font-bold text-greenVE-600 uppercase bg-greenVE-50 px-2 py-0.5 rounded-full border border-greenVE-100">Activo</span>
                                                : <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Inactivo</span>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ClickAwayListener>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                            2. Configurar Empresa
                        </label>
                        <select 
                            className='w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-greenVE-500 transition-all shadow-sm'
                            value={empresa} 
                            onChange={(event)=>setEmpresa(event.target.value)}
                        >
                            <option value={"1"}>VisitaEcuador.com</option>
                            <option value={"2"}>Hoteles FullVacations</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-0'>Persona Adicional</label>
                        <label className={`flex items-center gap-3 h-11 px-4 rounded-xl border transition-all cursor-pointer shadow-sm
                            ${adicional 
                                ? "bg-greenVE-600 border-greenVE-600 text-white shadow-greenVE-100" 
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                            <input 
                                type='checkbox' 
                                className='w-4 h-4 rounded border-slate-300 text-greenVE-600 focus:ring-greenVE-500 bg-white' 
                                checked={adicional} 
                                onChange={() => {setAdicional(!adicional); setClientes([])}} 
                            />
                            <span className='text-[11px] font-bold uppercase tracking-tight'>Pasajero Adicional</span>
                        </label>
                    </div>
                </div>

                {user && (
                    <div className='mt-2 animate-slideDown'>
                        <SuscriptorDetalle user={user} />
                    </div>
                )}
            </div>

            {/* Columna Derecha: Detalle Adicional */}
            <div className='w-full lg:w-1/2 flex flex-col gap-6'>
                {adicional && (
                    <div className='flex flex-col gap-2 animate-fadeIn'>
                        <label className='text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1'>
                            3. Buscar Pasajero Adicional
                        </label>
                        <div className='relative flex items-stretch group'>
                            <input
                                value={cedulaValue} 
                                onChange={(e) => handleChangeCedula(e.target.value)}
                                className='w-full h-11 px-4 bg-white border border-slate-200 rounded-l-xl text-sm font-semibold text-slate-700 outline-none transition-all focus:border-greenVE-500 focus:ring-4 focus:ring-greenVE-500/5 shadow-sm placeholder:text-slate-300'
                                placeholder='Ingrese cédula del pasajero...'
                            />
                            <button 
                                className='flex items-center px-4 bg-white border border-slate-200 border-l-0 rounded-r-xl hover:bg-slate-50 active:scale-95 group transition-all'
                                onClick={loadingCed ? () => { } : () => handleCLickCancelCed()}
                            >
                                <span className='text-[10px] font-bold text-slate-400 group-hover:text-red-500 uppercase transition-colors'>Limpiar</span>
                            </button>
                        </div>

                        {sugCedula && (
                            <ClickAwayListener onClickAway={handleClickAway} >
                                <div className="absolute mt-20 w-full max-w-[400px] bg-white z-[60] shadow-2xl rounded-xl border border-slate-100 overflow-hidden animate-slideUp cursor-pointer"
                                     onClick={() => onClickSuggestionCed(sugCedula)}>
                                    <div className='flex items-center justify-between p-4 hover:bg-greenVE-50 transition-all group'>
                                        <div className='flex flex-col'>
                                            <span className='text-xs font-bold text-slate-700 group-hover:text-greenVE-800 transition-colors uppercase'>
                                                {sugCedula.nombres}
                                            </span>
                                            <span className='text-[10px] text-slate-400 font-medium'>
                                                {`CI: ${sugCedula.ci}`}
                                            </span>
                                        </div>
                                        <span className='text-[10px] font-bold text-greenVE-600 uppercase'>Añadir</span>
                                    </div>
                                </div>
                            </ClickAwayListener>
                        )}
                    </div>
                )}
                
                {clientes && clientes.length > 0 && (
                    <div className='animate-slideDown'>
                        <ClienteDetalle clientes={clientes} handleDeleteCliente={handleDeleteCliente}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuscriptorReserva;