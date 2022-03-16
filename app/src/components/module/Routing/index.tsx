import React, { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import SubsTranslator from '~forms/SubsTranslator';
import routes from '~dictionaries/routes';

const Routing = (): ReactElement =>
  <Switch>
    {routes.map(({ path, component }) => <Route exact key={path} path={path}
      component={component}/>)}
    <Route component={SubsTranslator}/>
  </Switch>;

export default Routing;
