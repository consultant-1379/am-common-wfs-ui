import { expect, fixture } from '@open-wc/testing';
import UpdateClusterDialog from '../../../../src/components/dialogs/update-cluster-dialog/update-cluster-dialog.js';

describe('UpdateClusterDialog Component Tests', () => {
  before(() => {
    UpdateClusterDialog.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-update-cluster-dialog>', async () => {
      const component = await fixture(
        '<e-update-cluster-dialog></e-update-cluster-dialog>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
