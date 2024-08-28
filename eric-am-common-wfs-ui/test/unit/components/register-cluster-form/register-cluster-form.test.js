import { expect, fixture } from '@open-wc/testing';
import RegisterClusterForm from '../../../../src/components/dialogs/register-cluster-dialog/_components/register-cluster-form/register-cluster-form.js';

describe('RegisterClusterForm Component Tests', () => {
  before(() => {
    RegisterClusterForm.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-register-cluster-form>', async () => {
      const component = await fixture(
        '<e-register-cluster-form></e-register-cluster-form>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
