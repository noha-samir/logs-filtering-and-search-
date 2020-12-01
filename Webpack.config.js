const PORT = process.env.PORT;
const HOST = process.env.HOST;
   const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
      entry: 'index.js',
      plugins: [
        new HtmlWebpackPlugin({
          inject: false,
          template: './template.html',

          // Pass the full url with the key!
          apiUrl: `http://${process.env.HOST}:${process.env.PORT}`,

        })
      ]
    }