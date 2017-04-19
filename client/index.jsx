import React from 'react';
import { Route } from 'react-router-dom';

import Mimico from '_components/mimico';

export default () => <Route path="/:idSector?"><Mimico /></Route>;
