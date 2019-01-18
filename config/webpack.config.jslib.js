const webpack = require("webpack");
const paths = require('./paths');

module.exports = {
  entry: {
    "bundle": "./src/components/AionPayButton.js",
  },
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
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
};