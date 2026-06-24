import React from "react";
import ListarCuentasGratis from "./GestionarCuentasGratis/ListarCuentasGratis";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { PhoneCall, Gift } from "lucide-react";

const SubmenuCallcenter = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subCallcenter", 0);

    const submenuList = [
        {
            title: "Cuentas Gratuitas",
            icon: Gift,
            page: <ListarCuentasGratis />,
        },
    ];

    return (
        <SubmenuLayout
            title="Call Center"
            icon={PhoneCall}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuCallcenter;