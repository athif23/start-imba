const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	module: {
		rules: [
			{
				test: /\.imba$/,
				loader: 'imba/loader',
			},
			{
				test:/\.(s*)css$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].css'
						}
					},
					{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader',
						options: { minimize: true }
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
	resolve: {
		extensions: [".imba",".js",".json"]
	},
	entry: ["./src/client.imba", "./src/styles/index.scss"],
	output: {  path: __dirname + '/dist', filename: "client.js" },
	plugins: [
    new UglifyJsPlugin({
			test: /\.js($|\?)/i
		})
  ]
}