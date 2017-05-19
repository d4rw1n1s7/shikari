const path = require('path');

module.exports = {
  entry: {
    'index': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: '[name].js',
    libraryTarget: 'window'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
