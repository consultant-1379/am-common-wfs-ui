import { expect, fixture } from '@open-wc/testing';
import DeregisterClusterDialog from '../../../../src/components/dialogs/deregister-cluster-dialog/deregister-cluster-dialog.js';

describe('DeregisterClusterDialog Component Tests', () => {
  before(() => {
    DeregisterClusterDialog.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-deregister-cluster-dialog>', async () => {
      const component = await fixture(
        '<e-deregister-cluster-dialog></e-deregister-cluster-dialog>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
