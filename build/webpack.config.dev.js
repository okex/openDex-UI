const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');

const address = '127.0.0.1';
const port = 5200;
const apiUrl = 'https://www.okex.com';
base.output.publicPath = `http://${address}:${port}/`;

base.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new webpack.HotModuleReplacementPlugin({}),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src'), 'index.html'),
    filename: 'index.html',
  })
);

module.exports = Object.assign(base, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    hot: true,
    host: address,
    port: 5200,
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/okex/index.html' }],
    },
  },
  devtool: 'source-map',
});
