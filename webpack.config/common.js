const webpack = require('webpack');
const path = require('path');
const mapValues = require('lodash/mapValues');
const config = require('../config.js');

const join = path.join;
const root = process.cwd();
const absPath = (relative = '') => join(root, relative);

module.exports = version =>
  ['webClient', 'webServer', 'firebase'].map((bundle) => {
    const aliases = {
      _client: absPath('client'),
      _firebase: absPath('firebase'),
      _server: absPath('server'),
      _store: absPath(
        {
          webClient: 'webClient/store',
          firebase: 'firebase/store',
        }[bundle]
      ),
      _components: absPath('components'),
      _containers: absPath(
        {
          webClient: 'webClient/containers',
          firebase: 'firebase/containers',
        }[bundle]
      ),
      _utils: absPath('utils'),
      _test: absPath('test'),
      _platform: absPath('webClient'),
      _jest: absPath('jest'),
    };
    const plugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
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
    ];
    return {
      entry: {
        [bundle]: [
          'babel-polyfill',
          absPath(
            {
              webClient: 'webClient/index.jsx',
              webServer: 'webServer/index.js',
              firebase: 'firebase/index.jsx',
            }[bundle]
          ),
        ],
      },
      output: {
        path: absPath('bundles'),
        filename: '[name].js',
        chunkFilename: `${bundle}.[name].js`,
        publicPath: '/bundles/',
        pathinfo: version === 'development',
      },
      target: {
        webClient: 'web',
        webServer: 'node',
        firebase: 'web',
      }[bundle],
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
      externals: [
        (context, request, callback) => {
          switch (bundle) {
            case 'webClient':
              return callback();
            case 'firebase':
              return callback();
            default:
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
                  const firstPart = request.split('/')[0];
                  if (Object.keys(aliases).indexOf(firstPart) === -1) {
                    return callback(null, `commonjs ${request}`);
                  }
                  break;
                }
              }
              return callback();
          }
        },
      ],
      stats: { children: false },
    };
  });
