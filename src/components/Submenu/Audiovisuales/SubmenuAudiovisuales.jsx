import React, { useEffect, useState } from 'react';
import { verificarPermiso } from '../../../global/utils';
import GestionarInfluencer from "./GestionarInfluencers/GestionarInfluencer";
import GestionarEstablecimientos from "./GestionarEstablecimientos/GestionarEstablecimientos";

const SubmenuAudiovisuales = ({ defaultSubmenu = 0 }) => {
    const [selSubmenu, setSelSubmenu] = useState(defaultSubmenu);

    useEffect(() => {
        setSelSubmenu(defaultSubmenu);
    }, [defaultSubmenu]);

    const submenuList = [];
    const isAdminBeta = verificarPermiso(538);

    if (verificarPermiso(540) || isAdminBeta) {
        submenuList.push({
            "title": "Gestionar Influencers",
            "icon": "icon-[material-symbols--person-outline]",
            "page": <GestionarInfluencer />
        });
    }

    if (verificarPermiso(541) || isAdminBeta) {
        submenuList.push({
            "title": "Gestionar Hoteles",
            "icon": "icon-[material-symbols--apartment]",
            "page": <GestionarEstablecimientos />
        });
    }

    return (
        <div className='flex w-full min-h-[calc(100vh-80px)] bg-[#f8fafc]'>
            {/* Sidebar */}
            <aside className='w-64 bg-white border-r border-[#e2e8f0] flex flex-col'>
                <div className='p-6 border-b border-[#f1f5f9] bg-[#fdfdfd] text-center'>
                    <h2 className='text-[11px] font-bold text-[#64748b] uppercase tracking-[0.15em]'>
                        Audiovisuales
                    </h2>
                </div>

                <nav className='flex-grow py-6 px-3 flex flex-col gap-1.5'>
                    {submenuList.length > 0 ? submenuList.map((item, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[13px] font-semibold transition-all duration-200
                                ${index === selSubmenu
                                    ? "bg-greenVE-500 text-white shadow-md shadow-greenVE-100"
                                    : "text-[#64748b] hover:bg-greenVE-50 hover:text-greenVE-600"}`}
                            onClick={() => setSelSubmenu(index)}
                        >
                            <span className={`${item.icon} text-lg ${index === selSubmenu ? "text-white" : "text-[#94a3b8]"}`}></span>
                            {item.title}
                        </button>
                    )) : (
                        <div className="mx-2 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 text-[11px] font-semibold text-center uppercase tracking-tighter">
                            Acceso no autorizado
                        </div>
                    )}
                </nav>

                <div className='p-4 border-t border-[#f1f5f9] bg-[#fcfcfc]'>
                    <div className='flex items-center justify-center gap-2 text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest'>
                        <span className="w-1.5 h-1.5 rounded-full bg-greenVE-400"></span>
                        Admin Dashboard
                    </div>
                </div>
            </aside>

            {/* Contenedor Principal */}
            <main className='flex-grow overflow-auto'>
                <div className="p-8">
                    {submenuList.length > 0 ? (
                        submenuList[selSubmenu]?.page
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-[#94a3b8] gap-3">
                            <span className="icon-[material-symbols--verified-user-outline] text-5xl"></span>
                            <p className="text-sm font-medium">Consulte los permisos con el administrador del sistema.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};




export default SubmenuAudiovisuales;

