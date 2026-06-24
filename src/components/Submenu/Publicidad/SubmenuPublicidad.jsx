import React from "react";
import { verificarPermiso } from "../../../global/utils";
import ListarPublicidad from "./GestionarPublicidad/ListarPublicidad";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { Megaphone } from "lucide-react";

const SubmenuPublicidad = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subPublicidad", 0);

    const submenuList = [];

    (verificarPermiso(28) || true) &&
        submenuList.push({
            title: "Gestionar Publicidad",
            icon: Megaphone,
            page: <ListarPublicidad />,
        });

    return (
        <SubmenuLayout
            title="Publicidad"
            icon={Megaphone}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuPublicidad;