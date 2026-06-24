import React, { useState } from "react";
import ListarSuscriptores from "./GestionarSuscriptores/ListarSuscriptores";
import ListarPorVencer from "./GestionarSuscriptores/PorVencer/ListarPorVencer";
import AgregarSuscriptor from "./GestionarSuscriptores/AgregarSuscriptor/AgregarSuscriptor";
import ImportarSuscriptores from "./GestionarSuscriptores/ImportarSuscriptores/ImportarSuscriptores";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { verificarPermiso } from "../../../global/utils";
import { Users, UserPlus, Download, CalendarClock } from "lucide-react";

const SubmenuSuscriptores = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subSuscriptores", 0);
    const [editData, setEditData] = useState();

    const handleClickEdit = (data) => {
        setEditData(data);
        setSelSubmenu(1);
    };

    const submenuList = [
        {
            title: "Listar Suscriptores",
            icon: Users,
            page: <ListarSuscriptores handleClickEdit={handleClickEdit} />,
        },
        {
            title: "Por Vencer",
            icon: CalendarClock,
            page: <ListarPorVencer />,
        },

    ];
    verificarPermiso(24) && submenuList.push({
        title: "Agregar Suscriptor",
        icon: UserPlus,
        page: <AgregarSuscriptor editData={editData} setEditData={setEditData} />,
    });
    verificarPermiso(25) && submenuList.push({
        title: "Importar Suscriptores",
        icon: Download,
        page: <ImportarSuscriptores />,
    });
    return (
        <SubmenuLayout
            title="Suscriptores"
            icon={Users}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuSuscriptores;