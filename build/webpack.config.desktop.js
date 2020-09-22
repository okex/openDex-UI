const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const base = require('./webpack.config.base');

base.output.publicPath = 'file:./';
base.output.path = path.resolve(__dirname, '../bundle');

base.plugins.unshift(
  new CleanWebpackPlugin([path.resolve(__dirname, '../bundle')], {
    root: path.resolve(__dirname, '../'),
  }),
  new webpack.DefinePlugin({
    'process.env.ROUTE_TYPE': JSON.stringify('hash'),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src'), 'desktop.html'),
    filename: 'index.html',
  })
);

base.devtool = 'source-map';
base.mode = 'production';

module.exports = Object.assign(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true,
          },
        }
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
});
