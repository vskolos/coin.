/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.svg$/i,
        type: 'asset/source',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Coin.',
      scriptLoading: 'module',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
      },
    }),
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/favicon.svg',
      cache: true,
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
}
