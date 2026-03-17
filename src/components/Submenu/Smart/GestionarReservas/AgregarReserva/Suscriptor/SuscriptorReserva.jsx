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
        <div className='flex flex-col md:flex-row w-full p-4 z-10 gap-4 item'>
            <div className='w-full md:w-1/2 flex flex-col gap-3'>
                
                <div className='flex w-full flex-col'>
                    <label className='font-semibold text-xs'>Buscar Suscriptor</label>
                    <div className='flex'>
                        <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                            <span className="icon-[fontisto--person] text-greenVE-600"></span>
                        </div>
                        <div className='w-full'>
                            <input
                                value={inputValue} onChange={(e) => handleChange(e.target.value)}
                                className='text-xs w-full'
                                placeholder='Ingrese nombres, cédula o id de usuario'
                            ></input>
                        </div>
                        <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-l-0 cursor-pointer' onClick={loading ? () => { } : () => handleCLickCancel()}>
                            {
                                !loading
                                    ? <span className="icon-[game-icons--cancel] text-greenVE-600"></span>
                                    : <span className="icon-[line-md--loading-twotone-loop]"></span>
                            }
                        </div>
                    </div>
                </div>
                {suggestion && (
                    <ClickAwayListener onClickAway={handleClickAway} >
                        <div className="absolute mt-14 max-h-[17rem] w-[34.5rem] bg-white z-50 shadow-2xl p-2 overflow-y-auto  rounded-lg">
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
                <div className='flex gap-4'>
                    <div className='flex  flex-col w-1/2'>
                        <label className='font-semibold text-xs'>Seleccionar Empresa</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[fontisto--person] text-greenVE-600"></span>
                            </div>
                            <div className='w-full'>
                                <select className='text-xs w-full' value={empresa} onChange={(event)=>setEmpresa(event.target.value)}>
                                    <option value={"1"}>VisitaEcuador.com</option>
                                    <option value={"2"}>Hoteles FullVacations</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-[16px] w-1/2'>
                        <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0 h-[34px]'>
                            <input className='cursor-pointer' type='checkbox' checked={adicional} onChange={() => {setAdicional(!adicional); setClientes([])}} />
                        </div>
                        <div className='w-full bg-white border border-black px-2 py-2 text-xs h-[34px]'>
                            <label>Reserva para persona adicional</label>
                        </div>
                    </div>
                </div>
                {
                    user && <SuscriptorDetalle user={user} />
                }
            </div>
            <div className='w-full md:w-1/2 flex flex-col gap-3'>
                <div className='flex gap-4 flex-full'>
                    
                    {
                        adicional
                            ? <div className='flex mt-[16px] w-1/2'>
                                <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0 h-[34px]'>
                                    <span className="icon-[fontisto--person] text-greenVE-600"></span>
                                </div>
                                <div className='w-full'>
                                    <input
                                        value={cedulaValue} onChange={(e) => handleChangeCedula(e.target.value)}
                                        className='text-xs w-full'
                                        placeholder='Ingrese cédula'
                                    ></input>
                                </div>
                                <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-l-0 cursor-pointer h-[34px]' onClick={loadingCed ? () => { } : () => handleCLickCancelCed()}>
                                    {
                                        !loadingCed
                                            ? <span className="icon-[game-icons--cancel] text-greenVE-600"></span>
                                            : <span className="icon-[line-md--loading-twotone-loop]"></span>
                                    }
                                </div>
                            </div>
                            : <></>
                    }
                    {sugCedula && (
                        <ClickAwayListener onClickAway={handleClickAway} >
                            <div className=" absolute mt-14 max-h-[17rem] w-[34.5rem] bg-white z-50 shadow-2xl p-2 overflow-y-auto  rounded-lg">
                                <div className="flex justify-between w-full p-1 cursor-pointer" onClick={() => onClickSuggestionCed(sugCedula)} >
                                    <label className="text-sm cursor-pointer text-xs" >
                                        {`CI: ${sugCedula.ci} ${sugCedula.nombres}`}
                                    </label>
                                </div>
                            </div>
                        </ClickAwayListener>
                    )}
                </div>
                {
                    clientes && clientes.length > 0 ? <ClienteDetalle clientes={clientes} handleDeleteCliente={handleDeleteCliente}/> : <></>
                }
            </div>
        </div>
    );
};

export default SuscriptorReserva;