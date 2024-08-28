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
import style from './deregister-cluster-dialog.css';

/**
 * Component DeregisterClusterDialog is defined as
 * `<e-deregister-cluster-dialog>`
 *
 * @extends {LitComponent}
 */
export default class DeregisterClusterDialog extends LitComponent {
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
    this.bubble('deregister-cluster-dialog:closed', { show: false });
  }

  _onSubmit() {
    // trigger submit event
    this.bubble('deregister-cluster-dialog:submit', {
      clusterName: this.cluster.nameWithExtension,
    });

    // trigger close event
    this._onCancel();
  }

  /**
   * Render the <e-deregister-cluster-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-dialog label="Deregister CISM cluster" ?show=${this.show}>
      <div slot="content">
        <span class="has-font-weight-bold">${this.clusterName}</span>
        <span>will be deregistered, do you want to proceed?</span>
      </div>
      <eui-button slot="cancel" @click=${this._onCancel}>Cancel</eui-button>
      <eui-button slot="bottom" warning @click=${this._onSubmit}
        >Deregister</eui-button
      >
    </eui-dialog>`;
  }
}

/**
 * @property {Boolean} show - show active/inactive state.
 */
definition('e-deregister-cluster-dialog', {
  style,
  props: {
    show: { attribute: true, type: Boolean, default: false },
    cluster: { attribute: false, type: Object },
  },
})(DeregisterClusterDialog);
