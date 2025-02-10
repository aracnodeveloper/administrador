class EstructuraReserva {
    static GuardarReserva(
        usuario, 
        ofertas, 
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
        tipo,
        idReserva,
        clientes, empresa
    ) {        
        const calcularPrecio = (item) => {
            const precioPorNoche = parseFloat(item.precio_feriado || item.precioOferta);
            const noches = parseInt(item.noches);
            const diasTotales = (((new Date(item.fechaSalida).getTime()) - (new Date(item.fechaIngreso).getTime())) / (1000 * 3600 * 24));
    
            function calcularFactor() {
                if (noches > 1) {
                    const moduloNoches = diasTotales % noches;
                    if (moduloNoches === 0) {
                        return diasTotales / noches;
                    } else {
                        return (diasTotales + 1) / noches;
                    }
                } else {
                    return diasTotales;
                }
            }
    
            const factor = calcularFactor();
            const precioTotal = precioPorNoche * factor;
    
            return precioTotal.toFixed(2);
        }
        var estructura = {
            //"token": "{{tokenUsuario}}",
            "tipo":tipo,
            "reserva": {
                "id_tbl_estado_reserva": estadoRes, // 1= pendiente 2=cancelado 3=confirmado 4=cotización
                "id_empresa": empresa, //1= visitaecuador    2= fullvacations
                "id_tbl_usuario_cliente": usuario.usuario[0].id_tbl_usuario,
                "fee": fee?fee:"false",
                "fee_valor": fee?totalFee:"null",
                "fee_referencia": isFeeRef?isFeeRef:"false",
                "id_tbl_reserva_ref": feeRef,
                "total_reserva": subtotal,
                "comentario_fee": comFee,
                "comentario_cliente": comCliente,
                "comentario_reserva": comReserva
            }
        };

        var ofertasTmp = ofertas.map(oferta => ({
            "id_tbl_establecimiento": oferta.id_tbl_establecimiento,
            "id_tbl_info_indice_oferta": oferta.id,
            "adultos": oferta.adultos,
            "ninos": oferta.ninos,
            "ninos_extras": oferta.adicionalNino,
            "adultos_extras": oferta.adicionalAdulto,
            "cantidad_ofertas": oferta.cantidadOfertas,
            "precio_feriado":oferta.precio_feriado,
            "fecha_inicio": oferta.fechaIngreso,
            "fecha_fin": oferta.fechaSalida,
            "forma_pago_oferta": oferta.forma_pago_oferta, 
            "precio_nino_adicional": oferta.costoNino,
            "precio_adulto_adicional": oferta.costoAdulto,
            "precio_total": (oferta.cantidadOfertas*calcularPrecio(oferta)
                            +oferta.adicionalAdulto*oferta.costoAdulto
                            +oferta.adicionalNino*oferta.costoNino),
            "edades_ninos": oferta.edades.join(",")
        }));

        estructura.ofertas = ofertasTmp;
        if(tipo=="modificar"){
            estructura.id_tbl_reserva=idReserva;
        }

        if(clientes.length>0){
            estructura.reserva.id_tbl_call_cliente=clientes[clientes.length-1].idCliente;
        }
        console.log("estructura", estructura)
        return estructura;
    }
}

export default EstructuraReserva;
