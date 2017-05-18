const webpack = require('webpack');
const path = require('path');
const mapValues = require('lodash/mapValues');
const config = require('../config.js');

const join = path.join;
const root = process.cwd();
const absPath = relative => join(root, relative);

module.exports = version =>
  ['webClient', 'webServer'].map((bundle) => {
    const aliases = {
      _client: absPath('client'),
      _server: absPath('server'),
      _store: absPath('client/store'),
      _components: absPath('client/components'),
      _utils: absPath('client/utils'),
      _test: absPath('test'),
      _platform: absPath(bundle === 'webServer' ? 'webClient' : bundle),
      _jest: absPath('jest'),
    };
    return {
      entry: {
        [bundle]: [
          'babel-polyfill',
          absPath(
            {
              webClient: 'webClient/index.jsx',
              webServer: 'webServer/index.js',
            }[bundle]
          ),
        ],
      },
      output: {
        path: absPath('bundles'),
        filename: '[name].js',
        publicPath: absPath('bundles'),
        pathinfo: version === 'development',
      },
      target: {
        webClient: 'web',
        webServer: 'node',
      }[bundle],
      devtool: 'source-map',
      module: {
        noParse: /es6-promise/,
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
      plugins: [
        new webpack.DefinePlugin(
          Object.assign(
            {
              'process.env': {
                NODE_ENV: JSON.stringify(version),
              },
              ROOT_DIR: JSON.stringify(root),
              BUNDLE: JSON.stringify(bundle),
            },
            mapValues(config, JSON.stringify)
          )
        ),
      ],
      resolve: {
        alias: aliases,
        extensions: ['.js', '.jsx'],
      },
      stats: { children: false },
    };
  });
