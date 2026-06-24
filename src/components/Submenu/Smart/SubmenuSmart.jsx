import React, { useEffect, useState } from "react";
import { verificarPermiso } from "../../../global/utils";
import { useParams } from "react-router-dom";
import { listarReservas } from "../../../controllers/smart/SmartController";
import ListarReservas from "./GestionarReservas/ListarReservas";
import AgregarReserva from "./GestionarReservas/AgregarReserva";
import ListarEstablecimientos from "./GestionarEstablecimientos/ListarEstablecimeintos";
import CrearEstablecimiento from "./GestionarEstablecimientos/CrearEstablecimiento";
import ListarAprobaciones from "./GestionarEstablecimientos/ListarAprobaciones";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { Zap, ClipboardList, Plus, Hotel, Building2, Building, CheckCircle2 } from "lucide-react";

const SubmenuSmart = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subSmart", 0);
    const [editData, setEditData] = useState();
    const { id } = useParams();

    const handleClickEdit = (data) => {
        setEditData(data);
        setSelSubmenu(1);
    };

    const submenuList = [];

    verificarPermiso(22) &&
        submenuList.push({
            title: "Listar reservas",
            icon: ClipboardList,
            page: <ListarReservas handleClickEdit={handleClickEdit} />,
        });

    verificarPermiso(23) &&
        submenuList.push({
            title: "Agregar reserva",
            icon: Plus,
            page: <AgregarReserva editData={editData} setEditData={setEditData} />,
        });

    verificarPermiso(17) &&
        submenuList.push({
            title: "Establecimientos",
            icon: Hotel,
            page: <ListarEstablecimientos />,
        });

    verificarPermiso(17) &&
        submenuList.push({
            title: "Crear Establecimiento",
            icon: Building2,
            page: <CrearEstablecimiento />,
        });

    verificarPermiso(17) &&
        submenuList.push({
            title: "Aprobaciones",
            icon: CheckCircle2,
            page: <ListarAprobaciones />,
        });

    useEffect(() => {
        if (id) {
            const agregarIndex = submenuList.findIndex(
                (item) => item.title === "Agregar reserva"
            );
            setSelSubmenu(agregarIndex);
            listarReservas({ id }).then((res) => {
                if (res) handleClickEdit(res);
            });
        }
    }, []);

    return (
        <SubmenuLayout
            title="Smart"
            icon={Building}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={(i) => { setSelSubmenu(i); setEditData(undefined); }}
        />
    );
};

export default SubmenuSmart;