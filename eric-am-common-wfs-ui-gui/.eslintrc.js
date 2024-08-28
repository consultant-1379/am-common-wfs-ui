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
module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  globals: {
    window: true,
    customElements: true,
    CustomEvent: true,
    browser: true,
    document: true,
    localStorage: true,
    FormData: true,
    mocha: true,
    describe: true,
    before: true,
    after: true,
    beforeEach: true,
    afterEach: true,
    it: true,
    __VERSION__: false,
    Event: true
  },
  rules: {
    //disagree with these
    // "import/no-useless-path-segments": 0,
    "no-underscore-dangle": 0,
    "class-methods-use-this": 0,
    //prettier with handle this. issue with indenting template literals
    indent: 0,
    //TODO - broken with JSCore currently
    "import/no-unresolved": 0,
    "import/extensions": 0,
    //reassigning CustomEvent detail is common pattern
    "no-param-reassign": 0,
    //as project is small, many files that will export multiple only export one thing
    "import/prefer-default-export": 0,
    "linebreak-style": 0,
    "no-console": 0,
    "no-empty": 0,
    //Used for pretty code
    "prettier/prettier": "error",
    "no-debugger": 2,
    "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }]
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
};
