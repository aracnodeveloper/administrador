import React, { lazy, Suspense, useState, useEffect } from 'react';
import { verificarPermiso } from '../../global/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuMobile from './MenuMobile';

// Componentes cargados con lazy 
const SubmenuAudiovisuales = lazy(() => import('../Submenu/Audiovisuales/SubmenuAudiovisuales'));
const SubmenuSmart = lazy(() => import('../Submenu/Smart/SubmenuSmart'));
const SubmenuSuscriptores = lazy(() => import('../Submenu/Suscriptores/SubmenuSuscriptores'));
const SubmenuCallcenter = lazy(() => import('../Submenu/Callcenter/SubmenuCallcenter'));
const SubmenuInicio = lazy(() => import('../Submenu/Inicio/SubmenuInicio'));

const session = JSON.parse(localStorage.getItem("datos"));
const nombre = session ? session.data.nombre : "";
const foto = session ? (session.data.fotos ? session.data.fotos.m : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png") : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png";

const Menu = () => {
    const [selMenu, setSelMenu] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    // Lista de menú con sus componentes
    const menuList = [
        {
            "title": "Inicio",
            "path": "/dashboard",
            "menu": <Suspense fallback={<div className="flex flex-col items-center justify-center p-12 w-full"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-3"></div><p className="text-greenVE-600 font-medium animate-pulse text-sm">Cargando Administrador Beta...</p></div>}><SubmenuInicio /></Suspense>
        }



    ];

    // visibilidad de Smart y Suscriptores 
    menuList.push({
        "title": "Suscriptores",
        "path": "/suscriptores",
        "menu": <Suspense fallback={<div className="flex flex-col items-center justify-center p-12 w-full"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-3"></div><p className="text-greenVE-600 font-medium animate-pulse text-sm">Cargando Suscriptores...</p></div>}><SubmenuSuscriptores defaultSubmenu={0} /></Suspense>
    });





    menuList.push({
        "title": "Smart",
        "path": "/smart",
        "menu": <Suspense fallback={<div className="flex flex-col items-center justify-center p-12 w-full"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-3"></div><p className="text-greenVE-600 font-medium animate-pulse text-sm">Cargando Smart...</p></div>}><SubmenuSmart defaultSubmenu={0} /></Suspense>
    });





    menuList.push({
        "title": "Call Center",
        "path": "/call-center",
        "menu": <Suspense fallback={<div className="flex flex-col items-center justify-center p-12 w-full"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-3"></div><p className="text-greenVE-600 font-medium animate-pulse text-sm">Cargando Call Center...</p></div>}><SubmenuCallcenter defaultSubmenu={0} /></Suspense>
    });





    if (verificarPermiso(539) || verificarPermiso(538)) {
        menuList.push({
            "title": "Audiovisuales",
            "path": "/audiovisuales",
            "menu": <Suspense fallback={<div className="flex flex-col items-center justify-center p-12 w-full"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-3"></div><p className="text-greenVE-600 font-medium animate-pulse text-sm">Cargando Audiovisuales...</p></div>}><SubmenuAudiovisuales defaultSubmenu={0} /></Suspense>
        });




    }

    useEffect(() => {
        const index = menuList.findIndex(item => {
            if (item.path === "/dashboard") return currentPath === "/dashboard" || currentPath === "/administrador/" || currentPath === "/administrador" || currentPath === "/";
            return currentPath.includes(item.path);
        });

        if (index !== -1) {
            setSelMenu(index);
        } else if (currentPath.includes("reserva")) {
            const smartIndex = menuList.findIndex(item => item.title === "Smart");
            if (smartIndex !== -1) setSelMenu(smartIndex);
        }
    }, [currentPath, menuList.length]);

    return (
        <>
            <header className="bg-greenVE-500 border-b border-white/20 sticky top-0 z-50 shadow-md">
                <div className="max-w-[1920px] mx-auto flex h-20 px-12 items-center justify-between">
                    {/* Logo Izquierda - Estilo Empresarial */}
                    <div className="flex-shrink-0 cursor-pointer flex items-center h-full" onClick={() => navigate("/")}>
                        <img 
                            src="https://visitaecuador.com/img/web/ve_logo.svg" 
                            className="h-11 w-auto object-contain transition-opacity hover:opacity-80" 
                            alt="logo" 
                        />
                    </div>

                    {/* Menú Central - Pestañas Integradas */}
                    <div className="hidden md:flex flex-grow justify-center h-full">
                        <nav className='flex h-full items-stretch'>
                            {
                                menuList.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`px-8 h-20 text-[13px] font-medium transition-all duration-200 uppercase tracking-wider flex items-center relative group font-sans
                                            ${index === selMenu 
                                                ? "text-white font-bold" 
                                                : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                        onClick={() => {
                                            setSelMenu(index);
                                            navigate(item.path);
                                        }}
                                    >
                                        {item.title}
                                        {/* Indicador de pestaña activo */}
                                        <div className={`absolute bottom-0 left-0 w-full h-1.5 transition-all duration-300
                                            ${index === selMenu ? "bg-white scale-x-100 opacity-100 shadow-[0_-2px_10px_rgba(255,255,255,0.4)]" : "bg-white scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-20"}`}>
                                        </div>
                                    </button>
                                ))
                            }
                        </nav>
                    </div>

                    {/* Menú Mobile */}
                    <div className='md:hidden'>
                        <MenuMobile menuList={menuList} setSelMenu={setSelMenu} selMenu={selMenu} />
                    </div>

                    {/* Perfil Derecha */}
                    <div className='flex items-center justify-end flex-shrink-0'>
                        <div className="flex gap-4 items-center cursor-pointer group px-5 py-2 rounded-2xl hover:bg-white/10 transition-all"
                            onClick={() => { localStorage.removeItem('permisos'); window.open("/", "_self") }}>
                            <div className="flex flex-col items-end leading-none gap-1">
                                <label className="text-[13px] font-bold text-white cursor-pointer group-hover:text-white">{nombre}</label>
                                <label className="text-[10px] font-medium text-white/40 uppercase tracking-widest cursor-pointer group-hover:text-red-300 transition-colors">Salir</label>
                            </div>
                            <img src={foto} className="rounded-full h-11 w-11 border-2 border-white/20 object-cover shadow-lg group-hover:border-white transition-all" alt="profile" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Código original  */}
            {/*<div className='flex justify-between px-5 py-3 bg-greenVE-500'>
                <img className='h-16' src='https://visitaecuador.com/ve/img/diseno/logo_ve.jpg'/>
                <div className='flex flex-col w-20 justify-center items-center'>
                    <span className="icon-[whh--avatar] h-10 w-10 text-gray-400"></span>
                    <div className='flex flex-col'>
                        <label className='text-xs'>Administrador</label>
                        <button className='text-xs text-red-700'>Salir</button>
                    </div>
                </div>
            </div>*/}

            <main className="w-full">
                {selMenu !== null && menuList[selMenu] && menuList[selMenu].menu}
            </main>
        </>
    );
};

export default Menu;
