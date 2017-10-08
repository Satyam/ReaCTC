import React, { Component } from 'react';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import reduce from 'lodash/reduce';

import firebaseShape from './shape';

const firebaseUserConnect = (firebaseDataMap, FirebaseActionsMap) => (BaseComponent) => {
  const FirebaseUserConnect = class extends Component {
    constructor(props, context) {
      super(props, context);
      this.firebase = context.firebase;
      this.state = {};
      const actionsMap = FirebaseActionsMap && FirebaseActionsMap(this.firebase.auth(), props);
      if (actionsMap && typeof actionsMap === 'object') {
        Object.assign(this.state, actionsMap);
      }
    }
    componentDidMount() {
      const auth = this.firebase.auth();
      if (!this.unsuscribe) {
        this.unsuscribe = auth.onAuthStateChanged((user) => {
          switch (typeof firebaseDataMap) {
            case 'object':
              this.setState(
                reduce(
                  firebaseDataMap,
                  (state, value, key) => Object.assign(state, { [value]: user[key] }),
                  {}
                )
              );
              break;
            case 'function':
              this.setState(firebaseDataMap(user));
              break;
            default:
              this.setState({ user });
          }
        });
      }
      if (!auth.currentUser) {
        auth.signInAnonymously();
      }
    }
    componentWillUnmount() {
      if (this.unsuscribe) this.unsuscribe();
    }

    render() {
      return React.createElement(BaseComponent, Object.assign({}, this.props, this.state));
    }
  };
  FirebaseUserConnect.contextTypes = {
    firebase: firebaseShape,
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'firebaseUserConnect'))(
      FirebaseUserConnect
    );
  }
  return FirebaseUserConnect;
};

export default firebaseUserConnect;
