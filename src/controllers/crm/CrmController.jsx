import Config from "../../global/config";
import CRMService from "../../services/crm/CRMService";

export const getDatosCRM = async function (cedula) {
    try{
        const crmService = new CRMService;
        const res = await crmService.obtnerDatosCRM({"ci":cedula, "token":Config.CRM_TOKEN})
        if(res!=null &&res.estado){
            return res.data
        }
    }catch{

    }
    return {}
}