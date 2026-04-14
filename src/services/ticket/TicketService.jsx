import Config from "../../global/config";
import GenericService from "../service";

// NOTA: agregar en .htaccess del apiv1.7:
//   Rewriterule ^v1.7/ticket/(.*)/(.*)$ /apiv1.7/tickets/$1.php?$2
//
// Opcionalmente agregar en config.jsx:
//   static get VERTICKET() { return "/ticket/"; }
// (si no, se usa "/ticket/" literal como aqui)

class TicketService extends GenericService {

    async listarTickets(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}listarTickets/`;
        return await this.post(url, params);
    }

    async crearTicket(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}crearTicket/`;
        return await this.post(url, params);
    }

    async obtenerTicket(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}obtenerTicket/`;
        return await this.post(url, params);
    }

    async actualizarTicket(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}actualizarTicket/`;
        return await this.post(url, params);
    }

    async eliminarTicket(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}eliminarTicket/`;
        return await this.post(url, params);
    }

    async marcarTicketUsado(params) {
        const url = `${Config.URL_SERVICIOS}${Config.TICKETS}marcarTicketUsado/`;
        return await this.post(url, params);
    }
}

export default TicketService;