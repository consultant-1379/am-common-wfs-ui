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

// components
import "../../../../generic-dialog/src/GenericDialog";
import { OK_BUTTON } from "../../../../../constants/Messages";

// helpers
import { DialogModel } from "../../../../generic-dialog/src/DialogModel";

/**
 * Component SupportedOperationsErrorDialog is defined as
 * `<e-supported-operations-error-dialog>`
 *
 * @fires SupportedOperationsErrorDialog#dialog:closed
 *
 * @property {object} data - error object.
 * @property {boolean} show - visible state of dialog.
 *
 * Imperatively create component
 * @example
 * let component = new SupportedOperationsErrorDialog();
 *
 * Declaratively create component
 * @example
 * <e-supported-operations-error-dialog></e-supported-operations-error-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-supported-operations-error-dialog", {
  props: {
    data: { attribute: true, type: "object", default: {} },
    show: { attribute: true, type: "boolean", default: false }
  }
})
export default class SupportedOperationsErrorDialog extends LitComponent {
  constructor() {
    super();

    this.dialogHandler = this.dialogHandler.bind(this);
  }

  componentDidReceiveProps() {
    if (this.show) {
      const { operationName, error } = this.data;

      this.dialogOpts = new DialogModel(`${operationName} error`, error);
      this.dialogOpts.setButtonLabels([OK_BUTTON]);
    }
  }

  /**
   * Handler for close event
   *
   * @event SupportedOperationsErrorDialog#dialog:closed
   * @returns {void}
   */
  dialogHandler() {
    this.bubble("dialog:closed");
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
  return html`
    <e-generic-dialog
      .dialogModel=${this.dialogOpts}
      @dialog-button-click=${this.dialogHandler}
    ></e-generic-dialog>
  `;
}

/**
 * Register the component as e-sync-dialog.
 * Registration can be done at a later time and with a different name
 */
SupportedOperationsErrorDialog.register();
