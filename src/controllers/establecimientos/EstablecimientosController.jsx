import EstablecimientosService from "../../services/establecimientos/EstablecimientosService";
import Config from "../../global/config";
import Detalle from "../../../../administrador/src/models/Detalle";
import Establecimiento from "../../../../administrador/src/models/Establecimiento";
import ResultadoBusqueda from "../../../../administrador/src/models/ResultadoBusqueda";
import { DefaultToken } from "../web/webController";
import Contactos from "../../../../administrador/src/models/Contactos";
import Oferta from "../../../../administrador/src/models/Oferta";

export const getEstablecimientos = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.gestionarEstablecimientos({ "tipo": "listar" });
        if (res != null && res.estado) return res.data;
    } catch {}
    return {};
};

export const setEstablecimiento = async function (params) {
    try {
        const s = new EstablecimientosService();
        const res = await s.gestionarEstablecimientos(params);
        if (res != null && res.estado) return true;
    } catch { return false; }
    return false;
};

export const getLugares = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.gestionarLugares({ "tipo": "listar" });
        if (res != null && res.estado) return res.data;
    } catch { return false; }
    return false;
};

export const listarEstablecimientosAdmin = async function (params = {}) {
    try {
        const s = new EstablecimientosService();
        const res = await s.listarEstablecimientosAdmin(params);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getPaises = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.getPaises();
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getCiudades = async function (id_pais) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getCiudades(id_pais);
        if (res != null && res.estado) {
            const ciudades = [];
            Object.entries(res.data).forEach(([provincia, lista]) => {
                lista.forEach(c => {
                    ciudades.push({
                        id_lugar:  c.id_tbl_lugar,
                        nombre:    c.nombre,
                        provincia: provincia,
                    });
                });
            });
            ciudades.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
            return ciudades;
        }
    } catch { return null; }
    return null;
};

export const verificarUsuario = async function (email) {
    try {
        const s = new EstablecimientosService();
        const res = await s.verificarUsuario(email);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const crearEstablecimiento = async function (params = {}) {
    /**
     * El PHP de setEstablecimiento tiene pr() en subscriber.php que contamina el output.
     * Leemos como texto y extraemos el JSON saltando cualquier basura previa.
     */
    try {
        const url = `${Config.URL_SERVICIOS}${Config.VEREST}setEstablecimiento/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(params),
        });
        const text = await response.text();
        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) {
            try {
                const data = JSON.parse(text.substring(jsonStart));
                if (data.estado) return data.data ?? true;
                console.error('setEstablecimiento error:', data.msj);
                return null;
            } catch {}
        }
        if (response.ok) return true;
    } catch (e) {
        console.error('crearEstablecimiento error:', e);
    }
    return null;
};

export const getTiposEstablecimiento = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.getTiposEstablecimiento();
        if (res != null && res.estado) return res.data.tipos;
    } catch { return null; }
    return null;
};

export const getEstablecimientoDetalle = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getEstablecimientoDetalle(id_establecimiento);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const updateEstablecimiento = async function (params = {}) {
    try {
        const s = new EstablecimientosService();
        const res = await s.updateEstablecimiento(params);
        if (res != null && res.estado) return true;
    } catch { return null; }
    return null;
};

export const getContratos = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getContratos(id_establecimiento);
        if (res != null && res.estado) return res.data.contratos;
    } catch { return null; }
    return null;
};

export const setContrato = async function (params = {}) {
    try {
        const s = new EstablecimientosService();
        const res = await s.setContrato(params);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getDatosContrato = async function (id_establecimiento, id_contrato = 0) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getDatosContrato(id_establecimiento, id_contrato);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

// ── Servicios SMART del establecimiento ──────────────────────────────────────
export const getServiciosEstablecimiento = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getServiciosEstablecimiento(id_establecimiento);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getCatalogoServiciosSmart = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.getCatalogoServiciosSmart();
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const setServiciosEstablecimiento = async function (params) {
    try {
        const s = new EstablecimientosService();
        const res = await s.setServiciosEstablecimiento(params);
        if (res != null && res.estado) return res.data ?? true;
    } catch { return null; }
    return null;
};

// ── Ofertas del establecimiento ──────────────────────────────────────────────
export const getOfertasEstablecimiento = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getOfertasEstablecimiento(id_establecimiento);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getCatalogosOferta = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.getCatalogosOferta();
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const gestionarOferta = async function (params) {
    try {
        const s = new EstablecimientosService();
        const res = await s.gestionarOferta(params);
        if (res != null && res.estado) return res.data ?? true;
    } catch { return null; }
    return null;
};

export const eliminarOferta = async function (id_oferta) {
    try {
        const s = new EstablecimientosService();
        const res = await s.eliminarOferta(id_oferta);
        if (res != null && res.estado) return true;
    } catch { return null; }
    return null;
};

export const getOferta = async function (id_info_indice) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getOferta(id_info_indice);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const getServiciosOferta = async function (id_oferta) {
    try {
        const s = new EstablecimientosService();
        const res = await s.getServiciosOferta(id_oferta);
        if (res != null && res.estado) return res.data;
    } catch { return null; }
    return null;
};

export const setServiciosOferta = async function (params) {
    try {
        const s = new EstablecimientosService();
        const res = await s.setServiciosOferta(params);
        if (res != null && res.estado) return res.data ?? true;
    } catch { return null; }
    return null;
};

// ── Aprobaciones ─────────────────────────────────────────────────────────────
export const listarEstablecimientosRevision = async function () {
    try {
        const s = new EstablecimientosService();
        const res = await s.listarEstablecimientosRevision();
        if (res != null && res.estado) {
            return Array.isArray(res.data)
                ? res.data
                : (res.data?.establecimientos ?? []);
        }
    } catch { return []; }
    return [];
};

export const aprobarEstablecimiento = async function (id_establecimiento) {
    try {
        const s = new EstablecimientosService();
        const res = await s.aprobarEstablecimiento(id_establecimiento);
        if (res != null && res.estado) return res.data ?? true;
        return res;
    } catch { return null; }
    return null;
};

export const getResultadoFiltro = async function (filtro) {
    var bd = JSON.parse(localStorage.getItem('datos'))
    if (bd == null) {
        return DefaultToken()
            .then((result) => {
                if (result) {
                    return _getResultadoFiltro(filtro);
                }
            });
    } else {
        return _getResultadoFiltro(filtro)
    }
}


const _getResultadoFiltro = async function (filtro) {
    try {
        const establecimientoService = new EstablecimientosService();
        const bd = JSON.parse(localStorage.getItem('datos'));
        var params = {
            "token": bd['token'],
            "id":filtro.IdDestino,
            "tipo":filtro.TipoDestino,
        }

        filtro.IdDestino&&(params.id=filtro.IdDestino);
        filtro.TipoDestino&&(params.tipo=filtro.TipoDestino);
        filtro.IdEstablecimiento&&(params.id_establecimiento=filtro.IdEstablecimiento);
        filtro.txtBusqueda&&(params.txtBusqueda=filtro.txtBusqueda);
        filtro.IdBeneficios&&(params.beneficios=filtro.IdBeneficios);
        filtro.IdServicios&&(params.idservicios=filtro.IdServicios);
        filtro.Personas&&(params.personas=filtro.Personas);
        filtro.Tiempo&&(params.tiempo=filtro.Tiempo);
        filtro.Precio&&(params.precio=filtro.Precio);
        filtro.Habitaciones&&(params.habitaciones=filtro.Habitaciones);
        filtro.Ordenar&&(params.ordenar=filtro.Ordenar);
        filtro.Fechas&&(params.fechas=filtro.Fechas);
        filtro.Pax&&(params.pax=filtro.Pax);
        const res = await establecimientoService.filtro(params);

        if (res.estado && res.codigo === 0) {
            const {
                establecimientos,
                centralReserva,
                opcionesOrden,
                beneficios,
                url,
                filtro: { catalogacion, locacion, precios, servicios, serviciosHabEst, incluyeEst, adicionalesEst },
            } = res.data;

            const listadoCatalogaciones = createDetalles(catalogacion, 'nombre', 'catalogacion');
            const listadoLocaciones = createDetalles(locacion, 'nombre', 'color');
            const listadoServicios = createDetalles(servicios, 'nombre', 'estilo');
            const listadoServiciosHab = createDetalles(serviciosHabEst,  'nombre', 'estilo');
            const listadoIncluye = createDetalles(incluyeEst, 'nombre', 'Icono');
            const listadoAdicionales = createDetalles(adicionalesEst, 'nombre', 'Icono');
            const listadoOrdenes = createDetalles(opcionesOrden, 'name', 'text');
            const listadoBeneficios = createDetalles(beneficios, 'nombre',  'color');

            const resultadoBusqueda = new ResultadoBusqueda(
                createEstablecimientos(establecimientos, url.oferta, beneficios, centralReserva),
                precios.MinPrecio,
                precios.MaxPrecio,
                listadoCatalogaciones,
                listadoLocaciones,
                listadoServicios,
                listadoServiciosHab,
                listadoIncluye,
                listadoAdicionales,
                listadoOrdenes,
                listadoBeneficios
            );
            return resultadoBusqueda;
        }
        if(res.codigo==401){
            return 401
        }
    } catch (e) {
        console.error(e);
    }
};

function createDetalles(data, titleKey, iconKey) {
    const listDetalles = [];
    if (data) {
        for (const item in data) {
            if (data.hasOwnProperty(item)) {
                const detalle = new Detalle();
                detalle.Titulo = data[item][titleKey] || data[item];
                detalle.Valor = item;
                detalle.Icono = data[item][iconKey];
                listDetalles.push(detalle);
            }
        }
    }
    return listDetalles;
}

// Función para crear una lista de objetos Establecimiento a partir de un array
function createEstablecimientos(establecimientos, url, beneficios, centralReservas) {

    // Función para mapear propiedades de oferta
    function mapPropiedadesOferta(ofertaTmp) {
        const oferta = new Oferta();
        const propiedadesOfertaObj = ['Id', 'IdLugar', 'EstadoBusqueda', 'IdOferta', 'Habitaciones', 'IdEstablecimiento', 'AplicaEn', 'TituloOferta', 'Ninos', 'Adultos', 'Dias', 'Noches', 'Ganga', 'Rack', 'Final', 'Ahorro', 'FinalSinImpuestos', 'Impuestos', 'Ciudad', 'Provincia', 'Favorito', 'FotoPrincipal', 'EstiloBeneficio', 'IdBeneficio', 'ColorBeneficio', 'Localidad', 'Acomodacion', 'Incluye', 'NoIncluye', 'Restricciones', 'SistemaServicios', 'NumOfertas', 'Base'];
        const propiedadesOferta = ['id', 'id_lugar', 'estadoBusqueda', 'id_oferta', 'habitaciones', 'id_establecimiento', 'aplicaen', 'tituloOferta', 'ninos', 'adultos', 'dias', 'noches', 'ganga', 'rack', 'final', 'ahorro', 'sinImpuestos', 'impuestos', 'ciudad', 'provincia', 'fav', 'foto', 'estiloBeneficio', 'idBeneficio', 'colorBeneficio', 'localidad', 'acomodacion', 'incluyeOferta', 'noIncluyeOferta', 'restriccionesOferta', 'sistemaServiciosOferta', 'numOfertas', 'base'];

        propiedadesOferta.forEach((prop, index) => oferta[propiedadesOfertaObj[index]] = ofertaTmp[prop]);

        // Porcentaje de ahorro
        oferta.PorcentajeAhorro = Math.round(100 - (parseInt(oferta.Final) * 100) / parseInt(oferta.Rack));


        // Detalles
        const propiedadesObj=['Incluye', 'NoIncluye', 'Restricciones', 'SistemaServicios'];
        ['incluyeOferta', 'noIncluyeOferta', 'restriccionesOferta', 'sistemaServiciosOferta'].forEach((detalle, index) => {
            ofertaTmp[detalle]&&(oferta[propiedadesObj[index]] = Object.entries(ofertaTmp[detalle]).map(([key, value]) => new Detalle(value, key, "")));
        });

        return oferta;
    }

    return establecimientos.filter(establecimientoTmp => establecimientoTmp.ofertas && Object.keys(establecimientoTmp.ofertas).length > 0).map(establecimientoTmp => {
        const establecimiento = new Establecimiento();

        // Mapeo de propiedades
        const propiedadesObj = ['IdEstablecimiento', 'Titulo', 'Ciudad', 'Pais', 'IdPais', 'IdCiudad', 'EdadNino', 'Catalogacion', 'Longitud', 'Latitud', 'Logo', 'Direccion', 'Descripcion', 'Favorito', 'TipoEstablecimiento'];
        const propiedades = ['id_establecimiento', 'titulo', 'ciudad', 'pais', 'idPais', 'idCiudad', 'edad_nino', 'catalogacion', 'longitud', 'latitud', 'logo', 'direccion', 'descripcionEst', 'favorito', 'tipoEstablecimiento'];
        propiedades.forEach((prop, index) => establecimiento[propiedadesObj[index]] = establecimientoTmp[prop]);

        // Foto
        establecimiento.Foto = url + establecimientoTmp.fotoHotel;

        // Galería
        establecimiento.Galeria = establecimientoTmp.galeria.map(g => new Detalle(g.nombre, url + g.img));

        // Ofertas
        establecimiento.Ofertas = Object.values(establecimientoTmp.ofertas).map(mapPropiedadesOferta);

        // Servicios
        const propiedadesServ=['Servicios', 'Incluye', 'NoIncluye', 'Restricciones', 'SistemaServicios', 'ServiciosHab','Adicionales'];
        ['serviciosEst', 'incluyeEst', 'noIncluyeEst', 'restriccionesEst', 'sistemaServEst', 'serviciosHabEst', 'adicionalesEst'].forEach((servicio, index) => {
            if(servicio=='serviciosEst'){
                establecimientoTmp[servicio]&&(establecimiento[propiedadesServ[index]] = Object.entries(establecimientoTmp[servicio]).map(([key, value]) => new Detalle(value.nombre, key, value.estilo)));
            }
            else{
                establecimientoTmp[servicio]&&(establecimiento[propiedadesServ[index]] = Object.entries(establecimientoTmp[servicio]).map(([key, value]) => new Detalle(value, key)));
            }
        });

        // Contactos Establecimiento
        const listaContactos = {
            Whatsapp: [],
            Telefono: [],
            Email: [],
            Web: []
        };

        if(establecimientoTmp.contactos){
            establecimientoTmp.contactos.forEach(contacto => {
                if (contacto.nombre.includes("WhatsApp")) listaContactos.Whatsapp.push(contacto.valor);
                if (contacto.nombre.includes("Teléfono Reservas")) listaContactos.Telefono.push(contacto.valor);
                if (contacto.nombre.includes("Email")) listaContactos.Email.push(contacto.valor);
                if (contacto.nombre.includes("Página Web")) listaContactos.Web.push(contacto.valor);
            });
        }

        establecimiento.Contactos = new Contactos(listaContactos.Whatsapp, listaContactos.Email,  listaContactos.Telefono,listaContactos.Web);

        // Contactos Central Reservas
        const contactosCR=new Contactos();
        contactosCR.Whatsapp=centralReservas.whatsapp.contacto;
        contactosCR.Telefono=centralReservas.telefono_reservas.contacto;
        contactosCR.Email=centralReservas.email.contacto;

        establecimiento.ContactosCentral = contactosCR;

        // Recomendados
        establecimiento.Recomendados = establecimientoTmp.recomendados.map(recomendadoTmp => {
            const ofertaTmp = establecimientoTmp.ofertas[recomendadoTmp.id];
            ofertaTmp.numOfertas=recomendadoTmp.numOfertas;
            return mapPropiedadesOferta(ofertaTmp);
        });

        // Precio y otros datos
        establecimiento.PrecioSinImpuestos = establecimientoTmp.precioRecomendadoSinImp;
        establecimiento.PrecioConImpuestos = establecimientoTmp.precioRecomendadoFinal;
        establecimiento.Rack = establecimientoTmp.precioRecomendadoRack;
        establecimiento.Impuestos = establecimientoTmp.precioRecomendadoImpuestos;

        //Calificacion
        establecimiento.Calificacion= new Detalle(
            establecimientoTmp.comentarios.calificacion,
            establecimientoTmp.comentarios.cantidadComentarios,
            establecimientoTmp.comentarios.puntuacion,
        )

        return establecimiento;
    });
}
