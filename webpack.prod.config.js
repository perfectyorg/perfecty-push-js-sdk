const path = require('path')

module.exports = {
  entry: {
    'perfecty-push-sdk': './src/app.js',
    'perfecty-push-sw': './src/service-worker.js'
  },
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
