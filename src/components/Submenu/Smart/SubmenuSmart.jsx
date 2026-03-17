import React, { lazy, Suspense, useEffect, useState } from 'react';
import { verificarPermiso } from '../../../global/utils';
import { useParams } from 'react-router-dom';
import { listarReservas } from '../../../controllers/smart/SmartController';
import Config from '../../../global/config';
import ListarReservas from "./GestionarReservas/ListarReservas";
import AgregarReserva from "./GestionarReservas/AgregarReserva";

const SubmenuSmart = ( {defaultSubmenu = 0}) => {
    const [selSubmenu, setSelSubmenu]= useState(0)
    const [editData, setEditData]=useState()
    const { id } = useParams();

    useEffect(() => {
        setSelSubmenu(defaultSubmenu);
    }, [defaultSubmenu]);

    const handleClickEdit=(data)=>{
        setEditData(data);
        setSelSubmenu(1)
    }
    const submenuList = [];

    if (verificarPermiso(22) || true) {
        submenuList.push({
            "title": "Listar reservas",
            "page": <ListarReservas handleClickEdit={handleClickEdit} />,
            "icon": "icon-[material-symbols--calendar-month-outline]"
        });
    }

    if (verificarPermiso(23) || true) {
        submenuList.push({
            "title": "Agregar reserva",
            "page": <AgregarReserva editData={editData} setEditData={setEditData} />,
            "icon": "icon-[material-symbols--add-circle-outline-rounded]"
        });
    }

    useEffect(()=>{
        if(id){
            const addIndex = submenuList.findIndex(item => item.title === "Agregar reserva");
            if (addIndex !== -1) setSelSubmenu(addIndex);
            
            listarReservas({id:id}).then((res) => {
                if (res) {
                    handleClickEdit(res)
                }
            })
        }
    }, [])

    return (
        <div className='flex flex-col md:flex-row w-full min-h-[80vh] bg-slate-50/30'>
            {/* Sidebar con diseño serio y profesional */}
            <aside className='w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shadow-sm'>
                <div className='flex flex-col gap-1'>
                    <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2'>Módulo Operativo</label>
                    <h2 className='text-xl font-bold text-slate-800 flex items-center gap-2'>
                        <span className='icon-[material-symbols--settings-suggest-outline] text-greenVE-600'></span>
                        Smart
                    </h2>
                </div>

                <nav className='flex flex-col gap-2'>
                    {
                        submenuList.map((item, index)=>(
                            <button
                                key={index}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold
                                    ${index === selSubmenu 
                                        ? "bg-greenVE-50 text-greenVE-700 shadow-sm border border-greenVE-100" 
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                                onClick={()=>{setSelSubmenu(index); setEditData()}}
                            >
                                <span className={`${item.icon} text-xl`}></span>
                                {item.title}
                            </button>
                        ))
                    }
                </nav>
            </aside>

            {/* Area de contenido con scroll suave */}
            <main className='flex-grow p-4 md:p-8 overflow-auto'>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-medium">Sincronizando...</div>}>
                    <div className='bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-full'>
                        {submenuList[selSubmenu]?.page}
                    </div>
                </Suspense>
            </main>
        </div>
    );
};

export default SubmenuSmart;
