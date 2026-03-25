import { Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { getInfluencers } from '../../../../controllers/audiovisuales/AudiovisualesController';
import AgregarInfluencer from './AgregarInfluencer';
import GestionarRedInfluencer from './GestionarRedInfluencer';
import GestionarVideoInfluencer from './GestionarVideoInfluencer';

const GestionarInfluencer = () => {
    const [data, setData] = useState([]);
    const [change, setChange] = useState(0);

    useEffect(() => {
        getInfluencers().then((res) => {
            if (res) {
                setData(res);
            }
        });
    }, [change]);

    const handleSetChange = () => {
        setChange(prev => prev + 1);
    };

    return (
        <div className='w-full'>
            <div className='bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden'>
                {/* Header Empresarial (Identidad Verde) */}
                <div className='px-8 py-6 border-b border-[#e2e8f0] bg-[#fdfdfd] flex justify-between items-center'>
                    <div>
                        <h2 className='text-xl font-bold text-[#1e293b] flex items-center gap-2'>
                            <span className="icon-[material-symbols--supervised-user-circle-outline] text-3xl text-greenVE-500"></span>
                            Gestión de Influencers
                        </h2>
                    </div>
                    
                    <div className="flex gap-2">
                        <AgregarInfluencer setChange={handleSetChange} key={change} />
                    </div>



                </div>


                {/* Tabla de Datos Corporativa */}
                <div className="p-4">
                    <div className="overflow-x-auto border border-[#f1f5f9] rounded shadow-sm">
                        <table className="w-full text-[13px] text-left text-[#334155]">
                            <thead className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider bg-[#f1f5f9] border-b border-[#e2e8f0]">
                                <tr>
                                    <th scope="col" className="px-6 py-4">ID de Registro</th>
                                    <th scope="col" className="px-6 py-4">Nombre del Colaborador</th>
                                    <th scope="col" className="px-6 py-4">Código Promocional</th>
                                    <th scope="col" className="px-8 py-4">Categoría de Influencia</th>
                                    <th scope="col" className="px-6 py-4 text-center">Acciones de Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {
                                    data.length ? data.map((item) => (
                                        <tr key={item.id_influencer} className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[11px] text-[#94a3b8]">
                                                {item.id_influencer}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#0f172a]">
                                                {item.nombre_influencer}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-greenVE-50 text-greenVE-600 px-2 py-1 rounded text-[11px] font-bold border border-greenVE-100 uppercase tracking-tighter">
                                                    {item.cp_influencer}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-greenVE-400"></span>
                                                    <span className="text-[#475569] font-medium">{item.nombre_categoria}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex gap-4 justify-center items-center">
                                                    <div className="hover:scale-110 transition-transform">
                                                        <AgregarInfluencer setChange={handleSetChange} editar={true} data={item} key={`${item.id_influencer}-${change}`} />
                                                    </div>
                                                    
                                                    <div className="text-[#64748b] hover:text-greenVE-600 transition-all hover:scale-110 cursor-pointer flex items-center">
                                                        <GestionarRedInfluencer data={item} key={`${item.id_influencer}-${change}`} setChange={handleSetChange}/>
                                                    </div>

                                                    <div className="text-[#64748b] hover:text-greenVE-600 transition-all hover:scale-110 cursor-pointer flex items-center">
                                                        <GestionarVideoInfluencer data={item}/>
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="icon-[line-md--loading-twotone-loop] h-10 w-10 text-[#64748b]"></span>
                                                    <p className="text-[#94a3b8] font-medium text-xs tracking-widest uppercase">Procesando solicitud...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default GestionarInfluencer;

