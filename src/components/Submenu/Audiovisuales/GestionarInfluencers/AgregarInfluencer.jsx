import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { setInfluencers } from '../../../../controllers/audiovisuales/AudiovisualesController';
import Alerta from '../../../../global/Alerta';

const AgregarInfluencer = ({ setChange, editar = false, data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const [correcto, setCorrecto] = useState();
    const [alertKey, setAlertKey] = useState(0);
    const [error, setError] = useState();

    useEffect(() => {
        if (editar && data) {
            setValue('id_influencer', data.id_influencer);
            setValue('nombre_influencer', data.nombre_influencer);
            setValue('cp_influencer', data.cp_influencer);
        }
    }, [editar, data, setValue]);

    const onSubmit = async (formData) => {
        setIsLoading(true);
        if (!isLoading) {
            const resp = await setInfluencers(formData, editar);
            setIsLoading(false);
            if (resp === true) {
                mostrarCorrecto();
                setChange(prev => prev + 1);
                handleDialogClose(false);
            } else {
                mostrarError();
            }
        }
    };

    const mostrarCorrecto = () => {
        setCorrecto(
            <Alerta
                key={alertKey}
                correcto={true}
                mensaje="Se ha guardado correctamente"
                onClose={() => setCorrecto(null)}
            />
        );
        setAlertKey(prevKey => prevKey + 1);
    };

    const mostrarError = () => {
        setError(
            <Alerta
                key={alertKey}
                correcto={false}
                mensaje="Ha ocurrido un error, intente nuevamente"
                onClose={() => setError(null)}
            />
        );
        setAlertKey(prevKey => prevKey + 1);
    };

    const handleDialogClose = (val) => {
        if (!val) {
            reset();
        }
        setIsOpen(val);
        setError(null);
    };

    return (
        <>
            {correcto}
            {editar ? (
                <span className="icon-[typcn--edit] w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" onClick={() => setIsOpen(true)}></span>
            ) : (
                <span className="z-0 icon-[solar--add-circle-bold-duotone] h-10 w-10 text-greenVE-500 cursor-pointer mt-3" onClick={() => setIsOpen(true)}></span>
            )}
            <Dialog open={isOpen} onClose={(val) => handleDialogClose(val)} static={true}>
                {error}
                <DialogPanel>
                    <h3 className='font-semibold text-black text-center'>{editar ? "Editar influencer" : "Creación de influncer"}</h3>
                    <div className='absolute right-4 top-4'>
                        <span className="icon-[mingcute--close-fill] h-6 w-6 cursor-pointer" onClick={() => setIsOpen(false)}></span>
                    </div>
                    <div className='flex flex-col'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-4 mt-4'>
                                <input className={`rounded-md outline-none  focus:ring-0 ${errors.nombre_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("nombre_influencer", { required: true })} placeholder="Nombre" />
                                <input className={`rounded-md outline-none  focus:ring-0 ${errors.cp_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("cp_influencer", { required: true })} placeholder="Código Promocional" />
                                <input className="rounded-md outline-none focus:ring-0 border-gray-300" placeholder="Categoría (Viajes, Fitness, etc.)" />
                                <input type="submit" className={`cursor-pointer  w-full border py-2 rounded-md ${isLoading ? "bg-gray-400" : "bg-greenVE-500"} text-white`} value={"Guardar"} />
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
};

export default AgregarInfluencer;
