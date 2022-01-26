const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

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
    'perfecty-push-sw': './src/service-worker.js',
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 9000
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  plugins: [new ESLintPlugin()],
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
