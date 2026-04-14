import GenericService from "../../services/service";
import Config  from "../../global/config";

class WebService extends GenericService {
    async getDefaultToken(params){
        const url = `${Config.URL_SERVICIOS}${Config.VERAPP}gestionDispositivo/`;
        return await this.post(url, params);
    }
}

export default WebService;