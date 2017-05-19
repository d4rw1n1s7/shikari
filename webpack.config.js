const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'shikari.min': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: '[name].js',
    libraryTarget: 'window'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader', options: { transpileOnly: true } }
    ]
  }
}
