import { Tooltip } from 'flowbite-react';
import React, { useState } from 'react';
import { getCertificadoReserva, listarReservas } from '../../../../../controllers/smart/SmartController';
import Config from '../../../../../global/config';
import { capitalize, verificarPermiso } from '../../../../../global/utils';
import { DataGrid } from '@mui/x-data-grid';

const TablaReservas = ({ handleClickEdit, reservas }) => {
    const [loadingId, setLoadingId] = useState();
    const [loadingCertId, setLoadingCertId] = useState();
    const estados = [
        <div className='flex gap-1 items-center text-amber-600'>
            <span className="icon-[lucide--clock] h-3 w-3"></span>
            <label>Pendiente</label>
        </div>,
        <div className='flex gap-1 items-center text-greenVE-600'>
            <span className="icon-[material-symbols--check-circle-outline] h-3 w-3"></span>
            <label>Confirmado</label>
        </div>,
        <div className='flex gap-1 items-center text-red-600'>
            <span className="icon-[f7--xmark-circle] h-3 w-3"></span>
            <label>Cancelado</label>
        </div>,
        <div className='flex gap-1 items-center text-blue-600'>
            <span className="icon-[icons8--document] h-3 w-3"></span>
            <label>Cotización</label>
        </div>,
    ]

    const handleClickEditRes = (id) => {
        setLoadingId(id)
        listarReservas({ id: id }).then((res) => {
            setLoadingId()
            if (res) {
                handleClickEdit(res)
            }
        })
    }

    const handleClickPrint = (id) => {
        window.open(`/administrador/imprimir-reserva?id=${id}`)
    }

    const handleClickCert = (id) => {
        setLoadingCertId(id)
        try {
            getCertificadoReserva(id).then((res) => {
                setLoadingCertId()
                if (res) {
                    const searchParams = new URLSearchParams();
                    for (const key in res) {
                        if (Object.hasOwnProperty.call(res, key)) {
                            const value = typeof res[key] === 'object' ? JSON.stringify(res[key]) : res[key];
                            searchParams.append(key, value);
                        }
                    }
                    console.log(searchParams)
                    window.open(`https://visitaecuador.com/#/certificado?${searchParams.toString()}`, '_blank');
                }
            })
        } catch (e) {

        }
    }

    const options = (id) => {
        return(
        <div className="flex justify-center items-center text-center gap-2">
            {
                verificarPermiso(68) &&
                    loadingId == id
                    ? <div className='h-5 w-5' ><span className="icon-[line-md--loading-twotone-loop] h-5 w-5"></span></div>
                    : <div className='h-5 w-5' title='Editar reserva' onClick={(e) => { e.preventDefault(); e.button === 0 && handleClickEditRes(id) }}><a className="icon-[typcn--edit] w-5 h-5 hover:bg-blue-600 cursor-pointer text-gray-500" href={`${window.location}reserva/${id}`} /></div>
            }
            {
                <div className='h-5 w-5'><span title='Imprimir reserva' className="icon-[uil--print] w-5 h-5 hover:bg-blue-600  cursor-pointer text-gray-500" onClick={() => handleClickPrint(id)}></span></div>
            }
            {
                verificarPermiso(73) &&
                    loadingCertId == id
                    ? <div className='h-5 w-5'><span className="icon-[line-md--loading-twotone-loop] h-5 w-5"></span></div>
                    : <div className='h-5 w-5'><span title='Imprimir certificado' className="icon-[iconamoon--certificate-badge] w-5 h-5 hover:bg-greenVE-600  cursor-pointer text-gray-500" onClick={() => handleClickCert(id)}></span></div>
            }
        </div>)
    }

    const usuario = (item) => {
        return (
            <div className="flex flex-col justify-center items-center gap-1  text-center py-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
                <label className={`${item.tipoUsuario=="gratis"?"text-greenVE-600":item.tipoUsuario==`suscriptor`?"text-blue-500":"text-orange-500"}`}>{item.tipoUsuario}</label>
                <label className='w-full overflow-hidden whitespace-nowrap text-ellipsis truncate' title={item.idCliSuscripcion}>{item.idCliSuscripcion}</label>
            </div>
        );
    };

    // Definir las columnas y su configuración
    const columns = [
        { field: 'id', headerName: '#', flex: 1.5 },
        { field: 'opciones', headerName: 'Opc.', flex: 7.5, renderCell: (params) => (options(params.row.id_tbl_reserva)), sortable: false },
        { field: 'id_tbl_reserva', headerName: '# Reserva', flex: 5 },
        { field: 'fecha', headerName: 'Fecha', flex: 8 },
        { field: 'estado', headerName: 'Estado', flex: 8, renderCell: (params) => (estados[parseInt(params.row.id_tbl_estado_reserva) - 1]), sortable: true  },
        { field: 'id_sus', headerName: 'ID Sus.', flex: 8, renderCell: (params) => (usuario(params.row.item)), sortable: true  },
        { field: 'suscriptor', headerName: 'Suscriptor', flex: 15 },
        { field: 'gestionado', headerName: 'Gestionado por', flex: 15 },
        { field: 'establecimiento', headerName: 'Establecimiento', flex: 20 },
        { field: 'num_paquetes', headerName: '# Paquetes', flex: 5 },
        { field: 'total', headerName: 'Total', flex: 6, renderCell:(params)=>(<span>${params.row.total.toFixed(2)}</span>) },
    ];

    // Mapear la lista recibida a las filas
    const rows = reservas.map((item, index) => ({
        id: index + 1, // Utilizo el índice + 1 como identificador
        id_tbl_reserva: item.id_tbl_reserva,
        fecha: item.fecha_creacion,
        id_tbl_estado_reserva:item.id_tbl_estado_reserva,
        estado:Config.obtenerEstadoReserva(parseInt(item.id_tbl_estado_reserva)),
        id_sus: item.tipoUsuario,
        suscriptor: capitalize(item.usuarioCliente),
        gestionado: capitalize(item.usuarioCreacion),
        establecimiento: capitalize(item.establecimiento),
        num_paquetes: parseInt(item.totalCantidadOfertas),
        total: parseFloat(item.total_reserva),
        item:item
    }));

    return (
        <>
            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={rows.length} 
                    getRowHeight={() => 'auto'}
                    disableSelectionOnClick
                    localeText={Config.esEs}
                    sx={Config.SettingTable}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: rows.length,
                          },
                        },
                    }}
                />
            </div>
        </>
    );
};

export default TablaReservas;