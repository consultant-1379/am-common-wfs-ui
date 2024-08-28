import { expect, fixture } from '@open-wc/testing';
import MakeDefaultClusterDialog from '../../../../src/components/dialogs/make-default-cluster-dialog/make-default-cluster-dialog.js';

describe('MakeDefaultClusterDialog Component Tests', () => {
  before(() => {
    MakeDefaultClusterDialog.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-make-default-cluster-dialog>', async () => {
      const component = await fixture(
        '<e-make-default-cluster-dialog></e-make-default-cluster-dialog>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
