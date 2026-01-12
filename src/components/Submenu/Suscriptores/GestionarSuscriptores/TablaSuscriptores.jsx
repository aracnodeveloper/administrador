import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { listarSuscriptores } from '../../../../controllers/suscriptores/SuscriptoresController';

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
        <div className='w-full overflow-x-auto'>
            <table className='w-full min-w-max'>
                <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 w-full">
                <tr className='flex justify-between'>
                    <th scope="col" className="flex justify-center items-center w-[5%] p-2">#</th>
                    <th scope="col" className="flex justify-center items-center w-[5%] p-2">Opciones</th>
                    <th scope="col" className="flex justify-center items-center w-[10%] p-2">ID</th>
                    <th scope="col" className="flex justify-center items-center w-[10%] p-2">Cédula</th>
                    <th scope="col" className="flex justify-center items-center w-[15%] p-2">Nombres</th>
                    <th scope="col" className="flex justify-center items-center w-[10%] p-2">Inicio / Fin</th>
                    <th scope="col" className="flex justify-center items-center w-[15%] p-2">Patrocinador</th>
                    <th scope="col" className="flex justify-center items-center w-[10%] p-2">Pago</th>
                    <th scope="col" className="flex justify-center items-center w-[10%] p-2">Empresa</th>
                </tr>
                </thead>
                <tbody>
                {suscriptores && suscriptores.length > 0 ? (
                    suscriptores.map((item, index) => {
                        const fechaFin = new Date(item.fecha_fin.split(" ")[0]);
                        const estaVencido = fechaFin < fActual;

                        return (
                            <tr
                                className={`odd:bg-white even:bg-gray-50 text-[12px] flex justify-between border-y hover:bg-gray-100 transition-colors ${
                                    estaVencido ? "text-red-500" : ""
                                }`}
                                key={`suscriptor-${item.id_tbl_usuario}-${index}`}
                            >
                                <td className="flex justify-center items-center w-[5%] text-center p-2">
                                    {index + 1}
                                </td>
                                <td className="flex justify-center items-center text-center w-[5%] gap-2 p-2">
                                    <Tooltip
                                        className='bg-gray-700 text-[10px] py-1'
                                        content="Editar Suscriptor"
                                        arrow={false}
                                    >
                                        {loadingId === item.id_tbl_usuario ? (
                                            <span className="icon-[eos-icons--loading] h-5 w-5 text-blue-600"></span>
                                        ) : (
                                            <span
                                                className="icon-[typcn--edit] w-5 h-5 hover:text-blue-600 cursor-pointer text-gray-500 transition-colors"
                                                onClick={() => handleClickEditar(item.id_tbl_usuario)}
                                            ></span>
                                        )}
                                    </Tooltip>
                                </td>
                                <td className="flex justify-center items-center w-[10%] text-center p-2">
                                    {item.codigo}
                                </td>
                                <td className="flex justify-center items-center w-[10%] text-center p-2">
                                    {item.ci_ruc}
                                </td>
                                <td className="flex justify-center items-center w-[15%] text-center p-2">
                                    {item.usuario}
                                </td>
                                <td className="flex justify-center items-center w-[10%] text-center p-2">
                                    <div className='flex flex-col text-[10px]'>
                                            <span className='text-green-600'>
                                                {item.fecha_inicio.split(" ")[0]}
                                            </span>
                                        <span className={estaVencido ? 'text-red-600 font-semibold' : 'text-orange-600'}>
                                                {item.fecha_fin.split(" ")[0]}
                                            </span>
                                    </div>
                                </td>
                                <td className="flex justify-center items-center w-[15%] text-center p-2">
                                    {item.vendedor}
                                </td>
                                <td className="flex justify-center items-center w-[10%] text-center p-2">
                                        <span className={`px-2 py-1 rounded-full text-[10px] ${
                                            item.estado_pago === 'Pagado'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {item.estado_pago}
                                        </span>
                                </td>
                                <td className="flex justify-center items-center w-[10%] text-center p-2">
                                    {item.nombre}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center py-8 text-gray-500">
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
