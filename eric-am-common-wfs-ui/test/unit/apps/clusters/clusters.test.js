/**
 * Integration tests for <e-clusters>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/clusters/clusters.js';

describe('MyApp Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-clusters>', async () => {
      const element = await fixture('<e-clusters></e-clusters>');
      const headingTag = element.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your app markup goes here" was not found',
      ).to.equal('Your app markup goes here');
    });
  });
});
