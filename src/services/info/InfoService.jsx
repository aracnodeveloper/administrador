import Config from "../../global/config";
import GenericService from "../service";

class InfoService extends GenericService{
    async listarLugares(params){
        const url = `${Config.URL_SERVICIOS}${Config.VERLUG}ciudades/`;
        return await this.post(url, params);
    }

    async listarCanalesVenta(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.SUSCRIPTOR}listarCanalesVenta/`;
        return await this.post(url, params);
    }
}
export default InfoService;