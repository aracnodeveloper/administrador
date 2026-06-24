import React from "react";
import { verificarPermiso } from "../../../global/utils";
import GestionarInfluencer from "./GestionarInfluencers/GestionarInfluencer";
import GestionarEstablecimientos from "./GestionarEstablecimientos/GestionarEstablecimientos";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { Clapperboard, Video, Hotel } from "lucide-react";

const SubmenuAudiovisuales = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subAudiovisuales", 0);

    const submenuList = [];

    verificarPermiso(540) &&
        submenuList.push({
            title: "Gestionar Influencers",
            icon: Video,
            page: <GestionarInfluencer />,
        });

    verificarPermiso(541) &&
        submenuList.push({
            title: "Gestionar Hoteles",
            icon: Hotel,
            page: <GestionarEstablecimientos />,
        });

    return (
        <SubmenuLayout
            title="Audiovisuales"
            icon={Clapperboard}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuAudiovisuales;