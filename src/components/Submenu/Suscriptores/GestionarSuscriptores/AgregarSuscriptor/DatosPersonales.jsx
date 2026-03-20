import React, { useEffect, useState } from 'react';
import Config from '../../../../../global/config';
import { getRemoteCities } from '../../../../../controllers/info/InfoController';

const DatosPersonales = ({ usuario, contactos }) => {
    const [provincias, setProvincias] = useState();
    const [selProvincia, setSelProvincia] = useState(0);
    const [selCiudad, setSelCiudad] = useState(0);

    const [userData, setUserData] = useState({
        ci_ruc: usuario?.ci_ruc || "",
        nombres: usuario?.nombres || "",
        direccion: usuario?.direccion || "",
        fecha_nacimiento: usuario?.fecha_nacimiento || "",
        genero: usuario?.genero || ""
    });

    const [contactList, setContactList] = useState(contactos || []);

    useEffect(() => {
        setUserData({
            ci_ruc: usuario?.ci_ruc || "",
            nombres: usuario?.nombres || "",
            direccion: usuario?.direccion || "",
            fecha_nacimiento: usuario?.fecha_nacimiento || "",
            genero: usuario?.genero || ""
        });
    }, [usuario]);

    useEffect(() => {
        setContactList(contactos || []);
    }, [contactos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddContact = () => {
        setContactList([...contactList, { id_tbl_tipo_contacto: "1", contacto: "" }]);
    };

    const handleChangeContact = (index, field, value) => {
        const newList = [...contactList];
        newList[index][field] = value;
        setContactList(newList);
    };

    const handleRemoveContact = (index) => {
        const newList = [...contactList];
        newList.splice(index, 1);
        setContactList(newList);
    };

    useEffect(() => {
        getRemoteCities().then((res) => {
            if (res) {
                setProvincias(res)
            }
        })
    }, []);

    return (
        <div className='flex flex-col gap-6 animate-fadeIn py-4'>
            {/* Cabecera Principal*/}
            <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
                <div className='bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-greenVE-600 text-white flex items-center justify-center shadow-sm'>
                            <span className='icon-[material-symbols--contact-page-outline-rounded] text-xl'></span>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-base font-bold text-slate-800 leading-tight'>Ficha de Datos Personales</h3>
                            <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Módulo Administrativo de Suscriptores</p>
                        </div>
                    </div>
                </div>

                <div className='p-4 grid grid-cols-1 lg:grid-cols-12 gap-4'>
                    {/* Sección Principal*/}
                    <div className='lg:col-span-12 flex flex-col gap-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 font-sans'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 uppercase ml-2 flex items-center gap-2'>
                                    Cédula / RUC <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 icon-[material-symbols--badge-outline-rounded] text-slate-300'></span>
                                    <input
                                        name="ci_ruc"
                                        value={userData.ci_ruc}
                                        onChange={handleChange}
                                        type='text'
                                        placeholder="Ingrese cédula o RUC"
                                        className='w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none font-sans'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 uppercase ml-2 flex items-center gap-2'>
                                    Nombres Completos <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 icon-[material-symbols--label-outline-rounded] text-slate-300'></span>
                                    <input
                                        name="nombres"
                                        value={userData.nombres}
                                        onChange={handleChange}
                                        type='text'
                                        placeholder="Ingresar nombre completo"
                                        className='w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none font-sans'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-sans'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[10px] font-bold text-slate-400 lg:text-center uppercase tracking-widest'>Provincia</label>
                                <select
                                    value={selProvincia}
                                    onChange={(event) => setSelProvincia(event.target.value)}
                                    className='w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 focus:ring-2 focus:ring-greenVE-500/5 focus:border-greenVE-500 transition-all outline-none font-sans'
                                >
                                    <option value="">Seleccione provincia</option>
                                    {provincias && provincias.map((item, index) => (
                                        <option value={index} key={index}>{item.Titulo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[10px] font-bold text-slate-400 lg:text-center uppercase tracking-widest'>Ciudad</label>
                                <select
                                    value={selCiudad}
                                    onChange={(event) => setSelCiudad(event.target.value)}
                                    className='w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 focus:ring-2 focus:ring-greenVE-500/5 focus:border-greenVE-500 transition-all outline-none font-sans'
                                >
                                    <option value="">Seleccione ciudad</option>
                                    {provincias && provincias[selProvincia]?.Valor.map((item, index) => (
                                        <option value={item.Valor} key={index}>{item.Titulo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Nuevos campos: Dirección, Fecha Nacimiento, Género */}
                        <div className='flex flex-col gap-4 font-sans'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[11px] font-bold text-slate-500 uppercase ml-2'>Dirección</label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 icon-[material-symbols--home-outline-rounded] text-slate-300'></span>
                                    <input
                                        name="direccion"
                                        value={userData.direccion}
                                        onChange={handleChange}
                                        type='text'
                                        placeholder="Ingrese dirección completa"
                                        className='w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none font-sans'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-2'>Fecha de Nacimiento</label>
                                    <div className='relative'>
                                        <input
                                            name="fecha_nacimiento"
                                            value={userData.fecha_nacimiento}
                                            onChange={handleChange}
                                            type='date'
                                            className='w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none font-sans cursor-pointer'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[11px] font-bold text-slate-500 uppercase ml-2'>Género</label>
                                    <select
                                        name="genero"
                                        value={userData.genero}
                                        onChange={handleChange}
                                        className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-greenVE-500/10 focus:border-greenVE-500 transition-all outline-none font-sans'
                                    >
                                        <option value="">Seleccione género</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="O">Otro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* SECCIÓN CONTACTOS*/}
            <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
                <div className='bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <span className='icon-[material-symbols--contact-emergency-outline-rounded] text-slate-400 text-xl'></span>
                        <h3 className='text-sm font-bold text-slate-800 uppercase tracking-widest'>Contactos</h3>
                    </div>
                    <button
                        onClick={handleAddContact}
                        className='bg-white hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-4 rounded-lg transition-all border border-slate-200 shadow-sm flex items-center gap-2 text-[11px] uppercase tracking-widest active:scale-95'
                    >
                        <span className='icon-[material-symbols--add-box-outline-rounded] text-lg'></span>
                        Añadir
                    </button>
                </div>

                <div className='p-6'>
                    <div className='border border-slate-200 rounded-lg overflow-hidden'>
                        <table className='w-full border-collapse font-sans'>
                            <thead>
                                <tr className='bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200'>
                                    <th className='px-6 py-3 text-left w-1/3 border-r border-slate-200'>Tipo de Medio</th>
                                    <th className='px-6 py-3 text-left'>Información / Detalle</th>
                                    <th className='px-6 py-3 text-center w-20'></th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100'>
                                {contactList.map((item, index) => (
                                    <tr key={index} className='hover:bg-slate-50 transition-colors'>
                                        <td className='px-4 py-2 border-r border-slate-50 relative'>
                                            <select
                                                value={item.id_tbl_tipo_contacto}
                                                className='w-full h-9 bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer appearance-none pr-8 font-sans'
                                                onChange={(e) => handleChangeContact(index, 'id_tbl_tipo_contacto', e.target.value)}
                                            >
                                                {Config.TIPOCONT.map((opt) => (
                                                    <option value={opt.id} key={opt.id}>{opt.nombre}</option>
                                                ))}
                                            </select>
                                            <span className='absolute right-4 top-1/2 -translate-y-1/2 icon-[material-symbols--arrow-drop-down] text-slate-300 pointer-events-none'></span>
                                        </td>
                                        <td className='px-4 py-2'>
                                            <input
                                                className='w-full h-9 bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 outline-none placeholder:text-slate-300 font-sans'
                                                value={item.contacto}
                                                placeholder="Ingresar contacto"
                                                onChange={(e) => handleChangeContact(index, 'contacto', e.target.value)}
                                            />
                                        </td>
                                        <td className='px-4 py-2 text-center border-l border-slate-50'>
                                            <button
                                                onClick={() => handleRemoveContact(index)}
                                                className='w-8 h-8 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center mx-auto'
                                                title="Remover"
                                            >
                                                <span className='icon-[material-symbols--close-rounded] text-lg'></span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {contactList.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className='px-6 py-12 text-center text-slate-400 italic text-xs bg-slate-50/20'>
                                            No hay registros de contacto ingresados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatosPersonales;