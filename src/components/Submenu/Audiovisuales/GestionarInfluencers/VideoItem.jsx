import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { setRedesSocialesInfluencer, setVideosInfluencers } from '../../../../controllers/audiovisuales/AudiovisualesController';
import Alerta from '../../../../global/Alerta';

const VideoItem = ({ item, onUpdateItem, onDeleteItem}) => {
    const [edit, setEdit] = useState();
    const [loading, setLoading] = useState();
    const [loadingDelete, setLoadingDelete] = useState();
    const [idVideo, setIdVideo]= useState(item.id_video_post);
    const [tituloVideo, setTituloVideo]= useState(item.titulo_video);
    const [urlMiniatura, setUrlMiniatura]= useState(item.url_miniatura_video);
    const [alerta, setAlerta] = useState();
    var pathVideo;


    const handleClickSave=()=>{
        setLoading(true);
        const params = {
            "tipo": "modificar",
            "id_video": item.id_video,
            "titulo_video": tituloVideo,
            "id_video_post": idVideo,
            "url_miniatura_video": urlMiniatura,
        };

        setVideosInfluencers(params).then((resp)=>{
            setLoading(false);
            setEdit(false);
            if (resp) {
                onUpdateItem({ ...item, titulo_video: tituloVideo, id_video_post: idVideo,  url_miniatura_video:urlMiniatura});
                setAlerta(<Alerta
                    key={item.id_influencer_redsocial}
                    correcto={true}
                    mensaje="Se ha modificado correctamente"
                    onClose={() => setAlerta(null)}
                />);
            } else {
                setAlerta(<Alerta
                    key={item.id_influencer_redsocial}
                    correcto={false}
                    mensaje="Ocurrio un error al modificar"
                    onClose={() => setAlerta(null)}
                />);
            }
        })
    }

    const handleClickDelete=()=>{
        setLoadingDelete(true);
        const params = {
            "tipo": "eliminar",
            "id_video": item.id_video,
        };

        setVideosInfluencers(params).then((resp) => {
            setLoadingDelete(false);
            if (!resp) {
                setAlerta(<Alerta
                    key={item.id_influencer_redsocial}
                    correcto={false}
                    mensaje="Ocurrio un error al eliminar"
                    onClose={() => setAlerta(null)}
                />);
            }else{
                onDeleteItem(item.id_video);
            }
        });
    }

    switch (item.nombre_redsocial.toLowerCase()){
        case "youtube":
            pathVideo =`https://www.youtube.com/watch?v=${idVideo}`;
            break;
        case "facebook":
            pathVideo = `https://www.facebook.com/watch/?v=${idVideo}`;
            break;
        case "tiktok":
            pathVideo = `https://www.tiktok.com/@f1tornello/video/${idVideo}`;
            break;
        case "instagram":
            pathVideo = `https://www.instagram.com/reel/${idVideo}`;
            break;
    }
        

    return (
        <>
            <tr className="odd:bg-white even:bg-gray-50">
                <td className="px-6 py-4">
                    {
                        edit
                        ?<input type='text'  className='text-xs h-5 bg-transparent' value={urlMiniatura} onChange={(event)=>setUrlMiniatura(event.target.value)}></input>
                        :<a href={pathVideo} target='_blank'><img src={item.url_miniatura_video}  className='h-8 w-12 cursor-pointer object-cover' /> </a>
                    }
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        {
                            edit
                            ?<input type='text'  className='text-xs h-5 bg-transparent' value={tituloVideo} onChange={(event)=>setTituloVideo(event.target.value)}></input>
                            :<label  className='text-xs h-5 bg-transparent' >{tituloVideo}</label>
                        }
                        
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        <label  className='text-xs h-5 bg-transparent'>{item.nombre_establecimiento}</label>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        <span className={`${item.url_logo_redsocial} w-7 h-4`}></span>
                        <a href={item.url_perfil_red_social_influencer} target='_blank' className='text-xs h-5 bg-transparent'>{item.nombre_usuario}</a>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        <input type={edit?"text":"select"} className='text-xs h-5 bg-transparent' value={idVideo} onChange={(event) => setIdVideo(event.target.value)}></input>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                    <label  className='text-xs h-5 bg-transparent'>{item.fecha_publicacion_video}</label>
                    </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                    <Tooltip className='bg-gray-700' content={edit ? "Guardar" : "Editar"} arrow={false}>
                        {
                            edit
                                ? loading ? <span className="icon-[line-md--loading-twotone-loop]  w-5 h-5"></span> : <span className="icon-[fluent--save-32-regular] w-5 h-5 hover:bg-blue-600 cursor-pointer" onClick={() => handleClickSave()}></span>
                                : <span className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600 cursor-pointer" onClick={() => setEdit(true)}></span>
                        }
                    </Tooltip>
                    <Tooltip className='bg-gray-700' content="Eliminar" arrow={false}>
                        {
                            loadingDelete
                            ?<span className="icon-[line-md--loading-twotone-loop]  w-5 h-5"></span>
                            :<span className="icon-[material-symbols--delete] w-5 h-5 hover:text-red-600 cursor-pointer" onClick={()=>handleClickDelete()}></span>
                        }
                    </Tooltip>
                </td>
            </tr>
        </>

    );
};

export default VideoItem;
