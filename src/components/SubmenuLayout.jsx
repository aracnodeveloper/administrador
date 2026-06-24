import { Lock } from "lucide-react";
import React from "react";

export const SubmenuLayout = ({ title, icon: Icon, submenuList, selSubmenu, setSelSubmenu }) => {
    if (!submenuList || submenuList.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Lock size={36} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-400">No tienes permisos para ver este módulo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <aside className="w-full md:w-56 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-100 shadow-sm">
                {/* Sidebar header */}
                <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={18} className="text-gray-500" strokeWidth={1.75} />}
                        <h2 className="text-sm font-bold text-gray-700">{title}</h2>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="p-2 flex md:flex-col flex-row gap-1 overflow-x-auto md:overflow-visible">
                    {submenuList.map((item, index) => {
                        const ItemIcon = item.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelSubmenu(index)}
                                className={`
                                    flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                                    transition-all duration-150 whitespace-nowrap md:whitespace-normal
                                    flex-shrink-0 md:flex-shrink md:w-full
                                    ${index === selSubmenu
                                        ? "bg-greenVE-500 text-white shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    }
                                `}
                            >
                                {ItemIcon && (
                                    <ItemIcon
                                        size={15}
                                        strokeWidth={1.75}
                                        className={index === selSubmenu ? "text-white" : "text-gray-400"}
                                    />
                                )}
                                <span className="text-xs font-medium">{item.title}</span>
                                {index === selSubmenu && (
                                    <span className="ml-auto text-white/50 text-xs hidden md:block">›</span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Content area */}
            <main className="flex-1 bg-gray-50 overflow-auto">
                <div className="p-4 md:p-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-5" aria-label="breadcrumb">
                        <span className="text-xs text-gray-400">{title}</span>
                        <span className="text-gray-300 text-xs">›</span>
                        <span className="text-xs font-medium text-gray-600">
                            {submenuList[selSubmenu]?.title}
                        </span>
                    </nav>

                    {/* Page content */}
                    {submenuList[selSubmenu]?.page}
                </div>
            </main>
        </div>
    );
};

export default SubmenuLayout;