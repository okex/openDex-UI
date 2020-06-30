const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const base = require('./webpack.config.base');

base.output.publicPath = 'file:./';
base.output.path = path.resolve(__dirname, '../bundle');
// 增加block strip能力
base.module.rules.forEach((item) => {
  if (item.use && item.use[0] === 'eslint-loader') {
    item.use.unshift('@ok/strip-block-loader');
    item.use.unshift('@ok/strap-react-hot-loader');
  }
});

base.plugins.unshift(
  new CleanWebpackPlugin([path.resolve(__dirname, '../bundle')], {
    root: path.resolve(__dirname, '../')
  }),
  new webpack.DefinePlugin({ 'process.env.ROUTE_TYPE': JSON.stringify('hash') }),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src'), 'desktop.html'),
    filename: 'index.html'
  }),
);

base.devtool = 'source-map';
base.mode = 'production';

module.exports = Object.assign(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
