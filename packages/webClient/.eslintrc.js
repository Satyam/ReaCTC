const path = require('path');
module.exports = {
  env: {
    browser: true,
  },
  rules: {
    'no-console': 2,
    'react/forbid-prop-types': 0,
    'import/named': 2,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
