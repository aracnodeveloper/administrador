import WebService from "../../services/web/WebService";

export const DefaultToken = async function () {
    // Genera un número aleatorio de 5 cifras
    const ramdomNum = Math.floor(10000 + Math.random() * 90000);

    // Obtiene el timestamp actual
    const timestamp = new Date().getTime();

    // Concatena el número aleatorio y el timestamp
    //const deviceid = ramdomNum.toString() + timestamp.toString();
    var token = false
    var params = {
        "udid": "invitadoweb"
    }
    try {
        const webService = new WebService;
        const datos = await webService.getDefaultToken(params);
        if (datos.estado && datos.codigo == 0) {   // falso
            if (Object.values(datos).length > 0) {
                var _values =
                {
                    "token": datos['token'],
                    "tipoUsuario": -1, //visitante:-1 gratis:0 suscriptor:1
                    "permisos": datos['data']['permisos'],
                    "identificador": datos['identificador'],
                };
                localStorage.setItem('datos', JSON.stringify(datos));
            }
            token = true
            return token;
        }
    } catch (e) {
        
    }
}