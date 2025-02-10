import Config from "../../global/config";
import GenericService from "../service";

class AudiovisualesService extends GenericService{
    async gestionarInfluencers(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}influencer/`;
        return await this.post(url, params);
    }

    async gestionarRedesSociales(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}redSocial/`;
        return await this.post(url, params);
    }

    async gestionarEstablecimientos(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}establecimiento/`;
        return await this.post(url, params);
    }

    async gestionarRedesSocialesInfluencer(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}influencer_redSocial/`;
        return await this.post(url, params);
    }

    async gestionarVideosInfluencer(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}video/`;
        return await this.post(url, params);
    }

    async gestionarLugares(params){
        const url = `${Config.URL_SERVICIOS}${Config.METRICAS}lugar/`;
        return await this.post(url, params);
    }
}

export default AudiovisualesService;