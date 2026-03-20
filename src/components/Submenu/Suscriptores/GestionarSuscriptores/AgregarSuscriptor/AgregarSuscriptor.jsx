import React from 'react';
import DatosPersonales from './DatosPersonales';
import InformacionSuscripcion from './InformacionSuscripcion';

const AgregarSuscriptor = ({ editData }) => {
    var suscriptor = {};
    suscriptor.usuario = editData ? editData.usuario[0] : {}
    suscriptor.contacto = editData ? editData.contacto : []
    suscriptor.suscripcion = editData ? editData.suscripcion : []

    return (
        <div className='w-full bg-slate-50/50 p-6 animate-fadeIn'>
            <div className='flex flex-col gap-1 mb-4'>
                <h2 className='text-2xl font-black text-greenVE-800 tracking-tight'>Agregar Suscriptor</h2>
                <div className='w-full h-px bg-slate-200 mt-2'></div>
            </div>

            <div className='flex flex-col gap-6'>
                <DatosPersonales usuario={suscriptor.usuario} contactos={suscriptor.contacto} />
                <InformacionSuscripcion suscripciones={suscriptor.suscripcion} />
                {/* Footer de Acciones */}
                <div className='flex items-center gap-4 pt-6 border-t border-slate-200'>
                    <button className='px-6 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95'>
                        Cancelar
                    </button>
                    <button className='px-8 py-2.5 rounded-lg bg-greenVE-800 text-white font-bold text-sm hover:bg-greenVE-900 transition-all shadow-md active:scale-95'>
                        Guardar Suscriptor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgregarSuscriptor;
