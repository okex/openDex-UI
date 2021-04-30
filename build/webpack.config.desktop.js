const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const base = require('./webpack.config.base');

const output = path.resolve(__dirname, '../app/bundle');
base.output.publicPath = 'file:./';
base.output.path = output;
base.mode = 'production';
base.plugins = [
  new CleanWebpackPlugin([output], {
    root: path.resolve(__dirname, '../'),
  }),
  new webpack.DefinePlugin({
    'process.env.ROUTE_TYPE': JSON.stringify('hash'),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(
      path.resolve(__dirname, '../src/desktop'),
      'index.html'
    ),
    filename: 'index.html',
  }),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../src/favicon-okex.ico'),
      to: path.resolve(output, 'favicon-okex.ico'),
    },
  ]),
];

module.exports = Object.assign(base, {
  mode: 'production',
});
