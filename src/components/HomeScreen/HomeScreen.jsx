import React, { useState, useEffect, useMemo } from "react";
import useMenuState from "../../hooks/useMenuState";
import {
    UserPlus,
    Hotel,
    Megaphone,
    PhoneCall,
    Clapperboard,
    Package,
    Ticket,
    Home,
} from "lucide-react";

const session = JSON.parse(localStorage.getItem("datos"));
const nombre = session ? session.data.nombre : "Administrador";

const QuickAction = ({ icon: Icon, label, description, onClick, color }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-greenVE-300 hover:shadow-md transition-all duration-200 text-left group w-full"
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-gray-400" strokeWidth={1.75} />
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <div className="ml-auto text-gray-300 group-hover:text-greenVE-500 transition-colors">→</div>
    </button>
);

const ACTION_CATALOG = [
    {
        menuTitle: "Audiovisuales",
        icon: Clapperboard,
        label: "Audiovisuales",
        description: "Gestionar contenido audiovisual",
        color: "bg-purple-50",
    },
    {
        menuTitle: "Suscriptores",
        icon: UserPlus,
        label: "Suscriptores",
        description: "Registrar un nuevo usuario",
        color: "bg-blue-50",
    },
    {
        menuTitle: "Smart",
        icon: Hotel,
        label: "Smart",
        description: "Agregar reserva de establecimiento",
        color: "bg-green-50",
    },
    {
        menuTitle: "FullPack",
        icon: Package,
        label: "FullPack",
        description: "Gestionar paquetes completos",
        color: "bg-orange-50",
    },
    {
        menuTitle: "Tickets",
        icon: Ticket,
        label: "Tickets",
        description: "Administrar tickets de soporte",
        color: "bg-indigo-50",
    },
    {
        menuTitle: "Publicidad",
        icon: Megaphone,
        label: "Gestionar publicidad",
        description: "Administrar anuncios activos",
        color: "bg-yellow-50",
    },
    {
        menuTitle: "Call Center",
        icon: PhoneCall,
        label: "Call Center",
        description: "Revisar cuentas gratuitas",
        color: "bg-pink-50",
    },
];

const HomeScreen = ({ menuList = [] }) => {
    const [greeting, setGreeting] = useState("Buenos días");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [, setSelMenu] = useMenuState("menu", 0);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 12 && hour < 19) setGreeting("Buenas tardes");
        else if (hour >= 19) setGreeting("Buenas noches");

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) =>
        date.toLocaleDateString("es-EC", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const goToMenu = (title) => {
        const idx = menuList.findIndex((m) => m.title === title);
        if (idx !== -1) setSelMenu(idx);
    };

    const visibleActions = useMemo(
        () => ACTION_CATALOG.filter((a) => menuList.some((m) => m.title === a.menuTitle)),
        [menuList]
    );

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">

            {/* Hero greeting */}
            <div className="relative bg-greenVE-500 rounded-3xl p-8 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute top-4 right-24 w-16 h-16 bg-white/5 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-greenVE-200 text-sm font-medium mb-1">
                            {greeting}, {nombre.split(" ")[0]} 👋
                        </p>
                        <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-greenVE-200 text-sm capitalize">
                            {formatDate(currentTime)}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            src="https://visitaecuador.com/img/web/ve_logo.svg"
                            style={{ width: "120px", height: "auto" }}
                            alt="Visita Ecuador"
                            className="brightness-0 invert opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Acciones rápidas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleActions.map((action) => (
                        <QuickAction
                            key={action.menuTitle}
                            {...action}
                            onClick={() => goToMenu(action.menuTitle)}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 border-t border-gray-100">
                <p className="text-xs text-gray-300">
                    Visita Ecuador © {new Date().getFullYear()} · Panel Administrativo
                </p>
            </div>
        </div>
    );
};

export default HomeScreen;