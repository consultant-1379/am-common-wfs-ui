import { expect, fixture } from '@open-wc/testing';
import ClustersTable from '../../../../src/apps/clusters/_components/clusters-table/clusters-table.js';

describe('ClustersTable Component Tests', () => {
  before(() => {
    ClustersTable.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-clusters-table>', async () => {
      const component = await fixture('<e-clusters-table></e-clusters-table>');
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
