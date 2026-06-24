import Config from "../../global/config";
import GenericService from "../service";

class PublicidadService extends GenericService {

    async listarPublicidades(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VERINFO}getPublicidadesAdmin/`;
        return await this.post(url, params);
    }

    async obtenerPublicidad(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VERINFO}getPublicidadAdmin/`;
        return await this.post(url, params);
    }

    async guardarPublicidad(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VERINFO}setPublicidad/`;
        return await this.post(url, params);
    }

    async eliminarPublicidad(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VERINFO}deletePublicidad/`;
        return await this.post(url, params);
    }

    async getCatalogos(params) {
        const url = `${Config.URL_SERVICIOS}${Config.VERINFO}getCatalogosPublicidad/`;
        return await this.post(url, params);
    }

    /**
     * Sube imagen al endpoint usando FormData (multipart/form-data).
     * No usa GenericService.post porque ese envia JSON.
     */
    async subirImagen(file, token) {
        try {
            const url = `${Config.URL_SERVICIOS}${Config.VERINFO}subirImagenPublicidad/`;
            const fd = new FormData();
            fd.append("file", file);
            fd.append("token", token);
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "bearer " + Config.DEVELOPER_TOKEN,
                },
                body: fd,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error("Error subiendo imagen publicidad:", e);
            return { estado: false, codigo: -1, msj: e.message };
        }
    }
}

export default PublicidadService;
