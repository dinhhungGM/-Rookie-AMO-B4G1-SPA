import React from "react";
import Main from "./features/assignment/page/Main";

const Home = React.lazy(() => import("./features/home/page/Home"));
const AddEditUser = React.lazy(() => import("./features/users/page/AddEdit"));
const AddEditAssignment = React.lazy(() => import("./features/assignment/page/AddEdit"));
const UserManager = React.lazy(() => import("./features/users/page/userList"));
const ManageAsset = React.lazy(() =>
  import("./features/asset/page/ManageAsset")
);
const CreateAsset = React.lazy(() =>
  import("./features/asset/page/CreateAsset")
);
const EditAsset = React.lazy(() => import("./features/asset/page/EditAsset"));

const routes = [
  { path: "/home", exact: true, name: "Home", component: Home },
  { path: "/manageasset", name: "Manage Asset", component: ManageAsset },
  {
    path: "/manageasset/createasset",
    name: "Create Asset",
    component: CreateAsset,
  },
  {
    path: "/manageasset/editasset/:id",
    name: "Edit Asset",
    component: EditAsset,
  },
  { path: "/manageuser/create", name: "Create User", component: AddEditUser },
  { path: "/manageuser/:userId", name: "Edit User", component: AddEditUser },
  { path: "/manageuser", exact: true, name: "User", component: UserManager },

  { path: "/manageassignment/create", name: "Create Assignment", component: AddEditAssignment },
  { path: "/manageassignment/:id", name: "Edit Assignment", component: AddEditAssignment },
  { path: "/manageassignment", exact: true, name: "Assignment", component: Main },
];

export default routes;
