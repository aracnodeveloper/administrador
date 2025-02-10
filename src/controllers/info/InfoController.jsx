import InfoService from "../../services/info/InfoService";

const infoService= new InfoService();
const session= JSON.parse(localStorage.getItem("datos"));

export const getRemoteCities = async function (){
    try{
        const listaProvincias=[];
        const params={
            "id_pais":239
        }
        const res = await infoService.listarLugares(params);
        if (res.estado) {
            for (const provinciaKey in res.data) {
                const listaCantones=[]
                var Provincia={};
                Provincia.Titulo=provinciaKey;
                for(const cantonItem of res.data[provinciaKey]){
                    var Canton={};
                    Canton.Titulo=cantonItem['nombre']
                    Canton.Valor=cantonItem['id_tbl_lugar']
                    listaCantones.push(Canton)
                }
                Provincia.Valor=listaCantones;
                listaProvincias.push(Provincia)
            }
            
            return listaProvincias.slice().sort((a,b)=>a.Titulo.localeCompare(b.Titulo))
        }
    }catch(e){

    }
}

export const listarCanalesVenta=async function (){
    try{
        var params={
            token: session.token
        }
        const res = await infoService.listarCanalesVenta(params);
        if(res&&res.estado&&res.codigo==0){
            return res.data;
        }
    }catch(e){
        
    }
    return false;
}