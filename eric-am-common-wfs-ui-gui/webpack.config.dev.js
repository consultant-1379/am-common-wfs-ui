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
const majorVersion = require("./package.json").version.match(/^\d+/)[0];
const path = require("path");

const clientRoot = "client";

const getExternalsEntries = () => {
  const obj = {};
  const externals = require("./externals.config.dev");
  Object.keys(externals).forEach(category => {
    const items = externals[category];
    if (category === "components") {
      Object.keys(items).forEach(categoryItem => {
        if (categoryItem === "default") {
          items[categoryItem].forEach(item => {
            const { path: itemPath, entry } = item;
            const ip = path.join(category, itemPath, "Main");
            const op = path.resolve(
              __dirname,
              clientRoot,
              category,
              itemPath,
              "src",
              `${entry}.js`
            );
            console.log(`[${ip}]: ${op}`);
            obj[ip] = op;
          });
          return;
        }

        if (categoryItem === "shareable") {
          items[categoryItem].forEach(item => {
            const { path: itemPath, entry } = item;
            const ip = path.join(category, itemPath, majorVersion, "Main");
            const op = path.resolve(
              __dirname,
              clientRoot,
              category,
              itemPath,
              "src",
              `${entry}.js`
            );
            console.log(`[${ip}]: ${op}`);
            obj[ip] = op;
          });
        }
      });
    } else {
      items.forEach(item => {
        const { path: itemPath, entry } = item;
        const ip = path.join(category, itemPath, entry);
        const op = path.resolve(__dirname, clientRoot, category, itemPath, "src", `${entry}.js`);
        console.log(`[${ip}]: ${op}`);
        obj[ip] = op;
      });
    }
  });

  return obj;
};

const externalsConfig = {
  entry: getExternalsEntries(),
  output: {
    path: path.resolve(__dirname, clientRoot),
    filename: "[name].js",
    libraryTarget: "amd"
  },
  externals: {
    "@eui/component": "amd @eui/component",
    "@eui/lit-component": "amd @eui/lit-component",
    "@eui/panel": "amd @eui/panel",
    "@eui/app": "amd @eui/app",
    "@eui/base": "amd @eui/base",
    "user-management": "amd user-management",
    "base-filter-panel": "amd base-filter-panel",
    "resource-filter-panel": "amd resource-filter-panel",
    "packages-filter-panel": "amd packages-filter-panel",
    "operations-filter-panel": "amd operations-filter-panel",
    "generic-dialog": "amd generic-dialog",
    "operations-history-list": "amd operations-history-list",
    "upgrade-wizard-component": "amd upgrade-wizard-component",
    "operations-details-panel": "amd operations-details-panel",
    "resource-operations-details": "amd resource-operations-details",
    "generic-inline-description": "amd generic-inline-description",
    "documentation-system-bar-menu": "amd documentation-system-bar-menu",
    "generic-accordion": "amd generic-accordion",
    "file-content-dialog": "amd file-content-dialog",
    "file-upload-dialog": "amd file-upload-dialog",
    "heal-resource-panel": "amd heal-resource-panel",
    "resource-backups-details": "amd resource-backups-details",
    "resource-backups-list": "amd resource-backups-list",
    "backup-local-dialog": "amd backup-local-dialog",
    "export-backup-dialog": "amd export-backup-dialog",
    "clusters-filter-panel": "amd clusters-filter-panel",
    "unavailable-page-component": "amd unavailable-page-component",
    "banner-component": "amd banner-component",
    "version-system-bar-menu": "amd version-system-bar-menu",
    "force-fail-dialog": "amd force-fail-dialog",
    "generic-key-map-card": "amd generic-key-map-card",
    "generic-key-map-card-group": "amd generic-key-map-card-group",
    "generic-key-value-file-text-input": "amd generic-key-value-text-input",
    "generic-file-input": "amd generic-file-input",
    "generic-key-value-pair-input": "amd generic-key-value-pair-input",
    "generic-key-value-pair-input-group": "amd generic-key-value-pair-input-group",
    "resource-rollback-panel": "amd resource-rollback-panel"
  }
};

const config = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: [path.resolve(__dirname, "client")],
    before: require("./dev/mock-server-dev"),
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "client/components"),
          path.resolve(__dirname, "client/panels"),
          path.resolve(__dirname, "client/plugins"),
          path.resolve(__dirname, "client/apps")
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

module.exports = () =>
  new Promise(resolve => {
    const _externalsConfig = Object.assign({}, config, externalsConfig);
    resolve(_externalsConfig);
  });
