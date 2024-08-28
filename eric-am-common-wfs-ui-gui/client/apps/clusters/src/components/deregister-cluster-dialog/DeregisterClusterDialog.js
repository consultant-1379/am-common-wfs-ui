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
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

// helpers
import { CANCEL_BUTTON, DEREGISTER_CLUSTER_BUTTON } from "../../../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../../../constants/Events";

/**
 * Component DeregisterClusterDialog is defined as
 * `<e-deregister-cluster-dialog>`
 *
 * @fires DeregisterClusterDialog#dialog-button-click
 * @fires DeregisterClusterDialog#submit
 *
 * @property {boolean} show - show the dialog.
 * @property {boolean} data - full data about table row.
 *
 * Imperatively create component
 * @example
 * let component = new DeregisterClusterDialog();
 *
 * Declaratively create component
 * @example
 * <e-deregister-cluster-dialog></e-deregister-cluster-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-deregister-cluster-dialog", {
  props: {
    show: { attribute: true, type: "boolean", default: false },
    data: { attribute: true, type: "object" },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class DeregisterClusterDialog extends LitComponent {
  constructor() {
    super();

    this.dialogHandler = this.dialogHandler.bind(this);
    this.closeEvent = this.closeEvent.bind(this);
  }

  componentDidReceiveProps(oldValue) {
    const { show } = oldValue;

    if (show === false && this.show === true) {
      this.isLoading = false;
    }
  }

  /**
   * Getter for cluster name with suffix
   *
   * @returns {string}
   */
  get clusterName() {
    const { name } = this.data;

    return `${name}.config`;
  }

  /**
   * Dialog actions handler
   *
   * @returns {void}
   */
  dialogHandler() {
    this.bubble("submit", { clusterName: this.clusterName });
    this.isLoading = true;
  }

  /**
   * Close dialog event
   *
   * @event DeregisterClusterDialog#dialog-button-click
   * @type {boolean}
   */
  closeEvent() {
    this.bubble(DIALOG_BUTTON_CLICK_EVENT, { selected: CANCEL_BUTTON });
  }

  render() {
    return this.show ? renderDialogTemplate.call(this) : null;
  }
}

/**
 * Basic dialog template
 *
 * @private
 * @returns {object}
 */
function renderDialogTemplate() {
  const submitLabel = this.isLoading ? "Deregistering..." : DEREGISTER_CLUSTER_BUTTON;
  const cancelLabel = this.isLoading ? "Close" : CANCEL_BUTTON;

  return html`
    <eui-base-v0-dialog label="Deregister CISM cluster" .show=${this.show} no-cancel>
      <div slot="content">
        <div class="info--wrapper">
          <strong>${this.data.name}</strong> will be deregistered, do you want to proceed?
        </div>
      </div>

      <!-- ACTIONS -->
      <eui-base-v0-button slot="bottom" @click=${this.closeEvent}
        >${cancelLabel}</eui-base-v0-button
      >
      <eui-base-v0-button
        slot="bottom"
        .disabled=${this.isLoading}
        warning
        @click=${this.dialogHandler}
        >${submitLabel}</eui-base-v0-button
      >
    </eui-base-v0-dialog>
  `;
}

/**
 * Register the component as e-deregister-cluster-dialog.
 * Registration can be done at a later time and with a different name
 */
DeregisterClusterDialog.register();
