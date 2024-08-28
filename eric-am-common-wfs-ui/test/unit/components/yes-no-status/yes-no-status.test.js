import { expect, fixture } from '@open-wc/testing';
import YesNoStatus from '../../../../src/components/statuses/yes-no-status/yes-no-status.js';

describe('YesNoStatus Component Tests', () => {
  before(() => {
    YesNoStatus.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-yes-no-status>', async () => {
      const component = await fixture('<e-yes-no-status></e-yes-no-status>');
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
