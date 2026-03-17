import React, { lazy, Suspense } from 'react';

const Menu = lazy(() => import('../components/Menu/Menu'));

const Home = () => {
    return (
        <div>
            <Suspense fallback={<div className="flex flex-col items-center justify-center p-10"><div className="w-10 h-10 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-2"></div><p className="text-gray-500 text-sm animate-pulse">Cargando menú...</p></div>}>
                <Menu />
            </Suspense>
        </div>
    );
};

export default Home;