import React, { Component } from 'react';

export default function loadModule(loader, props) {
  return class ModuleLoader extends Component {
    constructor(...args) {
      super(...args);
      this.state = { Component: null };
    }
    componentDidMount() {
      this.mounted = true;
      loader().then(this.setComponent);
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    setComponent = (module) => {
      if (this.mounted) {
        /* eslint-disable no-underscore-dangle */
        this.setState({ Component: module.default || module });
        /* eslint-enable no-underscore-dangle */
      }
    };
    render() {
      const C = this.state.Component;
      return C ? <C {...props} /> : <img alt="loading" src="/icons/loading.gif" />;
    }
  };
}
