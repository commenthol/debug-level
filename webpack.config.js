var path = require('path')

module.exports = {
  entry: '', // karma will set this
  output: '', // karma will set this
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'lib': path.resolve(__dirname, 'lib')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test')
        ]
      }
    ]
  }
}
