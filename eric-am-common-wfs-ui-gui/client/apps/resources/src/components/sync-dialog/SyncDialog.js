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
import {
  CANCEL_BUTTON,
  SYNC_BUTTON,
  INVALID_TIMEOUT_ERR_MSG,
  SYNC_TIMEOUT_LABEL
} from "../../../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../../../constants/Events";
import { isValidTimeoutRange } from "../../../../../utils/CommonUtils";

// styles
import style from "./SyncDialog.css";

// consts
const DEFAULT_TIMEOUT = 3600;

/**
 * Component SyncDialog is defined as
 * `<e-sync-dialog>`
 *
 * @fires SyncDialog#dialog-button-click
 * @fires SyncDialog#submit
 *
 * @property {boolean} value - value of the timeout input.
 * @property {boolean} show - show the dialog.
 * @property {boolean} data - full data about table row.
 *
 * Imperatively create component
 * @example
 * let component = new SyncDialog();
 *
 * Declaratively create component
 * @example
 * <e-sync-dialog></e-sync-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-sync-dialog", {
  style,
  props: {
    value: { attribute: false, type: "string", default: DEFAULT_TIMEOUT },
    show: { attribute: true, type: "boolean", default: false },
    data: { attribute: true, type: "object" }
  }
})
export default class SyncDialog extends LitComponent {
  constructor() {
    super();

    this.dialogHandler = this.dialogHandler.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.closeEvent = this.closeEvent.bind(this);
  }

  componentDidReceiveProps(oldValue) {
    const { show } = oldValue;

    if (show === false && this.show === true) {
      this.value = DEFAULT_TIMEOUT;
    }
  }

  get isValid() {
    return isValidTimeoutRange(Number(this.value));
  }

  /**
   * Input handler
   *
   * @param {object}: event - event of input
   * @returns {void}
   */
  inputHandler(event) {
    const { value } = event.target;

    this.value = value;
  }

  /**
   * Dialog actions handler
   *
   * @param {object}: event - event of input
   * @returns {void}
   */
  dialogHandler(event) {
    const { instanceId, vnfInstanceName } = this.data;
    const value = this.value || 3600;

    this.bubble("submit", {
      instanceId,
      vnfInstanceName,
      body: { additionalParams: { applicationTimeOut: value } }
    });
    this.closeEvent(event.detail);
  }

  /**
   * Close dialog event
   *
   * @event SyncDialog#dialog-button-click
   * @type {boolean}
   */
  closeEvent() {
    this.bubble(DIALOG_BUTTON_CLICK_EVENT, { selected: CANCEL_BUTTON });
  }

  render() {
    return html`
      <eui-base-v0-dialog label="Sync" .show=${this.show} no-cancel>
        <div slot="content">
          <div class="timeout-form--wrapper">
            <label htmlFor="sync-timeout">${SYNC_TIMEOUT_LABEL}</label>
            <div class="timeout-form-input--wrapper">
              <eui-base-v0-text-field
                id="sync-timeout"
                name="applicationTimeOut"
                placeholder="3600"
                value="${this.value}"
                @input=${this.inputHandler}
              ></eui-base-v0-text-field>
              ${renderErrorMessageTemplate.call(this)}
            </div>
          </div>
        </div>
        <eui-base-v0-button slot="bottom" @click=${this.closeEvent}
          >${CANCEL_BUTTON}</eui-base-v0-button
        >
        <eui-base-v0-button
          slot="bottom"
          primary
          @click=${this.dialogHandler}
          .disabled=${!this.isValid}
          >${SYNC_BUTTON}</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Basic error message for timeout
 *
 * @private
 * @returns {object}
 */
function renderErrorMessageTemplate() {
  return !this.isValid
    ? html`
        <div class="error-message sync-timeout-form">${INVALID_TIMEOUT_ERR_MSG}</div>
      `
    : null;
}

/**
 * Register the component as e-sync-dialog.
 * Registration can be done at a later time and with a different name
 */
SyncDialog.register();
