// Import Webpack npm module
const path = require('path')
var WebpackFtpUpload = require('webpack-ftp-upload-plugin')
 
const ftpUpload = new WebpackFtpUpload({
    host: 'host',
    username: 'user',
    password: 'pass',
    local: path.join(__dirname,'assets'), // eg. path.join(__dirname, 'dist')
    path: "./www/elsie.store/wp-content/plugins/components-composite/assets", // eg. /var/www/ftp/
})       

module.exports = {
  // Which file is the entry point to the application
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets/js'),
    sourceMapFilename: 'bundle.map.js'
  },
  plugins:[
    ftpUpload
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
}