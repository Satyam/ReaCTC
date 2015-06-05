var webpack = require('webpack');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
  entry: "./src/main",

  output: {
    path: __dirname + "/build/",
    filename: "app.js"
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
		{test: /\.less$/,  loader: "style!css!less"}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
