import React from 'react';
import User from './features/users/page/userList';

const Home = React.lazy(() => import('./features/home/page/Home'));
const AddEdit = React.lazy(() => import('./features/users/page/AddEdit'));
const UserManager = React.lazy(() => import('./features/users/page/userList'));

const routes = [
    { path: '/home', exact: true, name: 'Home', component: Home },
    { path: '/manageuser/create',  name: 'Create User', component: AddEdit },
    { path: '/manageuser', exact: true, name: 'User', component: UserManager },
];

export default routes;
