const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const base = require('./webpack.config.base');
base.output.publicPath = 'file:./';
base.output.path = path.resolve(__dirname, '../bundle');
base.mode = 'production';
base.plugins = [
  new CleanWebpackPlugin([path.resolve(__dirname, '../bundle')], {
    root: path.resolve(__dirname, '../'),
  }),
  new webpack.DefinePlugin({
    'process.env.ROUTE_TYPE': JSON.stringify('hash'),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(
      path.resolve(__dirname, '../src/desktop'),
      'desktop.html'
    ),
    filename: 'index.html',
  }),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../src/favicon-okex.ico'),
      to: path.resolve(__dirname, '../bundle/favicon-okex.ico'),
    },
  ]),
];

module.exports = Object.assign(base, {
  mode: 'production',
});
