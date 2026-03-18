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
        <div className='flex flex-col gap-8 animate-fadeIn'>
            {/* Contenedor del Resumen Integral */}
            <div className='flex flex-col w-full gap-8 bg-white p-2 rounded-2xl'>
                
                {/* Tabla de Ofertas y Detalles de Precios */}
                <div className='animate-slideDown'>
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
                </div>

                {/* Sección de Fee y Facturación */}
                <div className='animate-slideDown' style={{ animationDelay: '100ms' }}>
                    <FeeReserva 
                        referenciaFee={referenciaFee}
                        setReferenciaFee={setReferenciaFee}
                        comentarioFee={comentarioFee}
                        setComentarioFee={setComentarioFee}
                        facturar={facturar}
                        handleChangeFacturar={handleChangeFacturar}
                        totalFee={totalFee}
                    />
                </div>

                {/* Acciones Finales: Guardar Reserva */}
                <div className='flex items-center justify-center pt-8 border-t border-slate-100 animate-slideUp'>
                    <button 
                        className={`group relative flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-lg
                            ${isLoading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-greenVE-600 text-white hover:bg-greenVE-700 hover:shadow-greenVE-200 hover:-translate-y-1 active:scale-95 shadow-greenVE-100"}`}
                        onClick={() => isLoading ? null : guardarReserva()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="icon-[line-md--loading-twotone-loop] text-2xl"></span>
                                <span className='text-sm'>Guardando...</span>
                            </>
                        ) : (
                            <span className='text-sm'>Finalizar y Guardar Reserva</span>
                        )}
                        
                        {!isLoading && (
                            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer'></div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumenReserva;