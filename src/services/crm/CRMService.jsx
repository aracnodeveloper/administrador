import Config from "../../global/config";
import GenericService from "../service";

class CRMService extends GenericService{
    async obtnerDatosCRM(params){
        const url = `${Config.URL_CRM}${Config.CRM_PERSONA}/detail/`;
        return await this.post(url, params);
    }
}

export default CRMService;