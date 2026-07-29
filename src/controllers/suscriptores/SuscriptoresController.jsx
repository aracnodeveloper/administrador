import { construirSuscripcionPayload } from "../../components/Submenu/Suscriptores/GestionarSuscriptores/ImportarSuscriptores/formatearData";
import { leerExcel } from "../../components/Submenu/Suscriptores/GestionarSuscriptores/ImportarSuscriptores/LeerExcel";
import Config from "../../global/config";
import SuscriptoresService from "../../services/suscriptores/SuscriptoresService";

const susService = new SuscriptoresService();
const session = JSON.parse(localStorage.getItem("datos"));

export const listarSuscriptores = async function ({
  filtros = {},
  pagina = 1,
  idUsuario,
}) {
  try {
    var params = {
      token: session.token,
      pagina: pagina,
    };
    if (idUsuario) {
      params.id_tbl_usuario = idUsuario;
    }
    if (filtros && filtros.cod_vendedor) {
      params.cod_vendedor = filtros.cod_vendedor;
    }
    if (filtros && filtros.nombre_vendedor) {
      params.nombre_vendedor = filtros.nombre_vendedor;
    }
    if (filtros && filtros.ci_cliente) {
      params.ci_cliente = filtros.ci_cliente;
    }
    if (filtros && filtros.cod_cliente) {
      params.cod_cliente = filtros.cod_cliente;
    }
    if (filtros && filtros.nombre_cliente) {
      params.nombre_cliente = filtros.nombre_cliente;
    }

    if (filtros && filtros.cantidad) {
      params.cantidad = filtros.cantidad;
    }

    console.log("Params", params);

    const res = await susService.listarSuscriptores(params);
    if (res.estado && res.codigo == 0) {
      return res["data"];
    }
  } catch (e) {
    console.error("Error en listarSuscriptores:", e);
    throw e;
  }
};

export const listarPorVencer = async function ({ filtros = {}, pagina = 1 }) {
  try {
    var params = {
      token: session.token,
      pagina: pagina,
    };
    if (filtros && filtros.cod_vendedor) params.cod_vendedor = filtros.cod_vendedor;
    if (filtros && filtros.nombre_vendedor) params.nombre_vendedor = filtros.nombre_vendedor;
    if (filtros && filtros.ci_cliente) params.ci_cliente = filtros.ci_cliente;
    if (filtros && filtros.cod_cliente) params.cod_cliente = filtros.cod_cliente;
    if (filtros && filtros.nombre_cliente) params.nombre_cliente = filtros.nombre_cliente;
    if (filtros && filtros.ciudad) params.ciudad = filtros.ciudad;
    if (filtros && filtros.cantidad) params.cantidad = filtros.cantidad;
    if (filtros && filtros.dias) params.dias = filtros.dias;
    // dias_vencidas puede ser 0 (no incluir vencidas), por eso se valida contra undefined/null/""
    if (
      filtros &&
      filtros.dias_vencidas !== undefined &&
      filtros.dias_vencidas !== null &&
      filtros.dias_vencidas !== ""
    ) {
      params.dias_vencidas = filtros.dias_vencidas;
    }

    const res = await susService.listarPorVencer(params);
    if (res.estado && res.codigo == 0) {
      return res["data"];
    }
    return { cantidad: 0, suscripciones: [] };
  } catch (e) {
    console.error("Error en listarPorVencer:", e);
    throw e;
  }
};

/** Tipo de lead en RISE para conversiones de suscripciones por vencer. */
const RISE_LEAD_TYPE_RENOVACION = "e5e5e5e5-0000-0000-0000-000000000099";

/**
 * Convierte una lista de suscripciones por vencer en leads de RISE.
 * Necesita nombre (usuario) y cédula (ci_ruc) como mínimo; RISE deduplica por
 * cédula activa, así que repetir la conversión no crea duplicados.
 * email/telefono/ciudad vienen del backend (listarPorVencer -> tbl_contacto_directorio
 * y tbl_lugar vía tbl_directorio: email = tipo 1, telefono = tipo 4 o 14,
 * ciudad = tbl_lugar.desc_lugar) y se mandan si existen.
 * @returns el resultado de RISE: { totalRows, createdCount, failedCount, rows[] }
 */
export const convertirPorVencerALeads = async function (suscripciones) {
  try {
    const items = (suscripciones || [])
      .map((s) => ({
        name: (s.usuario || "").trim(),
        cedula: (s.ci_ruc || "").trim(),
        email: (s.email || "").trim(),
        phone: (s.telefono || "").trim(),
        city: (s.ciudad || "").trim(),
        typeId: RISE_LEAD_TYPE_RENOVACION,
      }))
      .filter((it) => it.name && it.cedula);

    if (items.length === 0) {
      return { totalRows: 0, createdCount: 0, failedCount: 0, rows: [] };
    }

    return await susService.convertirEnLeadsRise(items);
  } catch (e) {
    console.error("Error en convertirPorVencerALeads:", e);
    throw e;
  }
};
// Nota: convertirEnLeadsRise manda upsert=true, así que las filas cuya cédula+tipo
// ya existan como lead activo se actualizan (rows[].updated === true) en vez de
// generar el error "ya existe" de antes.

export const comprobarCodigoPromocional = async function (codigo) {
  try {
    var params = {
      id_servicio: 1,
      codigo: codigo,
    };

    const res = await susService.comprobarCodigo(params);
    if (res.estado) {
      return res["data"];
    }
  } catch (e) {
    console.log(e);
  }
};

export const listarProductos = async function (idCodigo) {
  try {
    var params = {
      id_codigo_promocional: idCodigo,
    };

    const res = await susService.listarProductos(params);
    if (res.estado) {
      return res["data"]["productos"];
    }
  } catch (e) {
    console.log(e);
  }
};

export const importarSuscripciones = async (
  file,
  producto,
  codigoPromo,
  datosVendedor
) => {
  const filas = await leerExcel(file);

  for (const fila of filas) {
    const payload = construirSuscripcionPayload(
      fila,
      producto,
      codigoPromo,
      datosVendedor
    );
    console.log("Payload a enviar:", payload);
    try {
      const res = await susService.crearSuscripcion(payload);
      if (res.estado) {
        console.log("Suscripción creada:", res);
        susService.sendNotificationSubscription({
          id_suscripcion_renovacion: res.data.id_suscripcion_renovacion,
        });
      } else throw new Error("Error al crear suscripción");
    } catch (err) {
      console.error("Error creando suscripción para:", fila, err);
    }
  }
};

/**
 * Función para guardar o actualizar un suscriptor
 * CORREGIDO: Ahora envía los IDs necesarios para edición
 */
export const guardarSuscriptor = async ({
  datosPersonales,
  suscripciones,
  isEdit = false,
}) => {
  try {
    // Validar que haya datos mínimos
    if (!datosPersonales.ci || !datosPersonales.nombres) {
      throw new Error("Debe completar cédula y nombres");
    }

    // Validar que haya al menos una suscripción
    if (!suscripciones || suscripciones.length === 0) {
      throw new Error("Debe agregar al menos una suscripción");
    }

    const suscripcion = suscripciones[0];

    // Validar que se hayan completado los campos requeridos de la suscripción
    if (
      !isEdit &&
      (!suscripcion.id_prod_suscripcion || !suscripcion.id_producto)
    ) {
      throw new Error("Debe seleccionar un producto válido");
    }

    // Validar que haya vendedor asignado (solo para nuevas suscripciones)
    if (
      !isEdit &&
      (!suscripcion.id_vendedor || !suscripcion.id_suscripcion_vendedor)
    ) {
      throw new Error(
        "Debe tener un vendedor asignado. Por favor, busque productos con un código promocional válido."
      );
    }

    // Extraer nombres
    const nombresArray = datosPersonales.nombres.trim().split(/\s+/);
    const nombre1 = nombresArray[0] || "";
    const nombre2 = nombresArray[1] || "";
    const apellido1 = nombresArray[2] || "";
    const apellido2 = nombresArray[3] || "";

    // Extraer email y celular de contactos
    const emailContacto =
      datosPersonales.contactos?.find((c) => c.id_tbl_tipo_contacto == 1)
        ?.contacto || "";
    const celularContacto =
      datosPersonales.contactos?.find(
        (c) => c.id_tbl_tipo_contacto == 2 || c.id_tbl_tipo_contacto == 3
      )?.contacto || "";

    // Calcular tiempo en días
    let tiempo = 1;
    if (suscripcion.fecha_inicio && suscripcion.fecha_fin) {
      const inicio = new Date(suscripcion.fecha_inicio);
      const fin = new Date(suscripcion.fecha_fin);
      const diffTime = Math.abs(fin - inicio);
      tiempo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    if (isEdit) tiempo = 0;

    // ============================================
    // PAYLOAD CORREGIDO PARA EDICIÓN
    // ============================================
    const payload = {
      demo: false,
      canal: "web",
      id_empresa: 1,
      notificar: false,
      tiempo: tiempo,
      aceptocondiciones: 1,
      verificar: false,
      id_servicio: 1,
      metodo: "fullvacations",
      tipo: isEdit ? "modificar" : "guardar",

      // Información personal
      personal: {
        ci: datosPersonales.ci,
        nombres: `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim(),
        celular: celularContacto,
        email: emailContacto || datosPersonales.ci + "@temp.com",
        pais: 239, // Ecuador
        ciudad: datosPersonales.ciudad
          ? datosPersonales.ciudad.toString()
          : "297", // Cuenca por defecto
        // *** IMPORTANTE PARA EDICIÓN: incluir id_tbl_usuario ***
        ...(isEdit &&
          datosPersonales.id_tbl_usuario && {
            id_tbl_usuario: parseInt(datosPersonales.id_tbl_usuario),
          }),
      },

      // ESTRUCTURA producto
      producto: {
        id_codigo_promocional: parseInt(suscripcion.id_codigo_promocional) || 0,
        id_usuario_vendedor:
          parseInt(suscripcion.id_vendedor) ||
          parseInt(suscripcion.id_tbl_usuario_vendedor) ||
          0,
        id_suscripcion_vendedor:
          parseInt(suscripcion.id_suscripcion_vendedor) ||
          parseInt(suscripcion.id_tbl_usuario_vendedor) ||
          0,
        cantidad: 1,
        precio: parseFloat(suscripcion.precio) || 0,
        id_producto: suscripcion.id_producto,
        id_lista_precio_producto:
          parseInt(suscripcion.id_lista_precio_producto) ||
          parseInt(suscripcion.id_tbl_lista_precio_producto) ||
          0,
        id_prod_suscripcion:
          parseInt(suscripcion.id_prod_suscripcion) ||
          parseInt(suscripcion.id_tbl_prod_suscripcion) ||
          0,
        id_tipo_canal:
          parseInt(suscripcion.id_canal) ||
          parseInt(suscripcion.id_tbl_tipo_canal) ||
          13,
        fecha_inicio: suscripcion.fecha_inicio || "",
        fecha_fin: suscripcion.fecha_fin || "",

        // *** IDs CRÍTICOS PARA EDICIÓN ***
        ...(isEdit && {
          id_suscripcion:
            parseInt(suscripcion.id_tbl_suscripcion) ||
            parseInt(suscripcion.id_suscripcion) ||
            undefined,
          id_suscripcion_renovacion:
            parseInt(suscripcion.id_tbl_suscripcion_renovacion) || undefined,
        }),

        pago: [
          {
            tipo_pago:
              parseInt(suscripcion.id_estado_pago) ||
              parseInt(suscripcion.id_tbl_estado_pago_suscripcion) ||
              5,
            total: parseFloat(suscripcion.precio) || 0,
            iva: (parseFloat(suscripcion.precio) * 0.12).toFixed(2),
            subtotal: (parseFloat(suscripcion.precio) / 1.12).toFixed(2),
            envio: 0,
            intereses: 0,
            diferido: 0,
            num_referencia: "",
            lote: 0,
          },
        ],
      },
    };

    // *** AGREGAR IDs A NIVEL RAÍZ PARA EDICIÓN (algunos backends lo esperan así) ***
    if (isEdit) {
      payload.id_tbl_suscripcion =
        parseInt(suscripcion.id_tbl_suscripcion) ||
        parseInt(suscripcion.id_suscripcion) ||
        undefined;
      payload.id_tbl_suscripcion_renovacion =
        parseInt(suscripcion.id_tbl_suscripcion_renovacion) || undefined;
      payload.id_tbl_usuario =
        parseInt(datosPersonales.id_tbl_usuario) || undefined;
    }

    console.log("========================================");
    console.log("MODO:", isEdit ? "EDICIÓN" : "CREACIÓN");
    console.log("IDs para edición:", {
      id_tbl_suscripcion: payload.id_tbl_suscripcion,
      id_tbl_suscripcion_renovacion: payload.id_tbl_suscripcion_renovacion,
      id_tbl_usuario: payload.id_tbl_usuario,
    });
    console.log("Payload completo:", JSON.stringify(payload, null, 2));
    console.log("========================================");

    // Llamar al servicio
    const res = await susService.crearSuscripcion(payload);
    console.log("Respuesta del servicio:", JSON.stringify(res, null, 2));

    if (res && res.estado) {
      console.log("Suscriptor guardado exitosamente:", res);

      // Enviar notificación si se creó correctamente
      if (res.data?.id_suscripcion_renovacion) {
        await susService.sendNotificationSubscription({
          id_suscripcion_renovacion: res.data.id_suscripcion_renovacion,
        });
      }

      return res.data;
    } else {
      const errorMsg =
        res?.mensaje ||
        res?.error ||
        res?.msj ||
        "Error al guardar el suscriptor";
      console.error("Error del backend:", errorMsg, res);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Error en guardarSuscriptor:", error);
    throw error;
  }
};
