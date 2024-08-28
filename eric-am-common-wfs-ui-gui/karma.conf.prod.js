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
    singleRun: true,
    autoWatch: false,
    frameworks: ["mocha"],
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--headless", "--no-sandbox"]
      }
    },
    files: [
      "polyfills/**/*.js",
      "node_modules/@eui/container/target/package/polyfills/**/*.js",
      "test/webpackEntry.js"
    ],
    plugins: [
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-mocha",
      "karma-webpack",
      "karma-coverage-istanbul-reporter",
      "karma-mocha-reporter",
      "karma-junit-reporter"
    ],
    preprocessors: {
      "./test/webpackEntry.js": ["webpack"]
    },
    webpack: require("./webpack.config.test.karma.prod.js"),
    webpackMiddleware: {
      stats: "errors-only"
    },
    reporters: ["coverage-istanbul", "mocha", "junit"],
    coverageIstanbulReporter: {
      dir: "test/coverage",
      reports: ["html"],
      fixWebpackSourcePaths: true,
      combineBrowserReports: true
    },
    mochaReporter: {
      showDiff: true
    },
    junitReporter: {
      outputDir: "test/junit"
    }
  };
  config.set(karmaConfig);
};
