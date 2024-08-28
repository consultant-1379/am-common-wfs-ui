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
module.exports = config => {
  const karmaConfig = {
    basePath: "",
    hostname: "localhost",
    listenAddress: "localhost",
    port: 9876,
    colors: true,
    singleRun: false,
    autoWatch: true,
    frameworks: ["mocha"],
    browsers: ["ChromeDev", "Firefox"],
    customLaunchers: {
      ChromeDev: {
        base: "Chrome",
        flags: ["--disable-gpu", "--disable-translate", "--disable-extensions"]
      }
    },
    files: [
      "client/polyfills/**/*.js",
      "node_modules/@eui/container/target/package/polyfills/**/*.js",
      "test/webpackEntry.js"
    ],
    plugins: [
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-mocha",
      "karma-webpack",
      "karma-mocha-reporter"
    ],
    preprocessors: {
      "./test/webpackEntry.js": ["webpack"]
    },
    webpack: require("./webpack.config.test.karma.dev.js"),
    webpackMiddleware: {
      stats: "errors-only"
    },
    reporters: ["mocha"],
    mochaReporter: {
      divider: "-",
      showDiff: true,
      output: "autowatch"
    }
  };

  config.set(karmaConfig);
};
