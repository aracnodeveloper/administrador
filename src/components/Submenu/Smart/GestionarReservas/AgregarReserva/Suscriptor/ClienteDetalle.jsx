import React from 'react';

const ClienteDetalle = ({clientes, handleDeleteCliente}) => {
    return (
        <div className='flex flex-col gap-2 w-1/2'>
            {
                clientes.map((item, index)=>(
                    <div className='border border-t-[10px] shadow-lg border-t-blue-800 p-2 bg-white flex flex-col gap-1 text-[10px]'>
                        <div className='w-full flex justify-end text-red-700 cursor-pointer'><label className='cursor-pointer' onClick={()=>handleDeleteCliente(index)}>Eliminar</label></div>
                        <div className='flex items-center gap-2'>
                            <span className="icon-[gridicons--user] h-4 w-4 text-blue-600"></span>
                            <label>{item.nombres}</label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="icon-[material-symbols--id-card] h-4 w-4 text-blue-600"></span>
                            <label>{item.ci}</label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="icon-[mingcute--birthday-2-fill] h-4 w-4 text-blue-600"></span>
                            <label>{item.nacimiento}</label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="icon-[f7--placemark-fill] h-4 w-4 text-blue-600"></span>
                            <label>{item.direccion}</label>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default ClienteDetalle;