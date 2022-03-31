import React from "react";

const Home = React.lazy(() => import("./features/home/page/Home"));
const EditAsset = React.lazy(() =>
  import("./features/manageAsset/page/EditAsset")
);

const routes = [
  { path: "/home", exact: true, name: "Home", component: Home },
  {
    path: "/edit-asset",
    exact: true,
    name: "Edit Asset",
    component: EditAsset,
  },
];

export default routes;
