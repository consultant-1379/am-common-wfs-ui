/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */
const path = require("path");

module.exports = {
  mode: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "client/api"),
          path.resolve(__dirname, "client/apps"),
          path.resolve(__dirname, "client/components"),
          path.resolve(__dirname, "client/panels"),
          path.resolve(__dirname, "client/plugins"),
          path.resolve(__dirname, "client/utils")
        ],
        loader: "babel-loader",
        options: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }]
          ]
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules|test|\-test\.js$/,
        loader: "istanbul-instrumenter-loader",
        options: { esModules: true },
        enforce: "post"
      },
      {
        test: /\.(html)/,
        use: {
          loader: "raw-loader",
          options: {
            exportAsEs6Default: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      }
    ]
  }
};
