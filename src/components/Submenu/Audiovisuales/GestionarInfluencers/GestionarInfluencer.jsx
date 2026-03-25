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
                {/* Header */}
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



                <div className="p-4 bg-white font-sans antialiased">
                    <div className="overflow-x-auto border border-[#f1f5f9] rounded-md shadow-sm">
                        <table className="w-full text-left border-collapse tracking-tight">
                            <thead className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center">#</th>
                                    <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9]">Nombre del Colaborador</th>
                                    <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center">Código</th>
                                    <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] border-r border-[#f1f5f9] text-center">Categoría</th>
                                    <th scope="col" className="px-4 py-3 text-[10px] sm:text-[0.7rem] font-black text-[#64748b] uppercase tracking-[0.1em] text-center">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {
                                    data.length ? data.map((item, index) => (
                                        <tr key={item.id_influencer} className="hover:bg-[#f1f5f9] transition-colors even:bg-[#fcfdfe] odd:bg-white text-[13px] sm:text-[0.8rem] text-[#334155]">
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9] font-mono text-[10px] text-[#94a3b8] w-12 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9] font-medium text-[#475569]">
                                                {item.nombre_influencer}
                                            </td>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9] text-center">
                                                <span className="bg-greenVE-50 text-greenVE-600 px-2 py-0.5 rounded text-[10px] font-black border border-greenVE-100 uppercase tracking-tighter">
                                                    {item.cp_influencer}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-r border-b border-[#f1f5f9] text-center">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-greenVE-400"></span>
                                                    <span className="font-medium text-[#64748b]">{item.nombre_categoria}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-b border-[#f1f5f9]">
                                                <div className="flex gap-4 justify-center items-center h-full">
                                                    <div className="text-slate-400 hover:text-blue-500 transition-all cursor-pointer flex items-center group" title="Editar">
                                                        <AgregarInfluencer setChange={handleSetChange} editar={true} data={item} key={`${item.id_influencer}-${change}`} />
                                                    </div>

                                                    <div className="text-slate-400 hover:text-greenVE-600 transition-all cursor-pointer flex items-center" title="Redes Sociales">
                                                        <GestionarRedInfluencer data={item} key={`${item.id_influencer}-${change}`} setChange={handleSetChange} />
                                                    </div>

                                                    <div className="text-slate-400 hover:text-greenVE-600 transition-all cursor-pointer flex items-center" title="Galería de Videos">
                                                        <GestionarVideoInfluencer data={item} />
                                                    </div>

                                                    <div className="text-slate-400 hover:text-red-500 transition-all cursor-pointer flex items-center" title="Eliminar Colaborador">
                                                        <span className="icon-[material-symbols--delete-outline-rounded] text-xl"></span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="icon-[line-md--loading-twotone-loop] h-8 w-8 text-greenVE-500"></span>
                                                    <p className="text-[#94a3b8] font-black text-[10px] tracking-[0.2em] uppercase">Sincronizando registros...</p>
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

