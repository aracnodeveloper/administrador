import Config from "../../global/config";
import GenericService from "../service";

class FullPackService extends GenericService {

    async getCodigosPrepago(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}getCodigosPrepago/`;
        return await this.post(url, params);
    }

    async setCodigosPrepago(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}setCodigoPrepago/`;
        return await this.post(url, params);
    }

    async desactivarCodigoPrepago(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}desactivarCodigoPrepago/`;
        return await this.post(url, params);
    }

    async activarCodigoPrepago(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}activarCodigoPrepago/`;
        return await this.post(url, params);
    }

    async listarProductos(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}listarProductosxCodigoPromocional/`;
        return await this.post(url, params);
    }

    async comprobarCodigo(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}comprobarCodigoPromocional/`;
        return await this.post(url, params);
    }

    async listarProductosFullPack(params) {
        const url = `${Config.URL_SERVICIOS}${Config.APP}listarproductosfullpack/`;
        return await this.post(url, params);
    }
}

export default FullPackService;