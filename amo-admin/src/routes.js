import React from "react";
import User from "./features/users/page/userList";

const Home = React.lazy(() => import("./features/home/page/Home"));
const AddEdit = React.lazy(() => import("./features/users/page/AddEdit"));
const UserManager = React.lazy(() => import("./features/users/page/userList"));
const CreateAsset = React.lazy(() =>
  import("./features/asset/page/CreateAsset")
);

const routes = [
  { path: "/home", exact: true, name: "Home", component: Home },
  {
    path: "/manageasset/createasset",
    name: "Create Asset",
    component: CreateAsset,
  },
  { path: "/manageuser/create", name: "Create User", component: AddEdit },
  { path: "/manageuser", exact: true, name: "User", component: UserManager },
];

export default routes;
