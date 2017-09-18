import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import FirebaseProvider from '_utils/firebase/provider';

import App from '_containers/app';
import createStore from '_store/createStore';

import celdasTriggers from '_store/celdas/triggers';

// firebase.initializeApp({
//   apiKey: 'AIzaSyBxCIBAgaeWp6d4TthWu497t4fSerb82Qo',
//   authDomain: 'reactc-6e29a.firebaseapp.com',
//   databaseURL: 'https://reactc-6e29a.firebaseio.com',
//   projectId: 'reactc-6e29a',
//   storageBucket: 'reactc-6e29a.appspot.com',
//   messagingSenderId: '343409897286',
// });

function setTriggers(database, dispatch, getState) {
  celdasTriggers(database, dispatch, getState);
}

document.addEventListener('DOMContentLoaded', () => {
  const dest = document.getElementById('contents');
  const store = createStore({ firebase });
  setTriggers(firebase.database(), store.dispatch, store.getState);
  render(
    <FirebaseProvider firebase={firebase}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </FirebaseProvider>,
    dest
  );
});
