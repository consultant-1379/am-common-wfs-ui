import { expect, fixture } from '@open-wc/testing';
import OperationsTable from '../../../../src/components/tables/operations-table/operations-table.js';

describe('OperationsTable Component Tests', () => {
  before(() => {
    OperationsTable.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-operations-table>', async () => {
      const component = await fixture(
        '<e-operations-table></e-operations-table>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
