import { expect, fixture } from '@open-wc/testing';
import DetailsPanelItem from '../../../../src/components/details-panel/_components/details-panel-item/details-panel-item.js';

describe('DetailsPanelItem Component Tests', () => {
  before(() => {
    DetailsPanelItem.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-details-panel-item>', async () => {
      const component = await fixture(
        '<e-details-panel-item></e-details-panel-item>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
