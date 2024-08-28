import { expect, fixture } from '@open-wc/testing';
import ContextCell from '../../../../src/components/context-cell/context-cell.js';

describe('ContextCell Component Tests', () => {
  before(() => {
    ContextCell.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-context-cell>', async () => {
      const component = await fixture(
        '<e-context-cell></e-context-cell>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
