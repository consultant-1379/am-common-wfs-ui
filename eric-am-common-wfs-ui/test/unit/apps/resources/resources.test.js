/**
 * Integration tests for <e-resources>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/resources/resources.js';

describe('Resources Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-resources>', async () => {
      const element = await fixture('<e-resources></e-resources>');
      const headingTag = element.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your app markup goes here" was not found',
      ).to.equal('Your app markup goes here');
    });
  });
});
