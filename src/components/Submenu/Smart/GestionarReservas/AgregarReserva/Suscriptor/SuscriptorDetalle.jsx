import React from 'react';

const SuscriptorDetalle = ({ user }) => {
    console.log(user);
    return (
        <div className='border border-t-[10px] shadow-lg border-t-blue-800 p-2 bg-white flex flex-col gap-4'>
            <div className='flex gap-2'>
                <div className='flex flex-col w-1/2 gap-2'>
                    <div className='flex gap-1 items-center'>
                        <span className="icon-[material-symbols--id-card-outline] w-5 h-5"></span>
                        <label className='text-[10px]'>{user.usuario[0].ci_ruc}</label>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <span className="icon-[fa-regular--user]  h-4 w-5"></span>
                        <label className='text-[10px]'>{user.usuario[0].nombres}</label>
                    </div>
                    {
                        user.usuario[0].usuario && <div className='flex gap-1 items-center'>
                            <span className="icon-[icon-park-solid--people-bottom-card] w-5 h-4"></span>
                            <label className='text-[10px]'>{user.usuario[0].usuario}</label>
                        </div>
                    }
                </div>
                <div className='flex flex-col w-1/2 gap-2'>
                    {
                        user.contacto.map((item, index) => (
                            <div className='flex gap-1 items-center' key={index}>
                                {
                                    item.nombre_tipo_contacto.toString().toLowerCase().includes("email")
                                        ? <span className="icon-[tabler--mail] w-5 h-5"></span>
                                        : item.nombre_tipo_contacto.toString().toLowerCase().includes("telefono")
                                            || item.nombre_tipo_contacto.toString().toLowerCase().includes("celular")
                                            ? <span className="icon-[tabler--phone] h-5 w-5"></span>
                                            : <></>
                                }
                                <label className='text-[10px]'>{item.contacto}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='bg-blue-200 flex py-1 px-4 gap-1'>
                <span className="icon-[solar--medal-star-circle-bold] h-4 w-4 text-blue-500"></span>
                <label className='text-xs font-semibold'>Suscripciones</label>
            </div>
            {
                user.suscripcion.length > 0
                    ? <table>
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                            <tr className='flex  justify-between '>
                                <th scope="col" className="flex justify-center items-center w-5/12">Producto</th>
                                <th scope="col" className="flex justify-center items-center w-2/12">Inicio</th>
                                <th scope="col" className="flex justify-center items-center w-2/12">Fin</th>
                                <th scope="col" className="flex justify-center items-center w-2/12">Vendedor</th>
                                <th scope="col" className="flex justify-center items-center w-1/12">Estado</th>
                            </tr>
                        </thead>
                        <body>
                            {
                                user.suscripcion.map((item, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                        <td className="flex justify-start items-center w-5/12">{item.titulo}</td>
                                        <td className="flex justify-center items-center w-2/12">{item.fecha_inicio}</td>
                                        <td className="flex justify-center items-center w-2/12">{item.fecha_fin}</td>
                                        <td className="flex justify-center items-center w-2/12">{item.vendedor}</td>
                                        <td className="flex justify-center items-center w-1/12">{
                                            item.estado == "activo"
                                                ? <span className="icon-[mdi--check-circle] text-greenVE-600 h-4 w-4"></span>
                                                : <span className="icon-[material-symbols--cancel] text-red-500 h-4 w-4"></span>
                                        }</td>
                                    </tr>
                                ))
                            }
                        </body>
                    </table>
                    : <label className='text-xs'>Usuario {user.usuario[0].metodo}</label>
            }
            {
                user.clicksContactos.length > 0 &&
                <div className='flex flex-col gap-4'>
                    <div className='bg-blue-200 flex py-1 px-4 gap-1'>
                        <span className="icon-[game-icons--click] h-4 w-4 text-blue-500"></span>
                        <label className='text-xs font-semibold'>Uso de prueba grátis</label>
                    </div>
                    <table>
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                            <tr className='flex  justify-between '>
                                <th scope="col" className="flex justify-center items-center w-6/12">Establecimiento</th>
                                <th scope="col" className="flex justify-center items-center w-3/12">Contacto</th>
                                <th scope="col" className="flex justify-center items-center w-3/12">Fecha</th>
                            </tr>
                        </thead>
                        <body>
                            {
                                user.clicksContactos.map((item, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                        <td className="flex justify-start items-center w-6/12">{item.establecimiento}</td>
                                        <td className="flex justify-center items-center w-3/12">{item.valor}</td>
                                        <td className="flex justify-center items-center w-3/12">{item.fecha}</td>
                                    </tr>
                                ))
                            }
                        </body>
                    </table>
                </div>
            }
            {
                user.business && user.business.length > 0 &&
                <div className='flex flex-col gap-4'>
                    <div className='bg-blue-200 flex py-1 px-4 gap-1'>
                        <span className="icon-[material-symbols-light--add-card-rounded] h-4 w-4 text-blue-500"></span>
                        <label className='text-xs font-semibold'>Tarjetas adicionales</label>
                    </div>
                    <table>
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                            <tr className='flex  justify-between '>
                                <th scope="col" className="flex justify-center items-center w-2/12">Cédula</th>
                                <th scope="col" className="flex justify-center items-center w-5/12">Nombres</th>
                                <th scope="col" className="flex justify-center items-center w-5/12">Contactos</th>
                            </tr>
                        </thead>
                        <body>
                            {
                                user.business.map((item, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                        <td className="flex justify-center items-center w-2/12 text-center">{item.ci_ruc}</td>
                                        <td className="flex justify-center items-center w-5/12">{item.nombres}</td>
                                        <td className="flex justify-center items-center w-5/12">{item.contactos}</td>
                                    </tr>
                                ))
                            }
                        </body>
                    </table>
                </div>
            }
            {
                user.referidos && user.referidos.length > 0 &&
                <div className='flex flex-col gap-4'>
                    <div className='bg-blue-200 flex py-1 px-4 gap-1'>
                        <span className="icon-[material-symbols-light--add-card-rounded] h-4 w-4 text-blue-500"></span>
                        <label className='text-xs font-semibold'>Clientes referidos</label>
                    </div>
                    <table>
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                            <tr className='flex  justify-between '>
                                <th scope="col" className="flex justify-center items-center w-2/12">Cédula</th>
                                <th scope="col" className="flex justify-center items-center w-5/12">Nombres</th>
                                <th scope="col" className="flex justify-center items-center w-2/12">Id Reserva</th>
                                <th scope="col" className="flex justify-center items-center w-3/12">Estado</th>
                            </tr>
                        </thead>
                        <body>
                            {
                                user.referidos.map((item, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50 text-[10px] flex">
                                        <td className="flex justify-center items-center w-2/12 text-center">{item.ci}</td>
                                        <td className="flex justify-center items-center w-5/12">{item.nombres}</td>
                                        <td className="flex justify-center items-center w-2/12">{item.id_tbl_reserva}</td>
                                        <td className="flex justify-center items-center w-3/12">{item.estado}</td>
                                    </tr>
                                ))
                            }
                        </body>
                    </table>
                </div>
            }
        </div>
    );
};

export default SuscriptorDetalle