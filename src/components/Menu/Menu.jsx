import React, { lazy, Suspense, useEffect } from "react";
import { verificarPermiso } from "../../global/utils";
import { useLocation } from "react-router-dom";
import MenuMobile from "./MenuMobile";
import useMenuState from "../../hooks/useMenuState";

const SubmenuAudiovisuales = lazy(() =>
    import("../Submenu/Audiovisuales/SubmenuAudiovisuales")
);
const SubmenuSmart = lazy(() => import("../Submenu/Smart/SubmenuSmart"));
const SubmenuSuscriptores = lazy(() =>
    import("../Submenu/Suscriptores/SubmenuSuscriptores")
);
const SubmenuCallcenter = lazy(() =>
    import("../Submenu/Callcenter/SubmenuCallcenter")
);
const SubmenuFullPack = lazy(() =>
    import("../Submenu/FullPack/SubmenuFullPack")
);
const SubmenuTickets = lazy(() =>
    import("../Submenu/Tickets/SubmenuTickets")
);

const session = JSON.parse(localStorage.getItem("datos"));
const nombre = session ? session.data.nombre : "";
const foto = session
    ? session.data.fotos
        ? session.data.fotos.m
        : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png"
    : "https://visitaecuador.com/ve/img/contenido/suscriptor/thum141x100/fotoperfil2_xXA8V_0.png";

var menuList = [
  { title: "Inicio", menu: <div>Menu Inicio</div> },
];

verificarPermiso(539) &&
menuList.push({
  title: "Audiovisuales",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuAudiovisuales />
      </Suspense>
  ),
});

menuList.push({
  title: "Suscriptores",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuSuscriptores />
      </Suspense>
  ),
});

verificarPermiso(17) &&
menuList.push({
  title: "Smart",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuSmart />
      </Suspense>
  ),
});

verificarPermiso(511) &&
menuList.push({
  title: "FullPack",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuFullPack />
      </Suspense>
  ),
});

// Permiso 512 para Tickets — ajusta el número según tu sistema de permisos
verificarPermiso(512) &&
menuList.push({
  title: "Tickets",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuTickets />
      </Suspense>
  ),
});

menuList.push({
  title: "Call Center",
  menu: (
      <Suspense fallback={<div>Cargando...</div>}>
        <SubmenuCallcenter />
      </Suspense>
  ),
});

const Menu = () => {
  const [selMenu, setSelMenu] = useMenuState("menu", null);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath.includes("reserva")) {
      const smartIndex = menuList.findIndex((item) => item.title === "Smart");
      if (smartIndex !== -1) setSelMenu(smartIndex);
    }
  }, [currentPath]);

  return (
      <>
        <header className="bg-greenVE-500">
          <div className="flex py-2 px-4 items-center md:items-end">
            <div className="w-3/12 md:w-2/12 flex cursor-pointer">
              <img
                  src="https://visitaecuador.com/img/web/ve_logo.svg"
                  style={{ width: "110px", height: "auto" }}
                  alt="logo"
              />
            </div>
            {window.innerWidth < 768 ? (
                <div className="w-3/12">
                  <MenuMobile
                      menuList={menuList}
                      setSelMenu={setSelMenu}
                      selMenu={selMenu}
                  />
                </div>
            ) : (
                <div className="h-8 w-full bg-greenVE-500 px-4 py-1 mb-5">
                  {menuList.map((item, index) => (
                      <button
                          key={index}
                          className={`border px-4 ${
                              index === selMenu
                                  ? "bg-white text-greenVE-500"
                                  : "text-white hover:bg-greenVE-600"
                          }`}
                          onClick={() => setSelMenu(index)}
                      >
                        {item.title}
                      </button>
                  ))}
                </div>
            )}
            <div className="flex md:h-[75px] items-start w-6/12 md:w-3/12">
              <div
                  className="flex gap-2 items-center cursor-pointer hover:bg-white hover:bg-opacity-20 hover:rounded-md p-1"
                  onClick={() => {
                    localStorage.removeItem("permisos");
                    window.open("/", "_self");
                  }}
              >
                <img
                    src={foto}
                    className="rounded-full h-10 w-10 border-2 md:block"
                    alt="profile"
                />
                <div className="flex flex-col">
                  <label className="font-semibold text-white cursor-pointer">
                    {nombre}
                  </label>
                  <label className="capitalize text-xs text-white cursor-pointer">
                    Salir
                  </label>
                </div>
              </div>
            </div>
          </div>
        </header>
        {selMenu !== null && menuList[selMenu]?.menu}
      </>
  );
};

export default Menu;