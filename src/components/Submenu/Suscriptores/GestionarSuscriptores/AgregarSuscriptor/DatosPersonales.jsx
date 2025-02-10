import React, { useEffect, useState } from 'react';
import Config from '../../../../../global/config';
import { getRemoteCities } from '../../../../../controllers/info/InfoController';

const DatosPersonales = ({usuario, contactos}) => {
    const [provincias, setProvincias]=useState();
    const [selProvincia, setSelProvincia]=useState(0);
    const [selCiudad, setSelCiudad]=useState(0);
    

    console.log (contactos)
    useEffect(()=>{
        getRemoteCities().then((res)=>{
            if(res){
                setProvincias(res)
            }
        })
    }, [])
    return (
        <div className='w-full border-2 rounded-md mt-5 flex'>
            <label className='absolute -mt-3 ml-5 rounded-full bg-greenVE-500 text-white px-4'>Datos Personales</label>
            <div className='flex flex-col items-center justify-center w-full'>
                <div className='flex pt-3 w-full justify-center items-center gap-2'>
                    <div className='flex flex-col items-end gap-2'>
                        <label>Cédula:</label>
                        <label>Nombres:</label>
                        <label>Provincia:</label>
                        <label>Ciudad:</label>
                        <label>Usuario:</label>
                        <label>Contraseña:</label>
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                        <input value={usuario.ci_ruc} type='text' className='h-6 w-60 text-sm'></input>
                        <input value={usuario.nombres} type='text' className='h-6 w-60 text-sm'></input>
                        <select className='h-6 text-sm py-0 w-60' value={selProvincia} onChange={(event)=>setSelProvincia(event.target.value)}>
                            {
                                provincias&&provincias.map((item, index)=>(
                                    <option value={index}>{item.Titulo}</option>
                                ))
                            }
                        </select>
                        <select className='h-6 text-sm w-60 py-0' value={selCiudad} onChange={(event)=>setSelCiudad(event.target.value)}>
                            {
                                provincias&&provincias[selProvincia].Valor.map((item, index)=>(
                                    <option value={item.Valor}>{item.Titulo}</option>
                                ))
                            }
                        </select>
                        <input value={usuario.usuario} type='text' className='h-6 w-60 text-sm' disabled></input>
                        <input value={usuario.clave} type='text' className='h-6 w-60 text-sm' disabled></input>
                    </div>
                </div>
                <div className='w-96 border border-gray-400 mt-5 mb-5 rounded-md flex flex-col gap-1 pb-3'>
                    <div className='bg-greenVE-500 text-center rounded-t-md w-96 text-white flex justify-center items-center gap-2'>
                        <label>Contactos</label>
                        <span className="icon-[gridicons--add] h-5 w-5"></span>
                    </div>
                    <div className='w-full flex gap-2 px-2'>
                        <label className='w-1/2 text-center'>Tipo</label>
                        <label className='w-1/2 text-center'>Contacto</label>
                    </div>
                    {
                        contactos.map((item, index)=>(
                            <div className='w-full flex gap-2 px-2' key={index}>
                                <select value={item.id_tbl_tipo_contacto} className='w-1/2 h-6 py-0 text-sm '>
                                    {
                                        Config.TIPOCONT.map((item)=>(
                                            <option value={item.id} key={item.id} className=''>{item.nombre}</option>
                                        ))
                                    }
                                </select>
                                <input className='w-1/2 h-6 text-sm' value={item.contacto}></input>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default DatosPersonales;