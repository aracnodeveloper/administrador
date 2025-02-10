import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { setRedesSocialesInfluencer } from '../../../../controllers/audiovisuales/AudiovisualesController';
import Alerta from '../../../../global/Alerta';

const SocialItem = ({ item, id_redsocial, id_influencer, onUpdateItem, onDeleteItem}) => {
    const [edit, setEdit] = useState(false);
    const [usuario, setUsuario] = useState(item.nombre_usuario);
    const [enlace, setEnlace] = useState(item.url_perfil_red_social_influencer);
    const [alerta, setAlerta] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleClickSave = () => {
        setLoading(true);

        const params = {
            "tipo": "modificar",
            "id_influencer_redsocial": item.id_influencer_redsocial,
            "url_perfil_red_social_influencer": enlace,
            "nombre_usuario": usuario,
            "id_influencer": id_influencer,
            "id_redsocial": id_redsocial,
        };

        setRedesSocialesInfluencer(params).then((resp) => {
            setLoading(false);
            setEdit(false);

            if (resp) {
                onUpdateItem({ ...item, nombre_usuario: usuario, url_perfil_red_social_influencer: enlace });
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
        });
    };

    const handleClickDelete = () => {
        setLoadingDelete(true);
        const params = {
            "tipo": "eliminar",
            "id_influencer_redsocial": item.id_influencer_redsocial,
        };

        setRedesSocialesInfluencer(params).then((resp) => {
            onDeleteItem(item.id_influencer_redsocial);
            setLoadingDelete(false);
            if (!resp) {
                setAlerta(<Alerta
                    key={item.id_influencer_redsocial}
                    correcto={false}
                    mensaje="Ocurrio un error al eliminar"
                    onClose={() => setAlerta(null)}
                />);
            }
        });
    }

    return (
        <>
            {alerta}
            <tr className="odd:bg-white even:bg-gray-50">
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        <span className={`${item.url_logo_redsocial} w-7 h-4`}></span>
                        <input type={edit ? "text" : "select"} className='text-xs h-5 bg-transparent' value={usuario} onChange={(event) => setUsuario(event.target.value)}></input>
                    </div>
                </td>
                <td className="px-6 py-4">
                    {
                        edit
                            ? <input type="text" className='text-xs h-5 bg-transparent' value={enlace} onChange={(event) => setEnlace(event.target.value)}></input>
                            : <a className='hover:text-blue-600 hover:underline' target='_blank' href={enlace}>ver</a>
                    }
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

export default SocialItem;
