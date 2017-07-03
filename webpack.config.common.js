const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [{
      test: /.ts$/,
      use: 'ts-loader',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'regame',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
