const MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  // devtool: 'inline-source-map',
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new MinifyPlugin({mangle: false})
  ]
}
