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
        <div className='flex flex-col md:flex-row w-full min-h-[80vh] bg-slate-50/30'>
            {/* Sidebar*/}
            <aside className='w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shadow-sm'>
                <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2'>Módulo Operativo</label>
                    <h2 className='text-xl font-bold text-slate-800 flex items-center gap-2'>
                        <span className='icon-[material-symbols--group-outline] text-greenVE-600'></span>
                        Suscriptores
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

export default SubmenuSuscriptores;
