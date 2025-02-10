import { verificarPermiso } from "../../global/utils";
import SmartService from "../../services/smart/SmartService";

const smartService = new SmartService;
const session= JSON.parse(localStorage.getItem("datos"));

const formatDate = ( date) => { 
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const buscarUsuarios = async function (busqueda) {
    try {
        const params = {
            "token": session.token,
            "tipo": "listado",
            "txtBusqueda": busqueda
        }
        console.log("ingresa")
        const res = await smartService.buscarUsuario(params)
        console.log(res)
        if (res != null && res.estado) {
            return res.data
        }
    } catch(e) {
        console.log(e)
    }
    return false;
}

export const buscarCliente = async function (busqueda) {
    try {
        const params = {
            "token": session.token,
            "tipo": "cliente",
            "ci": busqueda
        }
        const res = await smartService.buscarUsuario(params)
        if (res != null && res.estado) {
            return res.data
        }
    } catch {

    }
    return false;
}

export const informacionUsuarios = async function (idUsuario) {
    try {
        
        const params = {
            "token": session.token,
            "tipo": "detalle",
            "id_tbl_usuario": idUsuario
        }
        const res = await smartService.buscarUsuario(params)
        if (res != null && res.estado) {
            return res.data
        }
    } catch {

    }
    return false;
}

export const getEstSmart = async function (termino) {
    try {
        var params = {
            "token": session.token,
            "termino": termino,
            "tipo":"establecimiento"
        }
        const res = await smartService.buscarEstDest(params);
        if (res.estado && res.codigo == 0) {   // falso

            return res['data']['sugerencias']
        }
    } catch (e) {
        console.log(e)
    }
}


export const getOfertas = async function (id_establecimiento) {
    try {
        var params = {
            "token": session.token,
            "id_establecimiento": id_establecimiento,
        }
        const res = await smartService.obtenerOfertas(params);
        if (res.estado && res.codigo == 0) {   // falso
            
            return res['data']
        }
    } catch (e) {
        console.log(e)
    }
}

export const saveReserva = async function (params) {
    try {
        params.token=session.token;

        const res = await smartService.guardarReserva(params);
        if (res.estado && res.codigo == 0) {   // falso
            
            return res['data']
        }
    } catch (e) {
        console.log(e)
    }
}

export const listarReservas = async function ({id="", pagina=1}) {
    try {
        var params={
            "token":session.token,
            "pagina":pagina,
            "cantidad":20,
            "fechas":{
                "inicio": formatDate(new Date().setMonth(new Date().getMonth() - 1)),
                "fin":formatDate(new Date())
            }
        }
        if(id!=""){
            params.id_tbl_reserva=id;
        }
        if(!verificarPermiso(87)){
            params.id_tbl_usuario=session.data.id_usuario;
        }
        console.log(params)
        const res = await smartService.listarReservas(params);
        if (res.estado && res.codigo == 0) {   // falso
            
            return res['data']
        }
    } catch (e) {
        console.log(e)
    }
}

export const listarReservasFiltro = async function (filtros, descargar=false) {
    try {
        var params={
            "token":session.token
        }
        if(filtros.id_tbl_usuario>0){
            params.id_tbl_usuario=filtros.id_tbl_usuario;
        }
        if(filtros.id_tbl_estado_reserva>0){
            params.id_tbl_estado_reserva=filtros.id_tbl_estado_reserva;
        }
        if(filtros.tipoPago>-2){
            params.tipoPago=filtros.tipoPago;
        }
        if(filtros.pagina>0){
            params.pagina=filtros.pagina;
        }
        if(filtros.fechas){
            params.fechas=filtros.fechas
        }
        if(filtros.codCliente){
            params.codCliente=filtros.codCliente
        }
        if(filtros.nomEstablecimiento){
            params.nomEstablecimiento=filtros.nomEstablecimiento
        }
        if(filtros.nroReserva){
            params.nroReserva=filtros.nroReserva
        }
        if(filtros.cantidad){
            params.cantidad=filtros.cantidad
        }
        console.log("params", params);
        var res;
        if(descargar){
            res = await smartService.descargarReservas(params);
        }else{
            res = await smartService.listarReservas(params);
        }
        if (res.estado && res.codigo == 0) {   // falso
            return res['data']
        }
    } catch (e) {
        console.log(e)
    }
    return false;
}

export const listarGestoresReservas = async function (){
    try{
        var params = {
            "token": session.token
        }
        const res = await smartService.listarGestoresReservas(params);
        if (res.estado && res.codigo == 0) {   // falso
            return res['data']
        }
    }catch(e){

    }
    return false;
}

export const getCertificadoReserva=async function(ID){
    try{
        var bd = JSON.parse(localStorage.getItem('datos'));
        const params={
            "id_tbl_reserva":ID,
            "token":bd['token'],
        }        
        const res= await smartService.getCertificadoReserva(params);
        console.log(res['data'][0]['adultos']);
        if(res.estado){
            console.log("certificado",res)
            const certificado= {};
            const impuestos= (parseInt(res['data'][0]['iva'])+parseInt(res['data'][0]['servicios']))/100;
            certificado.NombreSus=res['data'][0]['nombre_suscriptor'];
            certificado.CedulaSus=res['data'][0]['ci_ruc'];
            certificado.IdSus=res['data'][0]['usu_o_email'];
            certificado.Adultos=res['data'][0]['adultos'];
            certificado.Ninos=res['data'][0]['ninos'];
            certificado.FechaIn=res['data'][0]['fecha_inicio'];
            certificado.FechaOut=res['data'][0]['fecha_fin'];
            certificado.CheckIn=res['data'][0]['check_in'];
            certificado.CheckOut=res['data'][0]['check_out'];
            certificado.Estado=res['data'][0]['nombre_estado_reserva'];
            certificado.NombreEst=res['data'][0]['hotel'];
            certificado.DireccionEst=res['data'][0]['direccion_establecimiento'];
            certificado.LatitudEst=res['data'][0]['latitud'];
            certificado.LongitudEst=res['data'][0]['longitud'];
            certificado.FotoEst=res['data'][0]['foto'];
            certificado.TelefonoEst=res['data'][0]['telefono'];
            certificado.EmailEst=res['data'][0]['email'];
            certificado.WhatsappEst=res['data'][0]['whatsApp'];
            certificado.LugarEst=res['data'][0]['lugar'];
            certificado.serviciosEst=res['data'][0]['serviciosEst'];
            certificado.sistemaServEst=res['data'][0]['sistemaServEst'];
            certificado.serviciosHabEst=res['data'][0]['serviciosHabEst'];
            certificado.incluyeEst=res['data'][0]['incluyeEst'];
            certificado.noIncluyeEst=res['data'][0]['noIncluyeEst'];
            certificado.restriccionesEst=res['data'][0]['restriccionesEst'];
            var habitaciones = [];
            var cantidad=0;
            var total=0;
            var imp=0;
            var subtotal=0;
            var adultos=0;
            var ninos =0;
            var idRes=res['data'][0]['id_tbl_reserva'];
            
            for(const reserva of res['data']){
                console.log(reserva)
                const habitacion = {};
                habitacion.Nombre=reserva["habitacion"]
                habitacion.Cantidad=parseFloat(reserva["cantidad"]);
                habitacion.Subtotal=(parseFloat(reserva["cantidad"])*parseFloat(reserva["precio"])*(1-impuestos));
                habitacion.Impuestos=(parseFloat(reserva["cantidad"])*parseFloat(reserva["precio"]*impuestos)).toFixed(2);
                habitacion.Impuestos=Number(habitacion.Impuestos);
                habitacion.SubtotalNino=(parseFloat(reserva["ninos_extras"]!=""?reserva["ninos_extras"]:"0")*parseFloat(reserva["precio_nino_adicional"]!=""?reserva["precio_nino_adicional"]:"0")*(1-impuestos));
                habitacion.ImpuestosNino=(parseFloat(reserva["ninos_extras"]!=""?reserva["ninos_extras"]:"0")*parseFloat((parseFloat(reserva["precio_nino_adicional"]!=""?reserva["precio_nino_adicional"]:"0"))*impuestos)).toFixed(2);
                habitacion.ImpuestosNino=Number(habitacion.ImpuestosNino);
                habitacion.SubtotalAdulto=(parseFloat(reserva["adultos_extras"]!=""?reserva["adultos_extras"]:"0")*parseFloat(reserva["precio_adulto_adicional"]!=""?reserva["precio_adulto_adicional"]:"0")*(1-impuestos));
                habitacion.ImpuestosAdulto=(parseFloat(reserva["adultos_extras"]!=""?reserva["adultos_extras"]:"0")*parseFloat((parseFloat(reserva["precio_adulto_adicional"]!=""?reserva["precio_adulto_adicional"]:"0"))*impuestos)).toFixed(2);
                habitacion.ImpuestosAdulto=Number(habitacion.ImpuestosAdulto);
                habitacion.Total=parseFloat(reserva["cantidad"])*parseFloat(reserva["precio"]);
                habitacion.Acomodacion=reserva["acomodacion"];
                habitacion.AplicaEn = reserva["aplicaEn"];
                habitacion.Ninos=reserva["ninosOferta"];
                habitacion.Adultos=reserva["adultosOferta"];
                habitacion.AdultosAdicionales=reserva["adultos_extras"];
                habitacion.PrecioAdultos=reserva["precio_adulto_adicional"];
                habitacion.NinosAdicionales=reserva["ninos_extras"];
                habitacion.PrecioNinos=reserva["precio_nino_adicional"];
                ninos+=parseInt(habitacion.Ninos?habitacion.Ninos:"0")+parseInt(habitacion.NinosAdicionales?habitacion.NinosAdicionales:"0");
                adultos+=parseInt(habitacion.Adultos)+parseInt(habitacion.AdultosAdicionales?habitacion.AdultosAdicionales:"0");
                habitaciones.push(habitacion);
                cantidad=cantidad+habitacion.Cantidad;
                total=total+habitacion.Total;
                imp=imp+habitacion.Impuestos+habitacion.ImpuestosAdulto+habitacion.ImpuestosNino;
                subtotal=subtotal+habitacion.Subtotal+habitacion.SubtotalNino+habitacion.SubtotalAdulto;
            }
            certificado.IdRes=idRes;
            certificado.Habitaciones=habitaciones;
            certificado.CantidadHab=cantidad;
            certificado.Subtotal=subtotal;
            certificado.Impuestos=imp;
            certificado.Total=subtotal+imp;
            certificado.Ninos=ninos;
            certificado.Adultos=adultos;
            return certificado;
        }
        return null;
    }catch(e){
    }
}


