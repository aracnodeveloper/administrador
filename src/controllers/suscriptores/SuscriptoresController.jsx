import { construirSuscripcionPayload } from "../../components/Submenu/Suscriptores/GestionarSuscriptores/ImportarSuscriptores/formatearData";
import { leerExcel } from "../../components/Submenu/Suscriptores/GestionarSuscriptores/ImportarSuscriptores/LeerExcel";
import Config from "../../global/config";
import SuscriptoresService from "../../services/suscriptores/SuscriptoresService";

const susService = new SuscriptoresService();
const session = JSON.parse(localStorage.getItem("datos"));

export const listarSuscriptores = async function ({
  filtros,
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

    if (filtros.cantidad) {
      params.cantidad = filtros.cantidad;
    }

    if (filtros.cantidad) {
      params.cantidad = filtros.cantidad;
    }

    console.log("Params", params);

    const res = await susService.listarSuscriptores(params);
    if (res.estado && res.codigo == 0) {
      // falso
      return res["data"];
    }
  } catch (e) {
    console.log(e);
  }
};

export const comprobarCodigoPromocional = async function (codigo) {
  try {
    var params = {
      id_servicio: 1,
      codigo: codigo,
    };

    const res = await susService.comprobarCodigo(params);
    if (res.estado) {
      // falso
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
      // falso
      return res["data"]["productos"];
    }
  } catch (e) {
    console.log(e);
  }
};

export const importarSuscripciones = async (file, producto, codigoPromo) => {
  const filas = await leerExcel(file);

  for (const fila of filas) {
    const payload = construirSuscripcionPayload(fila, producto, codigoPromo);
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
