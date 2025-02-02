// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // or 'production'
  
  // Instead of './monolithic.js', point to your main content script:
  entry: {
    contentScript: './src/content-script.js'
  },

  output: {
    filename: '[name].bundle.js', // => dist/contentScript.bundle.js
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three',             // ensures THREE is globally available if needed
      process: 'process/browser'  // for Node polyfills if needed
    })
  ],

  devtool: 'source-map',

  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"),
      "stream": require.resolve("stream-browserify"),
      "constants": require.resolve("constants-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "buffer": require.resolve("buffer/"),
      "assert": require.resolve("assert/"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "crypto": require.resolve("crypto-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      // Modules that aren't needed in the browser:
      "child_process": false,
      "fs": false,
      "module": false,
      "worker_threads": false,
      "uglify-js": false,
      "@swc/core": false,
      "esbuild": false,
      "inspector": false
    }
  },

  module: {
    rules: [
      // If you need Babel or other loaders, add them here
      // Example for Babel:
      /*
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
      */
    ],
  },
};
