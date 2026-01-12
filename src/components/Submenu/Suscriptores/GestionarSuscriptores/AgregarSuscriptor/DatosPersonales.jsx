import React, { useEffect, useState } from 'react';
import Config from '../../../../../global/config';
import { getRemoteCities } from '../../../../../controllers/info/InfoController';

const DatosPersonales = ({ datosPersonales, setDatosPersonales }) => {
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        getRemoteCities().then((res) => {
            if (res) {
                setProvincias(res);
            }
        });
    }, []);

    const handleChange = (field, value) => {
        setDatosPersonales(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContactoChange = (index, field, value) => {
        const nuevosContactos = [...datosPersonales.contactos];
        nuevosContactos[index] = {
            ...nuevosContactos[index],
            [field]: value
        };
        setDatosPersonales(prev => ({
            ...prev,
            contactos: nuevosContactos
        }));
    };

    const agregarContacto = () => {
        setDatosPersonales(prev => ({
            ...prev,
            contactos: [
                ...prev.contactos,
                {
                    id_tbl_tipo_contacto: 1,
                    contacto: ''
                }
            ]
        }));
    };

    const eliminarContacto = (index) => {
        setDatosPersonales(prev => ({
            ...prev,
            contactos: prev.contactos.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className='w-full border-2 border-gray-300 rounded-lg mt-5 relative bg-white shadow-sm'>
            <label className='absolute -top-3 left-6 bg-greenVE-600 text-white px-4 py-1 rounded-full text-sm font-semibold'>
                Datos Personales
            </label>

            <div className='p-6 pt-8'>
                {/* Grid de 2 columnas para campos principales */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    {/* Cédula/RUC */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Cédula/RUC <span className='text-red-500'>*</span>
                        </label>
                        <input
                            value={datosPersonales.ci}
                            onChange={(e) => handleChange('ci', e.target.value)}
                            type='text'
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                            placeholder='Ingrese cédula o RUC'
                            maxLength={13}
                        />
                    </div>

                    {/* Nombres Completos */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Nombres Completos <span className='text-red-500'>*</span>
                        </label>
                        <input
                            value={datosPersonales.nombres}
                            onChange={(e) => handleChange('nombres', e.target.value)}
                            type='text'
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                            placeholder='Nombre1 Nombre2 Apellido1 Apellido2'
                        />
                        <span className='text-xs text-gray-500 mt-1'>
                            Formato: Primer nombre, segundo nombre, primer apellido, segundo apellido
                        </span>
                    </div>

                    {/* Provincia */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Provincia
                        </label>
                        <select
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                            value={datosPersonales.provincia}
                            onChange={(e) => handleChange('provincia', e.target.value)}
                        >
                            <option value={0}>Seleccione provincia</option>
                            {provincias && provincias.map((item, index) => (
                                <option key={index} value={index}>{item.Titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ciudad */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Ciudad
                        </label>
                        <select
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                            value={datosPersonales.ciudad}
                            onChange={(e) => handleChange('ciudad', e.target.value)}
                        >
                            <option value={0}>Seleccione ciudad</option>
                            {provincias && provincias[datosPersonales.provincia]?.Valor.map((item, index) => (
                                <option key={index} value={item.Valor}>{item.Titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dirección */}
                    <div className='flex flex-col md:col-span-2'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Dirección
                        </label>
                        <input
                            value={datosPersonales.direccion || ''}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                            type='text'
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                            placeholder='Ingrese dirección completa'
                        />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Fecha de Nacimiento
                        </label>
                        <input
                            value={datosPersonales.fecha_nacimiento || ''}
                            onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                            type='date'
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                        />
                    </div>

                    {/* Género */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 mb-1'>
                            Género
                        </label>
                        <select
                            value={datosPersonales.genero || ''}
                            onChange={(e) => handleChange('genero', e.target.value)}
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                        >
                            <option value="">Seleccione género</option>
                            <option value="1">Masculino</option>
                            <option value="2">Femenino</option>
                            <option value="3">Otro</option>
                        </select>
                    </div>
                </div>

                {/* Sección de Contactos */}
                <div className='border-t border-gray-200 pt-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-base font-semibold text-gray-700'>Contactos</h3>
                        <button
                            onClick={agregarContacto}
                            className='flex items-center gap-2 px-4 py-2 bg-greenVE-600 text-white rounded-md hover:bg-greenVE-700 transition-colors'
                        >
                            <span className="icon-[gridicons--add] h-5 w-5"></span>
                            Agregar Contacto
                        </button>
                    </div>

                    {datosPersonales.contactos && datosPersonales.contactos.length > 0 ? (
                        <div className='space-y-3'>
                            {datosPersonales.contactos.map((item, index) => (
                                <div key={index} className='flex gap-3 items-start p-3 bg-gray-50 rounded-md border border-gray-200'>
                                    <div className='flex-1'>
                                        <label className='text-xs text-gray-600 mb-1 block'>Tipo de Contacto</label>
                                        <select
                                            value={item.id_tbl_tipo_contacto}
                                            onChange={(e) => handleContactoChange(index, 'id_tbl_tipo_contacto', e.target.value)}
                                            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                                        >
                                            {Config.TIPOCONT.map((tipo) => (
                                                <option value={tipo.id} key={tipo.id}>
                                                    {tipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex-1'>
                                        <label className='text-xs text-gray-600 mb-1 block'>Contacto</label>
                                        <input
                                            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenVE-500'
                                            value={item.contacto}
                                            onChange={(e) => handleContactoChange(index, 'contacto', e.target.value)}
                                            placeholder='Ingrese contacto'
                                        />
                                    </div>
                                    <button
                                        onClick={() => eliminarContacto(index)}
                                        className='mt-6 text-red-500 hover:text-red-700 transition-colors'
                                        title='Eliminar contacto'
                                    >
                                        <span className="icon-[material-symbols--delete-outline] h-6 w-6"></span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8 text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-300'>
                            <span className="icon-[material-symbols--contact-phone-outline] h-12 w-12 mx-auto mb-2 text-gray-400"></span>
                            <p className='text-sm'>No hay contactos agregados</p>
                            <p className='text-xs text-gray-400 mt-1'>Haz clic en "Agregar Contacto" para añadir uno</p>
                        </div>
                    )}
                </div>

                {/* Nota informativa */}
                <div className='mt-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-md'>
                    <p className='text-xs text-blue-800'>
                        <span className='font-semibold'>Nota:</span> Los campos marcados con <span className='text-red-500'>*</span> son obligatorios.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DatosPersonales;
