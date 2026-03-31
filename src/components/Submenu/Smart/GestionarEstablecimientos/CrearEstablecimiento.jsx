import React, { useState, useEffect } from "react";
import {
    getPaises,
    getCiudades,
    crearEstablecimiento,
    getTiposEstablecimiento
} from "../../../../controllers/establecimientos/EstablecimientosController";

const TIPOS_FALLBACK = [
    { id: 97,  nombre: "Albergues" },
    { id: 98,  nombre: "Apartamento Hotel" },
    { id: 112, nombre: "Apartamentos Turísticos" },
    { id: 6,   nombre: "Cabañas" },
    { id: 461, nombre: "Campamento turístico" },
    { id: 454, nombre: "Casa" },
    { id: 458, nombre: "Chalet Boutique" },
    { id: 11,  nombre: "Comida Rápida" },
    { id: 225, nombre: "Complejo Turístico" },
    { id: 455, nombre: "Departamento" },
    { id: 277, nombre: "Eco Lodge" },
    { id: 145, nombre: "Hacienda" },
    { id: 19,  nombre: "Hospedaje Estudiantil" },
    { id: 20,  nombre: "Hospedaje Familiar" },
    { id: 22,  nombre: "Hostal Residencial" },
    { id: 21,  nombre: "Hostales" },
    { id: 23,  nombre: "Hosterías" },
    { id: 24,  nombre: "Hotel Apartamento" },
    { id: 25,  nombre: "Hoteles" },
    { id: 87,  nombre: "Hoteles Residenciales" },
    { id: 26,  nombre: "Moteles" },
    { id: 27,  nombre: "Paradores" },
    { id: 28,  nombre: "Pensiones" },
    { id: 457, nombre: "Quinta" },
    { id: 196, nombre: "Residencial" },
    { id: 376, nombre: "Resort" },
    { id: 30,  nombre: "Restaurantes" },
    { id: 424, nombre: "SPA" },
    { id: 92,  nombre: "Tours" },
    { id: 460, nombre: "Villa" },
];

const PASOS = ["Propietario", "Establecimiento", "Contacto"];

const StepIndicator = ({ actual }) => (
    <div className="flex items-center justify-center gap-0 mb-6">
        {PASOS.map((label, i) => (
            <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i < actual  ? "bg-green-600 text-white" :
                        i === actual ? "bg-green-700 text-white ring-2 ring-green-300" :
                        "bg-gray-200 text-gray-400"
                    }`}>
                        {i < actual ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium ${i === actual ? "text-green-700" : "text-gray-400"}`}>
                        {label}
                    </span>
                </div>
                {i < PASOS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-1 mb-4 ${i < actual ? "bg-green-600" : "bg-gray-200"}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);

const Campo = ({ label, error, children, requerido }) => (
    <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1">
            {label} {requerido && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
);

const inputCls = (err) =>
    `w-full border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 ${
        err ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

const CrearEstablecimiento = () => {
    const [paso, setPaso]           = useState(0);
    const [loading, setLoading]     = useState(false);
    const [exito, setExito]         = useState(false);
    const [errores, setErrores]     = useState({});
    const [errorGlobal, setErrorGlobal] = useState(null);

    const [tiposEstablecimiento, setTiposEstablecimiento] = useState(TIPOS_FALLBACK);
    const [paises, setPaises]             = useState([]);
    const [ciudades, setCiudades]         = useState([]);
    const [cargandoCiudades, setCargandoCiudades] = useState(false);

    // Paso 0
    const [usuario, setUsuario]     = useState("");
    const [pass, setPass]           = useState("");
    const [nombres, setNombres]     = useState("");
    const [telefono, setTelefono]   = useState("");

    // Paso 1
    const [tipoEst, setTipoEst]     = useState("");
    const [nombreEst, setNombreEst] = useState("");
    const [identificacion, setIdentificacion] = useState("");
    const [habitaciones, setHabitaciones] = useState("");
    const [pais, setPais]           = useState("");
    const [ciudad, setCiudad]       = useState("");
    const [direccion, setDireccion] = useState("");

    // Paso 2
    const [emailReserva, setEmailReserva] = useState("");
    const [whatsapp, setWhatsapp]   = useState("");
    const [telReserva, setTelReserva] = useState("");
    const [web, setWeb]             = useState("");

    useEffect(() => {
        getTiposEstablecimiento().then(data => {
            if (data && data.length > 0) setTiposEstablecimiento(data);
        });
        getPaises().then(data => {
            if (data?.paises) setPaises(data.paises);
        });
    }, []);

    useEffect(() => {
        if (!pais) { setCiudades([]); setCiudad(""); return; }
        setCargandoCiudades(true);
        // getCiudades ya devuelve el array aplanado desde el controller
        getCiudades(pais).then(data => {
            if (data && data.length > 0) setCiudades(data);
            else setCiudades([]);
            setCargandoCiudades(false);
        });
    }, [pais]);

    const validarPaso0 = () => {
        const errs = {};
        if (!usuario || usuario.trim().length < 3)
            errs.usuario = "Ingrese un usuario (mínimo 3 caracteres)";
        if (!pass || pass.length < 6 || pass.length > 15)
            errs.pass = "Debe tener entre 6 y 15 caracteres";
        else if (!/[a-z]/.test(pass)) errs.pass = "Debe tener al menos una minúscula";
        else if (!/[A-Z]/.test(pass)) errs.pass = "Debe tener al menos una mayúscula";
        else if (!/[0-9]/.test(pass)) errs.pass = "Debe tener al menos un número";
        if (!nombres) errs.nombres = "Ingrese nombres y apellidos";
        if (!telefono || telefono.length < 7) errs.telefono = "Ingrese un teléfono válido";
        return errs;
    };

    const validarPaso1 = () => {
        const errs = {};
        if (!tipoEst) errs.tipoEst = "Seleccione el tipo de establecimiento";
        if (!nombreEst) errs.nombreEst = "Ingrese el nombre del establecimiento";
        if (!pais) errs.pais = "Seleccione un país";
        if (!ciudad) errs.ciudad = "Seleccione una ciudad";
        if (!direccion) errs.direccion = "Ingrese la dirección";
        return errs;
    };

    const validarPaso2 = () => {
        const errs = {};
        if (!emailReserva || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailReserva))
            errs.emailReserva = "Ingrese un email válido";
        if (!whatsapp || whatsapp.length < 7) errs.whatsapp = "Ingrese un WhatsApp válido";
        if (!telReserva || telReserva.length < 7) errs.telReserva = "Ingrese un teléfono válido";
        return errs;
    };

    const avanzar = async () => {
        let errs = {};
        if (paso === 0) errs = validarPaso0();
        if (paso === 1) errs = validarPaso1();
        if (paso === 2) errs = validarPaso2();
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;
        if (paso < 2) { setPaso(p => p + 1); return; }

        setLoading(true);
        setErrorGlobal(null);
        const payload = {
            email:       usuario,
            pass,
            nombres,
            telefono,
            id_servicio: 1,
            establecimiento: [{
                id_servicio:   parseInt(tipoEst),
                nombre:        nombreEst,
                identificacion,
                cantidad:      habitaciones,
                id_lugar:      parseInt(ciudad),
                id_genero:     3,
                direccion,
                contacto: {
                    1:  [emailReserva],
                    3:  [telReserva],
                    5:  web ? [web] : [],
                    14: [whatsapp],
                }
            }]
        };

        const res = await crearEstablecimiento(payload);
        setLoading(false);
        if (res) setExito(true);
        else setErrorGlobal("No se pudo crear el establecimiento. Verifique los datos e intente nuevamente.");
    };

    const retroceder = () => { setErrores({}); setPaso(p => p - 1); };

    const resetForm = () => {
        setExito(false); setPaso(0); setErrores({}); setErrorGlobal(null);
        setUsuario(""); setPass(""); setNombres(""); setTelefono("");
        setTipoEst(""); setNombreEst(""); setIdentificacion("");
        setHabitaciones(""); setPais(""); setCiudad(""); setDireccion("");
        setEmailReserva(""); setWhatsapp(""); setTelReserva(""); setWeb("");
    };

    if (exito) return (
        <div className="flex-1 p-6 flex items-center justify-center">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-base font-bold text-gray-800 mb-2">¡Establecimiento creado!</h2>
                <p className="text-xs text-gray-500 mb-1">Se ha enviado un email de confirmación al establecimiento.</p>
                <p className="text-xs text-gray-400 mb-6">El establecimiento quedará en estado pendiente hasta su verificación.</p>
                <button onClick={resetForm} className="px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors">
                    Crear otro establecimiento
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-4 w-full">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-800">Crear Establecimiento</h2>
                <p className="text-xs text-gray-400">Registra un nuevo establecimiento en el sistema</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full">
                <StepIndicator actual={paso} />

                {errorGlobal && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorGlobal}
                    </div>
                )}

                {paso === 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Datos del propietario / acceso</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Campo label="Usuario - Email" error={errores.usuario} requerido>
                                <input type="text" className={inputCls(errores.usuario)} placeholder="usuario o correo@ejemplo.com" value={usuario} onChange={e => setUsuario(e.target.value)} />
                            </Campo>
                            <Campo label="Contraseña" error={errores.pass} requerido>
                                <input type="text" className={inputCls(errores.pass)} placeholder="Mín. 6 car., 1 mayús., 1 núm." value={pass} onChange={e => setPass(e.target.value)} />
                            </Campo>
                            <Campo label="Nombres y apellidos" error={errores.nombres} requerido>
                                <input type="text" className={inputCls(errores.nombres)} placeholder="Nombre Apellido" value={nombres} onChange={e => setNombres(e.target.value)} />
                            </Campo>
                            <Campo label="Teléfono de contacto" error={errores.telefono} requerido>
                                <input type="tel" className={inputCls(errores.telefono)} placeholder="Ej: 0999999999" value={telefono} onChange={e => setTelefono(e.target.value)} />
                            </Campo>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Si ya tienes una cuenta, se usarán tus datos existentes y se agregará el nuevo establecimiento.</p>
                    </div>
                )}

                {paso === 1 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Información del establecimiento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Campo label="Tipo de establecimiento" error={errores.tipoEst} requerido>
                                <select className={inputCls(errores.tipoEst)} value={tipoEst} onChange={e => setTipoEst(e.target.value)}>
                                    <option value="">Seleccione...</option>
                                    {tiposEstablecimiento.map(t => (
                                        <option key={t.id} value={t.id}>{t.nombre}</option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Nombre del establecimiento" error={errores.nombreEst} requerido>
                                <input type="text" className={inputCls(errores.nombreEst)} placeholder="Nombre comercial" value={nombreEst} onChange={e => setNombreEst(e.target.value)} />
                            </Campo>
                            <Campo label="RUC / Identificación">
                                <input type="text" className={inputCls(false)} placeholder="Número de registro o RUC" value={identificacion} onChange={e => setIdentificacion(e.target.value)} />
                            </Campo>
                            <Campo label="Número de habitaciones">
                                <input type="number" min="1" max="500" className={inputCls(false)} placeholder="Ej: 20" value={habitaciones} onChange={e => setHabitaciones(e.target.value)} />
                            </Campo>
                            <Campo label="País" error={errores.pais} requerido>
                                <select className={inputCls(errores.pais)} value={pais} onChange={e => { setPais(e.target.value); setCiudad(""); }}>
                                    <option value="">{paises.length === 0 ? "Cargando..." : "Seleccione país..."}</option>
                                    {paises.map(p => (
                                        <option key={p.id_lugar} value={p.id_lugar}>{p.nombre}</option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Ciudad" error={errores.ciudad} requerido>
                                <select
                                    className={inputCls(errores.ciudad)}
                                    value={ciudad}
                                    onChange={e => setCiudad(e.target.value)}
                                    disabled={!pais || cargandoCiudades}
                                >
                                    <option value="">
                                        {!pais ? "Seleccione primero un país" : cargandoCiudades ? "Cargando..." : ciudades.length === 0 ? "Sin ciudades disponibles" : "Seleccione ciudad..."}
                                    </option>
                                    {ciudades.map(c => (
                                        // id_lugar viene del aplanado en el controller
                                        <option key={c.id_lugar} value={c.id_lugar}>
                                            {c.nombre}{c.provincia ? ` — ${c.provincia}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                        </div>
                        <Campo label="Dirección" error={errores.direccion} requerido>
                            <textarea rows={2} className={inputCls(errores.direccion)} placeholder="Dirección completa y referencias" value={direccion} onChange={e => setDireccion(e.target.value)} />
                        </Campo>
                    </div>
                )}

                {paso === 2 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Datos de contacto del establecimiento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Campo label="Email de reservas" error={errores.emailReserva} requerido>
                                <input type="email" className={inputCls(errores.emailReserva)} placeholder="reservas@establecimiento.com" value={emailReserva} onChange={e => setEmailReserva(e.target.value)} />
                            </Campo>
                            <Campo label="WhatsApp (con código de país)" error={errores.whatsapp} requerido>
                                <input type="tel" className={inputCls(errores.whatsapp)} placeholder="Ej: 593 999 999 999" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                            </Campo>
                            <Campo label="Teléfono de reservas" error={errores.telReserva} requerido>
                                <input type="tel" className={inputCls(errores.telReserva)} placeholder="Ej: 072999999" value={telReserva} onChange={e => setTelReserva(e.target.value)} />
                            </Campo>
                            <Campo label="Página web">
                                <input type="text" className={inputCls(false)} placeholder="https://mipagina.com" value={web} onChange={e => setWeb(e.target.value)} />
                            </Campo>
                        </div>
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                            <strong>Nota:</strong> Una vez creado, el establecimiento quedará en estado pendiente hasta su verificación.
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                    <button
                        onClick={retroceder}
                        disabled={paso === 0 || loading}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${paso === 0 ? "text-gray-300 cursor-default" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={avanzar}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Procesando...
                            </>
                        ) : paso < 2 ? "Siguiente →" : "Crear Establecimiento"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrearEstablecimiento;