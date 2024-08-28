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

import { string } from 'rollup-plugin-string';
import { fromRollup } from '@web/dev-server-rollup';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';

process.env.NODE_ENV = 'test';

const replaceCss = fromRollup(string);

export default {
  coverage: true,
  coverageConfig: {
    exclude: ['**/node_modules/**/*', '**/web_modules/**/*', '**/npm/**/*'],
    isBlockCoverage: true
  },
  nodeResolve: true,
  mimeTypes: {
    '**/*.css': 'js',
  },
  plugins: [replaceCss({ include: ['src/**/*.css'] })],
  files: 'test/**/*.test.js',
  reporters: [
    defaultReporter({ reportTestResults: false, reportTestProgress: true }),
    junitReporter({
      outputPath: './coverage/junit/test-results.xml',
      reportLogs: true,
    })
  ],
};
