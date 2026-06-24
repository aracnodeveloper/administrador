import React, { useState } from 'react';
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';

const BtnAccion = ({ title, disabled, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-lg text-xs transition-colors ${
            disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" :
                       "bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
        }`}
    >
        {children}
    </button>
);

const TablaSuscriptores = ({ suscriptores, handleClickEdit }) => {
    const fActual = new Date();
    const [loadingId, setLoadingId] = useState();

    const handleClickEditar = async (id) => {
        console.log('🔍 Buscando suscriptor con ID:', id);
        setLoadingId(id);

        try {
            const res = await listarSuscriptores({
                idUsuario: id,
                filtros: {},
                pagina: 1
            });
            console.log('📦 Datos recibidos del backend:', res);

            // El backend devuelve 'suscripcion' (singular) cuando se busca por ID
            if (res) {
                // Normalizar la estructura: convertir 'suscripcion' a 'suscripciones'
                const datosNormalizados = {
                    ...res,
                    suscripciones: res.suscripcion || res.suscripciones || []
                };

                console.log('✅ Datos normalizados:', datosNormalizados);

                if (datosNormalizados.suscripciones.length > 0) {
                    handleClickEdit(datosNormalizados);
                } else {
                    console.warn('⚠️ No se encontraron suscripciones');
                    alert('No se encontraron suscripciones para este usuario');
                }
            } else {
                alert('No se encontraron datos para este suscriptor');
            }
        } catch (error) {
            console.error('❌ Error al cargar suscriptor:', error);
            alert(`Error al cargar los datos: ${error.message}`);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-xs'>
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600 w-10">#</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Acciones</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">ID</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Cédula</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Nombres</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Inicio / Fin</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Patrocinador</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Pago</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Empresa</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {suscriptores && suscriptores.length > 0 ? (
                    suscriptores.map((item, index) => {
                        const fechaFin = new Date(item.fecha_fin.split(" ")[0]);
                        const estaVencido = fechaFin < fActual;

                        return (
                            <tr
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors ${
                                    estaVencido ? "text-red-500" : ""
                                }`}
                                key={`suscriptor-${item.id_tbl_usuario}-${index}`}
                            >
                                <td className="px-3 py-2 text-gray-400">
                                    {index + 1}
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-1.5">
                                        {loadingId === item.id_tbl_usuario ? (
                                            <span className="icon-[eos-icons--loading] h-4 w-4 text-green-600"></span>
                                        ) : (
                                            <BtnAccion
                                                title="Editar Suscriptor"
                                                onClick={() => handleClickEditar(item.id_tbl_usuario)}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </BtnAccion>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-2 font-mono text-gray-700">
                                    {item.codigo}
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                    {item.ci_ruc}
                                </td>
                                <td className="px-3 py-2 font-semibold text-gray-800">
                                    {item.usuario}
                                </td>
                                <td className="px-3 py-2">
                                    <div className='flex flex-col text-[10px]'>
                                        <span className='text-green-600'>
                                            {item.fecha_inicio.split(" ")[0]}
                                        </span>
                                        <span className={estaVencido ? 'text-red-600 font-semibold' : 'text-orange-600'}>
                                            {item.fecha_fin.split(" ")[0]}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                    {item.vendedor}
                                </td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        item.estado_pago === 'Pagado' || item.estado_pago === 'Cortesía'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {item.estado_pago}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                    {item.nombre}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center py-10 text-gray-400">
                            No hay suscriptores para mostrar
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaSuscriptores;
