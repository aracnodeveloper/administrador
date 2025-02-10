import Config from "../../global/config";
import GenericService from "../service";

class CallcenterService extends GenericService{
    async listarCuentasGratisCall(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.CALLCENTER}listarUsuariosPrueba/`;
        return await this.post(url, params);
    }
    async gestionarCuentasGratisCall(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.CALLCENTER}gestionCallCenter/`;
        return await this.post(url, params);
    }
}

export default CallcenterService;