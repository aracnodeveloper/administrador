import { Tooltip } from 'flowbite-react';
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
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center'>
                    <label className='text-greenVE-700 text-xl border-0'>Gestión de Influencers</label>
                    <Tooltip className='bg-gray-700' content="Añadir influencer" arrow={false}>
                        <AgregarInfluencer setChange={handleSetChange} key={change} />
                    </Tooltip>
                </div>
                <div className='border border-gray-300 mt-2'></div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Id Influencer</th>
                                <th scope="col" className="px-6 py-3">Nombre</th>
                                <th scope="col" className="px-6 py-3">Código Promocional</th>
                                <th scope="col" className="px-6 py-3">Categoría</th>
                                <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length ? data.map((item) => (
                                    <tr key={item.id_influencer} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-6 py-4">{item.id_influencer}</td>
                                        <td className="px-6 py-4">{item.nombre_influencer}</td>
                                        <td className="px-6 py-4">{item.cp_influencer}</td>
                                        <td className="px-6 py-4">{item.nombre_categoria}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Tooltip className='bg-gray-700' content="Editar" arrow={false}>
                                                <AgregarInfluencer setChange={handleSetChange} editar={true} data={item} key={`${item.id_influencer}-${change}`} />
                                            </Tooltip>
                                            <Tooltip className='bg-gray-700' content="Redes sociales" arrow={false}>
                                                <GestionarRedInfluencer data={item}  key={`${item.id_influencer}-${change}`} setChange={handleSetChange}/>
                                            </Tooltip>
                                            <Tooltip className='bg-gray-700' content="Videos" arrow={false}>
                                                <GestionarVideoInfluencer data={item}/>
                                            </Tooltip>{/*
                                            <Tooltip className='bg-gray-700' content="Eliminar" arrow={false}>
                                                <span className="icon-[material-symbols--delete] w-5 h-5 hover:text-red-600 cursor-pointer"></span>
                                </Tooltip>*/}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4"><span className="icon-[eos-icons--bubble-loading] h-10 w-full text-greenVE-500"></span></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GestionarInfluencer;
