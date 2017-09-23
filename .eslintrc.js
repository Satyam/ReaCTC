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
      'babel-module': {},
    },
    'import/core-modules': ['electron'],
  },
  globals: Object.assign(
    {
      ROOT_DIR: false,
    },
    mapValues(config, () => false)
  ),
  rules: {
    // See: https://github.com/facebookincubator/create-react-app/issues/2631#issuecomment-312894470
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': ['warn', { aspects: ['invalidHref'] }],
    // Up to here
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
