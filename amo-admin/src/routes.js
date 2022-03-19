import React from 'react';

const Home = React.lazy(() => import('./features/home/page/Home'));

const routes = [
    { path: '/home', exact: true, name: 'Home', component: Home },
];

export default routes;
