const config = require('./config.js');
const mapValues = require('lodash/mapValues');

module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  plugins: ['flowtype'],
  env: {
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config/development.js',
        'config-index': 0,
      },
    },
    'import/core-modules': ['electron'],
  },
  globals: Object.assign(
    {
      ROOT_DIR: false,
      BUNDLE: false,
    },
    mapValues(config, () => false)
  ),
  rules: {
    'no-console': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'react/require-default-props': 0,
    'flowtype/no-types-missing-file-annotation': 0,
    'react/sort-comp': [
      'error',
      {
        order: ['static-methods', 'lifecycle', 'everything-else', 'render'],
        groups: {
          lifecycle: [
            'props',
            'state',
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'getInitialState',
            'state',
            'getChildContext',
            'componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'componentDidUpdate',
            'componentWillUnmount',
          ],
        },
      },
    ],
  },
};
