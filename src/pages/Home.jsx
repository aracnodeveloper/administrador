import React, { lazy, Suspense } from 'react';

const Menu = lazy(()=> import('../components/Menu/Menu'));

const Home = () => {
    return (
        <div>
            <Suspense><Menu/></Suspense>
        </div>
    );
};

export default Home;