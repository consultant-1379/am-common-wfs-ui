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
import { CANCEL_BUTTON, DELETE_NODE_BUTTON } from "../../../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../../../constants/Events";

/**
 * Component DeleteNodeDialog is defined as
 * `<e-delete-node-dialog>`
 *
 * @fires DeleteNodeDialog#dialog-button-click
 * @fires DeleteNodeDialog#submit
 *
 * @property {boolean} show - show the dialog.
 * @property {boolean} data - full data about table row.
 *
 * Imperatively create component
 * @example
 * let component = new DeleteNodeDialog();
 *
 * Declaratively create component
 * @example
 * <e-delete-node-dialog></e-delete-node-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-delete-node-dialog", {
  props: {
    show: { attribute: true, type: "boolean", default: false },
    data: { attribute: true, type: "object" },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class DeleteNodeDialog extends LitComponent {
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
   * Getter for vnf instance name
   *
   * @returns {string}
   */
  get nodeName() {
    const { vnfInstanceName = "" } = this.data;

    return vnfInstanceName;
  }

  /**
   * Dialog actions handler
   *
   * @returns {void}
   */
  dialogHandler() {
    this.bubble("submit", { vnfInstanceId: this.data.instanceId });
    this.isLoading = true;
  }

  /**
   * Close dialog event
   *
   * @event DeleteNodeDialog#dialog-button-click
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
  const submitLabel = this.isLoading ? "Deleting node..." : DELETE_NODE_BUTTON;
  const cancelLabel = this.isLoading ? "Close" : CANCEL_BUTTON;

  return html`
    <eui-base-v0-dialog label="Confirm delete node" .show=${this.show} no-cancel>
      <div slot="content">
        <div class="info--wrapper">
          You are about to delete <strong>${this.nodeName}</strong> from ENM.
        </div>
      </div>

      <!-- ACTIONS -->
      <eui-base-v0-button slot="bottom" @click=${this.closeEvent}
        >${cancelLabel}</eui-base-v0-button
      >
      <eui-base-v0-button
        slot="bottom"
        .disabled=${this.isLoading}
        primary
        @click=${this.dialogHandler}
        >${submitLabel}</eui-base-v0-button
      >
    </eui-base-v0-dialog>
  `;
}

/**
 * Register the component as e-delete-node-dialog.
 * Registration can be done at a later time and with a different name
 */
DeleteNodeDialog.register();
