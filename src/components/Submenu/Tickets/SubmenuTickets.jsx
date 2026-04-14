import React, { lazy, Suspense } from 'react';
import useMenuState from '../../../hooks/useMenuState';

const TicketMain = lazy(() => import('../../Tickets/TicketMain'));

const SubmenuTickets = () => {
    const [submenu, setSubmenu] = useMenuState('subTickets', 0);

    const submenuList = [
        {
            title: 'Tickets / Certificados',
            component: (
                <Suspense fallback={<div className="p-4 text-sm text-gray-400">Cargando...</div>}>
                    <TicketMain />
                </Suspense>
            ),
        },
    ];

    return (
        <div>
            <div className="flex gap-1 px-4 pt-2 bg-gray-50 border-b overflow-x-auto">
                {submenuList.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setSubmenu(index)}
                        className={
                            'px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap ' +
                            (index === submenu
                                ? 'border-green-500 text-green-700 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700')
                        }>
                        {item.title}
                    </button>
                ))}
            </div>
            <div>{submenuList[submenu]?.component}</div>
        </div>
    );
};

export default SubmenuTickets;