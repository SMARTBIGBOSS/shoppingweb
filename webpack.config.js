const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:  __dirname + "/app/js/main.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
	devtool: 'cheap-module-eval-source-map',
	devServer: {
	   clientLogLevel: 'warning',
	   port: 8080,
	   open: true,
	   contentBase: '/dist'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new webpack.HotModuleReplacementPlugin(),
		//new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
		  template: 'index.template.html'
		})
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
		{
         test: /\.css$/,
         use: ['style-loader','css-loader']
        },
	    {
		  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		  loader: 'url-loader',
		  options: {
			limit: 10000
	      }
		},
		{  
		  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		  loader: 'url-loader',
		  options: {
			limit: 10000
		  }
		}
       ]
    } 
}