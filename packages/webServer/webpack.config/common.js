const webpack = require('webpack');
const path = require('path');
const mapValues = require('lodash/mapValues');

const join = path.join;
const pkgRoot = process.cwd();
const absRoot = path.resolve(pkgRoot, '../..');
const pkgPath = (relative = '') => join(pkgRoot, relative);

const config = require('../../../config.js');

module.exports = (version) => {
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
    entry: ['babel-polyfill', pkgPath('index.js')],
    output: {
      path: pkgPath('bundles'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/bundles/',
      pathinfo: version === 'development',
    },
    target: 'node',
    devtool: 'source-map',
    module: {
      noParse: /es6-promise/, // some dependencies might want it.
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins,
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    externals: [
      (context, request, callback) => {
        switch (request[0]) {
          case '.': {
            const fullPath = join(context, request);
            if (fullPath.indexOf('/node_modules/') > -1) {
              return callback(null, `commonjs ${fullPath}`);
            }
            break;
          }
          case '/':
            break;
          default: {
            if (request[0] === '_') {
              return callback(null, `commonjs ${request}`);
            }
            break;
          }
        }
        return callback();
      },
    ],
    stats: { children: false },
  };
};
