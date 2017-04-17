const webpack = require('webpack');
const path = require('path');

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
      },
      target: {
        webClient: 'web',
        webServer: 'node',
      }[bundle],
      devtool: 'source-map',
      module: {
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
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(version),
          },
          PORT: JSON.stringify(process.env.npm_package_myWebServer_port),
          HOST: JSON.stringify(process.env.npm_package_myWebServer_host),
          REST_API_PATH: JSON.stringify(process.env.npm_package_myWebServer_restAPIpath),
          ROOT_DIR: JSON.stringify(root),
          BUNDLE: JSON.stringify(bundle),
        }),
      ],
      resolve: {
        alias: aliases,
        extensions: ['.js', '.jsx'],
      },
      externals: [
        (context, request, callback) => {
          if (bundle === 'webClient') {
            return callback();
          }
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
