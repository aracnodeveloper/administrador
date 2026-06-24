import React, { useState, useEffect } from "react";
import {
    getOfertasEstablecimiento,
    getCatalogosOferta,
    gestionarOferta,
    eliminarOferta,
    getOferta,
    getServiciosOferta,
    setServiciosOferta,
    getCatalogoServiciosSmart,
} from "../../../../controllers/establecimientos/EstablecimientosController";
import { Spin, MsgOk, MsgErr, Campo, iCls } from "./TabInfoEstablecimiento";

// ─── Componente: Tab Ofertas ────────────────────────────────────────────────
const TabOfertasEstablecimiento = ({ idEstablecimiento }) => {
    const [cargando,   setCargando]   = useState(true);
    const [ofertas,    setOfertas]    = useState([]);
    const [catalogos,  setCatalogos]  = useState(null);
    const [editando,   setEditando]   = useState(null);    // null | {id_oferta?, ...}
    const [msj,        setMsj]        = useState("");
    const [msjTipo,    setMsjTipo]    = useState("ok");

    // Servicios de la oferta en edicion
    const [cargandoOferta,    setCargandoOferta]    = useState(false);
    const [catServicios,      setCatServicios]      = useState([]);   // [{nombre, items:[{id_tbl_servicio_smart, nombre_servicio_smart}]}]
    const [serviciosOferta,   setServiciosOferta]   = useState({});   // { idServicio: { id_tbl_tipo_detalle, detalle_o_comentario } }
    const [abiertosSvc,       setAbiertosSvc]       = useState({});

    const cargarOfertas = async () => {
        setCargando(true);
        const data = await getOfertasEstablecimiento(idEstablecimiento);
        // data puede venir como { ofertas: [...] } o array directo
        const lista = Array.isArray(data) ? data : (data?.ofertas ?? []);
        setOfertas(lista);
        setCargando(false);
    };

    useEffect(() => {
        if (!idEstablecimiento) return;
        cargarOfertas();
        getCatalogosOferta().then(c => setCatalogos(c ?? {}));
    }, [idEstablecimiento]);

    const handleNueva = () => {
        setMsj("");
        setEditando({
            id_oferta: 0,
            id_info_indice: 0,
            titulo: "",
            keywords: "",
            resumen: "",
            contenido: "",
            codigo_anterior: "",
            id_clasificacion: "",
            id_beneficio: "",
            id_acomodacion: "",
            id_empresa: [],
            dias: 1,
            noches: 0,
            adultos: 2,
            ninos: 0,
            fecha_inicio: "",
            fecha_fin: "",
            costo_rack: 0,
            precio_oferta: 0,
        });
    };

    // Helper: buscar id_X dentro de un array de catalogo por su nombre.
    //   `idKey`     = nombre del campo de id (p.ej "id_tbl_clasificacion_oferta")
    //   `nombreKey` = nombre del campo de nombre en el catalogo
    //   `nombre`    = string a buscar (comparacion case-insensitive y sin espacios)
    const buscarIdPorNombre = (lista, idKey, nombreKey, nombre) => {
        if (!Array.isArray(lista) || !nombre) return "";
        const target = String(nombre).trim().toLowerCase();
        const hit = lista.find(x => String(x[nombreKey] ?? "").trim().toLowerCase() === target);
        return hit ? String(hit[idKey]) : "";
    };

    const handleEditar = async (of) => {
        setMsj("");
        setCargandoOferta(true);
        // Mostrar el formulario inmediatamente con datos del listado, despues
        // sobreescribir con el detalle completo.
        const idInfo  = of.id_tbl_info_indice ?? of.id_info_indice ?? 0;
        const idOf    = of.id_tbl_oferta ?? of.id_oferta ?? 0;
        const cats    = catalogos ?? {};

        // -- 1. Pre-cargar lo que ya tenemos del listado (cae al buscar por nombre)
        const idClas = of.id_tbl_clasificacion_oferta ?? of.id_clasificacion;
        const idBen  = of.id_tbl_tipo_beneficio_suscripcion ?? of.id_beneficio;
        const idAcom = of.id_tbl_acomodacion ?? of.id_acomodacion;
        const resClas = idClas ? String(idClas) : buscarIdPorNombre(cats.clasificaciones, 'id_tbl_clasificacion_oferta', 'nombre_clasificacion_oferta', of.nombreClasificacion);
        const resBen  = idBen  ? String(idBen)  : buscarIdPorNombre(cats.tiposBeneficio, 'id_tbl_tipo_beneficio_suscripcion', 'nombre_tipo_beneficio_suscripcion', of.nombreTipoBeneficio);
        const resAcom = idAcom ? String(idAcom) : buscarIdPorNombre(cats.acomodaciones, 'id_tbl_acomodacion', 'nombre_acomodacion', of.nombreAcomodacion);

        let arrEmpresas = Array.isArray(of.id_empresa) ? of.id_empresa.map(String) : [];
        if (arrEmpresas.length === 0 && of.nombreEmpresa) {
            const idEmp = buscarIdPorNombre(cats.empresas, 'id_tbl_empresa', 'nombre', of.nombreEmpresa);
            if (idEmp) arrEmpresas = [idEmp];
        }

        setEditando({
            id_oferta:        idOf,
            id_info_indice:   idInfo,
            titulo:           of.titulo ?? "",
            keywords:         "",
            resumen:          "",
            contenido:        "",
            codigo_anterior:  of.codigo_anterior ?? "",
            id_clasificacion: resClas,
            id_beneficio:     resBen,
            id_acomodacion:   resAcom,
            id_empresa:       arrEmpresas,
            dias:             of.dias ?? 1,
            noches:           of.noches ?? 0,
            adultos:          of.adultos ?? 2,
            ninos:            of.ninos ?? 0,
            fecha_inicio:     of.fecha_inicio ?? "",
            fecha_fin:        of.fecha_fin ?? "",
            costo_rack:       of.costo_rack ?? 0,
            precio_oferta:    of.precio_oferta ?? 0,
        });
        setServiciosOferta({});

        // -- 2. getOferta(idInfo) -> trae keywords/resumen/contenido + IDs reales
        if (idInfo > 0) {
            const data = await getOferta(idInfo);
            if (data) {
                const o = data.oferta ?? data;
                const empresasReales = Array.isArray(data.empresas)
                    ? data.empresas.map(e => String(e.id_tbl_empresa))
                    : arrEmpresas;
                setEditando(prev => ({
                    ...prev,
                    id_oferta:        Number(o.id_tbl_oferta ?? idOf),
                    id_info_indice:   Number(o.id_tbl_info_indice ?? idInfo),
                    titulo:           o.titulo ?? prev.titulo,
                    keywords:         o.keywords ?? "",
                    resumen:          o.resumen ?? "",
                    contenido:        o.contenido_informacion ?? o.contenido ?? "",
                    codigo_anterior:  o.codigo_anterior ?? prev.codigo_anterior,
                    id_clasificacion: String(o.id_tbl_clasificacion_oferta ?? prev.id_clasificacion ?? ""),
                    id_beneficio:     String(o.id_tbl_tipo_beneficio_suscripcion ?? prev.id_beneficio ?? ""),
                    id_acomodacion:   String(o.id_tbl_acomodacion ?? prev.id_acomodacion ?? ""),
                    id_empresa:       empresasReales,
                    dias:             Number(o.dias ?? prev.dias),
                    noches:           Number(o.noches ?? prev.noches),
                    adultos:          Number(o.adultos ?? prev.adultos),
                    ninos:            Number(o.ninos ?? prev.ninos),
                    fecha_inicio:     (o.fecha_inicio ?? prev.fecha_inicio ?? "").substring(0, 10),
                    fecha_fin:        (o.fecha_fin ?? prev.fecha_fin ?? "").substring(0, 10),
                    costo_rack:       Number(o.costo_rack ?? prev.costo_rack),
                    precio_oferta:    Number(o.precio_oferta ?? prev.precio_oferta),
                }));
            }
        }

        // -- 3. getServiciosOferta(idOferta) -> servicios marcados y catalogo
        if (idOf > 0) {
            await cargarServiciosOferta(idOf);
        }

        setCargandoOferta(false);
    };

    // -- Cargar el catalogo SMART + servicios actualmente marcados en la oferta
    const cargarServiciosOferta = async (idOferta) => {
        try {
            // Catalogo siempre (puede ya estar cargado, en cuyo caso no hace falta)
            if (catServicios.length === 0) {
                const cat = await getCatalogoServiciosSmart();
                const tipos = cat?.tipos ?? cat?.data?.tipos ?? [];
                // Normalizar al shape { nombre, items: [{id_tbl_servicio_smart, nombre_servicio_smart}] }
                const grupos = tipos.map(t => ({
                    nombre: t.nombre ?? t.nombre_tipo_servicio_smart,
                    items: (t.servicios ?? []).map(s => ({
                        id_tbl_servicio_smart:    String(s.id ?? s.id_tbl_servicio_smart),
                        nombre_servicio_smart:    s.nombre ?? s.nombre_servicio_smart,
                    })),
                }));
                setCatServicios(grupos);
                // Abrir todos por defecto
                const open = {};
                grupos.forEach(g => { open[g.nombre] = true; });
                setAbiertosSvc(open);
            }

            // Servicios marcados de esta oferta
            const data = await getServiciosOferta(idOferta);
            const lista = data?.servicios ?? data ?? [];
            const sel = {};
            (Array.isArray(lista) ? lista : []).forEach(s => {
                if (s.id_tbl_tipo_detalle != null) {
                    sel[String(s.id_tbl_servicio_smart)] = {
                        id_tbl_tipo_detalle:  String(s.id_tbl_tipo_detalle),
                        detalle_o_comentario: s.detalle_o_comentario ?? "",
                    };
                }
            });
            setServiciosOferta(sel);
        } catch (e) {
            console.error('Error cargando servicios de oferta:', e);
        }
    };

    const toggleServicioOferta = (idServicio) => {
        setServiciosOferta(prev => {
            const nuevo = { ...prev };
            if (nuevo[idServicio]) delete nuevo[idServicio];
            else nuevo[idServicio] = { id_tbl_tipo_detalle: '', detalle_o_comentario: '' };
            return nuevo;
        });
    };

    const updateServicioDetalle = (idServicio, campo, valor) => {
        setServiciosOferta(prev => ({
            ...prev,
            [idServicio]: { ...(prev[idServicio] ?? {}), [campo]: valor },
        }));
    };

    const toggleGrupoSvc = (nombreGrupo) => {
        setAbiertosSvc(prev => ({ ...prev, [nombreGrupo]: !prev[nombreGrupo] }));
    };

    const handleEliminar = async (idOferta) => {
        if (!window.confirm("¿Eliminar esta oferta? Esta acción no se puede deshacer.")) return;
        const ok = await eliminarOferta(idOferta);
        if (ok) {
            setMsj("Oferta eliminada.");
            setMsjTipo("ok");
            cargarOfertas();
        } else {
            setMsj("No se pudo eliminar la oferta.");
            setMsjTipo("err");
        }
    };

    const handleGuardar = async () => {
        if (!editando) return;
        setMsj("");
        const params = {
            ...editando,
            id_establecimiento: idEstablecimiento,
        };
        const ok = await gestionarOferta(params);
        if (!ok) {
            setMsj("No se pudo guardar la oferta.");
            setMsjTipo("err");
            return;
        }

        // Determinar id_oferta resultante (insert devuelve nuevo id en data.id_oferta)
        let idOferta = Number(editando.id_oferta) || 0;
        if (typeof ok === "object" && ok?.id_oferta) idOferta = Number(ok.id_oferta);

        // Persistir servicios si tenemos id de oferta valido
        if (idOferta > 0) {
            const id_servicios = {};
            const extra = {};
            Object.entries(serviciosOferta).forEach(([idServ, info]) => {
                const tipo = Number(info?.id_tbl_tipo_detalle);
                if (!isNaN(tipo) && tipo > 0) {
                    id_servicios[idServ] = tipo;
                    const comentario = info?.detalle_o_comentario ?? "";
                    if (comentario.trim() !== "") extra[idServ] = comentario;
                }
            });
            await setServiciosOferta({
                id_oferta: idOferta,
                id_servicios,
                extra,
            });
        }

        setMsj(Number(editando.id_oferta) > 0 ? "Oferta actualizada." : "Oferta creada.");
        setMsjTipo("ok");
        setEditando(null);
        setServiciosOferta({});
        setCatServicios([]);
        cargarOfertas();
    };

    // -- Render: formulario de edicion ---------------------------------------
    if (editando) {
        return (
            <FormularioOferta
                data={editando}
                catalogos={catalogos}
                onChange={setEditando}
                onCancelar={() => {
                    setEditando(null);
                    setMsj("");
                    setServiciosOferta({});
                    setCatServicios([]);
                }}
                onGuardar={handleGuardar}
                msj={msj}
                msjTipo={msjTipo}
                cargandoOferta={cargandoOferta}
                catServicios={catServicios}
                serviciosOferta={serviciosOferta}
                abiertosSvc={abiertosSvc}
                toggleServicio={toggleServicioOferta}
                updateServicio={updateServicioDetalle}
                toggleGrupo={toggleGrupoSvc}
            />
        );
    }

    // -- Render: listado -----------------------------------------------------
    if (cargando) {
        return (
            <div className="flex items-center justify-center h-32 gap-2 text-gray-400">
                <Spin size={5}/><span className="text-xs">Cargando ofertas...</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {msj && (msjTipo === "ok" ? <MsgOk txt={msj}/> : <MsgErr txt={msj}/>)}

            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-700">
                    Ofertas del establecimiento ({ofertas.length})
                </h3>
                <button
                    onClick={handleNueva}
                    className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Nueva oferta
                </button>
            </div>

            {ofertas.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-10 border border-dashed border-gray-200 rounded-lg">
                    Este establecimiento no tiene ofertas registradas todavía.
                </p>
            ) : (
                <div className="space-y-2">
                    {ofertas.map((of, idx) => {
                        const idOf    = of.id_tbl_oferta ?? of.id_oferta ?? idx;
                        const tit     = of.titulo ?? of.tituloOferta ?? "(sin título)";
                        const precio  = of.precio_oferta ?? of.precioOferta;
                        const rack    = of.costo_rack ?? of.costoRack;
                        const fIni    = of.fecha_inicio ?? "";
                        const fFin    = of.fecha_fin ?? "";
                        const acom    = of.nombreAcomodacion ?? of.acomodacion ?? "";
                        const benef   = of.nombreTipoBeneficio ?? of.tipoBeneficio ?? "";
                        const clasif  = of.nombreClasificacion ?? "";
                        const adul    = of.adultos ?? 0;
                        const nin     = of.ninos ?? 0;
                        const dias    = of.dias ?? 0;
                        const noches  = of.noches ?? 0;
                        const estado  = of.nombreEstado ?? "";
                        const idEst   = String(of.id_tbl_estado_modificacion ?? "");
                        const estColor = idEst === "3" ? "bg-green-100 text-green-700"
                                       : idEst === "2" ? "bg-yellow-100 text-yellow-700"
                                       : "bg-gray-100 text-gray-600";
                        return (
                            <div key={idOf} className="border border-gray-200 rounded-lg p-2.5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-xs font-semibold text-gray-800">{tit}</p>
                                            {estado && (
                                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${estColor}`}>
                                                    {estado}
                                                </span>
                                            )}
                                        </div>
                                        {(acom || benef || clasif) && (
                                            <p className="text-[10px] text-gray-500 mt-1">
                                                {[clasif, benef, acom].filter(Boolean).join(" · ")}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            {(dias > 0 || noches > 0) && (
                                                <span>{dias}D / {noches}N · </span>
                                            )}
                                            {(adul > 0 || nin > 0) && (
                                                <span>{adul} adulto{adul !== 1 ? "s" : ""}{nin > 0 ? `, ${nin} niño${nin !== 1 ? "s" : ""}` : ""}</span>
                                            )}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            {fIni && fFin ? `${fIni} → ${fFin}` : "Sin fechas"}
                                            {precio != null && <> · <span className="text-green-700 font-semibold">${precio}</span></>}
                                            {rack != null && rack > 0 && <> <span className="line-through text-gray-400">${rack}</span></>}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            onClick={() => handleEditar(of)}
                                            disabled={!catalogos}
                                            className="p-1 rounded hover:bg-blue-50 text-blue-600 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                            title={catalogos ? "Editar" : "Cargando catalogos..."}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(idOf)}
                                            className="p-1 rounded hover:bg-red-50 text-red-500"
                                            title="Eliminar">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Sub-componente: formulario de oferta ───────────────────────────────────
const FormularioOferta = ({
    data, catalogos, onChange, onCancelar, onGuardar, msj, msjTipo,
    cargandoOferta,
    catServicios = [],
    serviciosOferta = {},
    abiertosSvc = {},
    toggleServicio,
    updateServicio,
    toggleGrupo,
}) => {
    const upd = (k, v) => onChange({ ...data, [k]: v });
    const cats = catalogos ?? {};
    const clasificaciones = cats.clasificaciones ?? cats.clasificacion ?? [];
    const beneficios      = cats.tiposBeneficio ?? cats.beneficios ?? cats.tipos_beneficio ?? [];
    const acomodaciones   = cats.acomodaciones ?? cats.acomodacion ?? [];
    const empresas        = cats.empresas ?? [];
    const tiposDetalle    = cats.tiposDetalle ?? cats.tipos_detalle ?? [];

    const countSelectedInGrupo = (grupo) => grupo.items.filter(s => !!serviciosOferta[String(s.id_tbl_servicio_smart)]).length;

    return (
        <div className="space-y-2">
            {msj && (msjTipo === "ok" ? <MsgOk txt={msj}/> : <MsgErr txt={msj}/>)}

            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-700">
                    {data.id_oferta > 0 ? "Editar oferta" : "Nueva oferta"}
                </h3>
                <button onClick={onCancelar} className="text-[11px] text-gray-500 hover:text-gray-700">
                    ← Volver al listado
                </button>
            </div>

            <Campo label="Título" requerido>
                <input type="text" className={iCls()} value={data.titulo} onChange={e => upd("titulo", e.target.value)}/>
            </Campo>

            <Campo label="Resumen">
                <textarea className={iCls()} rows={2} value={data.resumen} onChange={e => upd("resumen", e.target.value)}/>
            </Campo>

            <Campo label="Contenido">
                <textarea className={iCls()} rows={3} value={data.contenido} onChange={e => upd("contenido", e.target.value)}/>
            </Campo>

            <div className="grid grid-cols-2 gap-2">
                <Campo label="Keywords">
                    <input type="text" className={iCls()} value={data.keywords} onChange={e => upd("keywords", e.target.value)}/>
                </Campo>
                <Campo label="Código anterior">
                    <input type="text" className={iCls()} value={data.codigo_anterior} onChange={e => upd("codigo_anterior", e.target.value)}/>
                </Campo>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Campo label="Clasificación" requerido>
                    <select className={iCls()} value={data.id_clasificacion} onChange={e => upd("id_clasificacion", e.target.value)}>
                        <option value="">— seleccionar —</option>
                        {clasificaciones.map(c => (
                            <option key={c.id ?? c.id_tbl_clasificacion_oferta} value={c.id ?? c.id_tbl_clasificacion_oferta}>
                                {c.nombre ?? c.nombre_clasificacion_oferta}
                            </option>
                        ))}
                    </select>
                </Campo>
                <Campo label="Beneficio" requerido>
                    <select className={iCls()} value={data.id_beneficio} onChange={e => upd("id_beneficio", e.target.value)}>
                        <option value="">— seleccionar —</option>
                        {beneficios.map(b => (
                            <option key={b.id ?? b.id_tbl_tipo_beneficio_suscripcion} value={b.id ?? b.id_tbl_tipo_beneficio_suscripcion}>
                                {b.nombre ?? b.nombre_tipo_beneficio_suscripcion}
                            </option>
                        ))}
                    </select>
                </Campo>
                <Campo label="Acomodación">
                    <select className={iCls()} value={data.id_acomodacion} onChange={e => upd("id_acomodacion", e.target.value)}>
                        <option value="">— seleccionar —</option>
                        {acomodaciones.map(a => (
                            <option key={a.id ?? a.id_tbl_acomodacion} value={a.id ?? a.id_tbl_acomodacion}>
                                {a.nombre ?? a.nombre_acomodacion}
                            </option>
                        ))}
                    </select>
                </Campo>
            </div>

            <div className="grid grid-cols-4 gap-2">
                <Campo label="Días">
                    <input type="number" min="0" className={iCls()} value={data.dias} onChange={e => upd("dias", Number(e.target.value))}/>
                </Campo>
                <Campo label="Noches">
                    <input type="number" min="0" className={iCls()} value={data.noches} onChange={e => upd("noches", Number(e.target.value))}/>
                </Campo>
                <Campo label="Adultos">
                    <input type="number" min="0" className={iCls()} value={data.adultos} onChange={e => upd("adultos", Number(e.target.value))}/>
                </Campo>
                <Campo label="Niños">
                    <input type="number" min="0" className={iCls()} value={data.ninos} onChange={e => upd("ninos", Number(e.target.value))}/>
                </Campo>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Campo label="Fecha inicio">
                    <input type="date" className={iCls()} value={data.fecha_inicio} onChange={e => upd("fecha_inicio", e.target.value)}/>
                </Campo>
                <Campo label="Fecha fin">
                    <input type="date" className={iCls()} value={data.fecha_fin} onChange={e => upd("fecha_fin", e.target.value)}/>
                </Campo>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Campo label="Costo rack">
                    <input type="number" min="0" step="0.01" className={iCls()} value={data.costo_rack} onChange={e => upd("costo_rack", Number(e.target.value))}/>
                </Campo>
                <Campo label="Precio oferta">
                    <input type="number" min="0" step="0.01" className={iCls()} value={data.precio_oferta} onChange={e => upd("precio_oferta", Number(e.target.value))}/>
                </Campo>
            </div>

            {/* ─── Servicios de la oferta ─── */}
            {data.id_oferta > 0 && (
                <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-700">Servicios incluidos en la oferta</h4>
                        {cargandoOferta && <Spin size={3}/>}
                    </div>
                    {catServicios.length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic px-2 py-3 bg-gray-50 rounded">
                            {cargandoOferta ? "Cargando servicios..." : "No hay servicios en el catalogo."}
                        </p>
                    ) : (
                        <div className="space-y-1.5">
                            {catServicios.map(grupo => {
                                const abierto = !!abiertosSvc[grupo.nombre];
                                const count = countSelectedInGrupo(grupo);
                                return (
                                    <div key={grupo.nombre} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleGrupo?.(grupo.nombre)}
                                            className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <span className="text-[11px] font-semibold text-gray-700">
                                                {grupo.nombre}
                                                {count > 0 && (
                                                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] bg-green-100 text-green-700">{count}</span>
                                                )}
                                            </span>
                                            <svg className={`w-3 h-3 text-gray-400 transition-transform ${abierto ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        {abierto && (
                                            <div className="p-2 space-y-1.5">
                                                {grupo.items.length === 0 ? (
                                                    <p className="text-[10px] text-gray-400 px-2">Sin servicios en este tipo.</p>
                                                ) : grupo.items.map(s => {
                                                    const idServ = String(s.id_tbl_servicio_smart);
                                                    const sel = serviciosOferta[idServ];
                                                    const marcado = !!sel;
                                                    return (
                                                        <div key={idServ} className="">
                                                            <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 rounded px-1.5 py-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={marcado}
                                                                    onChange={() => toggleServicio?.(idServ)}
                                                                    className="w-3.5 h-3.5 accent-green-600 mt-0.5"
                                                                />
                                                                <span className="text-[11px] text-gray-700 flex-1">{s.nombre_servicio_smart}</span>
                                                            </label>
                                                            {marcado && (
                                                                <div className="ml-6 mt-1 grid grid-cols-3 gap-1.5">
                                                                    <select
                                                                        value={sel.id_tbl_tipo_detalle || ""}
                                                                        onChange={e => updateServicio?.(idServ, "id_tbl_tipo_detalle", e.target.value)}
                                                                        className="col-span-1 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-green-300">
                                                                        <option value="">Tipo...</option>
                                                                        {tiposDetalle.map(td => (
                                                                            <option key={td.id_tbl_tipo_detalle} value={td.id_tbl_tipo_detalle}>
                                                                                {td.nombre_tipo_detalle}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        value={sel.detalle_o_comentario || ""}
                                                                        onChange={e => updateServicio?.(idServ, "detalle_o_comentario", e.target.value)}
                                                                        placeholder="Detalle / comentario"
                                                                        className="col-span-2 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-green-300"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {data.id_oferta === 0 && (
                        <p className="text-[10px] text-gray-400 italic mt-1">Guarda la oferta primero para asociar servicios.</p>
                    )}
                </div>
            )}

            {empresas.length > 0 && (
                <Campo label="Empresas">
                    <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                        {empresas.map(emp => {
                            const idEmp = emp.id ?? emp.id_tbl_empresa;
                            const checked = (data.id_empresa ?? []).map(String).includes(String(idEmp));
                            return (
                                <label key={idEmp} className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                            const arr = data.id_empresa ?? [];
                                            const set = new Set(arr.map(String));
                                            if (set.has(String(idEmp))) set.delete(String(idEmp));
                                            else set.add(String(idEmp));
                                            upd("id_empresa", Array.from(set));
                                        }}
                                        className="w-3 h-3 accent-green-600"
                                    />
                                    <span className="text-[11px] text-gray-700">
                                        {emp.nombre ?? emp.nombre_empresa ?? `Empresa ${idEmp}`}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </Campo>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                    onClick={onCancelar}
                    className="text-[11px] text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 font-semibold transition-colors">
                    Cancelar
                </button>
                <button
                    onClick={onGuardar}
                    className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded-lg px-4 py-1.5 transition-colors">
                    {data.id_oferta > 0 ? "Actualizar oferta" : "Crear oferta"}
                </button>
            </div>
        </div>
    );
};

export default TabOfertasEstablecimiento;
