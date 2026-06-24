import React, { lazy, Suspense } from "react";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { Ticket } from "lucide-react";

const TicketMain = lazy(() => import("../../Tickets/TicketMain"));

const SubmenuTickets = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subTickets", 0);

    const submenuList = [
        {
            title: "Tickets / Certificados",
            icon: Ticket,
            page: (
                <Suspense fallback={<div className="p-4 text-sm text-gray-400">Cargando...</div>}>
                    <TicketMain />
                </Suspense>
            ),
        },
    ];

    return (
        <SubmenuLayout
            title="Tickets"
            icon={Ticket}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuTickets;