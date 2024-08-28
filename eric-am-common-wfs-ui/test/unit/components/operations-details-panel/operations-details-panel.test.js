import { expect, fixture } from '@open-wc/testing';
import OperationsDetailsPanel from '../../../../src/components/details-panel/operations-details-panel/operations-details-panel.js';

describe('OperationsDetailsPanel Component Tests', () => {
  before(() => {
    OperationsDetailsPanel.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-operations-details-panel>', async () => {
      const component = await fixture(
        '<e-operations-details-panel></e-operations-details-panel>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
