const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
	new MiniCssExtractPlugin({
	  filename: '[name].[hash].css',
	  chunkFilename: '[id].[hash].css',
	}),
	new HtmlWebPackPlugin({
	  filename: "index.html",
	  template: "source/index.html"
	})
  ],
  module: {
	rules: [
	  {
		test: /\.imba$/,
		loader: 'imba/loader',
	  },
	  {
		test: /\.html$/,
		use: [
		  {
			loader: "html-loader",
			options: { minimize: true }
		  }
		]
	  },
	  {
		test: /\.css$/,
		use: [
		  {
			loader: MiniCssExtractPlugin.loader,
			options: {
			  hmr: process.env.NODE_ENV === 'development',
			},
		  },
		  'css-loader'
		],
	  },
	],
  },
  devServer: {
	historyApiFallback: true,
  },
  resolve: {
	extensions: [".imba", ".js", ".json", ".css"]
  },
  entry: ["./source/index.imba", "./source/index.css", "./source/index.html"],
  output: {  path: __dirname + '/public', filename: '[name].[contenthash].js' }
}