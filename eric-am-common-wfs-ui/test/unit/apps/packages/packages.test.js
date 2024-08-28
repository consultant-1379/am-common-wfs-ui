/**
 * Integration tests for <e-packages>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/packages/packages.js';

describe('Packages Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-packages>', async () => {
      const element = await fixture('<e-packages></e-packages>');
      const headingTag = element.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your app markup goes here" was not found',
      ).to.equal('Your app markup goes here');
    });
  });
});
