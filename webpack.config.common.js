const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      use: 'ts-loader',
    }, {
      test: /.mp3$/,
      use: ['file-loader'],
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'regame',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
