import Config from "../../global/config";
import GenericService from "../service";

class EstablecimientosService extends GenericService {

    async gestionarEstablecimientos(params) {
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}establecimiento/`;
        return await this.post(url, params);
    }

    async gestionarLugares(params) {
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}lugar/`;
        return await this.post(url, params);
    }

    async listarEstablecimientosAdmin(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}admin_establecimientos/`;
        return await this.post(url, params);
    }

    async getPaises() {
        const url = `${Config.URL_SERVICIOS}${Config.VERLUG}paises/`;
        return await this.post(url, { id_servicio: 1 });
    }

    async getCiudades(id_pais) {
        const url = `${Config.URL_SERVICIOS}${Config.VERLUG}ciudades/`;
        return await this.post(url, { id_servicio: 1, id_pais });
    }

    async verificarUsuario(email) {
        const url = `${Config.URL_SERVICIOS}${Config.SUSCRIPTOR}checkUsuario/`;
        return await this.post(url, { nombreusuario: email, id_servicio: 1 });
    }

    async crearEstablecimiento(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setEstablecimiento/`;
        return await this.post(url, params);
    }

    async getTiposEstablecimiento() {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getTiposEstablecimiento/`;
        return await this.post(url, {});
    }

    async getEstablecimientoDetalle(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getEstablecimientoDetalle/`;
        return await this.post(url, { id_establecimiento });
    }

    async updateEstablecimiento(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}updateEstablecimiento/`;
        return await this.post(url, params);
    }

    // ── Contratos ─────────────────────────────────────────────────────────

    async getContratos(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getContratos/`;
        return await this.post(url, { id_establecimiento });
    }

    async setContrato(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setContrato/`;
        return await this.post(url, params);
    }
}

export default EstablecimientosService;