const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const base = require('./webpack.config.base');
base.output.publicPath = '/';
base.output.path = path.resolve(__dirname, '../bundle-web');
base.mode = 'production';
base.plugins = [
  new CleanWebpackPlugin([path.resolve(__dirname, '../bundle-web')], {
    root: path.resolve(__dirname, '../'),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src/web'), 'index.html'),
    filename: 'index.html',
  }),
  new MiniCssExtractPlugin({
    filename: '[name]/index.css',
    chunkFilename: 'common/[name]/[name].css',
  }),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../src/favicon-okex.ico'),
      to: path.resolve(__dirname, '../bundle-web/favicon-okex.ico'),
    },
  ]),
];

module.exports = Object.assign(base, {
  mode: 'production',
});