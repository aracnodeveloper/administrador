import { Alert, Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Config from '../../../../../global/config';
import {listarSuscriptores } from '../../../../../controllers/suscriptores/SuscriptoresController';
import { gestionarCuentaGratis } from '../../../../../controllers/callcenter/CallcenterController';
import Alerta from '../../../../../global/Alerta';

const EditarCuentaGratis = ({ open, setOpen, item, handleUpdateData}) => {
    const [estadoVenta, setEstadoVenta] = useState(1);
    const [estadoLlamada, setEstadoLlamada] = useState(1);
    const [comentario, setComentario] = useState();
    const [idSuscripcion, setIdSuscripcion]=useState();
    const [idUsuario, setIdUsuario] = useState();
    const [nombreUsuario, setNombreUsuario]=useState();
    const [suscripcionUsuario, setSuscripcionUsuario]=useState();
    const [userInput, setUserInput] = useState();
    const [suggestion, setSuggestion] = useState();
    const [isLoadingSearch, setIsLoadingSearch]=useState(false);
    const [loading, setLoading]=useState(false);
    const [correcto, setCorrecto]=useState();
    const [error, setError]=useState();

    useEffect(() => {
        if (item) {
            setEstadoLlamada(item.callcenter ? parseInt(item.callcenter.estado_llamada) : 1);
            setEstadoVenta(item.callcenter ? (item.callcenter.id_tbl_suscripcion_renovacion ? 2 : 1) : 1);
            setComentario(item.callcenter ? item.callcenter.comentario : "");
            if(item.callcenter){
                setIdUsuario(item.callcenter.codSuscriptor)
                setIdSuscripcion(item.callcenter.id_tbl_suscripcion_renovacion)
                setNombreUsuario(item.callcenter.nomSuscriptor)
                setSuscripcionUsuario(item.callcenter.producto)
            }
        }
    }, [item]);

    const handleClickClose = () => {
        item="";
        /*setEstadoVenta(1);
        setEstadoLlamada(1);
        setIdUsuario();
        setNombreUsuario();
        setSuscripcionUsuario();
        setIdSuscripcion();*/
        setUserInput();

        setOpen(false);
    }

    const onClickSuggestion=(item)=>{
        setIdUsuario(item.codigo);
        setIdSuscripcion(item.id_tbl_suscripcion_renovacion);
        setNombreUsuario(item.usuario);
        setSuscripcionUsuario(item.producto);
        setSuggestion();
    }

    const handleClickAway = () => {
        //if (suggestion || sugCedula) {
        setSuggestion(null)
        //setSugCedula(null)
        //}
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userInput /*&& !selected*/) {
                setIsLoadingSearch(true)
                listarSuscriptores({filtros:{cod_cliente:userInput}}).then((res) => {
                    setIsLoadingSearch(false)
                    setSuggestion(res.suscripciones)
                    console.log(res)
                });
            } else {
                setIsLoadingSearch(false)
                setSuggestion(null);
            }
        }, 500);
        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el valor cambia
    }, [userInput]);

    const handleClickSave=()=>{
        setLoading(true);
        var tipo;
        if(item.callcenter){
            tipo="modificar";
        }else{
            tipo="guardar";
        }
        gestionarCuentaGratis({tipo:tipo, comentario:comentario, idSuscripcion:idSuscripcion, idUsuario:item.id_tbl_usuario, llamada:estadoLlamada}).then((res)=>{
            if(res){
                setLoading(false);
                var callcenter={
                    "codSuscriptor":idUsuario,
                    "comentario":comentario,
                    "estado_llamada":estadoLlamada,
                    "fecha_fin":"",
                    "fecha_inicio":"",
                    "id_tbl_suscripcion_renovacion":idSuscripcion,
                    "nomSuscriptor":nombreUsuario,
                    "producto":suscripcionUsuario,
                    "valor":""
                }
                handleUpdateData(item.id_tbl_usuario, callcenter)
                setOpen(false);
                setCorrecto(<Alerta correcto={true} mensaje={"Se han guardado los cambios correctamente"} onClose={() => setCorrecto(null)}/>)
            }
            else{
                setLoading(false);
                setError(<Alerta correcto={false} mensaje={"No se han podido guardar los cambios"} onClose={() => setError(null)}/>)
            }
        });
    }

    return (
        <div>
            {correcto}
            <Dialog
                open={open}
                onClose={handleClickClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClickClose();
                    },
                }}
            >
                {error}
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent className='flex flex-col gap-2'>
                    <div className='flex gap-2 w-[425px] '>
                        <div className='flex flex-col gap-0.5 text-xs w-1/2'>
                            <label className='text-lg font-semibold'>Prueba Gratis</label>
                            <div className='flex items-center gap-2'>
                                <div className='h-5 w-5 flex items-center'>
                                    <span className="icon-[ph--user-circle] h-4 w-4 text-blue-600"></span>
                                </div>
                                <label className='text-gray-500 font-light block w-[170px] break-words'>{item.nombre}</label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-5 w-5 flex items-center'>
                                    <span className="icon-[mage--id-card] h-4 w-4 text-blue-600"></span>
                                </div>
                                <label className='text-gray-500 font-light block w-[170px] break-words'>{item.ci}</label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-5 w-5 flex items-center'>
                                    <span className="icon-[bi--phone] h-4 w-4 text-blue-600"></span>
                                </div>
                                <label className='text-gray-500 font-light block w-[170px] break-words'>{item.telefono}</label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-5 w-5 flex items-center'>
                                    <span className="icon-[ci--mail] h-4 w-4 text-blue-600"></span>
                                </div>
                                <label className='text-gray-500 font-light block w-[170px] break-words'>{item.mail}</label>
                            </div>
                        </div>
                        {
                            (idSuscripcion)&&
                            <div className='flex flex-col gap-0.5 text-xs w-1/2'>
                                <label className='text-lg font-semibold'>Suscripción</label>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 flex items-center'>
                                        <span className="icon-[ph--user-circle] h-4 w-4 text-blue-600"></span>
                                    </div>
                                    <label className='text-gray-500 font-light block w-[170px] break-words'>{nombreUsuario}</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 flex items-center'>
                                        <span className="icon-[hugeicons--id] h-4 w-4 text-blue-600"></span>
                                    </div>
                                    <label className='text-gray-500 font-light block w-[170px] break-words'>{idUsuario}</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='h-5 w-5 flex items-center'>
                                        <span className="icon-[solar--card-2-outline] h-4 w-4 text-blue-600"></span>
                                    </div>
                                    <label className='text-gray-500 font-light block w-[170px] break-words'>{suscripcionUsuario}</label>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='w-full flex gap-2'>
                        <Select value={estadoLlamada} className='w-52' onChange={(event) => setEstadoLlamada(event.target.value)}>
                            {
                                Config.LLAMADA.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                        <Select value={estadoVenta} className='w-52' onChange={(event) => setEstadoVenta(event.target.value)} disabled={estadoLlamada == 4 ? false : true}>
                            {
                                Config.VENTA.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </div>
                    {
                        estadoVenta == 2 &&
                        <>
                            <div className='w-full'>
                                <TextField className='w-full' placeholder='Id Suscriptor' value={userInput} onChange={(event) => setUserInput(event.target.value)}></TextField>
                                <div className='h-7 w-7 absolute -mt-10 ml-[390px] text-greenVE-600'>{isLoadingSearch&&<span className="icon-[line-md--loading-twotone-loop] h-7 w-7"></span>}</div>
                            </div>
                            <div>
                                {suggestion && (
                                <ClickAwayListener  onClickAway={handleClickAway} >
                                    <div className="absolute max-h-[17rem] w-[24.5rem] bg-white z-50 shadow-2xl p-2 overflow-y-auto  rounded-lg">
                                        {
                                            suggestion ? (
                                                suggestion.map((item, key) => (
                                                    <div key={key} className={`flex items-center p-1 ${key !== suggestion.length - 1 ? 'border-b' : ''} cursor-pointer gap-2`}>
                                                        <div className="flex justify-between w-full p-1 cursor-pointer"  onClick={() => onClickSuggestion(item)}>
                                                            <label key={key} className="cursor-pointer text-xs" >
                                                                {`ID: ${item.codigo} CI: ${item.ci_ruc} ${item.usuario}`}
                                                            </label>
                                                            {/*
                                                                item.estado == "activo"
                                                                    ? <span className="icon-[mdi--check-circle] text-greenVE-600 h-4 w-4"></span>
                                                                    : <span className="icon-[material-symbols--cancel] text-red-500 h-4 w-4"></span>*/
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (<p></p>)
                                        }
                                    </div>
                                </ClickAwayListener>
                            )}
                            </div>
                        </>
                    }
                    <div>
                        <TextareaAutosize placeholder='Comentario' className='w-full border-[#c4c4c4] rounded-md' value={comentario} onChange={(event) => setComentario(event.target.value)} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleClickSave} disabled={loading}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditarCuentaGratis;
