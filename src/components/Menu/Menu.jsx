import React, { lazy, Suspense, useState } from 'react';
import { verificarPermiso } from '../../global/utils';
import { useLocation } from 'react-router-dom';
import Config from '../../global/config';
import MenuMobile from './MenuMobile';

const SubmenuAudiovisuales = lazy(() => import('../Submenu/Audiovisuales/SubmenuAudiovisuales'));
const SubmenuSmart = lazy(() => import('../Submenu/Smart/SubmenuSmart'));
const SubmenuSuscriptores = lazy(() => import('../Submenu/Suscriptores/SubmenuSuscriptores'));
const SubmenuCallcenter = lazy(() => import('../Submenu/Callcenter/SubmenuCallcenter'));

const session = JSON.parse(localStorage.getItem("datos"));
const nombre = session ? session.data.nombre : "";
const foto = session ? (session.data.fotos ? session.data.fotos.m : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png") : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png";

var menuList = [
    {
        "title": "Inicio",
        "menu": <div>Menu Inicio</div>
    }
]
verificarPermiso(539) && menuList.push(
    {
        "title": "Audiovisuales",
        "menu": <Suspense><SubmenuAudiovisuales /></Suspense>
    }
)
verificarPermiso(103) && menuList.push(
    {
        "title": "Suscriptores",
        "menu": <Suspense><SubmenuSuscriptores /></Suspense>
    }
)
verificarPermiso(17) && menuList.push(
    {
        "title": "Smart",
        "menu": <Suspense><SubmenuSmart /></Suspense>
    }
)

menuList.push(
    {
        "title": "Call Center",
        "menu": <Suspense><SubmenuCallcenter /></Suspense>
    }
)

const Menu = () => {
    const [selMenu, setSelMenu] = useState();
    const location = useLocation();
    const currentPath = location.pathname;
    useState(() => {
        if (currentPath.includes("reserva")) {
            setSelMenu(menuList.findIndex(item => item.title === "Smart"))
        }
    }, [])
    return (
        <>
            <header className="bg-greenVE-500">
                <div className="flex py-2 px-4 items-center md:items-end">
                    <div className="w-3/12 md:w-2/12 flex cursor-pointer">
                        <img src="https://visitaecuador.com/img/web/ve_logo.svg" style={{ width: "110px", height: "auto" }} />
                    </div>
                    {
                        window.innerWidth < 768
                            ? <div className='w-3/12'>
                                <MenuMobile  menuList={menuList} setSelMenu={setSelMenu} selMenu={selMenu}/>
                            </div>
                            : <div className='h-8 w-full bg-greenVE-500 px-4 py-1 '>
                                {
                                    menuList.map((item, index) => (
                                        <button className={` border ${index == 0 ? "rounded-l-full" : index == (menuList.length - 1) ? "rounded-r-full" : ""}  px-4 ${index == selMenu ? "bg-white text-greenVE-500" : "text-white hover:bg-greenVE-600"}`} onClick={() => setSelMenu(index)}>{item.title}</button>
                                    ))
                                }
                            </div>
                    }
                    <div className='flex md:h-[75px] items-start w-6/12 md:w-3/12'>
                        <div className="flex gap-2 items-center cursor-pointer hover:bg-white hover:bg-opacity-20 hover:rounded-md p-1" onClick={() => { localStorage.removeItem('permisos'); window.open("/", "_self") }}>
                            <img src={foto} className="rounded-full h-10 w-10 border-2  md:block" />
                            <div className="flex flex-col ">
                                <label className="font-semibold text-white cursor-pointer">{nombre}</label>
                                <label className="capitalize text-xs text-white cursor-pointer">Salir</label>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/*<div className='flex justify-between px-5 py-3 bg-greenVE-500'>
                <img className='h-16' src='https://visitaecuador.com/ve/img/diseno/logo_ve.jpg'/>
                <div className='flex flex-col w-20 justify-center items-center'>
                    <span className="icon-[whh--avatar] h-10 w-10 text-gray-400"></span>
                    <div className='flex flex-col'>
                        <label className='text-xs'>Administrador</label>
                        <button className='text-xs text-red-700'>Salir</button>
                    </div>
                </div>
            </div>
            <div className='h-8 w-full bg-greenVE-500 px-10 py-1'>
                {
                    menuList.map((item, index)=>(
                        <button className={`text-white border ${index==0?"border-l-2":index==(menuList.length-1)?"border-r-2":" border-x-1"} border-y-0 px-4 ${index==selMenu?"bg-greenVE-700":"hover:bg-greenVE-600"}`} onClick={()=>setSelMenu(index)}>{item.title}</button>
                    ))
                }
            </div>*/}
            {
                selMenu != null &&
                menuList[selMenu].menu
            }
        </>
    );
};

export default Menu;
