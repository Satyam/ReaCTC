import { Component } from 'react';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createEagerFactory from 'recompose/createEagerFactory';
import map from 'lodash/map';

import firebaseShape from './shape';

const connect = listeners => (BaseComponent) => {
  const factory = createEagerFactory(BaseComponent);

  const FirebaseConnect = class extends Component {
    constructor(props, context) {
      super(props, context);
      this.firebase = context.firebase;
    }
    componentDidMount() {
      const database = this.firebase.database();
      this.subscriptions = map(
        listeners(this.props),
        (ref, prop) =>
          ref &&
          database.ref(ref).on('value', (snapshot) => {
            this.setState({ [prop]: snapshot.val() });
          })
      );
    }
    componentWillUnmount() {
      this.subscriptions.forEach(subs => subs && subs.off());
    }

    render() {
      return factory(Object.assign({}, this.props, this.state));
    }
  };
  FirebaseConnect.contextTypes = {
    firebase: firebaseShape,
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'firebaseConnect'))(FirebaseConnect);
  }
  return FirebaseConnect;
};

export default connect;
