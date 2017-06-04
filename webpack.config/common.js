const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const mapValues = require('lodash/mapValues');
const config = require('../config.js');

const join = path.join;
const root = process.cwd();
const absPath = relative => join(root, relative);

const vendorChunk = new RegExp(`^${absPath('node_modules')}`);
const reactChunk = new RegExp(`^${absPath('node_modules/(react|redux)')}`);
const rToolboxChunk = new RegExp(`^${absPath('node_modules/react-toolbox')}`);

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
    const plugins = [
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
    if (bundle === 'webClient') {
      plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: `${bundle}-vendor`,
          minChunks: function minChunks(module) {
            return module.context && vendorChunk.test(module.context);
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: `${bundle}-react`,
          minChunks: function minChunks(module) {
            return module.context && reactChunk.test(module.context);
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: `${bundle}-react-toolbox`,
          minChunks: function minChunks(module) {
            return module.context && rToolboxChunk.test(module.context);
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: `${bundle}-manifest`,
          minChunks: Infinity,
        })
      );
      if (version === 'development') {
        plugins.push(new BundleAnalyzerPlugin());
      }
    }
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
        // filename: version === 'development' ? '[name].js' : '[name].[chunkhash].js',
        filename: '[name].js',
        publicPath: '/bundles/',
        pathinfo: version === 'development',
      },
      target: {
        webClient: 'web',
        webServer: 'node',
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
          if (bundle === 'webClient') {
            return callback();
          }
          // if (bundle === 'cordova') {
          //   return callback();
          // }
          // if (request === 'electron') {
          //   return callback(null, `commonjs ${request}`);
          // }
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
        },
      ],
      stats: { children: false },
    };
  });
