/**
 * Integration tests for <e-operations>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/operations/operations.js';

describe('Operations Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-operations>', async () => {
      const element = await fixture('<e-operations></e-operations>');
      const headingTag = element.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your app markup goes here" was not found',
      ).to.equal('Your app markup goes here');
    });
  });
});
