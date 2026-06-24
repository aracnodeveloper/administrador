import React, { useState } from 'react';
import { setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import Alerta from '../../../../global/Alerta';

// ── Botón de acción reutilizable ──────────────────────────────────────────────
const BtnAccion = ({ title, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
            disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" :
                       "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
        }`}
    >
        {children}
    </button>
);

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
        <tr className={`hover:bg-green-50 transition-colors ${edit ? 'bg-green-50' : ''}`}>
                <td className="px-3 py-2">
                    {
                        edit
                        ? <input
                            type='text'
                            className='border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-green-300'
                            value={nombreEst}
                            onChange={(event)=>setNombreEst(event.target.value)}
                          />
                        : <span className="font-semibold text-gray-800">{nombreEst}</span>
                    }
                </td>
                <td className="px-3 py-2">
                    {
                        edit
                        ? <select
                            value={idLug}
                            className='border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300'
                            onChange={(event)=>setIdLug(event.target.value)}
                          >
                            {ciudades && ciudades.map((item)=>(
                                <option key={item.id_lugar} value={item.id_lugar}>
                                    {item.nombre_lugar}
                                </option>
                            ))}
                          </select>
                        : <span className="text-gray-500">{nombreLug}</span>
                    }
                </td>
                
                <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                        {edit ? (
                            loading ? (
                                <span className="icon-[line-md--loading-twotone-loop] w-4 h-4 text-green-600"></span>
                            ) : (
                                <BtnAccion title="Guardar" onClick={() => handleClickGuardar()}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </BtnAccion>
                            )
                        ) : (
                            <BtnAccion title="Editar" onClick={() => setEdit(true)}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </BtnAccion>
                        )}
                        {edit && (
                            <BtnAccion title="Cancelar" onClick={() => setEdit(false)}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </BtnAccion>
                        )}
                        {loadingDelete ? (
                            <span className="icon-[line-md--loading-twotone-loop] w-4 h-4 text-red-500"></span>
                        ) : (
                            <BtnAccion title="Eliminar" onClick={() => handleClickDelete()}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </BtnAccion>
                        )}
                    </div>
                </td>
            </tr>
        </>
    );
};

export default EstablecimientoItem;