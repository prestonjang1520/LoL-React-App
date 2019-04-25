const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'index_bundle.js'
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}, 
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
				loader: 'url-loader?limit=100000' 
			}
		]
   },
   node: {
    fs: "empty"
  },
   plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
   ]
};