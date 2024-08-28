import { expect, fixture } from '@open-wc/testing';
import OperationsFilterPanel from '../../../../src/components/filter-panel/operations-filter-panel/operations-filter-panel.js';

describe('OperationsFilterPanel Component Tests', () => {
  before(() => {
    OperationsFilterPanel.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-operations-filter-panel>', async () => {
      const component = await fixture(
        '<e-operations-filter-panel></e-operations-filter-panel>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
