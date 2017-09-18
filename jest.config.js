const config = require('./config.js');

module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '^_webClient/(.*)': '<rootDir>/packages/webClient/$1',
    '^_firebase/(.*)': '<rootDir>/firebase/$1',
    '^_store/(.*)': '<rootDir>/packages/webClient/store/$1',
    '^_components/(.*)': '<rootDir>/components/$1',
    '^_containers/(.*)': '<rootDir>/packages/webClient/containers/$1',
    '^_utils/(.*)': '<rootDir>/utils/$1',
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
