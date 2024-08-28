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

// services
import { storage, STORAGE_KEYS } from '../../../services/storage.service';

// styles
import style from './make-default-cluster-dialog.css';

const DEFAULT_FORM_DATA = {
  clusterName: '',
  isDefault: true,
  skipSameClusterVerification: true,
};

/**
 * Component MakeDefaultClusterDialog is defined as
 * `<e-make-default-cluster-dialog>`
 *
 * @extends {LitComponent}
 */
export default class MakeDefaultClusterDialog extends LitComponent {
  constructor() {
    super();

    this._onCancel = this._onCancel.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  static get components() {
    return {
      'eui-dialog': Dialog,
      'eui-button': Button,
    };
  }

  get clusterName() {
    return this?.cluster?.name || '';
  }

  didChangeProps(changedProps) {
    if (changedProps.has('show')) {
      this.cluster = storage.getItemObj(STORAGE_KEYS.ACTION_ROW_DATA);
    }
  }

  _onCancel() {
    this.bubble('make-default-cluster-dialog:closed', { show: false });
  }

  _onSubmit() {
    // trigger submit event
    this.bubble('make-default-cluster-dialog:submit', {
      ...this.formData,
      clusterName: this.cluster.nameWithExtension,
    });

    // trigger close event
    this._onCancel();
  }

  /**
   * Render the <e-make-default-cluster-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-dialog label="Change default cluster" ?show=${this.show}>
      <div slot="content">
        <span class="has-font-weight-bold">${this.clusterName}</span>
        <span>will be set as default cluster, do you want to proceed?</span>
      </div>
      <eui-button slot="cancel" @click=${this._onCancel}>Cancel</eui-button>
      <eui-button slot="bottom" primary @click=${this._onSubmit}
        >Confirm</eui-button
      >
    </eui-dialog>`;
  }
}

/**
 * @property {Boolean} show - show active/inactive state.
 */
definition('e-make-default-cluster-dialog', {
  style,
  props: {
    show: { attribute: true, type: Boolean, default: false },
    cluster: { attribute: false, type: Object },
    formData: { attribute: false, type: 'object', default: DEFAULT_FORM_DATA },
  },
})(MakeDefaultClusterDialog);
