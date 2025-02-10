import Config from "../../global/config";
import GenericService from "../service";

class SuscriptoresService extends GenericService{
    async listarSuscriptores(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.SUSCRIPTOR}listarSuscripciones/`;
        return await this.post(url, params);
    }
}
export default SuscriptoresService;