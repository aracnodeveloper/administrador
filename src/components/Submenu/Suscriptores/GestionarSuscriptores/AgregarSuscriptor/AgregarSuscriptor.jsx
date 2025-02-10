import React from 'react';
import DatosPersonales from './DatosPersonales';
import InformacionSuscripcion from './InformacionSuscripcion';

const AgregarSuscriptor = ({editData}) => {
    var suscriptor={};
    suscriptor.usuario=editData?editData.usuario[0]:{}
    suscriptor.contacto=editData?editData.contacto:[]
    suscriptor.suscripcion=editData?editData.suscripcion:[]

    return (
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center'>
                    <label className={"text-greenVE-700 text-xl border-0'"}>Agregar Suscriptor</label>
                </div>
                <div className='border border-gray-300 mt-2'></div>
                <DatosPersonales usuario={suscriptor.usuario} contactos={suscriptor.contacto}/>
                <InformacionSuscripcion suscripciones={suscriptor.suscripcion} />
            </div>
        </div>
    );
};

export default AgregarSuscriptor;