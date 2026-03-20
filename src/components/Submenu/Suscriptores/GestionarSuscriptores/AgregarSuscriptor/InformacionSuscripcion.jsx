import React, { useEffect, useState } from 'react';
import { Datepicker } from 'flowbite-react';
import { formatDate } from '../../../../../global/utils';
import Config from '../../../../../global/config';
import { listarCanalesVenta } from '../../../../../controllers/info/InfoController';
import { buscarUsuarios } from '../../../../../controllers/smart/SmartController';
import ClickAwayListener from 'react-click-away-listener';

const InformacionSuscripcion = ({ suscripciones = [] }) => {
    const [canales, setCanales] = useState();
    const [suggestion, setSuggestion] = useState();
    const [inputValue, setInputValue] = useState();
    const [promoCode, setPromoCode] = useState('');

    // Estado local para manejar las suscripciones añadidas dinámicamente
    const [listSuscripciones, setListSuscripciones] = useState(suscripciones);

    useEffect(() => {
        setListSuscripciones(suscripciones);
    }, [suscripciones]);

    useEffect(() => {
        listarCanalesVenta().then((res) => {
            if (res) {
                setCanales(res)
            }
        })
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue) {
                buscarUsuarios(inputValue).then((res) => {
                    setSuggestion(res)
                });
            } else {
                setSuggestion(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleClickAway = () => {
        setSuggestion();
    }

    const onClickSuggestion = (item) => {
        setSuggestion()
    }

    // Función para AÑADIR una suscripción al hacer clic en el botón
    const handleAddSubscription = () => {
        const nuevaSuscripcion = {
            titulo: "",
            precio: "0.00",
            fecha_inicio: formatDate(new Date()),
            fecha_fin: "",
            id_estado_pago: "1",
            vendedor: "",
            id_tbl_tipo_canal: "1",
            observacion: ""
        };
        setListSuscripciones([...listSuscripciones, nuevaSuscripcion]);
    };

    // Función para ELIMINAR una suscripción
    const handleRemoveSubscription = (index) => {
        const newList = [...listSuscripciones];
        newList.splice(index, 1);
        setListSuscripciones(newList);
    };

    return (
        <div className='flex flex-col gap-6 animate-fadeIn py-4 mt-4'>
            {/* Cabecera con Badge*/}
            <div className='flex items-center'>
                <div className='bg-greenVE-600 text-white px-8 py-2 rounded-full text-sm font-bold shadow-sm flex items-center gap-2.5'>
                    <span className='icon-[material-symbols--info-outline-rounded] text-xl'></span>
                    Información de la Suscripción
                </div>
            </div>

            {/* Panel de Búsqueda de Productos */}
            <div className='bg-blue-50/50 border border-blue-200 rounded-xl p-4 shadow-sm'>
                <div className='flex flex-col gap-4'>
                    <label className='text-xs font-bold text-slate-700 ml-2'>
                        Buscar Productos por Código Promocional
                    </label>
                    <div className='flex gap-3'>
                        <div className='relative flex-1'>
                            <input
                                type='text'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Ingrese código promocional"
                                className='w-full h-11 px-5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm'
                            />
                        </div>
                        <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-md active:scale-95 text-xs uppercase tracking-widest'>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón de Agregar (Vinculado a la función handleAddSubscription) */}
            <div className='flex justify-start'>
                <button
                    onClick={handleAddSubscription}
                    className='bg-greenVE-600 hover:bg-greenVE-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md flex items-center gap-2 text-xs uppercase tracking-widest active:scale-95'
                >
                    <span className='icon-[material-symbols--add-circle-outline-rounded] text-lg'></span>
                    Agregar Suscripción
                </button>
            </div>

            {/* Listado de Suscripciones (Cards) */}
            <div className='flex flex-col gap-4'>
                {listSuscripciones.length > 0 ? (
                    listSuscripciones.map((item, index) => (
                        <div key={index} className='bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group animate-fadeIn'>
                            {/* Botón Eliminar Card */}
                            <button
                                onClick={() => handleRemoveSubscription(index)}
                                className='absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors'
                            >
                                <span className='icon-[material-symbols--close-rounded] text-2xl'></span>
                            </button>

                            <h4 className='text-sm font-bold text-greenVE-800 mb-6'>Suscripción #{index + 1}</h4>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* Fila 1 */}
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Nombre Suscripción <span className='text-red-500'>*</span></label>
                                    <select className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 outline-none'>
                                        <option value="">Seleccione un producto</option>
                                        <option value="1">Plan Oro</option>
                                        <option value="2">Plan Plata</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Precio</label>
                                    <input type='text' defaultValue={item.precio || "0.00"} className='w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 outline-none' />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Fecha Inicio</label>
                                    <div className='relative'>
                                        <input
                                            type='date'
                                            className='w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none cursor-pointer'
                                            defaultValue={item.fecha_inicio || '2026-03-20'}
                                        />
                                    </div>
                                </div>

                                {/* Fila 2 */}
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Fecha Fin</label>
                                    <div className='relative'>
                                        <input
                                            type='date'
                                            className='w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none cursor-pointer'
                                            defaultValue={item.fecha_fin}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Estado de Pago</label>
                                    <select defaultValue={item.id_estado_pago || "1"} className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none'>
                                        <option value="1">Pagado</option>
                                        <option value="2">Pendiente</option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Canal de Venta</label>
                                    <select defaultValue={item.id_tbl_tipo_canal || "1"} className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none'>
                                        {canales && canales.map((opt) => (
                                            <option key={opt.id_tbl_tipo_canal} value={opt.id_tbl_tipo_canal}>{opt.nombre}</option>
                                        ))}
                                        <option value="1">Venta Directa</option>
                                    </select>
                                </div>

                                {/* Fila 3 - Vendedor */}
                                <div className='md:col-span-3 flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Vendedor</label>
                                    <input type='text' defaultValue={item.vendedor} placeholder='Buscar vendedor...' className='w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none' />
                                </div>

                                {/* Fila 4 - Observaciones */}
                                <div className='md:col-span-3 flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-1'>Observaciones</label>
                                    <textarea rows='2' defaultValue={item.observacion} placeholder='Observaciones adicionales...' className='w-full p-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none resize-none'></textarea>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Estado Vacío (Dotted Box) */
                    <div className='border-2 border-dashed border-slate-200 rounded-2xl py-20 bg-slate-50/50 flex flex-col items-center justify-center gap-4 group hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-300'>
                        <div className='w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors'>
                            <span className='icon-[material-symbols--inventory-2-outline-rounded] text-3xl'></span>
                        </div>
                        <div className='flex flex-col items-center gap-1'>
                            <h4 className='text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors'>No hay suscripciones agregadas</h4>
                            <p className='text-[11px] text-slate-400 text-center max-w-[300px]'>Busca productos con un código promocional y luego agrega una suscripción</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default InformacionSuscripcion;