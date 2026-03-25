import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import Alerta from '../../../../global/Alerta';

const EstablecimientoItem = ({ item, ciudades, onUpdateItem, onDeleteItem }) => {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [nombreEst, setNombreEst] = useState(item.nombre_establecimiento);
    const [nombreLug, setNombreLug] = useState(item.nombre_lugar);
    const [idLug, setIdLug] = useState(item.id_lugar);
    const [alerta, setAlerta] = useState();

    const obtenerNombreLugar = (idLugar) => {
        const mapEncontrado = ciudades.find(map => map.id_lugar === idLugar);
        const name = mapEncontrado ? mapEncontrado.nombre_lugar : null;
        setNombreLug(name);
        return name;
    }

    const handleClickDelete = () => {
        setLoadingDelete(true);
        const params = {
            "tipo": "eliminar",
            "id_establecimiento": item.id_establecimiento
        }
        setEstablecimiento(params).then((resp) => {
            setLoadingDelete(false);
            if (resp) {
                setEdit(false);
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
                    mensaje="Ocurrió un error al eliminar"
                    onClose={() => setAlerta(null)}
                />);
            }
        })
    }

    const handleClickGuardar = () => {
        setLoading(true);
        const params = {
            "tipo": "modificar",
            "id_establecimiento": item.id_establecimiento,
            "nombre_establecimiento": nombreEst,
            "id_lugar": idLug
        }
        setEstablecimiento(params).then((resp) => {
            setLoading(false);
            if (resp) {
                setEdit(false);
                onUpdateItem({ ...item, nombre_establecimiento: nombreEst, id_lugar: idLug, nombre_lugar: obtenerNombreLugar(idLug) });
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
                    mensaje="Ocurrió un error al modificar"
                    onClose={() => setAlerta(null)}
                />);
            }
        })
    }

    return (
        <>
            {alerta}
            <tr className="hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9]">
                <td className="px-6 py-4">
                    {edit ? (
                        <input 
                            type='text' 
                            className='w-full text-[13px] border-[#cbd5e1] rounded bg-white py-1 focus:ring-1 focus:ring-[#0f172a]' 
                            value={nombreEst} 
                            onChange={(event) => setNombreEst(event.target.value)}
                        />
                    ) : (
                        <span className="font-bold text-[#1e293b]">
                            {nombreEst}
                        </span>
                    )}
                </td>
                <td className="px-6 py-4">
                    {edit ? (
                        <select 
                            value={idLug} 
                            className='w-full text-[13px] border-[#cbd5e1] rounded bg-white py-1 focus:ring-1 focus:ring-[#0f172a]' 
                            onChange={(event) => setIdLug(event.target.value)}
                        >
                            {ciudades && ciudades.map((city) => (
                                <option key={city.id_lugar} value={city.id_lugar}>
                                    {city.nombre_lugar}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center gap-1.5 text-[#64748b]">
                            <span className="icon-[material-symbols--location-on-outline] text-sm"></span>
                            <span className="font-medium">{nombreLug}</span>
                        </div>
                    )}
                </td>

                <td className="px-6 py-4">
                    <div className="flex gap-4 justify-center">
                        {edit ? (
                            <button 
                                onClick={handleClickGuardar} 
                                className="text-[#2563eb] hover:scale-110 transition-transform flex items-center"
                                title="Guardar Cambios"
                            >
                                {loading ? <span className="icon-[line-md--loading-twotone-loop] w-5 h-5"></span> : <span className="icon-[material-symbols--check-circle] text-xl"></span>}
                            </button>
                        ) : (
                            <button 
                                onClick={() => setEdit(true)} 
                                className="text-[#64748b] hover:text-greenVE-600 hover:scale-110 transition-all flex items-center"
                                title="Editar"
                            >
                                <span className="icon-[material-symbols--edit-document-outline] text-xl"></span>
                            </button>
                        )}

                        <button 
                            onClick={handleClickDelete} 
                            className="text-[#94a3b8] hover:text-red-500 hover:scale-110 transition-all flex items-center"
                            title="Eliminar"
                        >
                            {loadingDelete ? <span className="icon-[line-md--loading-twotone-loop] w-5 h-5"></span> : <span className="icon-[material-symbols--delete-outline-rounded] text-xl"></span>}
                        </button>
                    </div>
                </td>

            </tr>
        </>
    );
};


export default EstablecimientoItem;