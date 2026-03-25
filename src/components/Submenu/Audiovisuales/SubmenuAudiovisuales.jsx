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
        <div className='flex w-full min-h-[calc(100vh-80px)] bg-[#f8fafc] font-sans antialiased'>
            {/* Sidebar */}
            <aside className='w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-sm'>
                <div className='p-6 border-b border-[#f1f5f9] bg-white'>
                    <h3 className='text-lg font-bold text-[#334155] flex items-center gap-2'>
                        <span className="icon-[material-symbols--settings-applications-outline] text-[#64748b]"></span>
                        Audiovisuales
                    </h3>
                </div>

                <nav className='flex-grow py-4 px-3 flex flex-col gap-1'>
                    {submenuList.length > 0 ? submenuList.map((item, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded text-[13px] font-semibold transition-all duration-200 group
                                ${index === selSubmenu
                                    ? "bg-greenVE-600 text-white shadow-sm"
                                    : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#334155]"}`}
                            onClick={() => setSelSubmenu(index)}
                        >
                            <span className={`${item.icon} text-lg ${index === selSubmenu ? "text-white" : "text-[#94a3b8] group-hover:text-[#64748b]"}`}></span>
                            {item.title}
                            {index === selSubmenu && (
                                <span className="ml-auto icon-[material-symbols--arrow-right-alt-rounded] text-lg"></span>
                            )}
                        </button>
                    )) : (
                        <div className="mx-2 p-3 bg-red-50 text-red-600 rounded border border-red-100 text-[11px] font-bold text-center uppercase tracking-wider">
                            Acceso no autorizado
                        </div>
                    )}
                </nav>
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

