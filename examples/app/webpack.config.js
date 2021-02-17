// const MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  mode: 'development',
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    // new MinifyPlugin({ mangle: false })
  ]
}
