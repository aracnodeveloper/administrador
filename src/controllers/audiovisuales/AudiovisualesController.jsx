import AudiovisualesService from "../../services/audiovisuales/AudiovisualesService"
import EstablecimientosService from "../../services/establecimientos/EstablecimientosService";

export const getInfluencers = async function () {

    try{
        const audiovisualesService = new AudiovisualesService;
        const res = await audiovisualesService.gestionarInfluencers({"tipo":"listar"})
        if(res!=null &&res.estado){
            return res.data
        }
    }catch{

    }
    return {}
}


export const setInfluencers = async function (params, modificar=false) {
    try{
        const audiovisualesService = new AudiovisualesService;
        modificar?params["tipo"]="modificar":params["tipo"]="guardar";
        const res = await audiovisualesService.gestionarInfluencers(params)
        if(res!=null &&res.estado){
            return true;
        }
    }catch{
        return false
    }
    return false
}

export const getRedesSociales = async function (params){
    try{
        const audiovisualesService = new AudiovisualesService;
        const res = await audiovisualesService.gestionarRedesSociales(params)
        if(res!=null &&res.estado){
            return res.data;
        }
    }catch{
        return false
    }
    return false
}

export const getEstablecimientos = async function (){
    var params ={
        "tipo":"listar"
    }
    try{
        const audiovisualesService = new AudiovisualesService;
        const res = await audiovisualesService.gestionarEstablecimientos(params)
        if(res!=null &&res.estado){
            return res.data;
        }
    }catch{
        return false
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

export const getRedesSocialesInfluencer = async function (id){
    try{
        const audiovisualesService = new AudiovisualesService;
        const params={
            "tipo":"listar",
            "id_influencer":parseInt(id)
        }
        const res = await audiovisualesService.gestionarRedesSocialesInfluencer(params)
        if(res!=null &&res.estado){
            return res.data;
        }
    }catch{
        return false
    }
    return false
}

export const setRedesSocialesInfluencer = async function (params) {
    try{
        const audiovisualesService = new AudiovisualesService;
        const res = await audiovisualesService.gestionarRedesSocialesInfluencer(params)
        if(res!=null &&res.estado){
            return true;
        }
    }catch{
        return false
    }
    return false
}

export const getVideosInfluencer = async function (id){
    try{
        const audiovisualesService = new AudiovisualesService;
        const params={
            "tipo":"listar",
            "id_influencer":parseInt(id)
        }
        const res = await audiovisualesService.gestionarVideosInfluencer(params)
        if(res!=null&&res.estado){
            return res.data;
        }
    }catch{
        return false
    }
    return false
}

export const setVideosInfluencers = async function (params) {
    try{
        const audiovisualesService = new AudiovisualesService;
        const res = await audiovisualesService.gestionarVideosInfluencer(params)
        if(res!=null &&res.estado){
            return true;
        }
    }catch{
        return false
    }
    return false
}