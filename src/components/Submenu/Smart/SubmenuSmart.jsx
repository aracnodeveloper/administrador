import React, { useEffect, useState } from 'react';
import { verificarPermiso } from '../../../global/utils';
import { useParams } from 'react-router-dom';
import { listarReservas } from '../../../controllers/smart/SmartController';
import Config from '../../../global/config';
import ListarReservas from "./GestionarReservas/ListarReservas";
import AgregarReserva from "./GestionarReservas/AgregarReserva";
import ListarEstablecimientos from "./GestionarEstablecimientos/ListarEstablecimeintos";
import CrearEstablecimiento from "./GestionarEstablecimientos/CrearEstablecimiento";
import useMenuState from '../../../hooks/useMenuState';

const SubmenuSmart = () => {
    // "subSmart" persiste en la URL: ?menu=2&subSmart=1
    const [selSubmenu, setSelSubmenu] = useMenuState('subSmart', 0);
    const [editData, setEditData] = useState();
    const { id } = useParams();

    const handleClickEdit = (data) => {
        setEditData(data);
        setSelSubmenu(1);
    };

    const submenuList = [];

    verificarPermiso(22) && submenuList.push({
        title: "Listar reservas",
        page: <ListarReservas handleClickEdit={handleClickEdit} />
    });

    verificarPermiso(23) && submenuList.push({
        title: "Agregar reserva",
        page: <AgregarReserva editData={editData} setEditData={setEditData} />
    });

    verificarPermiso(17) && submenuList.push({
        title: "Establecimientos",
        page: <ListarEstablecimientos />
    });

    verificarPermiso(17) && submenuList.push({
        title: "Crear Establecimiento",
        page: <CrearEstablecimiento />
    });

    // Si viene un :id por URL, cargar la reserva y abrir el formulario de edición
    useEffect(() => {
        if (id) {
            const agregarIndex = submenuList.findIndex(item => item.title === "Agregar reserva");
            setSelSubmenu(agregarIndex);
            listarReservas({ id }).then((res) => {
                if (res) handleClickEdit(res);
            });
        }
    }, []);

    return (
        <div className='md:flex w-full md:p-4'>
            <div>
                <div className='flex flex-col w-[100%] md:w-56 bg-greenVE-100 px-2 pb-4 rounded-md'>
                    {!Config.isMobile && (
                        <label className='text-sm mb-2 text-center font-semibold text-greenVE-800 py-2 border-greenVE-600 border-0 border-b-2'>
                            Smart
                        </label>
                    )}
                    {submenuList.map((item, index) => (
                        <button
                            key={index}
                            className={`text-gray-500 font-light md:text-xs text-left py-1 border border-gray-200 ${
                                index === 0 ? "border-t-0" : index === (submenuList.length - 1) ? "border-b-2" : "border-y-1"
                            } border-x-0 px-4 ${index === selSubmenu ? "bg-greenVE-400" : "hover:bg-greenVE-100"}`}
                            onClick={() => { setSelSubmenu(index); setEditData(undefined); }}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            </div>
            {submenuList[selSubmenu]?.page}
        </div>
    );
};

export default SubmenuSmart;