import React, { useState, useEffect, Suspense } from 'react';
import ListarCuentasGratis from './GestionarCuentasGratis/ListarCuentasGratis';

const SubmenuCallcenter = ({ defaultSubmenu = 0 }) => {
    const [selSubmenu, setSelSubmenu] = useState(defaultSubmenu);

    useEffect(() => {
        setSelSubmenu(defaultSubmenu);
    }, [defaultSubmenu]);

    const submenuList = [
        {
            "title": "Cuentas Gratuitas",
            "page": <ListarCuentasGratis />,
            "icon": "icon-[material-symbols--contact-emergency-outline-rounded]"
        }
    ];

    return (
        <div className='flex w-full min-h-[calc(100vh-80px)] bg-[#f8fafc] font-sans antialiased text-slate-700'>
            {/* Sidebar */}
            <aside className='w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-sm'>
                <div className='p-6 border-b border-[#f1f5f9] bg-white'>
                    <h3 className='text-lg font-bold text-[#334155] flex items-center gap-2'>
                        <span className='icon-[material-symbols--support-agent] text-[#64748b]'></span>
                        Call Center
                    </h3>
                </div>

                <nav className='flex-grow py-4 px-3 flex flex-col gap-1'>
                    {submenuList.map((item, index) => (
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
                    ))}
                </nav>
            </aside>

            {/* Area de contenido */}
            <main className='flex-grow p-8 overflow-auto'>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-medium">Cargando módulo...</div>}>
                    <div className='min-h-full'>
                        {submenuList[selSubmenu]?.page}
                    </div>
                </Suspense>
            </main>
        </div>
    );
};

export default SubmenuCallcenter;
