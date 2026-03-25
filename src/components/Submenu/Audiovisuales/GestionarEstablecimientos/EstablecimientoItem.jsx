import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import Alerta from '../../../../global/Alerta';

const EstablecimientoItem = ({ item, ciudades, onUpdateItem, onDeleteItem, index }) => {
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
            <tr className="hover:bg-[#f8fafc] transition-colors even:bg-[#fcfdfe] odd:bg-white text-[13px]">
                <td className="px-5 py-3 border-r border-[#f1f5f9] font-mono text-[11px] text-[#94a3b8] text-center">
                    {String(index).padStart(2, '0')}
                </td>
                <td className="px-5 py-3 border-r border-[#f1f5f9]">
                    {edit ? (
                        <input 
                            type='text' 
                            className='w-full text-[13px] font-medium border-[#e2e8f0] rounded bg-white py-1 px-3 focus:ring-1 focus:ring-[#334155] focus:border-[#334155] outline-none transition-all' 
                            value={nombreEst} 
                            onChange={(event) => setNombreEst(event.target.value)}
                        />
                    ) : (
                        <span className="font-medium text-[#475569]">
                            {nombreEst}
                        </span>
                    )}
                </td>
                <td className="px-5 py-3 border-r border-[#f1f5f9] text-center">
                    {edit ? (
                        <select 
                            value={idLug} 
                            className='w-full text-[13px] font-medium border-[#e2e8f0] rounded bg-white py-1 px-3 focus:ring-1 focus:ring-[#334155] focus:border-[#334155] outline-none transition-all cursor-pointer' 
                            onChange={(event) => setIdLug(event.target.value)}
                        >
                            {ciudades && ciudades.map((city) => (
                                <option key={city.id_lugar} value={city.id_lugar}>
                                    {city.nombre_lugar}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-[#64748b]">
                            {nombreLug}
                        </span>
                    )}
                </td>

                <td className="px-5 py-3 text-center">
                    <div className="flex gap-4 justify-center items-center">
                        {edit ? (
                            <button 
                                onClick={handleClickGuardar} 
                                className="text-[#94a3b8] hover:text-green-600 transition-colors"
                                title="Guardar"
                            >
                                {loading ? <span className="icon-[line-md--loading-twotone-loop] w-5 h-5 block"></span> : <span className="icon-[material-symbols--check-circle] text-2xl block"></span>}
                            </button>
                        ) : (
                            <button 
                                onClick={() => setEdit(true)} 
                                className="text-[#94a3b8] hover:text-[#334155] transition-colors"
                                title="Editar"
                            >
                                <span className="icon-[material-symbols--edit-document-outline] text-xl block"></span>
                            </button>
                        )}

                        <button 
                            onClick={handleClickDelete} 
                            className="text-[#94a3b8] hover:text-red-500 transition-colors"
                            title="Eliminar"
                        >
                            {loadingDelete ? <span className="icon-[line-md--loading-twotone-loop] w-5 h-5 block"></span> : <span className="icon-[material-symbols--delete-outline-rounded] text-xl block"></span>}
                        </button>
                    </div>
                </td>
            </tr>

        </>
    );
};


export default EstablecimientoItem;