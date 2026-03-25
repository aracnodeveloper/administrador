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
        <div className="p-10 font-sans antialiased text-slate-700 bg-[#f8fafc] min-h-[calc(100vh-80px)]">
            <div className="mb-10 max-w-4xl">
                <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">
                    Panel de Administración
                </h1>
                <div className="h-1 w-16 bg-[#334155] mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
                {menuItems.map((item, index) => (
                    <div 
                        key={index}
                        className="bg-white p-8 rounded-lg border border-[#e2e8f0] hover:border-[#cbd5e1] hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                        onClick={() => navigate(item.path)}
                    >
                        <div className="w-14 h-14 bg-[#f1f5f9] rounded flex items-center justify-center mb-6 group-hover:bg-[#334155] transition-colors duration-300">
                            <span className={`${item.icon} text-3xl text-[#64748b] group-hover:text-white transition-colors duration-300`}></span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1e293b] group-hover:text-[#334155] transition-colors uppercase tracking-tight">
                            {item.title}
                        </h3>
                        <div className="mt-8 pt-6 border-t border-[#f1f5f9] flex items-center text-[#334155] font-bold text-[13px] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            Acceder al módulo <span className="icon-[material-symbols--arrow-right-alt-rounded] ml-2 text-lg"></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmenuInicio;
