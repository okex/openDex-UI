const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');

const address = '127.0.0.1';
const port = 5200;

base.entry = path.resolve(__dirname,'../src/desktop/index.js');
base.output.publicPath = `http://${address}:${port}/`;

base.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new webpack.HotModuleReplacementPlugin({}),
  new HtmlWebpackPlugin({
    template: path.resolve(path.resolve(__dirname, '../src/desktop'), 'index.html'),
    filename: 'index.html',
  })
);

base.resolve.alias = Object.assign(base.resolve.alias,{
  _app:path.resolve(__dirname, '../src/desktop/'),
});

module.exports = Object.assign(base, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '../src/desktop'),
    hot: true,
    host: address,
    port: 5200,
    proxy: {
      '/tradingview/*': {
        target: 'http://okcombeta.bafang.com/',
        changeOrigin: true,
        secure: true,
      },
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/index.html' }],
    },
  },
  devtool: 'source-map',
});
