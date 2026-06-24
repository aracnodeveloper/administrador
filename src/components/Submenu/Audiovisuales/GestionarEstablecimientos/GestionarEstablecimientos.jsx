import React, { useEffect, useState } from 'react';
import { getEstablecimientos } from '../../../../controllers/audiovisuales/AudiovisualesController';
import EstablecimientoItem from './EstablecimientoItem';
import { getLugares, setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
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
            {alerta}
            <div className='flex-1 p-4 w-full relative'>
                {/* Header con botón agregar */}
                <div className="flex flex-wrap gap-2 mb-3 items-center">
                    <button
                        onClick={() => setEnableAdd(true)}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        <span className="text-base leading-none">+</span>
                        Nuevo establecimiento
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {data.length === 0 ? (
                        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                            <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span className="text-sm">Cargando...</span>
                        </div>
                    ) : (
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Establecimiento</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Ciudad</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {enableAdd && (
                                    <tr className='bg-green-50'>
                                        <td className="px-3 py-2">
                                            <input
                                                type='text'
                                                value={nombreEst || ''}
                                                className='border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-green-300'
                                                placeholder="Nombre del establecimiento"
                                                onChange={(event) => setNombreEst(event.target.value)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={idLug}
                                                className='border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300'
                                                onChange={(event) => setIdLug(event.target.value)}
                                            >
                                                {dataLugares && dataLugares.map((item) => (
                                                    <option key={item.id_lugar} value={item.id_lugar}>
                                                        {item.nombre_lugar}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1.5">
                                                <BtnAccion title="Guardar" onClick={() => handleClickSave()}>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </BtnAccion>
                                                <BtnAccion title="Cancelar" onClick={() => setEnableAdd(false)}>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </BtnAccion>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {data.map((item) => (
                                    <EstablecimientoItem 
                                        key={item.id_establecimiento} 
                                        item={item} 
                                        ciudades={dataLugares}
                                        onUpdateItem={handleUpdateItem}
                                        onDeleteItem={handleDeleteItem}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default GestionarEstablecimientos;