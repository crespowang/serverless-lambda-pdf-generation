const webpack = require("webpack");
const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const WebpackPluginCopy = require("inq-webpack-plugin-copy");
module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  node: {
    __dirname: true
  },

  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: true
                }
              }
            ],
            "@babel/typescript"
          ]
        },
        include: [__dirname],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development"
    }),
    new WebpackPluginCopy([
      {
        from: "bin/wkhtmltopdf",
        to: "wkhtmltopdf",
        toType: "file",
        copyPermissions: true
      }
    ])
  ]
};
