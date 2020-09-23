const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const src = path.resolve(__dirname, '../src');

const base = {
  output: {
    filename: '[name]/index.js',
    chunkFilename: 'common/[name]/[name].js',
    path: path.resolve(__dirname, '../bundle'),
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
    },
  },
  plugins: [
    process.env.NODE_ENV === 'production'
      ? new MiniCssExtractPlugin({
          filename: '[name]/index.css',
          chunkFilename: 'common/[name]/[name].css',
        })
      : null,
  ],
};

base.plugins = base.plugins.filter((item) => {
  if (item !== null) {
    return item;
  }
  return false;
});

module.exports = base;
