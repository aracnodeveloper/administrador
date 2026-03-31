import React, { useState, useRef } from "react";
import { updateEstablecimiento } from "../../../../controllers/establecimientos/EstablecimientosController";
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

// ─── Tab Info: orquesta los 3 sub-tabs ───────────────────────────────────────
const TabBtn = ({ label, activo, onClick }) => (
    <button onClick={onClick}
        className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${activo ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
        {label}
    </button>
);

const TabInfoEstablecimiento = ({ detalle, ciudades, cargandoCiudades, tipos, onGuardado, onGaleriaChange }) => {
    const [subTab, setSubTab] = useState("info");
    return (
        <div>
            <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                <TabBtn label="Datos"     activo={subTab === "info"}      onClick={() => setSubTab("info")}/>
                <TabBtn label="Galería"   activo={subTab === "galeria"}   onClick={() => setSubTab("galeria")}/>
                <TabBtn label="Contactos" activo={subTab === "contactos"} onClick={() => setSubTab("contactos")}/>
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
        </div>
    );
};

export default TabInfoEstablecimiento;