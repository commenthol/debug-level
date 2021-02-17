const path = require('path')

module.exports = {
  entry: '', // karma will set this
  output: '', // karma will set this
  // devtool: 'inline-source-map',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      lib: path.resolve(__dirname, 'lib')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
