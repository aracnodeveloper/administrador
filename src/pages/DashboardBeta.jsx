import React from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarPermiso } from '../global/utils';

const DashboardBeta = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: "Suscriptores",
            path: "/suscriptores",
            permiso: 103,
            icon: "icon-[material-symbols--person]",
            description: "Gestión de usuarios y suscriptores del sistema.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Smart",
            path: "/smart",
            permiso: 17,
            icon: "icon-[material-symbols--smart-toy]",
            description: "Administración de reservas y servicios inteligentes.",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            title: "Call Center",
            path: "/call-center",
            permiso: null,
            icon: "icon-[material-symbols--call]",
            description: "Atención al cliente y soporte técnico.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            title: "Audiovisuales",
            path: "/audiovisuales",
            permiso: 539,
            icon: "icon-[material-symbols--video-library]",
            description: "Galería multimedia y contenido audiovisual.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Administrador <span className="text-greenVE-600">Beta</span>
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Panel global de gestión unificada. Seleccione un módulo para continuar.
                    </p>
                    <div className="h-1 w-20 bg-greenVE-500 mt-4 rounded-full"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {menuItems.map((item, index) => {
                        // Check for specific permission OR general Admin Beta permission (538)
                        const hasSpecificPerm = !item.permiso || verificarPermiso(item.permiso);
                        const hasAdminBeta = verificarPermiso(538);

                        // If user has either specific permission or is an Admin Beta, show the card
                        if (!hasSpecificPerm && !hasAdminBeta) return null;

                        return (
                            <div
                                key={index}
                                className={`group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2`}
                                onClick={() => navigate(item.path)}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 ${item.bg}`}></div>

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${item.bg} ${item.color} text-3xl group-hover:scale-110 shadow-inner`}>
                                    <span className={item.icon}></span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-greenVE-700 transition-colors uppercase tracking-wide">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {item.description}
                                </p>

                                <div className="mt-8 flex items-center text-sm font-bold text-greenVE-600 group-hover:text-greenVE-800 transition-colors">
                                    Explorar módulo
                                    <span className="icon-[material-symbols--arrow-right-alt] ml-2 text-xl transition-transform group-hover:translate-x-2"></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardBeta;
