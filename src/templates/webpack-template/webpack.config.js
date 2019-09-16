let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.imba$/,
        loader: 'imba/loader',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ],
  },
  devServer: {
        historyApiFallback: true,
  },
  resolve: {
    extensions: [".imba", ".js", ".json", ".scss"]
  },
  entry: ["./source/index.imba", "./source/index.scss"],
  output: {  path: __dirname + '/public', filename: "client.js" },
  plugins: [
    new ExtractTextPlugin('index.css')
  ]
}