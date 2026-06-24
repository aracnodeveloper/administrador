import React, { useState, useRef, useEffect } from "react";
import {
    updateEstablecimiento,
    getServiciosEstablecimiento,
    getCatalogoServiciosSmart,
    setServiciosEstablecimiento,
} from "../../../../controllers/establecimientos/EstablecimientosController";
import Config from "../../../../global/config";

const URL_FOTOS_BASE  = "https://visitaecuador.com/ve/img/contenido/informacion/thum500x500/";
const URL_SUBIR_FOTOS = `${Config.URL_SERVICIOS}${Config.VEREST}proxySubirFotos/`;
const URL_ELIM_FOTOS  = "https://visitaecuador.com/ve/views/establecimiento/eliminar_fotografias.php";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const Campo = ({ label, children, requerido }) => (
    <div className="mb-3">
        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
            {label}{requerido && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);
export const iCls = (err = false) =>
    `w-full border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;
export const Spin = ({ size = 4 }) => (
    <svg className={`w-${size} h-${size} animate-spin text-green-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
);
export const MsgOk  = ({ txt }) => <p className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 mb-2">✓ {txt}</p>;
export const MsgErr = ({ txt }) => <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mb-2">{txt}</p>;

// ─── Sub-tab: Info básica ─────────────────────────────────────────────────────
const PanelInfo = ({ data, ciudades, cargandoCiudades, tipos, onGuardado }) => {
    const [nombre,       setNombre]       = useState(data.nombre ?? "");
    const [direccion,    setDireccion]    = useState(data.direccion_establecimiento ?? "");
    const [idCiudad,     setIdCiudad]     = useState(String(data.id_ciudad ?? ""));
    const [idServicio,   setIdServicio]   = useState(String(data.id_tbl_servicio ?? ""));
    const [catalogacion, setCatalogacion] = useState(String(data.catalogacion ?? "0"));
    const [latitud,      setLatitud]      = useState(data.latitud ?? "");
    const [longitud,     setLongitud]     = useState(data.longitud ?? "");
    const [resumen,      setResumen]      = useState(data.resumen ?? "");
    const [keywords,     setKeywords]     = useState(data.keywords ?? "");
    const [loading,      setLoading]      = useState(false);
    const [exito,        setExito]        = useState(false);
    const [errorMsg,     setErrorMsg]     = useState(null);

    const guardar = async () => {
        if (!nombre.trim()) { setErrorMsg("El nombre es obligatorio"); return; }
        setLoading(true); setErrorMsg(null);
        const ok = await updateEstablecimiento({
            id_establecimiento: data.id_tbl_establecimiento,
            nombre, direccion, id_ciudad: idCiudad,
            id_servicio: idServicio, catalogacion,
            latitud, longitud, resumen, keywords,
        });
        setLoading(false);
        if (ok) { setExito(true); setTimeout(() => setExito(false), 3000); onGuardado?.({ nombre, direccion }); }
        else setErrorMsg("No se pudo guardar. Intente nuevamente.");
    };

    return (
        <div>
            <Campo label="Nombre" requerido>
                <input type="text" className={iCls()} value={nombre} onChange={e => setNombre(e.target.value)}/>
            </Campo>
            <Campo label="Tipo de establecimiento">
                <select className={iCls()} value={idServicio} onChange={e => setIdServicio(e.target.value)}>
                    <option value="">Seleccione...</option>
                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
            </Campo>
            <Campo label="Ciudad">
                <select className={iCls()} value={idCiudad} onChange={e => setIdCiudad(e.target.value)} disabled={cargandoCiudades}>
                    <option value="">{cargandoCiudades ? "Cargando..." : "Seleccione..."}</option>
                    {ciudades.map(c => (
                        <option key={c.id_lugar} value={c.id_lugar}>
                            {c.nombre}{c.provincia ? ` — ${c.provincia}` : ""}
                        </option>
                    ))}
                </select>
            </Campo>
            <Campo label="Dirección">
                <input type="text" className={iCls()} value={direccion} onChange={e => setDireccion(e.target.value)}/>
            </Campo>
            <Campo label="Categoría">
                <select className={iCls()} value={catalogacion} onChange={e => setCatalogacion(e.target.value)}>
                    <option value="0">Sin categoría</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
            </Campo>
            <div className="grid grid-cols-2 gap-2">
                <Campo label="Latitud">
                    <input type="number" step="0.000001" className={iCls()} value={latitud} onChange={e => setLatitud(e.target.value)} placeholder="-2.123456"/>
                </Campo>
                <Campo label="Longitud">
                    <input type="number" step="0.000001" className={iCls()} value={longitud} onChange={e => setLongitud(e.target.value)} placeholder="-79.123456"/>
                </Campo>
            </div>
            <Campo label="Descripción">
                <textarea rows={3} className={iCls()} value={resumen} onChange={e => setResumen(e.target.value)}/>
            </Campo>
            <Campo label="Keywords (SEO)">
                <input type="text" className={iCls()} value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="hotel, playa, ecuador"/>
            </Campo>
            {errorMsg && <MsgErr txt={errorMsg}/>}
            {exito    && <MsgOk  txt="Guardado correctamente"/>}
            <button onClick={guardar} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                {loading ? <><Spin size={3}/> Guardando...</> : "Guardar cambios"}
            </button>
        </div>
    );
};

// ─── Sub-tab: Galería ─────────────────────────────────────────────────────────
const PanelGaleria = ({ galeria: gi, idInfoIndice, onGaleriaChange }) => {
    const [galeria,    setGaleria]    = useState(gi ?? []);
    const [subiendo,   setSubiendo]   = useState(false);
    const [eliminando, setEliminando] = useState(null);
    const [exito,      setExito]      = useState(null);
    const [error,      setError]      = useState(null);
    const fileRef = useRef();
    const ok = msg => { setExito(msg); setTimeout(() => setExito(null), 3000); };

    const subirFotos = async (files) => {
        if (!files?.length) return;
        setSubiendo(true); setError(null);
        try {
            const fd = new FormData();
            Array.from(files).forEach(f => fd.append('file[]', f));
            fd.append('db', 'true');
            fd.append('id_tbl_info_indice', idInfoIndice);
            fd.append('tipo', '4');
            fd.append('url', '');
            const res  = await fetch(URL_SUBIR_FOTOS, { method: 'POST', body: fd });
            const data = await res.json();
            if (data?.ids?.length > 0) {
                const nuevas = data.ids.map(i => ({
                    id_foto: i.idFoto, direccion_foto: i.nombre,
                    url: i.urlAbsoluto ?? URL_FOTOS_BASE + i.nombre,
                    descripcion: "", esPrincipal: false,
                }));
                const nueva = [...galeria, ...nuevas];
                setGaleria(nueva); ok(`${nuevas.length} foto(s) subida(s)`); onGaleriaChange?.(nueva);
            } else {
                setError("No se pudieron subir. Verifica el formato JPG/PNG.");
            }
        } catch { setError("Error al subir. Verifica CORS en visitaecuador.com."); }
        finally { setSubiendo(false); if (fileRef.current) fileRef.current.value = ''; }
    };

    const eliminarFoto = async (foto) => {
        if (!window.confirm("¿Eliminar esta foto definitivamente?")) return;
        setEliminando(foto.id_foto); setError(null);
        try {
            const fd = new FormData();
            fd.append('id_foto', foto.id_foto);
            fd.append('tipo_foto', '2');
            fd.append('identificacion', idInfoIndice);
            const res  = await fetch(URL_ELIM_FOTOS, { method: 'POST', body: fd });
            const data = await res.json();
            if (data?.estado) {
                const nueva = galeria.filter(f => f.id_foto !== foto.id_foto);
                setGaleria(nueva); ok("Foto eliminada"); onGaleriaChange?.(nueva);
            } else { setError(data?.msj ?? "No se pudo eliminar"); }
        } catch { setError("Error al eliminar. Verifica CORS."); }
        finally { setEliminando(null); }
    };

    return (
        <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors mb-3"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); subirFotos(e.dataTransfer.files); }}>
                {subiendo
                    ? <div className="flex items-center justify-center gap-2 text-green-600"><Spin size={4}/><span className="text-xs">Subiendo...</span></div>
                    : <>
                        <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p className="text-xs text-gray-500">Clic o arrastra fotos</p>
                        <p className="text-[10px] text-gray-400">JPG/PNG · Máx. 10</p>
                    </>
                }
            </div>
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png" className="hidden" onChange={e => subirFotos(e.target.files)}/>
            {exito && <MsgOk txt={exito}/>}
            {error && <MsgErr txt={error}/>}
            {galeria.length === 0
                ? <p className="text-center text-xs text-gray-400 py-6">Sin fotografías</p>
                : <div className="grid grid-cols-2 gap-2">
                    {galeria.map(foto => (
                        <div key={foto.id_foto} className={`relative rounded-lg overflow-hidden border ${foto.esPrincipal ? "border-green-400 ring-2 ring-green-300" : "border-gray-200"}`}>
                            <img src={foto.url ?? URL_FOTOS_BASE + foto.direccion_foto} alt=""
                                className="w-full h-24 object-cover"
                                onError={e => { e.target.src = "https://visitaecuador.com/ve/img/iconos/hotel.png"; }}/>
                            {foto.esPrincipal && (
                                <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">Principal</span>
                            )}
                            <button onClick={() => eliminarFoto(foto)} disabled={eliminando === foto.id_foto}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors">
                                {eliminando === foto.id_foto
                                    ? <Spin size={3}/>
                                    : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                                      </svg>
                                }
                            </button>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

// ─── Sub-tab: Contactos ───────────────────────────────────────────────────────
const TIPOS_CONT = [
    { id: 1,  label: "Email" },
    { id: 3,  label: "Teléfono" },
    { id: 14, label: "WhatsApp" },
    { id: 5,  label: "Web" },
];
const PanelContactos = ({ contactos }) => {
    const mapa = {};
    (contactos ?? []).forEach(c => { mapa[c.tipo] = c.contacto; });
    return (
        <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-700 mb-2">
                Los contactos se gestionan desde el panel del establecimiento en el portal.
            </div>
            {TIPOS_CONT.map(t => (
                <Campo key={t.id} label={t.label}>
                    <input type="text" className={iCls() + " bg-gray-50 text-gray-500"}
                        value={mapa[t.id] ?? ""} readOnly placeholder="Sin datos"/>
                </Campo>
            ))}
        </div>
    );
};

// ─── Sub-tab: Servicios ──────────────────────────────────────────────────────
const PanelServicios = ({ idEstablecimiento, onGuardado }) => {
    const [cargando,      setCargando]      = useState(true);
    const [guardando,     setGuardando]     = useState(false);
    const [catalogo,      setCatalogo]      = useState([]);   // [{id, nombre, servicios:[{id, nombre}]}]
    const [seleccionados, setSeleccionados] = useState({});   // { id_servicio: true }
    const [detalles,      setDetalles]      = useState({});   // { id_servicio: "texto extra" }
    const [abiertos,      setAbiertos]      = useState({});   // { id_tipo: true }
    const [msj,           setMsj]           = useState("");
    const [msjTipo,       setMsjTipo]       = useState("ok"); // ok | err

    // Carga inicial: catalogo + servicios actuales del establecimiento
    useEffect(() => {
        if (!idEstablecimiento) return;
        let cancelado = false;
        setCargando(true);
        Promise.all([
            getCatalogoServiciosSmart(),
            getServiciosEstablecimiento(idEstablecimiento),
        ]).then(([cat, mios]) => {
            if (cancelado) return;
            // catalogo viene como { tipos: [...] }
            const tipos = cat?.tipos ?? cat?.data?.tipos ?? [];
            setCatalogo(tipos);
            // abrir todos los tipos por defecto
            const open = {};
            tipos.forEach(t => { open[String(t.id ?? t.id_tbl_tipo_servicio_smart)] = true; });
            setAbiertos(open);

            // mios viene como
            //   { servicios_seleccionados: { tipoNombre: [ids] }, detalle: { id: "texto" }, servicios_extra: {...} }
            // (con fallback a las claves legacy seleccionados / detalles)
            const sel = {};
            const det = {};
            if (mios) {
                const selRaw = mios.servicios_seleccionados ?? mios.seleccionados ?? {};
                Object.values(selRaw).forEach(arr => {
                    (arr ?? []).forEach(id => { sel[String(id)] = true; });
                });
                const detRaw = mios.detalle ?? mios.detalles ?? {};
                Object.entries(detRaw).forEach(([k, v]) => { det[String(k)] = v ?? ""; });
            }
            setSeleccionados(sel);
            setDetalles(det);
            setCargando(false);
        }).catch(() => {
            if (!cancelado) {
                setMsj("No se pudo cargar el catalogo de servicios.");
                setMsjTipo("err");
                setCargando(false);
            }
        });
        return () => { cancelado = true; };
    }, [idEstablecimiento]);

    const toggleTipo = (idTipo) => {
        setAbiertos(prev => ({ ...prev, [idTipo]: !prev[idTipo] }));
    };

    const toggleServicio = (idServicio) => {
        setSeleccionados(prev => {
            const nuevo = { ...prev };
            if (nuevo[idServicio]) delete nuevo[idServicio];
            else nuevo[idServicio] = true;
            return nuevo;
        });
    };

    const setDetalle = (idServicio, texto) => {
        setDetalles(prev => ({ ...prev, [idServicio]: texto }));
    };

    const guardar = async () => {
        setGuardando(true);
        setMsj("");
        // Construir payload: { "29": 1, "67": 1, ... } solo de los marcados
        const id_servicios = {};
        Object.keys(seleccionados).forEach(id => {
            if (seleccionados[id]) id_servicios[id] = 1;
        });
        const extra = {};
        Object.entries(detalles).forEach(([id, v]) => {
            if (id_servicios[id] && v != null && String(v).trim() !== "") {
                extra[id] = String(v);
            }
        });
        const ok = await setServiciosEstablecimiento({
            id_establecimiento: idEstablecimiento,
            id_servicios,
            extra,
        });
        setGuardando(false);
        if (ok) {
            setMsj("Servicios actualizados correctamente.");
            setMsjTipo("ok");
            onGuardado?.();
        } else {
            setMsj("No se pudo guardar. Intenta de nuevo.");
            setMsjTipo("err");
        }
    };

    if (cargando) {
        return (
            <div className="flex items-center justify-center h-32 gap-2 text-gray-400">
                <Spin size={5}/><span className="text-xs">Cargando servicios...</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {msj && (msjTipo === "ok" ? <MsgOk txt={msj}/> : <MsgErr txt={msj}/>)}

            {catalogo.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-6">
                    No hay servicios disponibles en el catalogo SMART.
                </p>
            ) : (
                <div className="space-y-2">
                    {catalogo.map(tipo => {
                        const idTipo = String(tipo.id ?? tipo.id_tbl_tipo_servicio_smart);
                        const abierto = !!abiertos[idTipo];
                        const servicios = tipo.servicios ?? [];
                        const marcadosEnTipo = servicios.filter(s => seleccionados[String(s.id ?? s.id_tbl_servicio_smart)]).length;
                        return (
                            <div key={idTipo} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleTipo(idTipo)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <span className="text-xs font-semibold text-gray-700">
                                        {tipo.nombre ?? tipo.nombre_tipo_servicio_smart}
                                        {marcadosEnTipo > 0 && (
                                            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700">
                                                {marcadosEnTipo}
                                            </span>
                                        )}
                                    </span>
                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${abierto ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                {abierto && (
                                    <div className="p-2 space-y-1.5">
                                        {servicios.length === 0 ? (
                                            <p className="text-[11px] text-gray-400 px-2">Sin servicios en este tipo.</p>
                                        ) : servicios.map(s => {
                                            const idServ = String(s.id ?? s.id_tbl_servicio_smart);
                                            const marcado = !!seleccionados[idServ];
                                            return (
                                                <div key={idServ} className="flex items-start gap-2">
                                                    <label className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 rounded px-1.5 py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={marcado}
                                                            onChange={() => toggleServicio(idServ)}
                                                            className="w-3.5 h-3.5 accent-green-600"
                                                        />
                                                        <span className="text-[11px] text-gray-700">{s.nombre ?? s.nombre_servicio_smart}</span>
                                                    </label>
                                                    {marcado && (
                                                        <input
                                                            type="text"
                                                            value={detalles[idServ] ?? ""}
                                                            onChange={e => setDetalle(idServ, e.target.value)}
                                                            placeholder="Detalle opcional"
                                                            className="w-40 border border-gray-200 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-green-300"
                                                        />
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

            <div className="flex justify-end pt-2 sticky bottom-0 bg-white">
                <button
                    onClick={guardar}
                    disabled={guardando}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                    {guardando && <Spin size={3}/>}
                    {guardando ? "Guardando..." : "Guardar servicios"}
                </button>
            </div>
        </div>
    );
};

// ─── Tab Info: orquesta los 4 sub-tabs ───────────────────────────────────────
const TabBtn = ({ label, activo, onClick }) => (
    <button onClick={onClick}
        className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${activo ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
        {label}
    </button>
);

const TabInfoEstablecimiento = ({ detalle, ciudades, cargandoCiudades, tipos, onGuardado, onGaleriaChange }) => {
    const [subTab, setSubTab] = useState("info");
    const idEst = detalle?.establecimiento?.id_tbl_establecimiento;
    return (
        <div>
            <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                <TabBtn label="Datos"     activo={subTab === "info"}       onClick={() => setSubTab("info")}/>
                <TabBtn label="Galería"   activo={subTab === "galeria"}    onClick={() => setSubTab("galeria")}/>
                <TabBtn label="Contactos" activo={subTab === "contactos"}  onClick={() => setSubTab("contactos")}/>
                <TabBtn label="Servicios" activo={subTab === "servicios"}  onClick={() => setSubTab("servicios")}/>
            </div>
            {subTab === "info" && (
                <PanelInfo
                    data={detalle.establecimiento}
                    ciudades={ciudades}
                    cargandoCiudades={cargandoCiudades}
                    tipos={tipos}
                    onGuardado={onGuardado}
                />
            )}
            {subTab === "galeria" && (
                <PanelGaleria
                    galeria={detalle.galeria}
                    idInfoIndice={detalle.id_info_indice}
                    onGaleriaChange={onGaleriaChange}
                />
            )}
            {subTab === "contactos" && (
                <PanelContactos contactos={detalle.contactos}/>
            )}
            {subTab === "servicios" && (
                <PanelServicios idEstablecimiento={idEst}/>
            )}
        </div>
    );
};

export default TabInfoEstablecimiento;