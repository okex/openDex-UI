const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const src = path.resolve(__dirname, '../src');
const client = process.env.CLIENT || 'desktop';
const base = {
  entry:path.resolve(__dirname,`../src/${client}/index.js`),
  output: {
    filename: '[name]/index.js',
    chunkFilename: 'common/[name]/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!@ok\/)/,
        options: {
          presets: ['@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.less', '.jsx'],
    modules: [
      src,
      './node_modules',
      path.resolve(__dirname, '../node_modules'),
    ],
    alias: {
      _src: path.resolve(__dirname, '../src/common/'),
      _component: path.resolve(__dirname, '../src/common/component/'),
      _constants: path.resolve(__dirname, '../src/common/constants/'),
      _app:path.resolve(__dirname, `../src/${client}/`),
    },
  },
};
if(process.env.NODE_ENV === 'production') {
  base.optimization = {
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
  }
}
module.exports = base;
