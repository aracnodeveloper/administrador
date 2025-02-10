import React from 'react';
import TablaOfertas from './TablaOfertas';
import TablaPagos from './TablaPagos';
import FeeReserva from './FeeReserva';

const ResumenReserva = ({
    ofertas, 
    actualizarCantidad, 
    actualizarNinos, 
    actualizarAdultos, 
    actualizarCostoAdulto, 
    actualizarCostoNino, 
    actualizarDescuento,
    actualizarTipoPago,
    eliminar, 
    guardarReserva,
    referenciaFee,
    setReferenciaFee,
    comentarioFee,
    setComentarioFee,
    facturar,
    handleChangeFacturar,
    subtotal,
    setSubtotal,
    totalFee,
    setFormaPago,
    formaPago,
    isLoading,
}) => {

    

    return (
        <div className='flex p-4 z-10 gap-8 bg-white'>
            <div className=' flex flex-col w-full gap-3'>
                <TablaOfertas 
                    ofertas={ofertas} 
                    actualizarCantidad={actualizarCantidad}
                    actualizarNinos={actualizarNinos}
                    actualizarAdultos={actualizarAdultos}
                    actualizarCostoAdulto={actualizarCostoAdulto}
                    actualizarCostoNino={actualizarCostoNino}
                    actualizarDescuento={actualizarDescuento}
                    actualizarTipoPago={actualizarTipoPago}
                    eliminar={eliminar}
                    subtotal={subtotal}
                    setSubtotal={setSubtotal}
                />
                <FeeReserva 
                    referenciaFee={referenciaFee}
                    setReferenciaFee={setReferenciaFee}
                    comentarioFee={comentarioFee}
                    setComentarioFee={setComentarioFee}
                    facturar={facturar}
                    handleChangeFacturar={handleChangeFacturar}
                    totalFee={totalFee}
                />
                <div className='w-8/12 flex items-center justify-center'>
                    <button className='bg-greenVE-500 text-white rounded-md px-2 py-2 w-36' onClick={()=>isLoading?null:guardarReserva()}>{isLoading?<span className="icon-[line-md--loading-twotone-loop] h-7 w-7 -my-2"></span>:"Guardar Reserva"}</button>
                </div>
            </div>
        </div>
    );
};

export default ResumenReserva;