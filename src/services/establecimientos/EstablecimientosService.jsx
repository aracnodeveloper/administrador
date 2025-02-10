import Config from "../../global/config";
import GenericService from "../service";

class EstablecimientosService extends GenericService{
    async gestionarEstablecimientos(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}establecimiento/`;
        return await this.post(url, params);
    }

    async gestionarLugares(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}lugar/`;
        return await this.post(url, params);
    }
}

export default EstablecimientosService;