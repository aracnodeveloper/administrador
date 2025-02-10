import React from 'react';

const ReservaDetalle = () => {
    return (
        <div className='flex p-4 z-10 gap-8'>
            <div className=' flex flex-col w-full gap-3'>
                <div className='flex flex-col w-3/12 pr-2'>
                    <label className='font-semibold text-xs'>Estado de reserva</label>
                    <div className='flex'>
                        <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                            <span className="icon-[entypo--flag] text-blue-600"></span>
                        </div>
                        <div className='w-full'>
                            <select
                                className='text-xs w-full'>
                                <option value="1">Pendiente</option>
                                <option value="2">Cancelada</option>
                                <option value="3">Confirmada</option>
                                <option value="4">Cotización</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <div className='w-1/4'>
                        <label className='font-semibold text-xs'>Reserva desde</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[majesticons--calendar] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <input
                                    type='date'
                                    className='text-xs w-full'>
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='w-1/4'>
                        <label className='font-semibold text-xs'>Reserva hasta</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[majesticons--calendar] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <input
                                    type='date'
                                    className='text-xs w-full'>
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='w-1/4'>
                        <label className='font-semibold text-xs'>Adultos</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[fontisto--person] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <select
                                    className='text-xs w-full'>
                                    {Array.from({ length: 100 }, (_, i) => i).map((number) => (
                                        <option key={number} value={number}>
                                        {number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='w-1/4'>
                        <label className='font-semibold text-xs'>Niños</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[material-symbols--child-care] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <select
                                    className='text-xs w-full'>
                                    {Array.from({ length: 100 }, (_, i) => i).map((number) => (
                                        <option key={number} value={number}>
                                        {number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex gap-4'>
                    <div className='flex flex-col w-1/2'>
                        <label className='font-semibold text-xs'>Comentario de cliente</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[majesticons--message] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                                <textarea
                                    rows="4" 
                                    className='text-xs w-full'>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-1/2'>
                        <label className='font-semibold text-xs'>Comentario de reservas</label>
                        <div className='flex'>
                            <div className='border flex items-center w-10 justify-center bg-gray-300 border-black border-r-0'>
                                <span className="icon-[majesticons--message] text-blue-600"></span>
                            </div>
                            <div className='w-full'>
                            <textarea
                                    rows="4" 
                                    className='text-xs w-full'>
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaDetalle;