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

    async getContratos(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getContratos/`;
        return await this.post(url, { id_establecimiento });
    }

    async setContrato(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setContrato/`;
        return await this.post(url, params);
    }

    async getDatosContrato(id_establecimiento, id_contrato = 0) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getDatosContrato/`;
        return await this.post(url, { id_establecimiento, id_contrato });
    }

    async filtro(params){
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}filtropost/`;
        return await this.post(url, params);
    }

    // -- Servicios SMART del establecimiento ----------------------------------
    async getServiciosEstablecimiento(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getServicios/`;
        return await this.post(url, { id_establecimiento });
    }

    async getCatalogoServiciosSmart() {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getServiciosSmart/`;
        return await this.post(url, {});
    }

    async setServiciosEstablecimiento(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setServicios/`;
        return await this.post(url, params);
    }

    // -- Ofertas del establecimiento ------------------------------------------
    async getOfertasEstablecimiento(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getOfertas/`;
        return await this.post(url, { id_establecimiento });
    }

    async getCatalogosOferta() {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getCatalogosOferta/`;
        return await this.post(url, {});
    }

    async gestionarOferta(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}gestionarOfertas/`;
        return await this.post(url, params);
    }

    async eliminarOferta(id_oferta) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}eliminarOferta/`;
        return await this.post(url, { id_oferta });
    }

    // -- Oferta individual (con keywords/resumen/contenido + empresas) --------
    async getOferta(id_info_indice) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getOferta/`;
        return await this.post(url, { id_info_indice });
    }

    // -- Servicios de una oferta concreta -------------------------------------
    async getServiciosOferta(id_oferta) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getServiciosOferta/`;
        return await this.post(url, { id_oferta });
    }

    async setServiciosOferta(params) {
        // params: { id_oferta, id_servicios: {<idServ>: <idTipoDetalle>}, extra: {<idServ>: "texto"} }
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setServiciosOferta/`;
        return await this.post(url, params);
    }

    // -- Aprobaciones (id_tbl_estado_modificacion = 2) ------------------------
    async listarEstablecimientosRevision() {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}listarEstablecimientosRevision/`;
        return await this.post(url, {});
    }

    async aprobarEstablecimiento(id_establecimiento) {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}aprobarEstablecimiento/`;
        return await this.post(url, { id_establecimiento });
    }

}

export default EstablecimientosService;