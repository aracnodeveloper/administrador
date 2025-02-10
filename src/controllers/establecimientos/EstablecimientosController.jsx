import EstablecimientosService from "../../services/establecimientos/EstablecimientosService";

export const getEstablecimientos = async function () {
    try{
        const establecimientosService = new EstablecimientosService;
        const res = await establecimientosService.gestionarEstablecimientos({"tipo":"listar"})
        if(res!=null &&res.estado){
            return res.data
        }
    }catch{

    }
    return {}
}

export const setEstablecimiento = async function (params) {
    try{
        const establecimientosService = new EstablecimientosService;
        const res = await establecimientosService.gestionarEstablecimientos(params)
        if(res!=null &&res.estado){
            return true;
        }
    }catch{
        return false;
    }
    return false
}

export const getLugares = async function (){
    var params ={
        "tipo":"listar"
    }
    try{
        const establecimientosService = new EstablecimientosService;
        const res = await establecimientosService.gestionarLugares(params)
        if(res!=null &&res.estado){
            return res.data;
        }
    }catch{
        return false
    }
    return false
}