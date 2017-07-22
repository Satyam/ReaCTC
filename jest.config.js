const config = require('./config.js');

module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '^_webClient/(.*)': '<rootDir>/webClient/$1',
    '^_firebase/(.*)': '<rootDir>/firebase/$1',
    '^_store/(.*)': '<rootDir>/webClient/store/$1',
    '^_components/(.*)': '<rootDir>/components/$1',
    '^_containers/(.*)': '<rootDir>/webClient/containers/$1',
    '^_utils/(.*)': '<rootDir>/utils/$1',
    '^_platform/restAPI': '<rootDir>/webClient/restAPI.js',
    '^_jest/(.*)': '<rootDir>/jest/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  globals: Object.assign(
    {
      ROOT_DIR: '/',
      BUNDLE: 'webClient',
    },
    config
  ),
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text'],
  snapshotSerializers: ['<rootDir>/node_modules/enzyme-to-json/serializer'],
};
