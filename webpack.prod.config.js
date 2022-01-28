const path = require('path')

module.exports = {
  entry: {
    'perfecty-push-sdk': {
      import: './src/app.js',
      library: {
        name: 'PerfectyPush',
        type: 'var',
        export: 'default'
      }
    },
    'perfecty-push-sw': './src/service-worker.js'
  },
  mode: 'production',
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
