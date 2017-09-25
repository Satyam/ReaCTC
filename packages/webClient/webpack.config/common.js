const webpack = require('webpack');
const path = require('path');
const mapValues = require('lodash/mapValues');

const pkgRoot = path.resolve(__dirname, '..');
const absRoot = path.resolve(pkgRoot, '../..');
const pkgPath = (relative = '') => path.join(pkgRoot, relative);
const absPath = (relative = '') => path.join(absRoot, relative);
const config = require('../../../config.js');

module.exports = (version) => {
  const aliases = {
    _webClient: pkgPath(),
    _wsClient: absPath('packages/wsClient'),
    _store: pkgPath('store'),
    _components: absPath('packages/components/src'),
    _containers: pkgPath('containers'),
    _utils: absPath('utils'),
    _test: absPath('test'),
  };
  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin(
      Object.assign(
        {
          'process.env': {
            NODE_ENV: JSON.stringify(version),
          },
          ROOT_DIR: JSON.stringify(absRoot),
        },
        mapValues(config, JSON.stringify)
      )
    ),
  ];
  return {
    entry: ['babel-polyfill', pkgPath('index.jsx')],
    output: {
      path: pkgPath('bundles'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/bundles/',
      pathinfo: version === 'development',
    },
    target: 'web',
    devtool: 'source-map',
    module: {
      noParse: /es6-promise/, // some dependencies might want it.
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]--[local]--[hash:base64:8]',
              },
            },
            'postcss-loader', // has separate config, see postcss.config.js nearby
          ],
        },
      ],
    },
    plugins,
    resolve: {
      alias: aliases,
      extensions: ['.js', '.jsx'],
    },
    stats: { children: false },
  };
};
