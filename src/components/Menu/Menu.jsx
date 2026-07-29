import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { verificarPermiso } from "../../global/utils";
import { useLocation, useNavigate } from "react-router-dom";
import MenuMobile from "./MenuMobile";
import useMenuState from "../../hooks/useMenuState";
import {
    Home,
    Clapperboard,
    Users,
    Zap,
    Package,
    Ticket,
    Megaphone,
    PhoneCall,
    LogOut,
    Building,
} from "lucide-react";

const SubmenuAudiovisuales = lazy(() => import("../Submenu/Audiovisuales/SubmenuAudiovisuales"));
const SubmenuSmart = lazy(() => import("../Submenu/Smart/SubmenuSmart"));
const SubmenuSuscriptores = lazy(() => import("../Submenu/Suscriptores/SubmenuSuscriptores"));
const SubmenuCallcenter = lazy(() => import("../Submenu/Callcenter/SubmenuCallcenter"));
const SubmenuFullPack = lazy(() => import("../Submenu/FullPack/SubmenuFullPack"));
const SubmenuTickets = lazy(() => import("../Submenu/Tickets/SubmenuTickets"));
const SubmenuPublicidad = lazy(() => import("../Submenu/Publicidad/SubmenuPublicidad"));
const HomeScreen = lazy(() => import("../HomeScreen/HomeScreen"));

const session = JSON.parse(localStorage.getItem("datos"));
const nombre = session ? session.data.nombre : "";
const nivel = session ? session.data.nivel : "";
const codigo = session ? session.data.codigo : "";
const foto = session
    ? session.data.fotos
        ? session.data.fotos.m
        : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png"
    : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png";

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-greenVE-300 border-t-greenVE-600 rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-light">Cargando...</span>
        </div>
    </div>
);

// Componente auxiliar para renderizar el ícono del nav
const NavIcon = ({ Icon, active, scrolled }) => (
    <div className={`bg-white rounded-lg w-5 h-5 flex items-center justify-center ${active ? "shadow-sm" : ""}`}>
        <Icon
            size={15}
            strokeWidth={1.75}
            className={
                active
                    ? "text-gray-700"
                    : scrolled
                        ? "text-gray-500"
                        : "text-gray-400"
            }
        />
    </div>
);

const Menu = () => {
    const [selMenu, setSelMenu] = useMenuState("menu", 0);
    const location = useLocation();
    const currentPath = location.pathname;
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const menuList = useMemo(() => {
        const list = [];

        list.push({ title: "Inicio", icon: Home, menu: null });

        verificarPermiso(539) &&
            list.push({
                title: "Audiovisuales",
                icon: Clapperboard,
                menu: (
                    <Suspense fallback={<LoadingFallback />}>
                        <SubmenuAudiovisuales />
                    </Suspense>
                ),
            });

        list.push({
            title: "Suscriptores",
            icon: Users,
            menu: (
                <Suspense fallback={<LoadingFallback />}>
                    <SubmenuSuscriptores />
                </Suspense>
            ),
        });

        verificarPermiso(17) &&
            list.push({
                title: "Smart",
                icon: Building,
                menu: (
                    <Suspense fallback={<LoadingFallback />}>
                        <SubmenuSmart />
                    </Suspense>
                ),
            });

        verificarPermiso(511) &&
            list.push({
                title: "FullPack",
                icon: Package,
                menu: (
                    <Suspense fallback={<LoadingFallback />}>
                        <SubmenuFullPack />
                    </Suspense>
                ),
            });

        verificarPermiso(512) &&
            list.push({
                title: "Tickets",
                icon: Ticket,
                menu: (
                    <Suspense fallback={<LoadingFallback />}>
                        <SubmenuTickets />
                    </Suspense>
                ),
            });

        (verificarPermiso(512) || true) &&
            list.push({
                title: "Publicidad",
                icon: Megaphone,
                menu: (
                    <Suspense fallback={<LoadingFallback />}>
                        <SubmenuPublicidad />
                    </Suspense>
                ),
            });

        list.push({
            title: "Call Center",
            icon: PhoneCall,
            menu: (
                <Suspense fallback={<LoadingFallback />}>
                    <SubmenuCallcenter />
                </Suspense>
            ),
        });

        list[0].menu = (
            <Suspense fallback={<LoadingFallback />}>
                <HomeScreen menuList={list} />
            </Suspense>
        );

        return list;
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (currentPath.includes("reserva")) {
            const smartIndex = menuList.findIndex((item) => item.title === "Smart");
            if (smartIndex !== -1) setSelMenu(smartIndex);
        }
    }, [currentPath]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white shadow-md"
                    : "bg-gradient-to-r from-greenVE-500 to-greenVE-500"
                    }`}
            >
                <div className="flex items-center px-4 md:px-6 h-20 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <img
                            src="https://visitaecuador.com/img/web/ve_logo.svg"
                            style={{ width: "75px", height: "auto" }}
                            alt="logo"
                            onClick={() => navigate('/')}
                            className={scrolled ? "brightness-0" : "brightness-0 invert"}
                        />
                    </div>

                    {/* Nav - Desktop */}
                    {window.innerWidth >= 768 ? (
                        <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto no-scrollbar px-2">
                            {menuList.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelMenu(index)}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-sm font-medium
                                        whitespace-nowrap transition-all duration-200 flex-shrink-0
                                        ${index === selMenu
                                            ? scrolled
                                                ? "bg-greenVE-600 text-white shadow-sm"
                                                : "bg-white text-greenVE-600 shadow-inner"
                                            : scrolled
                                                ? "text-gray-600 hover:bg-gray-100 bg-gray-100"
                                                : "text-white/80 hover:bg-white/10 hover:text-white bg-gray-100/25"
                                        }
                                    `}
                                >
                                    <NavIcon
                                        Icon={item.icon}
                                        active={index === selMenu}
                                        scrolled={scrolled}
                                    />
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </nav>
                    ) : (
                        <div className="flex-1">
                            <MenuMobile
                                menuList={menuList}
                                setSelMenu={setSelMenu}
                                selMenu={selMenu}
                            />
                        </div>
                    )}

                    {/* User */}
                    <div
                        className={`
                            flex items-center gap-2.5 flex-shrink-0 px-3 py-1.5 rounded-xl
                            transition-all duration-200
                            ${scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"}
                        `}
                    >
                        <img
                            src={foto}
                            className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
                            alt="profile"
                        />
                        <div className="hidden md:flex flex-col text-left">
                            <span className="text-xs font-semibold leading-tight">{nombre}</span>
                            <span className={`text-xs leading-tight ${scrolled ? "text-gray-600" : "text-white"}`}>{nivel}: {codigo}</span>

                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("permisos");
                            window.open("/", "_self");
                        }}
                        className={`
                            flex items-center gap-2.5 flex-shrink-0 px-3 py-1.5 rounded-xl
                            transition-all duration-200
                            ${scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"}
                        `}
                    >
                        <span className={`text-xs leading-tight ${scrolled ? "text-gray-600" : "text-white"}`}>
                            <LogOut size={20} strokeWidth={2} />
                        </span>
                    </button>
                </div>

                {/* Active tab indicator */}
                <div className={`h-0.5 bg-white/30 transition-all duration-300 ${scrolled ? "hidden" : ""}`} />
            </header>

            {/* Content */}
            <main className="min-h-[calc(100vh-4rem)]">
                {selMenu !== null && menuList[selMenu]?.menu}
            </main>
        </div>
    );
};

export default Menu;