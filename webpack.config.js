var path = require('path');

module.exports = {
    entry: {
      client : "./src/client.js",
      server : "./src/server.js"
    },

    output: {
        path: __dirname,
        filename: "./dist/[name].js"
    },

    resolve: {
      extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx', '.json', 'index.json']
    },

    module: {
      preLoaders: [
          { test: /\.json$/, loader: "json-loader" }
      ],

      loaders: [
        {
          loader: "babel-loader",

          // Skip any files outside of your project's `src` directory
          include: [
            path.resolve(__dirname, "src"),
          ],

          exclude: [/node_modules/],

          // Only run `.js` and `.jsx` files through Babel
          test: /\.js?$/,

          // Options to configure babel with
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'stage-0'/*, 'react'*/],
          }
        },
      ]
    }
};
