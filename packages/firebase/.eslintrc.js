const path = require('path');
module.exports = {
  env: {
    browser: true,
  },
  rules: {
    'no-console': 2,
    'react/forbid-prop-types': 0,
  },
  globals: {
    firebase: false,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
