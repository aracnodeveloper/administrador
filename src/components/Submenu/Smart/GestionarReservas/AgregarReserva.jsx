import { Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import SuscriptorReserva from './AgregarReserva/Suscriptor/SuscriptorReserva';
import OfertaDetalle from './AgregarReserva/DetalleOferta/OfertaDetalle';
import ResumenReserva from './AgregarReserva/ResumenReserva/ResumenReserva';
import EstructuraReserva from '../../../../global/estructuraReserva';
import { getOfertas, saveReserva } from '../../../../controllers/smart/SmartController';
import Alerta from '../../../../global/Alerta';

const AgregarReserva = ({ editData, setEditData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selTab, setSelTab] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [cedulaValue, setCedulaValue] = useState('');
    const [user, setUser] = useState();
    const [inputEst, setInputEst] = useState('');
    const [selectedOfer, setSelectedOfer] = useState([]);
    const [contactos, setContactos] = useState();
    const [selectedEst, setSelectedEst] = useState();
    const [ofertas, setOfertas] = useState();
    const [comCliente, setComCliente] = useState();
    const [comReserva, setComReserva] = useState();
    const [estadoRes, setEstadoRes] = useState(1);
    const [feeRef, setFeeRef] = useState("");
    const [comFee, setComFee] = useState();
    const [facturar, setFacturar] = useState("1");
    const [fee, setFee] = useState(true);
    const [isFeeRef, setIsFeeRef] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [totalFee, setTotalFee] = useState();
    const [formaPago, setFormaPago] = useState("1");
    const [alerta, setAlerta] = useState();
    const [adicional, setAdicional] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [empresa, setEmpresa] = useState("1");

    const cleanFields = () => {
        setEditData();
        setIsLoading(false);
        setSelTab(0);
        setInputValue('');
        setUser();
        setInputEst();
        setSelectedOfer([]);
        setContactos();
        setSelectedEst();
        setOfertas();
        setComCliente();
        setComReserva();
        setEstadoRes(1);
        setFeeRef("");
        setComFee();
        setFacturar("1");
        setFee(true);
        setIsFeeRef(false);
        setSubtotal(0);
        setTotalFee();
        setFormaPago("1");
        setAdicional(false);
        setClientes([]);
        setEmpresa("1");
    }

    useEffect(() => {
        if (editData) {
            console.log("datos editar", editData)
            setUser({
                usuario: editData.usuario,
                contacto: editData.contacto,
                suscripcion: editData.suscripcion,
                clicksContactos: editData.clicksContactos,
                referidos: editData.referidos,
                business: editData.business
            })
            setContactos(editData.contactosEstablecimiento)
            if (editData.ofertas && editData.ofertas.length > 0) {
                editData.ofertas.forEach((item, index) => {
                    editData.ofertas[index].edades = item.edades_ninos.split(",")
                    editData.ofertas[index].fechaIngreso = item.fecha_inicio
                    editData.ofertas[index].fechaSalida = item.fecha_fin
                    editData.ofertas[index].cantidadOfertas = item.cantidad_ofertas
                    editData.ofertas[index].adicionalAdulto = item.adultos_extras
                    editData.ofertas[index].adicionalNino = item.ninos_extras
                    editData.ofertas[index].costoAdulto = item.precio_adulto_adicional
                    editData.ofertas[index].costoNino = item.precio_nino_adicional
                })
            }
            setSelectedOfer(editData.ofertas)
            setComCliente(editData.reserva.comentario_cliente)
            setComReserva(editData.reserva.comentario_reserva)
            setFormaPago(editData.reserva.forma_pago)
            setComFee(editData.reserva.comentario_fee)
            setFeeRef(editData.reserva.id_tbl_reserva_ref)
            setTotalFee(editData.reserva.fee_valor)
            setEstadoRes(editData.reserva.id_tbl_estado_reserva)
            setEmpresa(editData.reserva.id_empresa)
            setSelectedEst({
                titulo: editData.ofertas[0].nombreEstablecimiento
            })
            //setFacturar(editData.reserva.fee)
            //setIsFeeRef(editData.reserva.fee_referencia)
            console.log("edit data", editData.reserva)
            if (editData.reserva.fee == "1") {
                setFee(true)
                setFacturar("1")
            } else if (editData.reserva.fee_referencia == "1") {
                setIsFeeRef(true)
                setFacturar("2")
            } else {
                setFacturar("3")
            }
            getOfertas(editData.ofertas[0].id_tbl_establecimiento).then((res) => {
                if (res) {
                    setOfertas(res.ofertas)
                }
            })

        }
    }, [editData])

    useEffect(() => {
        //id_usuario_metodo: 45
        if (facturar == "3") {
            setTotalFee(0)
        } else if (user && user.usuario && ((user.usuario[0].metodo == "express") || (user.usuario[0].metodo == "gratis"))) {
            var numFee = 0;
            selectedOfer.forEach((item) => {
                numFee += getDays(item.fechaIngreso, item.fechaSalida) * parseInt(item.cantidadOfertas)
            });
            console.log(numFee);
            setTotalFee(numFee * 10)
        } else if (verificarFechasIguales(selectedOfer)) {
            console.log("aqui");
            setTotalFee(5)
        } else {
            console.log("acá");
            setTotalFee(10)
        }
    }, [selectedOfer, user, facturar])

    function verificarFechasIguales(listado) {
        console.log("ingresó");

        try {
            const fechaIngresoReferencia = listado[0].fechaIngreso;
            const fechaSalidaReferencia = listado[0].fechaSalida;

            listado.forEach((item) => {
                // Verifica que la fecha de ingreso y salida sean las mismas
                if (item.fechaIngreso !== fechaIngresoReferencia || item.fechaSalida !== fechaSalidaReferencia) {
                    throw new Error("Fechas diferentes");
                }

                // Verifica que haya un día de diferencia entre la fecha de salida del elemento anterior
                // y la fecha de ingreso del elemento actual (para index > 0)
                const diferenciaEnDias = (new Date(item.fechaIngreso) - new Date(item.fechaSalida)) / (1000 * 60 * 60 * 24);
                console.log("dias", diferenciaEnDias, (diferenciaEnDias !== 1))
                console.log("dias", diferenciaEnDias, (diferenciaEnDias !== 1));

                if (Math.abs(diferenciaEnDias) !== 1) {
                    throw new Error("Diferencia en días incorrecta");
                }
            });
        } catch (error) {
            console.log("falso", false);
            return false;
        }

        return true;
    }




    const getDays = (inicio, fin) => {
        const diffInMs = Math.abs(new Date(fin) - new Date(inicio));
        return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    };

    function obtenerFechaActualYManana() {
        const fechaActual = new Date();
        const fechaManana = new Date(fechaActual);
        fechaManana.setDate(fechaActual.getDate() + 1);

        const añoActual = fechaActual.getFullYear();
        const mesActual = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const diaActual = String(fechaActual.getDate()).padStart(2, '0');

        const añoManana = fechaManana.getFullYear();
        const mesManana = String(fechaManana.getMonth() + 1).padStart(2, '0');
        const diaManana = String(fechaManana.getDate()).padStart(2, '0');

        const fechaActualString = `${añoActual}-${mesActual}-${diaActual}`;
        const fechaMananaString = `${añoManana}-${mesManana}-${diaManana}`;

        return { fechaActual: fechaActualString, fechaManana: fechaMananaString };
    }

    const handleAddOferta = (item) => {
        item.cantidadOfertas = 1;
        item.adicionalNino = 0;
        item.adicionalAdulto = 0;
        item.costoAdulto = 0;
        item.costoNino = 0
        item.descuento = 0;
        item.edades = [];
        item.fechaIngreso = obtenerFechaActualYManana().fechaActual;
        item.fechaSalida = obtenerFechaActualYManana().fechaManana;
        for (var i = 0; i < item.ninos; i++) {
            item.edades.push(0)
        }
        setSelectedOfer(prevOferList => [...prevOferList, item]);
    }

    const handleDeleteOferta = (index) => {
        setSelectedOfer(prevOferList => prevOferList.filter((_, i) => i !== index));
    };

    const handleUpdateOferta = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) => {
                if (i === index) {
                    const difference = newValue - oferta.cantidadOfertas;
                    let newEdades;
                    if (difference > 0) {
                        newEdades = [...oferta.edades, ...Array(difference * oferta.ninos).fill(0)];
                    } else if (difference < 0) {
                        // Eliminar elementos del final del array
                        newEdades = oferta.edades.slice(0, (difference * oferta.ninos));
                    } else {
                        newEdades = oferta.edades;
                    }
                    return {
                        ...oferta,
                        cantidadOfertas: newValue,
                        edades: newEdades
                    };
                } else {
                    return oferta;
                }
            })
        );
    };

    const handleUpdateCostoNino = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, costoNino: newValue } : oferta
            )
        );
    };

    const handleUpdateDescuento = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, descuento: newValue } : oferta
            )
        );
    };

    const handleUpdateCostoAdulto = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, costoAdulto: newValue } : oferta
            )
        );
    };

    const handleUpdateCostoFeriado = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, precio_feriado: newValue } : oferta
            )
        );
    };

    const handleUpdateAdulto = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, adicionalAdulto: newValue } : oferta
            )
        );
    };

    const handleUpdateTipoPago = (index, newValue) => {

        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, forma_pago_oferta: newValue } : oferta
            )
        );
    };

    const handleUpdateNino = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) => {
                if (i === index) {
                    const difference = newValue - oferta.adicionalNino;
                    let newEdades;
                    if (difference > 0) {
                        newEdades = [...oferta.edades, ...Array(difference).fill(0)];
                    } else if (difference < 0) {
                        // Eliminar elementos del final del array
                        newEdades = oferta.edades.slice(0, difference);
                    } else {
                        newEdades = oferta.edades;
                    }
                    return {
                        ...oferta,
                        adicionalNino: newValue,
                        edades: newEdades
                    };
                } else {
                    return oferta;
                }
            })
        );
    };

    const handleUpdateEdad = (offerIndex, edadIndex, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) => {
                if (i === offerIndex) {
                    const newEdades = oferta.edades.map((edad, j) =>
                        j === edadIndex ? newValue : edad
                    );

                    return {
                        ...oferta,
                        edades: newEdades
                    };
                } else {
                    return oferta;
                }
            })
        );
    };

    const handleUpdateIngreso = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, fechaIngreso: newValue } : oferta
            )
        );
    };

    const handleUpdateSalida = (index, newValue) => {
        setSelectedOfer(prevOferList =>
            prevOferList.map((oferta, i) =>
                i === index ? { ...oferta, fechaSalida: newValue } : oferta
            )
        );
    };

    const handleClickGuardar = () => {
        setIsLoading(true);
        var params = EstructuraReserva.GuardarReserva(
            user,
            selectedOfer,
            comCliente,
            comReserva,
            comFee,
            fee,
            isFeeRef,
            feeRef,
            subtotal,
            formaPago,
            totalFee,
            estadoRes,
            editData ? "modificar" : "guardar",
            editData ? editData.reserva.id_tbl_reserva : "",
            clientes,
            empresa
        );

        console.log("modificar", params)

        saveReserva(params).then((res) => {
            setIsLoading(false)
            if (res) {
                setAlerta(
                    <Alerta correcto={true} mensaje={"La reserva se ha guardado correctamente"} onClose={() => setAlerta(null)} />
                )
                cleanFields();
                console.log(res)
            } else {
                setAlerta(
                    <Alerta correcto={false} mensaje={"Ha ocurrido un error al guardar"} onClose={() => setAlerta(null)} />
                )
            }
        })
    }

    const handleChangeFacturar = (item) => {

        console.log("cambio", item)
        setFacturar(item)
        if (item == "1") {
            setFee(true)
            setIsFeeRef(false)
            setFeeRef(" ")
            setComFee(" ")
        }
        if (item == "2") {
            console.log("segunda opcion")
            setFee(false)
            setIsFeeRef(true)
            setComFee(" ")
        }
        if (item == "3") {
            setFee(false)
            setIsFeeRef(false)
            setFeeRef(" ")
        }
    }

    const tabs = [
        <SuscriptorReserva
            user={user}
            setUser={setUser}
            inputValue={inputValue}
            setInputValue={setInputValue}
            adicional={adicional}
            setAdicional={setAdicional}
            cedulaValue={cedulaValue}
            setCedulaValue={setCedulaValue}
            clientes={clientes}
            setClientes={setClientes}
            empresa={empresa}
            setEmpresa={setEmpresa}
        />,
        <OfertaDetalle
            inputEst={inputEst}
            setInputEst={setInputEst}
            selectedOfer={selectedOfer}
            setSelectedOfer={setSelectedOfer}
            contactos={contactos}
            setContactos={setContactos}
            setSelectedEst={setSelectedEst}
            ofertas={ofertas}
            setOfertas={setOfertas}
            comCliente={comCliente}
            setComCliente={setComCliente}
            comReserva={comReserva}
            setComReserva={setComReserva}
            eliminar={handleDeleteOferta}
            actualizar={handleUpdateOferta}
            adicionalAdulto={handleUpdateAdulto}
            adicionalNino={handleUpdateNino}
            fechaIngreso={handleUpdateIngreso}
            fechaSalida={handleUpdateSalida}
            actualizarEdades={handleUpdateEdad}
            handleAddOferta={handleAddOferta}
            estadoRes={estadoRes}
            setEstadoRes={setEstadoRes}
            actualizarFeriado={handleUpdateCostoFeriado} />,
        <ResumenReserva
            ofertas={selectedOfer}
            actualizarCantidad={handleUpdateOferta}
            actualizarNinos={handleUpdateNino}
            actualizarAdultos={handleUpdateAdulto}
            actualizarCostoNino={handleUpdateCostoNino}
            actualizarCostoAdulto={handleUpdateCostoAdulto}
            actualizarDescuento={handleUpdateDescuento}
            actualizarTipoPago={handleUpdateTipoPago}
            eliminar={handleDeleteOferta}
            guardarReserva={handleClickGuardar}
            referenciaFee={feeRef}
            setReferenciaFee={setFeeRef}
            comentarioFee={comFee}
            setComentarioFee={setComFee}
            facturar={facturar}
            handleChangeFacturar={handleChangeFacturar}
            subtotal={subtotal}
            setSubtotal={setSubtotal}
            totalFee={totalFee}
            setFormaPago={setFormaPago}
            formaPago={formaPago}
            isLoading={isLoading}
        />
    ]
    return (
        <>
            {alerta}
            <div className='w-full px-4 py-2 animate-fadeIn'>
                {/* Contenedor Principal*/}
                <div className='w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all'>
                    {/* Header de la Sección */}
                    <div className='bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-2xl bg-greenVE-600 text-white flex items-center justify-center shadow-lg shadow-greenVE-100'>
                                <span className='icon-[material-symbols--event-available-outline-rounded] text-2xl'></span>
                            </div>
                            <div>
                                <h2 className='text-lg font-bold text-slate-800 tracking-tight'>
                                    {editData ? `Modificar Reserva # ${editData.reserva.id_tbl_reserva}` : "Nueva Reserva"}
                                </h2>
                            </div>
                        </div>
                        {editData && (
                            <div className='bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full border border-amber-100 flex items-center gap-2'>
                                <div className='w-2 h-2 rounded-full bg-amber-500 animate-pulse'></div>
                                <span className='text-[10px] font-bold uppercase tracking-widest'>Modo Edición</span>
                            </div>
                        )}
                    </div>

                    {/* Información del Establecimiento*/}
                    {selectedEst && (
                        <div className='mx-8 mt-6 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 animate-slideDown'>
                            <div className='flex items-center gap-3'>
                                <div className='w-1.5 h-8 bg-greenVE-600 rounded-full'></div>
                                <label className='text-sm font-bold text-slate-700 uppercase tracking-widest'>
                                    {selectedEst.titulo}
                                </label>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                                {contactos && contactos.map((item, idx) => (
                                    <div key={idx} className='flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-greenVE-300 group'>
                                        <div className='flex flex-col min-w-0'>
                                            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>{item.tipo}</span>
                                            <label className='text-[11px] font-bold text-slate-600 truncate group-hover:text-greenVE-700 transition-colors'>{item.contacto}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {/* Navegación por tabs */}
                <div className="px-8 mt-6">
                    <div className="flex border-b border-slate-100">
                        {[
                            { id: 0, label: "Suscriptor" },
                            { id: 1, label: "Detalle de Oferta" },
                            { id: 2, label: "Resumen de Reserva" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelTab(tab.id)}
                                className={`flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative group
                                        ${selTab === tab.id
                                        ? "text-greenVE-600"
                                        : "text-slate-400 hover:text-slate-600"}`}
                            >
                                {tab.label}
                                {/* Indicador de Tab Activo */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full transition-all duration-300
                                        ${selTab === tab.id ? "bg-greenVE-600 opacity-100 translate-y-0" : "bg-slate-200 opacity-0 translate-y-2 pointer-events-none"}`}>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Área de Contenido del Paso */}
                <div className='p-8 pt-6'>
                    <div className='min-h-[400px] animate-fadeIn'>
                        {tabs[selTab]}
                    </div>
                </div>
            </div>
        </div >
        </>
    );
};

export default AgregarReserva;