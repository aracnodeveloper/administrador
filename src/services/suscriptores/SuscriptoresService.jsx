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

  /**
   * Crea leads en RISE (otro host, sin el token de apidev) en modo relajado:
   * basta nombre + cédula. Devuelve el LeadBulkCreateResultDto de RISE.
   */
  async convertirEnLeadsRise(items) {
    // RISE_API puede venir con o sin "/api" (y con o sin slash final): se normaliza.
    const base = (Config.RISE_API || "").replace(/\/+$/, "");
    const path = /\/api$/i.test(base) ? "/Lead/bulk" : "/api/Lead/bulk";
    const url = `${base}${path}?relaxRequired=true`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(items),
    });
    if (!response.ok) {
      throw new Error(`RISE respondió ${response.status}`);
    }
    return await response.json();
  }
}
export default SuscriptoresService;
