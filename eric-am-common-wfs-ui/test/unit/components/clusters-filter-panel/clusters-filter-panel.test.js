import { expect, fixture } from '@open-wc/testing';
import ClustersFilterPanel from '../../../../src/apps/clusters/_components/clusters-filter-panel/clusters-filter-panel.js';

describe('ClustersFilterPanel Component Tests', () => {
  before(() => {
    ClustersFilterPanel.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-clusters-filter-panel>', async () => {
      const component = await fixture(
        '<e-clusters-filter-panel></e-clusters-filter-panel>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
