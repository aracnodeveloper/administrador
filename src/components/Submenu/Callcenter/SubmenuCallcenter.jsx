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
        <div className='flex flex-col md:flex-row w-full min-h-[80vh] bg-slate-50/30'>
            {/* Sidebar*/}
            <aside className='w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shadow-sm'>
                <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2'>Módulo Comercial</label>
                    <h2 className='text-xl font-bold text-slate-800 flex items-center gap-2'>
                        <span className='icon-[material-symbols--support-agent] text-greenVE-600'></span>
                        Call Center
                    </h2>
                </div>

                <nav className='flex flex-col gap-2'>
                    {
                        submenuList.map((item, index) => (
                            <button
                                key={index}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold
                                    ${index === selSubmenu
                                        ? "bg-greenVE-50 text-greenVE-700 shadow-sm border border-greenVE-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                                onClick={() => setSelSubmenu(index)}
                            >
                                <span className={`${item.icon} text-xl`}></span>
                                {item.title}
                            </button>
                        ))
                    }
                </nav>
            </aside>

            {/* Area de contenido*/}
            <main className='flex-grow p-4 md:p-8 overflow-auto'>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-medium">Cargando módulo...</div>}>
                    <div className='bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-full'>
                        {submenuList[selSubmenu]?.page}
                    </div>
                </Suspense>
            </main>
        </div>
    );
};

export default SubmenuCallcenter;
