import React, { lazy, Suspense, useState, useEffect } from 'react';
import { verificarPermiso } from '../../global/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuMobile from './MenuMobile';

// Componentes originales cargados con lazy 
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

    // visibilidad de Smart y Suscriptores para que funcione 
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
            <header className="bg-greenVE-500">
                <div className="flex py-2 px-4 items-center md:items-end">
                    <div className="w-3/12 md:w-2/12 flex cursor-pointer">
                        <img src="https://visitaecuador.com/img/web/ve_logo.svg" style={{ width: "110px", height: "auto" }} alt="logo" />
                    </div>
                    {
                        window.innerWidth < 768
                            ? <div className='w-3/12'>
                                <MenuMobile menuList={menuList} setSelMenu={setSelMenu} selMenu={selMenu} />
                            </div>
                            : <div className='h-8 w-full bg-greenVE-500 px-4 py-1 mb-5'>
                                {
                                    menuList.map((item, index) => (
                                        <button
                                            key={index}
                                            className={`border px-4 ${index === selMenu ? "bg-white text-greenVE-500 font-bold" : "text-white hover:bg-greenVE-600"}`}
                                            onClick={() => {
                                                setSelMenu(index);
                                                navigate(item.path);
                                            }}
                                        >
                                            {item.title}
                                        </button>
                                    ))
                                }
                            </div>
                    }
                    <div className='flex md:h-[75px] items-start w-6/12 md:w-3/12'>
                        <div className="flex gap-2 items-center cursor-pointer hover:bg-white hover:bg-opacity-20 hover:rounded-md p-1"
                            onClick={() => { localStorage.removeItem('permisos'); window.open("/", "_self") }}>
                            <img src={foto} className="rounded-full h-10 w-10 border-2 md:block" alt="profile" />
                            <div className="flex flex-col">
                                <label className="font-semibold text-white cursor-pointer">{nombre}</label>
                                <label className="capitalize text-xs text-white cursor-pointer">Salir</label>
                            </div>
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
