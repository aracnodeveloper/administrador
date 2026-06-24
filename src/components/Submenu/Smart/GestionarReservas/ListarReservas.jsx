import React, { useEffect, useState } from 'react';
import TablaReservas from './ListarReserva/TablaReservas';
import { listarGestoresReservas, listarReservas, listarReservasFiltro } from '../../../../controllers/smart/SmartController';
import Config from '../../../../global/config';
import { formatDate, verificarPermiso } from '../../../../global/utils';
import DescargarReservas from './DescargarReservas';


const ListarReservas = ({ handleClickEdit }) => {
    const [change, setChange] = useState();
    const [data, setData] = useState();
    const [numPaginas, setNumPaginas] = useState();
    const [total, setTotal]=useState();
    const [selPagina, setSelPagina] = useState(0);
    const [gestores, setGestores] = useState();
    const [selGestor, setSelGestor] = useState("-2");
    const [selEstado, setSelEstado] = useState("-2");
    const [selPago, setSelPago] = useState("-3");
    const [fInicio, setFInicio] = useState(formatDate(new Date().setMonth(new Date().getMonth() - 1)));
    const [fFin, setFFin] = useState(formatDate(new Date()))
    const [idSuscriptor, setIdSuscriptor] = useState();
    const [nomEstablecimiento, setNomEstablecimiento] = useState();
    const [idReserva, setIdReserva] = useState();
    const [ciRuc, setCiRuc] = useState();
    const [loading, setLoading] = useState();
    const [cantidad, setCantidad]=useState("20");

    const handleSetChange = () => {
        setChange(prev => prev + 1);
    };

    useEffect(() => {
        setLoading(true);
        listarReservas({}).then((res) => {
            setLoading(false)
            if (res && res.reservas) {
                setData(res.reservas)
                setNumPaginas(cantidad=="1"?1:Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
            }
        });
        if (verificarPermiso(87)) {
            listarGestoresReservas({}).then((res) => {
                if (res) {
                    setGestores(res)
                    console.log(res)
                }
            });
        }
    }, []);

    const handleClicAplicar = ({ pagina = 1, aplicar = true }) => {
        setData();
        setLoading(true);
        const params = {
            id_tbl_usuario: parseInt(selGestor),
            id_tbl_estado_reserva: parseInt(selEstado),
            tipoPago: selPago,
            pagina: pagina,
            fechas: {
                inicio: fInicio,
                fin: fFin
            },
            codCliente: idSuscriptor,
            nomEstablecimiento: nomEstablecimiento,
            nroReserva: idReserva,
            ciRuc: ciRuc,
            cantidad:cantidad!="1"?cantidad:""
        };
        listarReservasFiltro(params, false).then((res) => {
            setLoading(false);
            if (res && res.reservas) {
                setData(res.reservas);
                setNumPaginas(cantidad=="1"?1:Math.ceil(parseInt(res.cantidad) / parseInt(cantidad)));
                setTotal(res.cantidad)
                if (aplicar) {
                    console.log("resetear");
                    setSelPagina(0);
                }
            }
        });
    };

    const handleOnPageChange = (newPage) => {
        setSelPagina(newPage);
        handleClicAplicar({ aplicar: false, pagina: newPage + 1 });
    };

    return (
        <div className='flex-1 p-4 w-full relative'>
            {/* Filtros inline */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                {verificarPermiso(87) &&
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                        value={selGestor}
                        onChange={(event) => setSelGestor(event.target.value)}
                    >
                        <option value="-2" disabled>Gestor de reserva</option>
                        <option value="-1">Todos los gestores</option>
                        {gestores && gestores.map((item, index) => (
                            <option key={index} value={item.id_tbl_usuario}>{item.nombre}</option>
                        ))}
                    </select>
                }
                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={selEstado}
                    onChange={(event) => setSelEstado(event.target.value)}
                >
                    <option value="-2" disabled>Estado de reserva</option>
                    <option value="-1">Todos los estados</option>
                    {Config.ESTADOS.map((item, index) => (
                        <option key={index} value={item.id}>{`${item.nombre} `}</option>
                    ))}
                </select>

                {/* Filtro de fechas */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 shrink-0">Fecha:</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fInicio}
                        onChange={e => setFInicio(e.target.value)}
                        title="Desde"
                    />
                    <span className="text-gray-300 text-xs">—</span>
                    <input
                        type="date"
                        className="text-xs border-none outline-none bg-transparent text-gray-600"
                        value={fFin}
                        onChange={e => setFFin(e.target.value)}
                        title="Hasta"
                    />
                </div>

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={selPago}
                    onChange={(event) => setSelPago(event.target.value)}
                >
                    <option value="-3" disabled>Tipo de pago</option>
                    <option value="-2">Todos los tipos</option>
                    {Config.PAGOS.map((item, index) => (
                        <option key={index} value={item.id}>{`${item.nombre} `}</option>
                    ))}
                </select>

                <select
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                    value={cantidad}
                    onChange={(event) => setCantidad(event.target.value)}
                >
                    {Config.ELEMENTOSHOJAS.map((item) => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))}
                </select>

                <DescargarReservas params={{
                    id_tbl_usuario: parseInt(selGestor),
                    id_tbl_estado_reserva: parseInt(selEstado),
                    tipoPago: selPago,
                    fechas: { inicio: fInicio, fin: fFin },
                    codCliente: idSuscriptor,
                    nomEstablecimiento: nomEstablecimiento,
                    nroReserva: idReserva,
                    ciRuc: ciRuc,
                }} />
            </div>

            {/* Filtros secundarios */}
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Id Suscriptor"
                    value={idSuscriptor || ''}
                    onChange={e => setIdSuscriptor(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Establecimiento"
                    value={nomEstablecimiento || ''}
                    onChange={e => setNomEstablecimiento(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Id Reserva"
                    value={idReserva || ''}
                    onChange={e => setIdReserva(e.target.value)}
                />
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Cédula / RUC"
                    value={ciRuc || ''}
                    onChange={e => setCiRuc(e.target.value)}
                />
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                    onClick={() => handleClicAplicar({filtros:true})}
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Aplicar'}
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {total && (
                    <div className="flex items-center justify-between px-4 py-2.5 border-b bg-gray-50">
                        <div className="text-xs text-gray-500">
                            Total: <strong className="text-gray-800">{total}</strong> resultado{total != 1 ? 's' : ''}
                        </div>
                        <span className="text-xs text-gray-400">Página {selPagina + 1}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando...</span>
                    </div>
                ) : (!loading && !data) ? (
                    <p className="text-center text-xs text-gray-400 py-10">Sin resultados disponibles</p>
                ) : (
                    <TablaReservas handleClickEdit={handleClickEdit} reservas={data} />
                )}
            </div>

            {/* Paginación */}
            {!loading && data && numPaginas > 1 && (
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>Página {selPagina + 1} de {numPaginas}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={selPagina === 0}
                            onClick={() => handleOnPageChange(selPagina - 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            ← Anterior
                        </button>
                        <button
                            disabled={selPagina >= numPaginas - 1}
                            onClick={() => handleOnPageChange(selPagina + 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarReservas;