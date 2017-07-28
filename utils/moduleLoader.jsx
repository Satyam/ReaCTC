import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function loadModule(loader, props) {
  return class ModuleLoader extends Component {
    constructor(...args) {
      super(...args);
      this.state = { Component: null };
    }
    setComponent = (module) => {
      /* eslint-disable no-underscore-dangle */
      this.setState({ Component: module.__esModule ? module.default : module });
      /* eslint-enable no-underscore-dangle */
    };
    componentDidMount() {
      // Unfortunately, the names of the imported modules have to be
      // named explicitely for webpack to know what to bundle
      loader().then(this.setComponent);
    }
    render() {
      const C = this.state.Component;
      return C ? <C {...props} /> : <img alt="loading" src="icons/loading.gif" />;
    }
    static propTypes = {
      loader: PropTypes.func,
    };
  };
}
