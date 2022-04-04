import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateAsset from "../page/CreateAsset";
import Main from "../page/Main";

const ManageAsset = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={match.url} component={Main} />

              <Route path={`${match.url}/add`} component={CreateAsset} />
              <Route path={`${match.url}/:assetId`} component={CreateAsset} />
      </Switch>
    </div>
  );
};

export default ManageAsset;
