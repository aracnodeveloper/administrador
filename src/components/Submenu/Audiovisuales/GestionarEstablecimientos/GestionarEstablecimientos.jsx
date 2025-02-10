import React, { useEffect, useState } from 'react';
import { getEstablecimientos } from '../../../../controllers/audiovisuales/AudiovisualesController';
import EstablecimientoItem from './EstablecimientoItem';
import { getLugares, setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import { Tooltip } from 'flowbite-react';
import Alerta from '../../../../global/Alerta';

const GestionarEstablecimientos = () => {
    const [data, setData] = useState([]);
    const [dataLugares, setDataLugares]= useState();
    const [change, setChange] = useState(0);
    const [enableAdd, setEnableAdd] = useState(false);
    const [idLug, setIdLug] = useState("0");
    const [nombreEst, setNombreEst] = useState();
    const [alerta, setAlerta] = useState();

    useEffect(() => {
        getEstablecimientos().then((resp)=>{
            if(resp){
                setData(resp);
            }
        })
        getLugares().then((resp)=>{
            if(resp){
                setDataLugares(resp);
            }
        })
    }, [change]);

    const handleUpdateItem = (updatedItem) => {
        setData((prev) => 
            prev.map(item => item.id_establecimiento === updatedItem.id_establecimiento ? updatedItem : item)
        );
    };

    const handleDeleteItem = (id_establecimiento) => {
        setData((prev) => 
            prev.filter(item => item.id_establecimiento !== id_establecimiento)
        );
    };

    const handleClickSave=()=>{
        if(nombreEst!=null){
            const params={
                "tipo":"guardar",
                "nombre_establecimiento":nombreEst,
                "id_lugar":idLug
            }
            setEstablecimiento(params).then((resp)=>{
                if (resp) {
                    setEnableAdd(false)
                    setNombreEst();
                    setIdLug("0")
                    getEstablecimientos().then((resp)=>{
                        if(resp){
                            setData(resp);
                        }
                    })
                    setAlerta(<Alerta
                        correcto={true}
                        mensaje="Se ha guardado correctamente"
                        onClose={() => setAlerta(null)}
                    />);
                } else {
                    setAlerta(<Alerta
                        correcto={false}
                        mensaje="Ocurrio un error al guardar"
                        onClose={() => setAlerta(null)}
                    />);
                }
            })
        }else{
            setAlerta(<Alerta
                correcto={false}
                mensaje="Complete todos los campos"
                onClose={() => setAlerta(null)}
            />);
        }
    }

    return (
        <>
            {
                alerta
            }
            <div className='pl-3 w-full'>
                <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                    <div className='flex gap-2 items-center'>
                        <label className='text-greenVE-700 text-xl border-0'>Gestión de establecimientos</label>
                        <Tooltip className='bg-gray-700' content="Añadir influencer" arrow={false}>
                            <span className="z-0 icon-[solar--add-circle-bold-duotone] h-10 w-10 text-greenVE-500 cursor-pointer mt-3" onClick={() => setEnableAdd(true)}></span>
                        </Tooltip>
                    </div>
                    <div className='border border-gray-300 mt-2'></div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Establecimiento</th>
                                    <th scope="col" className="px-6 py-3">Ciudad</th>
                                    <th scope="col" className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    enableAdd
                                    &&<tr className='odd:bg-white even:bg-gray-50'>
                                        <td className="px-6 py-4">
                                            <input type='text' value={nombreEst}  className='text-xs h-5 bg-transparent rounded-lg' onChange={(event)=>{setNombreEst(event.target.value)}}></input>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select value={idLug} className='text-xs h-8 bg-transparent rounded-lg' onChange={(event)=>setIdLug(event.target.value)}>
                                                {
                                                    dataLugares&&dataLugares.map((item)=>(
                                                        <option value={item.id_lugar}>
                                                                {item.nombre_lugar}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Tooltip className='bg-gray-700' content="Guardar" arrow={false}>
                                                <span className="icon-[fluent--save-32-regular] w-5 h-5 hover:bg-blue-600 cursor-pointer" onClick={() => handleClickSave()}></span>
                                            </Tooltip>
                                            <Tooltip className='bg-gray-700' content="Cancelar" arrow={false}>
                                                    <span className="icon-[material-symbols--cancel-outline] w-5 h-5 hover:text-red-600 cursor-pointer" onClick={()=>setEnableAdd(false)}></span>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                }
                                {
                                    data.length ? data.map((item) => (
                                        <>
                                        <EstablecimientoItem 
                                            key={item.id_establecimiento} 
                                            item={item} 
                                            ciudades={dataLugares}
                                            onUpdateItem={handleUpdateItem}
                                            onDeleteItem={handleDeleteItem}/>
                                        
                                        </>
                                    )) : (
                                        <tr>
                                            <td colSpan="4"><span className="icon-[eos-icons--bubble-loading] h-10 w-full text-greenVE-500"></span></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GestionarEstablecimientos;