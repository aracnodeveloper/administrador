import React, { useEffect, useRef, useState } from "react";
import {
    guardarPublicidad,
    subirImagenPublicidad,
    getCatalogosPublicidad,
} from "../../../../controllers/publicidad/PublicidadController";
import Alerta from "../../../../global/Alerta";

const URL_FOTOS_BASE = "https://visitaecuador.com/ve/img/contenido/publicidad/";

const hoy = () => new Date().toISOString().slice(0, 10);
const enUnAnio = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
};

// ── Botón de acción (para el trigger) ─────────────────────────────────────────
const BtnAccion = ({ title, onClick, children }) => (
    <button
        onClick={onClick}
        title={title}
        className="p-1.5 rounded-lg text-xs transition-colors bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700"
    >
        {children}
    </button>
);

const AgregarPublicidad = ({ setChange, editar = false, data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandido, setExpandido] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subiendo, setSubiendo] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [alertKey, setAlertKey] = useState(0);
    const fileRef = useRef();

    const [catalogos, setCatalogos] = useState({ objetos: [], tipos_publicidad: [] });

    // Estado del formulario
    const [form, setForm] = useState({
        id_tbl_publicidad_dirigida: 0,
        descripcion: "",
        vinculo: "",
        id_tbl_objeto: "",
        id_tbl_tipo_publicidad: 1,
        id_tbl_lugar: 0,
        id_tbl_usuario_socio: 0,
        fecha_inicio: hoy(),
        fecha_fin: enUnAnio(),
        posicion: 0,
        id_tbl_servicio_web: 1,
        id_tbl_metodo_servicio: 1,
        id_tbl_foto: 0,
        direccion_foto: "",
    });

    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (isOpen) {
            getCatalogosPublicidad().then((c) => {
                if (c) setCatalogos(c);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (editar && data) {
            setForm({
                id_tbl_publicidad_dirigida: data.id_tbl_publicidad_dirigida || 0,
                descripcion: data.descripcion || "",
                vinculo: data.vinculo || "",
                id_tbl_objeto: data.id_tbl_objeto || "",
                id_tbl_tipo_publicidad: data.id_tbl_tipo_publicidad || 1,
                id_tbl_lugar: data.id_tbl_lugar || 0,
                id_tbl_usuario_socio: data.id_tbl_usuario_socio || 0,
                fecha_inicio: data.fecha_inicio || hoy(),
                fecha_fin: data.fecha_fin || enUnAnio(),
                posicion: data.posicion || 0,
                id_tbl_servicio_web: data.id_tbl_servicio_web || 1,
                id_tbl_metodo_servicio: data.id_tbl_metodo_servicio || 1,
                id_tbl_foto: data.id_tbl_foto || 0,
                direccion_foto: data.direccion_foto || "",
            });
        }
    }, [editar, data]);

    const handleChange = (campo, valor) => {
        setForm((p) => ({ ...p, [campo]: valor }));
        if (errores[campo]) setErrores((e) => ({ ...e, [campo]: null }));
    };

    const validar = () => {
        const errs = {};
        if (!form.descripcion || form.descripcion.trim().length < 3)
            errs.descripcion = "Ingrese una descripcion (min 3 caracteres)";
        if (!form.id_tbl_objeto) errs.id_tbl_objeto = "Seleccione tipo de objeto";
        if (!form.fecha_inicio) errs.fecha_inicio = "Requerido";
        if (!form.fecha_fin) errs.fecha_fin = "Requerido";
        if (form.fecha_inicio && form.fecha_fin && form.fecha_inicio > form.fecha_fin)
            errs.fecha_fin = "La fecha fin debe ser mayor que la inicio";
        if (!editar && !form.direccion_foto)
            errs.direccion_foto = "Suba la imagen del banner";
        return errs;
    };

    const subirImagen = async (file) => {
        if (!file) return;
        const tiposOk = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!tiposOk.includes(file.type)) {
            mostrar(false, "Formato no permitido. Use JPG, PNG o WEBP");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            mostrar(false, "El archivo supera 5MB");
            return;
        }
        setSubiendo(true);
        const data = await subirImagenPublicidad(file);
        setSubiendo(false);
        if (data && data.direccion_foto) {
            setForm((p) => ({
                ...p,
                id_tbl_foto: data.id_tbl_foto,
                direccion_foto: data.direccion_foto,
            }));
            mostrar(true, "Imagen cargada correctamente");
            if (errores.direccion_foto) setErrores((e) => ({ ...e, direccion_foto: null }));
        } else {
            mostrar(false, "No se pudo subir la imagen");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const errs = validar();
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        const res = await guardarPublicidad(form);
        setIsLoading(false);

        if (res.ok) {
            mostrar(true, res.msj || "Guardado correctamente");
            setChange?.((prev) => prev + 1);
            cerrarPanel();
        } else {
            mostrar(false, res.msj || "Error al guardar");
        }
    };

    const mostrar = (correcto, mensaje) => {
        setAlerta(
            <Alerta
                key={alertKey}
                correcto={correcto}
                mensaje={mensaje}
                onClose={() => setAlerta(null)}
            />
        );
        setAlertKey((k) => k + 1);
    };

    const cerrarPanel = () => {
        setIsOpen(false);
        setExpandido(false);
        if (!editar) {
            setForm({
                id_tbl_publicidad_dirigida: 0,
                descripcion: "",
                vinculo: "",
                id_tbl_objeto: "",
                id_tbl_tipo_publicidad: 1,
                id_tbl_lugar: 0,
                id_tbl_usuario_socio: 0,
                fecha_inicio: hoy(),
                fecha_fin: enUnAnio(),
                posicion: 0,
                id_tbl_servicio_web: 1,
                id_tbl_metodo_servicio: 1,
                id_tbl_foto: 0,
                direccion_foto: "",
            });
        }
        setErrores({});
    };

    const inputCls = (err) =>
        `w-full rounded-lg border px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 ${
            err ? "border-red-400 bg-red-50" : "border-gray-200"
        }`;

    const previewUrl =
        form.direccion_foto && URL_FOTOS_BASE + form.direccion_foto;

    const panelCls = expandido
        ? "fixed inset-0 z-50 bg-white flex flex-col"
        : "fixed top-0 right-0 h-full z-50 bg-white shadow-2xl border-l border-gray-200 flex flex-col";
    const panelStyle = expandido ? {} : { width: "480px" };

    return (
        <>
            {alerta}
            {editar ? (
                <BtnAccion title="Editar publicidad" onClick={() => setIsOpen(true)}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </BtnAccion>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-4 rounded-lg shadow-sm transition-colors"
                >
                    <span className="text-base leading-none">+</span>
                    Nueva publicidad
                </button>
            )}

            {isOpen && (
                <div className={panelCls} style={panelStyle}>
                    {/* ── Header ──────────────────────────────────────────── */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shrink-0">
                        <button onClick={cerrarPanel}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title="Cerrar panel">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                                {editar ? "Editar publicidad" : "Nueva publicidad"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {editar ? `ID: ${form.id_tbl_publicidad_dirigida}` : "Complete los campos para crear"}
                            </p>
                        </div>

                        {/* Expandir / contraer */}
                        <button onClick={() => setExpandido(v => !v)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title={expandido ? "Panel lateral" : "Pantalla completa"}>
                            {expandido
                                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6"/>
                                  </svg>
                                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                                  </svg>
                            }
                        </button>
                    </div>

                    {/* ── Contenido scrolleable ────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <form onSubmit={onSubmit} className="flex flex-col gap-3">
                            {/* Imagen */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Imagen del banner{" "}
                                    {!editar && <span className="text-red-500">*</span>}
                                </label>
                                <div
                                    className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const f = e.dataTransfer.files?.[0];
                                        if (f) subirImagen(f);
                                    }}
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Banner"
                                            className="max-h-32 mx-auto rounded"
                                        />
                                    ) : subiendo ? (
                                        <div className="flex items-center justify-center gap-2 py-4">
                                            <svg className="w-4 h-4 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            <span className="text-xs text-green-600">Subiendo...</span>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500 py-4">
                                            Clic o arrastra una imagen JPG/PNG/WEBP (max 5MB)
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={(e) => subirImagen(e.target.files?.[0])}
                                />
                                {errores.direccion_foto && (
                                    <p className="text-xs text-red-500 mt-0.5">
                                        {errores.direccion_foto}
                                    </p>
                                )}
                                {form.direccion_foto && (
                                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                                        {form.direccion_foto}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Descripcion <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className={inputCls(errores.descripcion)}
                                        placeholder="Texto descriptivo"
                                        value={form.descripcion}
                                        onChange={(e) => handleChange("descripcion", e.target.value)}
                                    />
                                    {errores.descripcion && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            {errores.descripcion}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Vinculo / URL
                                    </label>
                                    <input
                                        className={inputCls(false)}
                                        placeholder="https://..."
                                        value={form.vinculo}
                                        onChange={(e) => handleChange("vinculo", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Tipo de objeto <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={inputCls(errores.id_tbl_objeto)}
                                        value={form.id_tbl_objeto}
                                        onChange={(e) =>
                                            handleChange("id_tbl_objeto", parseInt(e.target.value) || "")
                                        }
                                    >
                                        <option value="">Seleccione...</option>
                                        {catalogos.objetos.map((o) => (
                                            <option key={o.id} value={o.id}>
                                                {o.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errores.id_tbl_objeto && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            {errores.id_tbl_objeto}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Tipo de publicidad
                                    </label>
                                    <select
                                        className={inputCls(false)}
                                        value={form.id_tbl_tipo_publicidad}
                                        onChange={(e) =>
                                            handleChange(
                                                "id_tbl_tipo_publicidad",
                                                parseInt(e.target.value)
                                            )
                                        }
                                    >
                                        {catalogos.tipos_publicidad.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Fecha inicio <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className={inputCls(errores.fecha_inicio)}
                                        value={form.fecha_inicio}
                                        onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                                    />
                                    {errores.fecha_inicio && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            {errores.fecha_inicio}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Fecha fin <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className={inputCls(errores.fecha_fin)}
                                        value={form.fecha_fin}
                                        onChange={(e) => handleChange("fecha_fin", e.target.value)}
                                    />
                                    {errores.fecha_fin && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            {errores.fecha_fin}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Posicion (orden)
                                    </label>
                                    <input
                                        type="number"
                                        className={inputCls(false)}
                                        value={form.posicion}
                                        onChange={(e) =>
                                            handleChange("posicion", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Id Lugar (opcional)
                                    </label>
                                    <input
                                        type="number"
                                        className={inputCls(false)}
                                        value={form.id_tbl_lugar}
                                        onChange={(e) =>
                                            handleChange("id_tbl_lugar", parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Servicio web
                                    </label>
                                    <input
                                        type="number"
                                        className={inputCls(false)}
                                        value={form.id_tbl_servicio_web}
                                        onChange={(e) =>
                                            handleChange(
                                                "id_tbl_servicio_web",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Metodo servicio
                                    </label>
                                    <input
                                        type="number"
                                        className={inputCls(false)}
                                        value={form.id_tbl_metodo_servicio}
                                        onChange={(e) =>
                                            handleChange(
                                                "id_tbl_metodo_servicio",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Id Usuario Socio (solo banners por socio)
                                    </label>
                                    <input
                                        type="number"
                                        className={inputCls(false)}
                                        value={form.id_tbl_usuario_socio}
                                        onChange={(e) =>
                                            handleChange(
                                                "id_tbl_usuario_socio",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || subiendo}
                                className={`mt-2 w-full py-2 rounded-lg text-white text-sm font-semibold transition-colors ${
                                    isLoading || subiendo
                                        ? "bg-gray-400"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isLoading ? "Guardando..." : editar ? "Actualizar" : "Crear"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AgregarPublicidad;
