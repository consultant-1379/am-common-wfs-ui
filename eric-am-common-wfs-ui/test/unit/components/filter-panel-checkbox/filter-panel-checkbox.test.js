import { expect, fixture } from '@open-wc/testing';
import FilterPanelCheckbox from '../../../../src/components/filter-panel/_components/filter-panel-checkbox/filter-panel-checkbox.js';

describe('FilterPanelCheckbox Component Tests', () => {
  before(() => {
    FilterPanelCheckbox.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-filter-panel-checkbox>', async () => {
      const component = await fixture(
        '<e-filter-panel-checkbox></e-filter-panel-checkbox>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
