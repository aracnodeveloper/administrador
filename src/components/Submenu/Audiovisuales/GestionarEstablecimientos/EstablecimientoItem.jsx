import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import Alerta from '../../../../global/Alerta';

const EstablecimientoItem = ({item, ciudades, onUpdateItem, onDeleteItem}) => {
    const [edit, setEdit] = useState();
    const [loading, setLoading] = useState();
    const [loadingDelete, setLoadingDelete] = useState();
    const [nombreEst, setNombreEst]=useState(item.nombre_establecimiento);
    const [nombreLug, setNombreLug]=useState(item.nombre_lugar);
    const [idLug, setIdLug] = useState(item.id_lugar);
    const [alerta, setAlerta] = useState();

    const obtenerNombreLugar=(idLugar)=>{
        const mapEncontrado = ciudades.find(map => map.id_lugar === idLugar);
        setNombreLug(mapEncontrado ? mapEncontrado.nombre_lugar: null);
        return mapEncontrado ? mapEncontrado.nombre_lugar: null;
    }

    const handleClickDelete=()=>{
        setLoadingDelete(true);
        const params={
            "tipo":"eliminar",
            "id_establecimiento":item.id_establecimiento
        }
        setEstablecimiento(params).then((resp)=>{
            setLoadingDelete(false);
            if (resp) {
                setEdit(false)
                onDeleteItem(item.id_establecimiento);
                setAlerta(<Alerta
                    key={item.id_establecimiento}
                    correcto={true}
                    mensaje="Se ha eliminado correctamente"
                    onClose={() => setAlerta(null)}
                />);
            } else {
                setAlerta(<Alerta
                    key={item.id_establecimiento}
                    correcto={false}
                    mensaje="Ocurrio un error al eliminar"
                    onClose={() => setAlerta(null)}
                />);
            }
        })
    }

    const handleClickGuardar=()=>{
        setLoading(true);
        const params={
            "tipo":"modificar",
            "id_establecimiento":item.id_establecimiento,
            "nombre_establecimiento":nombreEst,
            "id_lugar":idLug
        }
        setEstablecimiento(params).then((resp)=>{
            setLoading(false);
            if (resp) {
                setEdit(false)
                onUpdateItem({ ...item, nombre_establecimiento: nombreEst, id_lugar: idLug, nombre_lugar: obtenerNombreLugar(idLug)});
                setAlerta(<Alerta
                    key={item.id_establecimiento}
                    correcto={true}
                    mensaje="Se ha modificado correctamente"
                    onClose={() => setAlerta(null)}
                />);
            } else {
                setAlerta(<Alerta
                    key={item.id_establecimiento}
                    correcto={false}
                    mensaje="Ocurrio un error al modificar"
                    onClose={() => setAlerta(null)}
                />);
            }
        })
    }

    return (
        <>
        {alerta}
        <tr className="odd:bg-white even:bg-gray-50">
                <td className="px-6 py-4">
                    {
                        edit
                        ?<input type='text'  className='text-xs h-5 bg-transparent' value={nombreEst} onChange={(event)=>setNombreEst(event.target.value)}></input>
                        :<label>{nombreEst}</label>
                    }
                </td>
                <td className="px-6 py-4">
                    <div className='flex items-center gap-2'>
                        {
                            edit
                            ?<select value={idLug} className='text-xs h-8 bg-transparent' onChange={(event)=>setIdLug(event.target.value)}>
                                {
                                    ciudades&&ciudades.map((item)=>(
                                        <option value={item.id_lugar}>
                                                {item.nombre_lugar}
                                        </option>
                                    ))
                                }
                            </select>
                            :<label  className='text-xs h-5 bg-transparent' >{nombreLug}</label>
                        } 
                        
                    </div>
                </td>
                
                <td className="px-6 py-4 flex gap-2">
                    <Tooltip className='bg-gray-700' content={edit ? "Guardar" : "Editar"} arrow={false}>
                        {
                            edit
                                ? loading ? <span className="icon-[line-md--loading-twotone-loop]  w-5 h-5"></span> : <span className="icon-[fluent--save-32-regular] w-5 h-5 hover:bg-blue-600 cursor-pointer" onClick={() => handleClickGuardar()}></span>
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

export default EstablecimientoItem;