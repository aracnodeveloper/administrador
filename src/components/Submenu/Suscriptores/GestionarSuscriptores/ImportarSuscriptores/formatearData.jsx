export const construirSuscripcionPayload = (fila, producto, codigoPromo) => {
  return {
    demo: false,
    canal: "web",
    id_empresa: "1",
    notificar: false,
    tiempo: 5, // aquí deberías usar la lógica de tiempo según tu negocio
    aceptocondiciones: 1,
    verificar: false,
    id_servicio: producto.id_tbl_servicio_web,
    metodo: "fullvacations",
    personal: {
      ci: fila["No. Identificación"],
      nombres: fila["Nombres"] + " " + fila["Apellidos"],
      celular: fila["Movil"],
      email: fila["Correo Corporativo"],
      pais: 239, // deberías mapearlo si cambia
      ciudad: "297", // idem
    },
    producto: {
      id_codigo_promocional: codigoPromo.id_codigo_promocional,
      id_usuario_vendedor: codigoPromo.vendedor.id_usuario_vendedor,
      id_suscripcion_vendedor: codigoPromo.vendedor.id_suscripcion_vendedor,
      cantidad: "1",
      precio: producto.precio_producto,
      id_producto: producto.id_producto,
      id_lista_precio_producto: producto.id_lista_precio_producto,
      id_prod_suscripcion: producto.id_prod_suscripcion,
      id_tipo_canal: "13",
      pago: [
        {
          tipo_pago: 5,
          total: producto.precio_producto,
          iva: (producto.precio_producto * 0.12).toFixed(2), // ejemplo: 12% IVA
          subtotal: (producto.precio_producto / 1.12).toFixed(2),
          envio: 0,
        },
      ],
    },
  };
};
