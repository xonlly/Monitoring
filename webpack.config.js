var path = require('path');
var plugins = [];

module.exports = {
  entry : {
    'build' : path.join(__dirname, 'www/js/core.js')
  },

  output : {
    path: path.join(__dirname, 'www/js'),
    filename: '[name].js',
    publicPath: '/',
  },

/*  resolve: {
    extensions: [
      ".js",
    ],
  },*/

  module : {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'babel?stage=0'
        ]
      }
    ]
  },

  plugins: plugins
};
