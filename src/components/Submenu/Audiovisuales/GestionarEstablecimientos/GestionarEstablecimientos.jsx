import React, { useEffect, useState } from 'react';
import { getEstablecimientos } from '../../../../controllers/audiovisuales/AudiovisualesController';
import EstablecimientoItem from './EstablecimientoItem';
import { getLugares, setEstablecimiento } from '../../../../controllers/establecimientos/EstablecimientosController';
import { Tooltip } from 'flowbite-react';
import Alerta from '../../../../global/Alerta';

const GestionarEstablecimientos = () => {
    const [data, setData] = useState([]);
    const [dataLugares, setDataLugares] = useState();
    const [enableAdd, setEnableAdd] = useState(false);
    const [idLug, setIdLug] = useState("0");
    const [nombreEst, setNombreEst] = useState();
    const [alerta, setAlerta] = useState();

    useEffect(() => {
        getEstablecimientos().then((resp) => {
            if (resp) {
                setData(resp);
            }
        });
        getLugares().then((resp) => {
            if (resp) {
                setDataLugares(resp);
            }
        });
    }, []);

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

    const handleClickSave = () => {
        if (nombreEst != null) {
            const params = {
                "tipo": "guardar",
                "nombre_establecimiento": nombreEst,
                "id_lugar": idLug
            };
            setEstablecimiento(params).then((resp) => {
                if (resp) {
                    setEnableAdd(false);
                    setNombreEst();
                    setIdLug("0");
                    getEstablecimientos().then((resp) => {
                        if (resp) {
                            setData(resp);
                        }
                    });
                    setAlerta(<Alerta
                        correcto={true}
                        mensaje="Se ha guardado correctamente"
                        onClose={() => setAlerta(null)}
                    />);
                } else {
                    setAlerta(<Alerta
                        correcto={false}
                        mensaje="Ocurrió un error al guardar"
                        onClose={() => setAlerta(null)}
                    />);
                }
            });
        } else {
            setAlerta(<Alerta
                correcto={false}
                mensaje="Complete todos los campos"
                onClose={() => setAlerta(null)}
            />);
        }
    };

    return (
        <>
            {alerta}
            <div className='w-full'>
                <div className='bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden'>
                    {/* Header */}
                    <div className='px-8 py-6 border-b border-[#e2e8f0] bg-[#fdfdfd] flex justify-between items-center'>
                        <div>
                            <h2 className='text-xl font-bold text-[#1e293b] flex items-center gap-2'>
                                <span className="icon-[material-symbols--apartment] text-3xl text-greenVE-500"></span>
                                Gestión de Establecimientos
                            </h2>
                        </div>

                        <div className="flex gap-2">
                            {!enableAdd && (
                                <button
                                    onClick={() => setEnableAdd(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-greenVE-500 text-white rounded text-xs font-bold hover:bg-greenVE-600 transition-all shadow-md shadow-greenVE-100"
                                >
                                    <span className="icon-[material-symbols--add-business-outline] text-lg"></span>
                                    Nuevo Registro
                                </button>
                            )}
                        </div>
                    </div>



                    <div className="p-4 bg-white font-sans antialiased">
                        <div className="overflow-x-auto border border-[#f1f5f9] rounded-md shadow-sm">
                            <table className="w-full text-left border-collapse tracking-tight">
                                <thead className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] w-12 text-center">#</th>
                                        <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9]">Nombre del Establecimiento</th>
                                        <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center w-64">Ubicación</th>
                                        <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] text-center w-32">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {enableAdd && (
                                        <tr className='bg-greenVE-50/30'>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9]"></td>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9]">
                                                <input
                                                    type='text'
                                                    placeholder="Ingrese el nombre oficial..."
                                                    value={nombreEst}
                                                    className='w-full text-[0.8rem] border-[#cbd5e1] rounded bg-white py-1 px-3 focus:ring-1 focus:ring-greenVE-500 outline-none'
                                                    onChange={(event) => { setNombreEst(event.target.value) }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9]">
                                                <select
                                                    value={idLug}
                                                    className='w-full text-[0.8rem] border-[#cbd5e1] rounded bg-white py-1 px-3 focus:ring-1 focus:ring-greenVE-500 outline-none'
                                                    onChange={(event) => setIdLug(event.target.value)}
                                                >
                                                    <option value="0">Seleccionar...</option>
                                                    {dataLugares && dataLugares.map((item) => (
                                                        <option key={item.id_lugar} value={item.id_lugar}>
                                                            {item.nombre_lugar}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border-b border-[#f1f5f9]">
                                                <div className="flex gap-4 justify-center items-center">
                                                    <button onClick={() => handleClickSave()} className="text-greenVE-600 hover:scale-110 transition-transform" title="Confirmar">
                                                        <span className="icon-[material-symbols--check-circle] text-xl"></span>
                                                    </button>
                                                    <button onClick={() => setEnableAdd(false)} className="text-gray-400 hover:text-red-500 hover:scale-110 transition-transform" title="Cancelar">
                                                        <span className="icon-[material-symbols--cancel] text-xl"></span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {data.length ? data.map((item, index) => (
                                        <EstablecimientoItem
                                            key={item.id_establecimiento}
                                            item={item}
                                            index={index + 1}
                                            ciudades={dataLugares}
                                            onUpdateItem={handleUpdateItem}
                                            onDeleteItem={handleDeleteItem}
                                        />
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="icon-[line-md--loading-twotone-loop] h-8 w-8 text-[#64748b]"></span>
                                                    <p className="text-[#94a3b8] font-black text-[10px] tracking-widest uppercase">Consultando base de datos...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};


export default GestionarEstablecimientos;
