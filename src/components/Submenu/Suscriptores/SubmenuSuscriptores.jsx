import React, { Suspense, useEffect, useState } from 'react';
import { verificarPermiso } from '../../../global/utils';
import ListarSuscriptores from './GestionarSuscriptores/ListarSuscriptores';
import AgregarSuscriptor from './GestionarSuscriptores/AgregarSuscriptor/AgregarSuscriptor';

const SubmenuSuscriptores = ({ defaultSubmenu = 0 }) => {
    const [selSubmenu, setSelSubmenu] = useState(0)
    const [editData, setEditData] = useState()
    const handleClickEdit = (data) => {
        setEditData(data);
        setSelSubmenu(1)
    }

    useEffect(() => {
        setSelSubmenu(defaultSubmenu);
    }, [defaultSubmenu]);

    const submenuList = [];

    if (verificarPermiso(196) || true) {
        submenuList.push({
            "title": "Listar Suscriptores",
            "page": <ListarSuscriptores handleClickEdit={handleClickEdit} />,
            "icon": "icon-[material-symbols--format-list-bulleted-rounded]"
        });
    }

    if (verificarPermiso(147) || true) {
        submenuList.push({
            "title": "Agregar Suscriptor",
            "page": <AgregarSuscriptor editData={editData} setEditData={setEditData} />,
            "icon": "icon-[material-symbols--person-add-outline-rounded]"
        });
    }

    submenuList.push({
        "title": "Importar Suscriptores",
        "icon": "icon-[material-symbols--upload-file-outline-rounded]",
        "page": (
            <div className='w-full p-6 animate-fadeIn'>
                <div className='flex flex-col'>
                    {/* Contenedor Unificado */}
                    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
                        {/* Header Integrado */}
                        <div className='flex justify-between items-center bg-slate-50/50 p-6 border-b border-slate-100'>
                            <div className='flex flex-col gap-0.5'>
                                <h2 className='text-xl font-bold text-greenVE-700'>Importar suscriptores</h2>
                                <p className='text-slate-500 text-xs font-medium'>Control de carga masiva por código promocional.</p>
                            </div>
                            <button
                                className='bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-xs border border-slate-200 shadow-sm'
                            >
                                <span className='icon-[material-symbols--download-rounded] text-lg'></span>
                                Descargar plantilla
                            </button>
                        </div>

                        {/* Cuerpo del Formulario */}
                        <div className='p-8 flex flex-col gap-6'>
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
                                <div className='md:col-span-3 flex flex-col gap-2'>
                                    <label className='text-[11px] font-black text-slate-400 uppercase ml-1'>Código Promocional</label>
                                    <div className='relative'>
                                        <span className='absolute left-4 top-1/2 -translate-y-1/2 icon-[material-symbols--vpn-key-outline-rounded] text-slate-400 text-lg'></span>
                                        <input
                                            type="text"
                                            placeholder="Ingrese el código para validar"
                                            className='w-full h-11 pl-12 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none text-slate-700 font-semibold'
                                        />
                                    </div>
                                </div>
                                <button className='h-11 w-full bg-greenVE-600 hover:bg-greenVE-700 text-white font-bold rounded-lg transition-all shadow-md shadow-greenVE-100 text-xs uppercase tracking-widest flex items-center justify-center gap-2'>
                                    <span className='icon-[material-symbols--check-circle-outline-rounded] text-lg'></span>
                                    Comprobar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    });

    return (
        <div className='flex w-full min-h-[calc(100vh-80px)] bg-[#f8fafc] font-sans antialiased text-slate-700'>
            {/* Sidebar */}
            <aside className='w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-sm'>
                <div className='p-6 border-b border-[#f1f5f9] bg-white'>
                    <h3 className='text-lg font-bold text-[#334155] flex items-center gap-2'>
                        <span className='icon-[material-symbols--group-outline] text-[#64748b]'></span>
                        Suscriptores
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

export default SubmenuSuscriptores;
