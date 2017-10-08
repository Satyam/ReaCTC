import React, { Component } from 'react';
import PropTypes from 'prop-types';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';

const initStore = initializer => (BaseComponent) => {
  const init = Array.isArray(initializer) ? initializer[0] : initializer;

  const StoreInitializer = class extends Component {
    static getStoreInitializer() {
      return initializer;
    }

    constructor(props, context) {
      super(props, context);
      this.store = context.store;
    }
    componentWillMount() {
      const store = this.store;
      this.isInitialized(init(store.dispatch, store.getState, this.props));
    }
    componentDidMount() {
      this.mounted = true;
    }
    componentWillReceiveProps(nextProps) {
      const store = this.store;
      this.isInitialized(init(store.dispatch, store.getState, nextProps, this.props));
    }

    shouldComponentUpdate() {
      return this.shouldUpdate;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    isInitialized(initRet) {
      this.shouldUpdate = initRet !== false;
      if (typeof initRet === 'object' && initRet.then) {
        if (typeof window !== 'undefined') {
          this.shouldUpdate = false;
          initRet.then(() => {
            this.shouldUpdate = true;
            if (this.mounted) this.forceUpdate();
          });
        }
      }
    }

    render() {
      return React.createElement(BaseComponent, this.props);
    }
  };
  StoreInitializer.contextTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
    }),
  };
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'initStore'))(StoreInitializer);
  }
  return StoreInitializer;
};

export default initStore;
