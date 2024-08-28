import { expect, fixture } from '@open-wc/testing';
import ClustersDetailsPanel from '../../../../src/components/details-panel/clusters-details-panel/clusters-details-panel.js';

describe('ClustersDetailsPanel Component Tests', () => {
  before(() => {
    ClustersDetailsPanel.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-clusters-details-panel>', async () => {
      const component = await fixture(
        '<e-clusters-details-panel></e-clusters-details-panel>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
