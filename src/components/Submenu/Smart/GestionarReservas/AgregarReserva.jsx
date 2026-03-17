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
    const [alerta, setAlerta]=useState();
    const [adicional, setAdicional]=useState(false);
    const [clientes, setClientes]=useState([]);
    const [empresa, setEmpresa]=useState("1");

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
            console.log("datos editar",editData)
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
        if(facturar=="3"){
            setTotalFee(0)
        }else if(user&&user.usuario&&((user.usuario[0].metodo=="express")||(user.usuario[0].metodo=="gratis"))){
            var numFee=0;
            selectedOfer.forEach((item)=>{
                numFee+=getDays(item.fechaIngreso, item.fechaSalida)*parseInt(item.cantidadOfertas)
            });
            console.log(numFee);
            setTotalFee(numFee*10)
        }else if (verificarFechasIguales(selectedOfer)) {
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
                    <Alerta correcto={true} mensaje={"La reserva se ha guardado correctamente"} onClose={() => setAlerta(null)}/>
                )
                cleanFields();
                console.log(res)
            }else{
                setAlerta(
                    <Alerta correcto={false} mensaje={"Ha ocurrido un error al guardar"} onClose={() => setAlerta(null)}/>
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
            <div className='pl-3 w-full'>
                <div className='w-full bg-gray-100 rounded-md px-4 py-2 pb-6'>
                    <div className='flex gap-2 items-center'>
                        <label className='text-greenVE-700 text-xl border-0'>{editData ? `Modificar Reserva # ${editData.reserva.id_tbl_reserva}` : "Agregar reserva"}</label>
                    </div>
                    <div className='border border-gray-300 mt-2'></div>
                    {
                        selectedEst
                        && <div className='w-full bg-white'>
                            <div className='bg-greenVE-200 px-4 flex py-1 gap-2'>
                                <span className="icon-[icon-park-solid--hotel] w-4 h-4"></span>
                                <label className='text-xs font-semibold'>{selectedEst.titulo.toUpperCase()}</label>
                            </div>
                            <div className='flex flex-wrap gap-y-2 px-4 py-2'>
                                {
                                    contactos && contactos.map((item) => (
                                        <div className='flex items-center gap-2 w-1/4'>
                                            {
                                                (
                                                    item.tipo.toLowerCase().includes("telefono") ||
                                                    item.tipo.toLowerCase().includes("teléfono") ||
                                                    item.tipo.toLowerCase().includes("celular")
                                                )
                                                    ? <span className="icon-[bxs--phone] text-greenVE-600 h-4 w-4"></span>
                                                    : item.tipo.toLowerCase().includes("whatsapp")
                                                        ? <span className="text-greenVE-600 icon-[formkit--whatsapp] h-4 w-4"></span>
                                                        : item.tipo.toLowerCase().includes("web")
                                                            ? <span className="icon-[mdi--web] text-greenVE-600 h-4 w-4"></span>
                                                            : <span className="icon-[mdi--email] text-greenVE-600 h-4 w-4"></span>
                                            }
                                            <label className='text-xs font-semibold'>{`${item.tipo}: `}</label>
                                            <label className='text-xs'>{item.contacto}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                        <div class="border-b border-gray-200 dark:border-gray-700">
                            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                <li onClick={() => setSelTab(0)} class="me-2">
                                    <a href="#" class={selTab == 0 ? "inline-flex items-center justify-center p-4 text-greenVE-600 border-b-2 border-greenVE-600 rounded-t-lg active dark:text-greenVE-500 dark:border-greenVE-500 group gap-2" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group gap-2"}>
                                        <span className="icon-[mdi--account-circle] h-5 w-5"></span>Suscriptor
                                    </a>
                                </li>
                                <li onClick={() => setSelTab(1)} class="me-2">
                                    <a href="#" class={selTab == 1 ? "inline-flex items-center justify-center p-4 text-greenVE-600 border-b-2 border-greenVE-600 rounded-t-lg active dark:text-greenVE-500 dark:border-greenVE-500 group gap-2" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group gap-2"} aria-current="page">
                                        <span className="icon-[ion--bed] h-5 w-5"></span>Detalle oferta
                                    </a>
                                </li>
                                <li onClick={() => setSelTab(2)} class="me-2">
                                    <a href="#" class={selTab == 2 ? "inline-flex items-center justify-center p-4 text-greenVE-600 border-b-2 border-greenVE-600 rounded-t-lg active dark:text-greenVE-500 dark:border-greenVE-500 group gap-2" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group gap-2"}>
                                        <span className="icon-[bi--info-circle-fill] h-5 w-5"></span> Resumen reserva
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {tabs[selTab]}
                </div>
            </div>
        </>
    );
};

export default AgregarReserva;