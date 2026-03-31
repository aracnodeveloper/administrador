import React, { useEffect } from 'react';
import { verificarPermiso } from '../../../global/utils';
import GestionarInfluencer from "./GestionarInfluencers/GestionarInfluencer";
import GestionarEstablecimientos from "./GestionarEstablecimientos/GestionarEstablecimientos";
import useMenuState from '../../../hooks/useMenuState';

const SubmenuAudiovisuales = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState('subAudiovisuales', 0);

    const submenuList = [];

    verificarPermiso(540) && submenuList.push({
        title: "Gestionar Influencers",
        page: <GestionarInfluencer />
    });

    verificarPermiso(541) && submenuList.push({
        title: "Gestionar Hoteles",
        page: <GestionarEstablecimientos />
    });

    return (
        <div className='flex w-full p-4'>
            <div>
                <div className='flex flex-col w-56 bg-greenVE-100 px-2 pb-4 rounded-md'>
                    <label className='text-sm mb-2 text-center font-semibold text-greenVE-800 py-2 border-greenVE-600 border-0 border-b-2'>
                        Audiovisuales
                    </label>
                    {submenuList.map((item, index) => (
                        <button
                            key={index}
                            className={`text-gray-500 font-light text-xs text-left py-1 border border-gray-200 ${
                                index === 0 ? "border-t-0" : index === (submenuList.length - 1) ? "border-b-2" : "border-y-1"
                            } border-x-0 px-4 ${index === selSubmenu ? "bg-greenVE-400" : "hover:bg-greenVE-100"}`}
                            onClick={() => setSelSubmenu(index)}
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

export default SubmenuAudiovisuales;