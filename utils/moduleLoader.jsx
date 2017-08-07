import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function loadModule(loader, props) {
  return class ModuleLoader extends Component {
    constructor(...args) {
      super(...args);
      this.state = { Component: null };
    }
    setComponent = (module) => {
      if (this.mounted) {
        /* eslint-disable no-underscore-dangle */
        this.setState({ Component: module.__esModule ? module.default : module });
        /* eslint-enable no-underscore-dangle */
      }
    };
    componentDidMount() {
      this.mounted = true;
      loader().then(this.setComponent);
    }
    componentWillUnmount() {
      this.mounted = false;
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
