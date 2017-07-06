import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function loadModule(componentName, props) {
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
      switch (componentName) {
        case 'Mimico':
          import(/* webpackChunkName: "Mimico" */ '_containers/mimico').then(this.setComponent);
          break;
        case 'Login':
          import(/* webpackChunkName: "Login" */ '_containers/login').then(this.setComponent);
          break;
        case 'AdminSectores':
          import(/* webpackChunkName: "AdminSectores" */ '_containers/adminSectores').then(
            this.setComponent
          );
          break;
        default:
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
