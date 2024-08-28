import { expect, fixture } from '@open-wc/testing';
import RegisterClusterDialog from '../../../../src/components/dialogs/register-cluster-dialog/register-cluster-dialog.js';

describe('RegisterClusterDialog Component Tests', () => {
  before(() => {
    RegisterClusterDialog.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-register-cluster-dialog>', async () => {
      const component = await fixture(
        '<e-register-cluster-dialog></e-register-cluster-dialog>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
