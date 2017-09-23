import { Component, Children } from 'react';
import PropTypes from 'prop-types';

import firebaseShape from './shape';

export default class FirebaseProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.firebase = props.firebase;
  }

  getChildContext() {
    return { firebase: this.firebase };
  }

  render() {
    return Children.only(this.props.children);
  }
}

FirebaseProvider.propTypes = {
  firebase: firebaseShape.isRequired,
  children: PropTypes.element.isRequired,
};
FirebaseProvider.childContextTypes = {
  firebase: firebaseShape.isRequired,
};
FirebaseProvider.displayName = 'FirebaseProvider';
