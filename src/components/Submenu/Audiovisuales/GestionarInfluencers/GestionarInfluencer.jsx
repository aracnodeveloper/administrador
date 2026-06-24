import React, { useEffect, useState } from 'react';
import { getInfluencers } from '../../../../controllers/audiovisuales/AudiovisualesController';
import AgregarInfluencer from './AgregarInfluencer';
import GestionarRedInfluencer from './GestionarRedInfluencer';
import GestionarVideoInfluencer from './GestionarVideoInfluencer';

// ── Botón de acción reutilizable ──────────────────────────────────────────────
const BtnAccion = ({ title, activo, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
            disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" :
            activo   ? "bg-green-600 text-white" :
                       "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
        }`}
    >
        {children}
    </button>
);

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
        <div className='flex-1 p-4 w-full relative'>
            {/* Header con botón agregar */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <AgregarInfluencer setChange={handleSetChange} key={change} />
            </div>

            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando...</span>
                    </div>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">ID</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Nombre</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Código Promocional</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Categoría</th>
                                <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr
                                    key={item.id_influencer}
                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}
                                >
                                    <td className="px-3 py-2 text-gray-400 font-mono">{item.id_influencer}</td>
                                    <td className="px-3 py-2 font-semibold text-gray-800">{item.nombre_influencer}</td>
                                    <td className="px-3 py-2 font-mono text-gray-700">{item.cp_influencer}</td>
                                    <td className="px-3 py-2 text-gray-500">{item.nombre_categoria}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1.5">
                                            <AgregarInfluencer setChange={handleSetChange} editar={true} data={item} key={`${item.id_influencer}-${change}`} />
                                            <GestionarRedInfluencer data={item} key={`red-${item.id_influencer}-${change}`} setChange={handleSetChange}/>
                                            <GestionarVideoInfluencer data={item}/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GestionarInfluencer;
