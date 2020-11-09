// Import Webpack npm module
const path = require('path')
var WebpackFtpUpload = require('webpack-ftp-upload-plugin')
 
const ftpUpload = new WebpackFtpUpload({
    host: '31.31.198.27',
    username: 'u1009822',
    password: 'BqPv7i_z',
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
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader', 
        options: {
          limit: 10000
        }
      }
    ]
  }
}