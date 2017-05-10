import React from 'react';
import { Route } from 'react-router-dom';

import { Layout, Panel } from 'react-toolbox/lib/layout';

import Estado from '_components/estado';

import Sector from '_components/sector';

export default function MimicoComponent() {
  return (
    <Layout>
      <Panel>
        <Route path="/sector/:idSector" component={Sector} />
      </Panel>
      <Estado />
    </Layout>
  );
}
