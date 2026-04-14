class ResultadoBusqueda{
    constructor(
        Establecimientos,
        PrecioMinimo,
        PrecioMaximo,
        Catalogaciones,
        Locaciones,
        Servicios,
        ServiciosHab,
        Incluye,
        Ordenes,
        Beneficios,
    ){
        this.Establecimientos=Establecimientos;
        this.PrecioMinimo=PrecioMinimo;
        this.PrecioMaximo=PrecioMaximo;
        this.Catalogacionesta=Catalogaciones;
        this.Locaciones=Locaciones;
        this.Servicios=Servicios;
        this.ServiciosHab=ServiciosHab;
        this.Incluye=Incluye;
        this.Ordenes=Ordenes;
        this.Beneficios=Beneficios;
    }
}

export default ResultadoBusqueda;