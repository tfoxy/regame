const webpack = require('webpack');
const merge = require('webpack-merge');

const config = require('./webpack.config.common');

module.exports = merge(config, {
  module: {
    rules: [{
      test: /.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
