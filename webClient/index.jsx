import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import registerServiceWorker from '_platform/registerServiceWorker';

import Client from '_client';
import createStore from '_store/createStore';

const dest = document.getElementById('contents');
const store = createStore();
render(
  <Provider store={store}>
    <BrowserRouter>
      <Client />
    </BrowserRouter>
  </Provider>,
  dest
);
registerServiceWorker();
