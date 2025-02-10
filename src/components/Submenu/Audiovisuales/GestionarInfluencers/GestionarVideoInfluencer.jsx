import { Dialog, DialogPanel } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getEstablecimientos, getRedesSocialesInfluencer, getVideosInfluencer, setVideosInfluencers } from '../../../../controllers/audiovisuales/AudiovisualesController';
import VideoItem from './VideoItem';

const GestionarVideoInfluencer = ({data}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [establecimientos, setEstablecimientos]=useState();
    const [videosInfluencer, setVideosInfluencer]=useState();
    const [redesInfluencer, setRedesInfluencer] = useState();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [alerta, setAlerta]=useState();

    useEffect(()=>{
        if (isOpen) {
            getVideosInfluencer(data.id_influencer).then((resp)=>{
                if(resp){
                    setVideosInfluencer(resp);
                }
            })
            getEstablecimientos().then((resp)=>{
                if(resp){
                    setEstablecimientos(resp);
                }
            })
            getRedesSocialesInfluencer(data.id_influencer).then((resp)=>{
                if(resp){
                    setRedesInfluencer(resp);
                }
            });
        }
    }, [isOpen]);

    const handleDialogClose = (val) => {
        setIsOpen(false);
        reset();
    };

    const onSubmit=(datos)=>{
        setIsLoading(true)
        const params={
            "tipo":"guardar",
            "titulo_video":datos.titulo_video,
            "id_video_post":datos.id_video_post,
            "fecha_publicacion_video":datos.fecha_publicacion_video,
            "url_miniatura_video":datos.url_miniatura_video,
            "id_establecimiento":datos.id_establecimiento,
            "id_influencer_redsocial":datos.id_influencer_redsocial
        }
        setVideosInfluencers(params).then((resp)=>{
            setIsLoading(false)
            if(resp){
                reset()
                getVideosInfluencer(data.id_influencer).then((resp)=>{
                    if(resp){
                        setVideosInfluencer(resp);
                    }
                })
            }else{

            }
        })
    }

    const handleUpdateItem = (updatedItem) => {
        setVideosInfluencer((prev) => 
            prev.map(item => item.id_video === updatedItem.id_video ? updatedItem : item)
        );
    };

    const handleDeleteItem = (id_video) => {
        setVideosInfluencer((prev) => 
            prev.filter(item => item.id_video !== id_video)
        );
    };

    return (
        <>
            <span className="icon-[material-symbols--video-library-rounded] w-5 h-5 hover:bg-green-800 cursor-pointer" onClick={() => setIsOpen(true)}></span>
            <Dialog open={isOpen} onClose={(val) => handleDialogClose(val)} static={true}>
                <DialogPanel className='max-w-screen-2xl'>
                    <h3 className='font-semibold text-black text-center'>{data.nombre_influencer}</h3>
                    <div className='absolute right-4 top-4'>
                        <span className="icon-[mingcute--close-fill] h-6 w-6 cursor-pointer" onClick={() => handleDialogClose(false)}></span>
                    </div>
                    <div className='flex flex-col'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex gap-4 mt-4'>
                                <select className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.nombre_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("id_establecimiento", { required: true })} placeholder="Url" >
                                    {
                                        establecimientos&&establecimientos.map((item)=>(
                                            <option value={item.id_establecimiento}>
                                                    {item.nombre_establecimiento}
                                            </option>
                                        ))
                                    }
                                </select>
                                <select className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.nombre_influencer ? "border-red-500 focus:border-red-500" : ""}`} {...register("id_influencer_redsocial", { required: true })} placeholder="Url" >
                                    {
                                        redesInfluencer&&redesInfluencer.map((item)=>(
                                            <option value={item.id_influencer_redsocial}>
                                                    {item.nombre_redsocial} {item.nombre_usuario}
                                            </option>
                                        ))
                                    }
                                </select>
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.titulo_video ? "border-red-500 focus:border-red-500" : ""}`} {...register("titulo_video", { required: true })} placeholder="Titulo video" />
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.id_video_post ? "border-red-500 focus:border-red-500" : ""}`} {...register("id_video_post", { required: true })} placeholder="Id Post" />
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.fecha_publicacion_video ? "border-red-500 focus:border-red-500" : ""}`} {...register("fecha_publicacion_video", { required: true })} placeholder="Fecha post" type='date' />
                                <input className={`w-1/4 rounded-md outline-none  focus:ring-0 ${errors.url_miniatura_video ? "border-red-500 focus:border-red-500" : ""}`} {...register("url_miniatura_video", { required: true })} placeholder="Url miniatura" />
                                <input type="submit" className={`cursor-pointer  w-1/4 border py-2 rounded-md ${isLoading?"bg-gray-400":"bg-greenVE-500"} text-white`} value={"Agregar"} />
                            </div>
                        </form>
                    </div>
                    <div className='mt-6'>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Video</th>
                                    <th scope="col" className="px-6 py-3">Titulo</th>
                                    <th scope="col" className="px-6 py-3">Establecimiento</th>
                                    <th scope="col" className="px-6 py-3">Perfil</th>
                                    <th scope="col" className="px-6 py-3">Id</th>
                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                    <th scope="col" className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    videosInfluencer&&videosInfluencer.map((item)=>(
                                        <VideoItem 
                                        key={item.id_video} 
                                        item={item} 
                                        onUpdateItem={handleUpdateItem}
                                        onDeleteItem={handleDeleteItem}/>
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

export default GestionarVideoInfluencer;