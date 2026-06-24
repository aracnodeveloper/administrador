import React, { lazy, Suspense } from "react";
import useMenuState from "../../../hooks/useMenuState";
import { SubmenuLayout } from "../../../components/SubmenuLayout";
import { Package } from "lucide-react";

const FullPackMain = lazy(() => import("../../FullPack/FullPackMain"));

const SubmenuFullPack = () => {
    const [selSubmenu, setSelSubmenu] = useMenuState("subFullPack", 0);

    const submenuList = [
        {
            title: "FullPack",
            icon: Package,
            page: (
                <Suspense fallback={<div className="p-4 text-sm text-gray-400">Cargando...</div>}>
                    <FullPackMain />
                </Suspense>
            ),
        },
    ];

    return (
        <SubmenuLayout
            title="FullPack"
            icon={Package}
            submenuList={submenuList}
            selSubmenu={selSubmenu}
            setSelSubmenu={setSelSubmenu}
        />
    );
};

export default SubmenuFullPack;