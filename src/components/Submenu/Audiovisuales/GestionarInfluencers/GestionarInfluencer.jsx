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
        <div className='w-full font-sans antialiased text-slate-700'>
            <div className='bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden'>
                {/* Header*/}
                <div className='px-8 py-6 border-b border-[#e2e8f0] bg-[#fdfdfd] flex justify-between items-center'>
                    <div className="flex items-center gap-3">
                        <span className="icon-[material-symbols--group-outline] text-2xl text-[#64748b]"></span>
                        <h2 className='text-xl font-bold text-[#1e293b] tracking-tight'>
                            Gestión de Influencers
                        </h2>
                    </div>

                    <div className="flex gap-2">
                        <AgregarInfluencer setChange={handleSetChange} key={change} />
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <div className="overflow-x-auto border border-[#f1f5f9] rounded-md shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                <tr>
                                    <th scope="col" className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center w-12">#</th>
                                    <th scope="col" className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9]">Nombre del Colaborador</th>
                                    <th scope="col" className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center">Código Interno</th>
                                    <th scope="col" className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center">Categoría</th>
                                    <th scope="col" className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {
                                    data.length ? data.map((item, index) => (
                                        <tr key={item.id_influencer} className="hover:bg-[#f8fafc] transition-colors even:bg-[#fcfdfe] odd:bg-white text-[13px]">
                                            <td className="px-5 py-3 border-r border-[#f1f5f9] font-mono text-[11px] text-[#94a3b8] text-center">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-5 py-3 border-r border-[#f1f5f9] font-medium text-[#475569]">
                                                {item.nombre_influencer}
                                            </td>
                                            <td className="px-5 py-3 border-r border-[#f1f5f9] text-center">
                                                <span className="bg-[#f1f5f9] text-[#475569] px-2.5 py-1 rounded text-[10px] font-bold border border-[#e2e8f0] uppercase tracking-tighter">
                                                    {item.cp_influencer}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 border-r border-[#f1f5f9] text-center">
                                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-greenVE-100 bg-greenVE-50/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-greenVE-500"></span>
                                                    <span className="text-[11px] font-semibold text-greenVE-700">{item.nombre_categoria}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-4 justify-center items-center">
                                                    <div className="text-[#94a3b8] hover:text-blue-600 transition-colors cursor-pointer flex items-center" title="Editar">
                                                        <AgregarInfluencer setChange={handleSetChange} editar={true} data={item} key={`${item.id_influencer}-${change}`} />
                                                    </div>

                                                    <div className="text-[#94a3b8] hover:text-green-600 transition-colors cursor-pointer flex items-center" title="Redes Sociales">
                                                        <GestionarRedInfluencer data={item} key={`${item.id_influencer}-${change}`} setChange={handleSetChange} />
                                                    </div>

                                                    <div className="text-[#94a3b8] hover:text-green-600 transition-colors cursor-pointer flex items-center" title="Galería de Videos">
                                                        <GestionarVideoInfluencer data={item} />
                                                    </div>

                                                    <div className="text-[#94a3b8] hover:text-red-500 transition-colors cursor-pointer flex items-center" title="Eliminar">
                                                        <span className="icon-[material-symbols--delete-outline-rounded] text-xl"></span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="icon-[line-md--loading-twotone-loop] h-8 w-8 text-[#64748b]"></span>
                                                    <p className="text-[#94a3b8] font-bold text-[10px] tracking-[0.2em] uppercase">Sincronizando información...</p>
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

