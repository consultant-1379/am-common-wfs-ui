/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */

// common libraries
import { LitComponent, html, definition } from '@eui/lit-component';

// components
import { Button } from '@eui/base/button';
import { Dialog } from '@eui/base/dialog';
import RegisterClusterForm from './_components/register-cluster-form/register-cluster-form.js';

// styles
import style from './register-cluster-dialog.css';

/**
 * Component RegisterClusterDialog is defined as
 * `<e-register-cluster-dialog>`
 *
 * @extends {LitComponent}
 */
export default class RegisterClusterDialog extends LitComponent {
  constructor() {
    super();

    this._onCancel = this._onCancel.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  static get components() {
    return {
      'eui-dialog': Dialog,
      'eui-button': Button,
      'e-register-cluster-form': RegisterClusterForm,
    };
  }

  get formEl() {
    if (this?.shadowRoot?.querySelector) {
      return this.shadowRoot.querySelector('e-register-cluster-form');
    }
    return null;
  }

  _onCancel() {
    this.bubble('register-cluster-dialog:closed', { show: false });
  }

  async _onSubmit() {
    const isValid = await this.formEl.validateForm();

    if (isValid) {
      // trigger submit event
      this.bubble('register-cluster-dialog:submit', {
        ...this.formEl.formData,
      });
      // trigger close event
      this._onCancel();
    }
  }

  /**
   * Render the <e-register-cluster-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-dialog label="Register cluster" ?show=${this.show}>
      <div slot="content">
        ${this.show
          ? html`<e-register-cluster-form></e-register-cluster-form>`
          : null}
      </div>
      <eui-button slot="cancel" @click=${this._onCancel}>Cancel</eui-button>
      <eui-button slot="bottom" primary @click=${this._onSubmit}
        >Upload</eui-button
      >
    </eui-dialog>`;
  }
}

/**
 * @property {Boolean} show - show active/inactive state.
 */
definition('e-register-cluster-dialog', {
  style,
  props: {
    show: { attribute: true, type: Boolean, default: false },
  },
})(RegisterClusterDialog);
