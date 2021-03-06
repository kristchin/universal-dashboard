var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var SRC_DIR = path.resolve(__dirname, 'src');
var APP_DIR = path.resolve(__dirname, 'src/app');

module.exports = (env) => {
  const isDev = env == 'development' || env == 'isolated';

  return {
    entry: ["babel-polyfill", 'whatwg-fetch', APP_DIR + '/index.jsx'],
    output: {
      path: BUILD_DIR,
      filename: isDev ? '[name].bundle.js' : '[name].[hash].bundle.js',
      sourceMapFilename: 'bundle.map',
      publicPath: "/"
    },
    module : {
      loaders : [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.(js|jsx)$/, exclude: [/node_modules/, /public/], loader: 'babel-loader'},
        { test: /\.(eot|ttf|woff2?|otf|svg)$/, loaders: ['file-loader'] }
      ]
    },
    resolve: {
      alias: {
                'config': path.join(__dirname, 'src/app/', env) + ".jsx"
            },
      extensions: ['.json', '.js', '.jsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(SRC_DIR, 'index.html'),
        chunksSortMode: 'dependency'
      })
    ].concat(!isDev?[    new UglifyJSPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true
      })]:[])
      ,
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      port: 10000,
      // hot: true,
      compress:true,
      publicPath: '/',
      stats: "minimal"
    },
  };
}

