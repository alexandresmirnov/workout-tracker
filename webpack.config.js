// In webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});
module.exports = {
	entry: [
		'./app/index.js'
	],
	output: {
		path: __dirname + '/app/dist',
		filename: "index_bundle.js"
	},
	module: {
		loaders: [
		{test: /\.js$/, include: __dirname + '/app', loader: "babel-loader"}
		]
	},
	plugins: [HTMLWebpackPluginConfig]
};