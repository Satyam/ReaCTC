import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function loadModule(componentName, props) {
  return class ModuleLoader extends Component {
    constructor(...args) {
      super(...args);
      this.state = { Component: null };
    }
    componentDidMount() {
      // Unfortunately, the names of the imported modules have to be
      // named explicitely for webpack to know what to bundle
      switch (componentName) {
        case 'Mimico':
          require.ensure('_components/mimico', (require) => {
            this.setState({ Component: require('_components/mimico').default });
          });
          break;
        case 'Login':
          require.ensure('_components/login', (require) => {
            this.setState({ Component: require('_components/login').default });
          });
          break;
      }
    }
    render() {
      const C = this.state.Component;
      return C && React.createElement(C, props);
    }
    static propTypes = {
      componentName: PropTypes.string,
    };
  };
}
