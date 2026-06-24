import Config from "../../global/config";
import GenericService from "../service";

class SuscriptoresService extends GenericService {
  async listarSuscriptores(params) {
    const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.SUSCRIPTOR}listarSuscripciones/`;
    return await this.post(url, params);
  }

  async listarPorVencer(params) {
    const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.SUSCRIPTOR}listarSuscripcionesPorVencer/`;
    return await this.post(url, params);
  }

  async comprobarCodigo(params) {
    const url = `${Config.URL_SERVICIOS}${Config.APP}comprobarCodigoPromocional/`;
    return await this.post(url, params);
  }

  async listarProductos(params) {
    const url = `${Config.URL_SERVICIOS}${Config.APP}listarProductosxCodigoPromocional/`;
    return await this.post(url, params);
  }

  async crearSuscripcion(params) {
    const url = `${Config.URL_SERVICIOS}${Config.SUSCRIPTOR}gestionarSuscripcion/`;
    return await this.post(url, params);
  }

  async sendNotificationSubscription(params) {
    const url = `${Config.URL_SERVICIOS}${Config.VERSUS}sendNotificacionSuscripcion/`;
    return await this.post(url, params);
  }
}
export default SuscriptoresService;
