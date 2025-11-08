const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: './'  // ⬅️ penting! agar path asset sesuai di GitHub Pages
  },
  devtool: 'inline-source-map',
  
  devServer: {
    static: './dist',
    historyApiFallback: true, // agar SPA tidak error saat reload
    port: 8080,
    hot: true,
    proxy: {
      '/api': {
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      title: 'StoryMapApp'
    })
  ],

  resolve: {
    extensions: ['.js']
  },

  optimization: {
    splitChunks: { chunks: 'all' }
  }
};
