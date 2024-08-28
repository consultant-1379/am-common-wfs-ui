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
import UpdateClusterForm from './_components/update-cluster-form/update-cluster-form.js';

// services
import { storage, STORAGE_KEYS } from '../../../services/storage.service';

// styles
import style from './update-cluster-dialog.css';

/**
 * Component UpdateClusterDialog is defined as
 * `<e-update-cluster-dialog>`
 *
 * @extends {LitComponent}
 */
export default class UpdateClusterDialog extends LitComponent {
  constructor() {
    super();

    this._onCancel = this._onCancel.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  static get components() {
    return {
      'eui-dialog': Dialog,
      'eui-button': Button,
      'e-update-cluster-form': UpdateClusterForm,
    };
  }

  get clusterName() {
    return this?.cluster?.name || '';
  }

  get formEl() {
    if (this?.shadowRoot?.querySelector) {
      return this.shadowRoot.querySelector('e-update-cluster-form');
    }
    return null;
  }

  didChangeProps(changedProps) {
    if (changedProps.has('show')) {
      this.cluster = storage.getItemObj(STORAGE_KEYS.ACTION_ROW_DATA);
    }
  }

  _onCancel() {
    this.bubble('update-cluster-dialog:closed', { show: false });
  }

  async _onSubmit() {
    const isValid = await this.formEl.validateForm();

    if (isValid) {
      // trigger submit event
      this.bubble('update-cluster-dialog:submit', { ...this.formEl.formData });

      // trigger close event
      this._onCancel();
    }
  }

  /**
   * Render the <e-update-cluster-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-dialog label="Update cluster config" ?show=${this.show}>
      <div slot="content">
        <div class="form--info">
          Update cluster config for '${this.clusterName}'
        </div>

        ${this.show
          ? html`<e-update-cluster-form
              .cluster=${this.cluster}
            ></e-update-cluster-form>`
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
definition('e-update-cluster-dialog', {
  style,
  props: {
    show: { attribute: true, type: Boolean, default: false },
    cluster: { attribute: false, type: Object },
  },
})(UpdateClusterDialog);
