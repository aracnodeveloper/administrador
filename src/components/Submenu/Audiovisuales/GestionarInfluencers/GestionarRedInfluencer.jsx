import { Dialog, DialogPanel, Select, SelectItem } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { getRedesSociales, getRedesSocialesInfluencer, setRedesSocialesInfluencer } from '../../../../controllers/audiovisuales/AudiovisualesController';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'flowbite-react';
import SocialItem from './SocialItem';
import Alerta from '../../../../global/Alerta';

const GestionarRedInfluencer = ({data, setChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redes, setRedes]=useState();
    const [redesInfluencer, setRedesInfluencer]=useState();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [alerta, setAlerta]=useState();

    const handleDialogClose = (val) => {
        setChange();
        setIsOpen(val);
    };

    useEffect(()=>{
        if (isOpen) {
            getRedesSociales({"tipo":"listar"}).then((resp)=>{
                if(resp){
                    setRedes(resp);
                }
            });
            getRedesSocialesInfluencer(data.id_influencer).then((resp)=>{
                if(resp){
                    setRedesInfluencer(resp);
                }
            });
        }
    }, [isOpen]);

    const onSubmit = async (formData) => {
        setIsLoading(true);
        const params ={
            "tipo":"guardar",
            "url_perfil_red_social_influencer": formData.url_perfil_red_social_influencer,
            "nombre_usuario":formData.nombre_usuario,
            "id_influencer":data.id_influencer,
            "id_redsocial":formData.id_redsocial
        }
        !isLoading&&setRedesSocialesInfluencer(params).then((resp)=>{
            setIsLoading(false);
            if(resp){
                reset();
                getRedesSocialesInfluencer(data.id_influencer).then((resp)=>{
                    if(resp){
                        setRedesInfluencer(resp);
                    }
                });
                setAlerta(<Alerta
                    key={data.id_influencer}
                    correcto={true}
                    mensaje="Se ha agregado correctamente"
                    onClose={()=>setAlerta(null)}
                />);
            }else{
                setAlerta(<Alerta
                    key={data.id_influencer}
                    correcto={false}
                    mensaje="Ocurrio un error al agregar"
                    onClose={()=>setAlerta(null)}
                />);
            }
        });
    };

    const handleUpdateItem = (updatedItem) => {
        setRedesInfluencer((prev) => 
            prev.map(item => item.id_influencer_redsocial === updatedItem.id_influencer_redsocial ? updatedItem : item)
        );
    };

    const handleDeleteItem = (id_influencer_redsocial) => {
        setRedesInfluencer((prev) => 
            prev.filter(item => item.id_influencer_redsocial !== id_influencer_redsocial)
        );
    };


    return (
        <>
            <span className="icon-[majesticons--hashtag-line] w-5 h-5 hover:text-amber-500 cursor-pointer" onClick={() => setIsOpen(true)}></span>
            <Dialog open={isOpen} onClose={(val) => handleDialogClose(val)} static={true}>
                <DialogPanel className='max-w-screen-md'>
                    <h3 className='font-semibold text-black text-center'>{data.nombre_influencer}</h3>
                    <div className='absolute right-4 top-4'>
                        <span className="icon-[mingcute--close-fill] h-6 w-6 cursor-pointer" onClick={() => handleDialogClose(false)}></span>
                    </div>
                    <div className='flex flex-col'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex gap-4 mt-4'>
                                <select className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.nombre_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("id_redsocial", { required: true })} placeholder="Url" >
                                    {
                                        redes&&redes.map((item)=>(
                                            <option value={item.id_redsocial}>
                                                    {item.nombre_redsocial}
                                            </option>
                                        ))
                                    }
                                </select>
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.nombre_usuario ? "border-red-500 focus:border-red-500" : ""}`} {...register("nombre_usuario", { required: true })} placeholder="Usuario" />
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.url_perfil_redsocial_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("url_perfil_red_social_influencer", { required: true })} placeholder="URL Perfil" />
                                <input type="submit" className={` cursor-pointer  w-1/4 border py-2 rounded-md ${isLoading?"bg-gray-400":"bg-greenVE-500"} text-white`} value={"Agregar"} />
                            </div>
                        </form>
                    </div>
                    <div className='mt-6'>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Red social</th>
                                    <th scope="col" className="px-6 py-3">Enlace</th>
                                    <th scope="col" className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    redesInfluencer&&redesInfluencer.map((item)=>(
                                        <SocialItem 
                                            key={item.id_influencer_redsocial} 
                                            item={item} 
                                            id_influencer={data.id_influencer} 
                                            id_redsocial={item.id_redsocial}
                                            onUpdateItem={handleUpdateItem}
                                            onDeleteItem={handleDeleteItem}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
};

export default GestionarRedInfluencer;
