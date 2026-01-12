import React, { useState, useEffect } from 'react';
import DatosPersonales from './DatosPersonales';
import InformacionSuscripcion from './InformacionSuscripcion';
import { guardarSuscriptor } from '../../../../../controllers/suscriptores/SuscriptoresController';

const AgregarSuscriptor = ({ editData, setEditData }) => {
    const [loading, setLoading] = useState(false);
    const [datosPersonales, setDatosPersonales] = useState({
        ci: '',
        nombres: '',
        provincia: 0,
        ciudad: 0,
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
        usuario: '',
        clave: '',
        contactos: []
    });

    const [suscripciones, setSuscripciones] = useState([]);

    // Cargar datos cuando editData cambia
    useEffect(() => {
        console.log('🔄 EditData recibido:', editData);

        if (editData) {
            // Normalizar: puede venir como 'suscripcion' o 'suscripciones'
            const suscripcionesData = editData.suscripciones || editData.suscripcion || [];

            if (suscripcionesData.length > 0) {
                console.log('📝 Cargando datos para editar:', editData);

                const primeraSuscripcion = suscripcionesData[0];
                const usuario = primeraSuscripcion.usuario?.[0] || editData.usuario?.[0] || {};

                // Extraer contactos
                const contactosArray = [];
                const contactosData = primeraSuscripcion.contacto || editData.contacto || [];

                if (Array.isArray(contactosData)) {
                    contactosData.forEach(c => {
                        contactosArray.push({
                            id_tbl_tipo_contacto: parseInt(c.id_tbl_tipo_contacto) || 1,
                            contacto: c.contacto || ''
                        });
                    });
                }

                // Cargar datos personales
                setDatosPersonales({
                    ci: usuario.ci_ruc || '',
                    nombres: usuario.nombres || '',
                    provincia: 0,
                    ciudad: usuario.id_tbl_lugar || 0,
                    direccion: usuario.direccion || '',
                    fecha_nacimiento: usuario.fecha_nacimiento || '',
                    genero: usuario.genero || '',
                    usuario: usuario.usuario || '',
                    clave: usuario.clave || '',
                    contactos: contactosArray
                });

                // Cargar suscripciones
                const suscripcionesFormateadas = suscripcionesData.map(sus => {
                    // Extraer información del vendedor
                    const vendedorInfo = sus.vendedor?.[0] || {};

                    return {
                        // Información básica
                        titulo: sus.titulo || '',
                        fecha_inicio: sus.fecha_inicio ? sus.fecha_inicio.split(' ')[0] : '',
                        fecha_fin: sus.fecha_fin ? sus.fecha_fin.split(' ')[0] : '',
                        id_estado_pago: sus.pago?.[0]?.id_tbl_estado_pago_suscripcion || 2,
                        observacion: sus.observacion || '',
                        precio: sus.pago?.[0]?.total || 0,

                        // IDs de producto
                        id_producto: sus.id_producto || '',
                        id_prod_suscripcion: sus.id_tbl_prod_suscripcion || '',
                        id_lista_precio_producto: sus.id_tbl_lista_precio_producto || '',

                        // Información del vendedor
                        vendedor: vendedorInfo.nombres || '',
                        id_vendedor: vendedorInfo.id_usuario || sus.id_usuario_vendedor || '',
                        id_suscripcion_vendedor: sus.id_suscripcion_vendedor || '',

                        // Código promocional y canal
                        id_codigo_promocional: sus.id_codigo_promocional || 0,
                        id_canal: sus.id_tbl_tipo_canal || 13
                    };
                });

                setSuscripciones(suscripcionesFormateadas);
                console.log('✅ Datos cargados:', {
                    datosPersonales: {
                        ci: usuario.ci_ruc,
                        nombres: usuario.nombres,
                        contactos: contactosArray.length
                    },
                    suscripciones: suscripcionesFormateadas.length
                });
            } else {
                console.warn('⚠️ No hay suscripciones en editData');
            }
        } else {
            // Si no hay editData, limpiar el formulario
            limpiarFormulario();
        }
    }, [editData]);

    const limpiarFormulario = () => {
        setDatosPersonales({
            ci: '',
            nombres: '',
            provincia: 0,
            ciudad: 0,
            direccion: '',
            fecha_nacimiento: '',
            genero: '',
            usuario: '',
            clave: '',
            contactos: []
        });
        setSuscripciones([]);
    };

    const handleGuardar = async () => {
        // Validaciones básicas
        if (!datosPersonales.ci || !datosPersonales.nombres) {
            alert('Por favor complete los campos obligatorios: Cédula y Nombres');
            return;
        }

        if (!suscripciones || suscripciones.length === 0) {
            alert('Por favor agregue al menos una suscripción');
            return;
        }

        // Validar que tenga vendedor asignado
        const suscripcion = suscripciones[0];
        if (!suscripcion.id_vendedor || !suscripcion.id_suscripcion_vendedor) {
            alert('La suscripción debe tener un vendedor asignado. Por favor, busque productos con un código promocional válido.');
            return;
        }

        setLoading(true);
        try {
            const resultado = await guardarSuscriptor({
                datosPersonales,
                suscripciones,
                isEdit: !!editData
            });

            if (resultado) {
                alert('Suscriptor guardado exitosamente ✅');
                limpiarFormulario();
                setEditData(null);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error al guardar el suscriptor: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        limpiarFormulario();
        setEditData(null);
    };

    return (
        <div className='pl-3 w-full'>
            <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                <div className='flex gap-2 items-center justify-between mb-4'>
                    <label className="text-greenVE-700 text-xl font-semibold">
                        {editData ? '✏️ Editar Suscriptor' : '➕ Agregar Suscriptor'}
                    </label>
                    {editData && (
                        <div className='px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm'>
                            Editando suscripción
                        </div>
                    )}
                </div>

                <DatosPersonales
                    datosPersonales={datosPersonales}
                    setDatosPersonales={setDatosPersonales}
                />

                <InformacionSuscripcion
                    suscripciones={suscripciones}
                    setSuscripciones={setSuscripciones}
                    isEdit={!!editData}
                />

                <div className='border border-gray-300 mt-4'></div>
                <div className='flex gap-2 mt-4'>
                    <button
                        onClick={handleCancelar}
                        className='px-4 py-2 rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 transition-colors'
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white font-medium ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-greenVE-700 hover:bg-greenVE-800'
                        }`}
                    >
                        {loading ? (
                            <span className='flex items-center gap-2'>
                                <span className="icon-[eos-icons--loading] h-5 w-5"></span>
                                Guardando...
                            </span>
                        ) : (
                            `${editData ? 'Actualizar' : 'Guardar'} Suscriptor`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgregarSuscriptor;
