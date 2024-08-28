import { expect, fixture } from '@open-wc/testing';
import ContextMenu from '../../../../src/components/context-menu/context-menu.js';

describe('ContextMenu Component Tests', () => {
  before(() => {
    ContextMenu.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-context-menu>', async () => {
      const component = await fixture(
        '<e-context-menu></e-context-menu>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
