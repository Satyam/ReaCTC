import { Component } from 'react';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createEagerFactory from 'recompose/createEagerFactory';
import reduce from 'lodash/reduce';

import firebaseShape from './shape';

const connect = mapping => (BaseComponent) => {
  const factory = createEagerFactory(BaseComponent);

  const FirebaseUserConnect = class extends Component {
    constructor(props, context) {
      super(props, context);
      this.firebase = context.firebase;
    }
    componentDidMount() {
      const auth = this.firebase.auth();
      if (!this.unsuscribe) {
        this.unsuscribe = auth.onAuthStateChanged((user) => {
          switch (typeof mapping) {
            case 'object':
              this.setState(
                reduce(
                  mapping,
                  (state, value, key) => Object.assign(state, { [value]: user[key] }),
                  {}
                )
              );
              break;
            case 'function':
              this.setState(mapping(user));
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
      return factory(Object.assign({}, this.props, this.state));
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

export default connect;
