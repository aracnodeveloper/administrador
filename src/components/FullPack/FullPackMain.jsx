import React, { useState } from 'react';
import CrearCodigosMasivo from './CrearCodigoMasivo';
import ListaCodigosPrepago from './ListaCodigoPrepago';

const FullPackMain = () => {
    const [recargar, setRecargar] = useState(0);
    const [tab, setTab] = useState('lista');

    const handleCodigosCreados = (codigos) => {
        setRecargar(prev => prev + 1);
        setTab('lista');
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setTab('lista')}
                    className={'px-4 py-2 text-sm font-semibold rounded-t ' + (tab === 'lista' ? 'bg-white text-green-700 border-t-2 border-green-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                    Lista de Codigos
                </button>
                <button
                    onClick={() => setTab('crear')}
                    className={'px-4 py-2 text-sm font-semibold rounded-t ' + (tab === 'crear' ? 'bg-white text-green-700 border-t-2 border-green-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                    Crear Codigos
                </button>
            </div>
            {tab === 'crear' && <CrearCodigosMasivo onCodigosCreados={handleCodigosCreados} />}
            {tab === 'lista' && <ListaCodigosPrepago recargar={recargar} />}
        </div>
    );
};

export default FullPackMain;