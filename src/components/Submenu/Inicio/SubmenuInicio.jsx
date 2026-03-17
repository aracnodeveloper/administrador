import React from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarPermiso } from '../../../global/utils';

const SubmenuInicio = () => {
    const navigate = useNavigate();

    // Estructura simplificada similar a la original
    const menuItems = [
        {
            title: "Suscriptores",
            path: "/suscriptores",
            permiso: 103,
            icon: "icon-[material-symbols--group-outline]",
            description: "Gestión de usuarios y suscriptores del sistema.",
            color: "text-greenVE-600",
            bg: "bg-greenVE-50"
        },
        {
            title: "Smart",
            path: "/smart",
            permiso: 17,
            icon: "icon-[material-symbols--settings-suggest-outline]",
            description: "Gestión inteligente de servicios y reservas.",
            color: "text-greenVE-600",
            bg: "bg-greenVE-50"
        },
        {
            title: "Call Center",
            path: "/call-center",
            permiso: null,
            icon: "icon-[material-symbols--support-agent]",
            description: "Gestión de soporte y atención al cliente.",
            color: "text-greenVE-600",
            bg: "bg-greenVE-50"
        }
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Administrador <span className="text-greenVE-500">Beta</span></h1>
                <p className="text-gray-500 mt-2">Panel global de gestión unificada. Seleccione un módulo para continuar.</p>
                <div className="h-1 w-20 bg-greenVE-500 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                    <div 
                        key={index}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate(item.path)}
                    >
                        <div className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center mb-4`}>
                            <span className={`${item.icon} text-2xl ${item.color}`}></span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-greenVE-500 transition-colors uppercase">
                            {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                            {item.description}
                        </p>
                        <div className="mt-6 flex items-center text-greenVE-500 font-semibold text-sm">
                            Explorar módulo <span className="icon-[material-symbols--arrow-right-alt] ml-1"></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmenuInicio;
