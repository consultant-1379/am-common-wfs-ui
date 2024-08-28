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

/**
 * Integration tests for <e-user-administration>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/user-administration/user-administration.js';

describe('UserAdministration Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-user-administration>', async () => {
      const element = await fixture(
        '<e-user-administration></e-user-administration>',
      );

      expect(
        headingTag.textContent,
        '<e-user-administration> component failed to create',
      ).notEqual(null);
    });
  });
});
