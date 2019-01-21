const webpack = require("webpack");
const paths = require('./paths');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: [
    'babel-polyfill',
    require.resolve('./polyfills'),
    "./src/components/AionPayButton.js",
  ],
  devtool: "source-map",
  output: {
    path: paths.appBuild,
    filename: "aion_pay.js"
  },
  module: {
    rules: [
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' },
      {
        test: /\.(js|jsx|mjs)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new UglifyJSPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ]
};