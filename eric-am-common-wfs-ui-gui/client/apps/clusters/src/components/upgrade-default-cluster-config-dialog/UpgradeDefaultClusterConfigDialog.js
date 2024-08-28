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
import { CANCEL_BUTTON } from "../../../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../../../constants/Events";

const DEFAULT_FORM_DATA = {
  clusterName: "",
  isDefault: true,
  skipSameClusterVerification: true
};

/**
 * Component UpgradeDefaultClusterConfigDialog is defined as
 * `<e-upgrade-default-cluster-config-dialog>`
 *
 * @fires UpgradeDefaultClusterConfigDialog#dialog-button-click
 * @fires UpgradeDefaultClusterConfigDialog#submit
 *
 * @property {boolean} show - show the dialog.
 * @property {boolean} data - full data about table row.
 *
 * Imperatively create component
 * @example
 * let component = new UpgradeDefaultClusterConfigDialog();
 *
 * Declaratively create component
 * @example
 * <e-upgrade-default-cluster-config-dialog></e-upgrade-default-cluster-config-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-upgrade-default-cluster-config-dialog", {
  props: {
    show: { attribute: true, type: "boolean", default: false },
    data: { attribute: true, type: "object" },
    formData: { attribute: true, type: "object", default: DEFAULT_FORM_DATA },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class UpgradeDefaultClusterConfigDialog extends LitComponent {
  constructor() {
    super();

    this.dialogHandler = this.dialogHandler.bind(this);
    this.closeEvent = this.closeEvent.bind(this);
  }

  componentDidReceiveProps(oldValue) {
    const { show } = oldValue;

    if (show === false && this.show === true) {
      this.formData.clusterName = `${this.data.name}.config`;

      this.isLoading = false;
    }
  }

  /**
   * Dialog actions handler
   *
   * @returns {void}
   */
  dialogHandler() {
    this.bubble("submit", this.formData);
    this.isLoading = true;
  }

  /**
   * Close dialog event
   *
   * @event UpgradeClusterConfigDialog#dialog-button-click
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
  const submitLabel = this.isLoading ? "Confirming..." : "Confirm";
  const cancelLabel = this.isLoading ? "Close" : CANCEL_BUTTON;

  return html`
    <eui-base-v0-dialog label="Change default cluster" .show=${this.show} no-cancel>
      <div slot="content">
        <div class="info--wrapper">
          <strong>${this.data.name}</strong> will be set as default cluster, do you want to proceed?
        </div>
      </div>

      <!-- ACTIONS -->
      <eui-base-v0-button slot="bottom" @click=${this.closeEvent}
        >${cancelLabel}</eui-base-v0-button
      >
      <eui-base-v0-button
        slot="bottom"
        primary
        @click=${this.dialogHandler}
        .disabled=${this.isLoading}
        >${submitLabel}</eui-base-v0-button
      >
    </eui-base-v0-dialog>
  `;
}

/**
 * Register the component as e-upgrade-default-cluster-config-dialog.
 * Registration can be done at a later time and with a different name
 */
UpgradeDefaultClusterConfigDialog.register();
