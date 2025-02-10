import Config from "../../global/config";
import GenericService from "../service";

class SmartService extends GenericService{
    async buscarUsuario(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}buscarUsuario/`;
        return await this.post(url, params);
    }

    async buscarEstDest(params){
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getEstablacimientoDestinoPost/`;
        return await this.post(url, params);
    }

    async obtenerOfertas(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}buscarOfertas/`;
        return await this.post(url, params);
    }

    async guardarReserva(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}guardarReserva/`;
        return await this.post(url, params);
    }
    async listarReservas(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}listarReserva/`;
        return await this.post(url, params);
    }
    async descargarReservas(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}descargarReservas/`;
        return await this.post(url, params);
    }
    async listarGestoresReservas(params){
        const url = `${Config.URL_SERVICIOS}${Config.ADMIN}${Config.RESERVAS}listarGestoresReservas/`;
        return await this.post(url, params);
    }

    async getCertificadoReserva(params){
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}getCertificadoReserva/`;
        return await this.post(url, params);
    }
}

export default SmartService;