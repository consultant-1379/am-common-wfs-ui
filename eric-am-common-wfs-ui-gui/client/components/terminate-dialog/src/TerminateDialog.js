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

// styles
import style from "./terminateDialog.css";

// helpers
import {
  APPLICATION_TIMEOUT,
  APPLICATION_TIMEOUT_DESCRIPTION,
  CLEAN_UP_RESOURCES,
  CLEAN_UP_RESOURCES_DESCRIPTION,
  INVALID_TIMEOUT_ERR_MSG,
  SKIP_JOB_VERIFICATION,
  SKIP_JOB_VERIFICATION_DESC
} from "../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";
import { isValidTimeoutRange } from "../../../utils/CommonUtils";

/**
 * Component TerminateDialog is defined as
 * `<e-terminate-dialog>`
 *
 * @property {object} dialogModel - message related to selected operation
 * @property {array} additionalParamsComponents - contains HTML components
 * @property {object} additionalParams - stores optional additional param for terminate
 *
 * Imperatively create component
 * @example
 * let component = new TerminateDialog();
 *
 * Declaratively create component
 * @example
 * <e-terminate-dialog></e-terminate-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-terminate-dialog", {
  style,
  home: "terminate-dialog",
  props: {
    dialogModel: { attribute: true, type: "object", default: {} },
    validApplicationTimeOut: { attribute: false, type: "boolean", default: true },
    additionalParamsComponents: { attribute: false, type: "array", default: [] },
    additionalParams: { attribute: false, type: "object", default: {} },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class TerminateDialog extends LitComponent {
  componentDidConnect() {
    this.createComponents();
  }

  createComponents() {
    /* TODO  */

    /* this.createCheckBox.call(
      this,
      SKIP_VERIFICATION,
      "skipVerification",
      true,
      SKIP_VERIFICATION_DESCRIPTION
    ); */
    this.createCheckBox.call(
      this,
      CLEAN_UP_RESOURCES,
      "cleanUpResources",
      true,
      CLEAN_UP_RESOURCES_DESCRIPTION
    );
    this.createCheckBox.call(
      this,
      SKIP_JOB_VERIFICATION,
      "skipJobVerification",
      false,
      SKIP_JOB_VERIFICATION_DESC
    );
    this.createTextField.call(
      this,
      APPLICATION_TIMEOUT,
      "applicationTimeOut",
      3600,
      APPLICATION_TIMEOUT_DESCRIPTION.replace("<OPERATION>", "terminate")
    );
  }

  handleClick(buttonLabel) {
    const eventDetail = {};

    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    eventDetail.additionalParams = this.additionalParams;

    if (buttonLabel === "Terminate") {
      this.isLoading = true;
    }

    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
  }

  _setTextField(event) {
    const { name } = event.currentTarget;
    const { value } = event.currentTarget;

    this.elementName = { name }.name;
    switch (this.elementName) {
      case "applicationTimeOut":
        this.validApplicationTimeOut = this._validateTimeout(value, `#${name} .errorMessage`);
        break;
      default:
        break;
    }

    if (this.validApplicationTimeOut) {
      this.element.disabled = false;
      this._sendEvent(name, value);
    }
  }

  _setCheckBox(event) {
    const { name } = event.currentTarget;
    const { checked } = event.currentTarget;

    this._sendEvent(name, checked);
  }

  _sendEvent(name, value) {
    if (value === "" || value === null) {
      delete this.additionalParams[name];
    } else {
      this.additionalParams[name] = value;
    }
  }

  _sendDefaults(name, value) {
    if (name != null && value != null) {
      this._sendEvent(name, value);
    }
  }

  _validateTimeout(timeOut, fieldClass) {
    this.element = this.shadowRoot.querySelector("#Terminate");
    const invalidTimeoutSelector = this.shadowRoot.querySelector(fieldClass);
    if (timeOut.length === 0) {
      invalidTimeoutSelector.style.display = "none";
      return true;
    }
    if (isValidTimeoutRange(timeOut)) {
      invalidTimeoutSelector.style.display = "none";
      return true;
    }
    invalidTimeoutSelector.style.display = "block";
    this.element.disabled = true;
    return false;
  }

  createCheckBox(label, name, value, description) {
    const checkbox = html`
      <div class="table">
        <div class="leftTableCell">
          <eui-base-v0-checkbox
            name=${name}
            ?checked=${value}
            @change=${this._setCheckBox.bind(this)}
            id=${name}
          >
            ${label}
          </eui-base-v0-checkbox>
        </div>
        <div class="rightTableCell">
          <p>${description}</p>
        </div>
      </div>
    `;
    this._sendDefaults(name, value);
    this.additionalParamsComponents.push(checkbox);
  }

  createTextField(label, name, value, description) {
    const textField = html`
      <div class="table">
        <div class="leftTableCell">
          ${label}
          <div>
            <eui-base-v0-text-field
              placeholder=${label}
              name=${name}
              @input=${this._setTextField.bind(this)}
              value=${value}
            >
            </eui-base-v0-text-field>
          </div>
          <div id=${name}>
            <small><span class="errorMessage">${INVALID_TIMEOUT_ERR_MSG}</span></small>
          </div>
        </div>
        <div class="rightTableCell">
          <p>${description}</p>
        </div>
      </div>
    `;
    this._sendDefaults(name, value);
    this.additionalParamsComponents.push(textField);
  }

  render() {
    const submitLabel = this.isLoading ? "Terminating..." : "Terminate";
    const cancelLabel = this.isLoading ? "Close" : "Cancel";

    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>
            <p>${this.dialogModel.content}</p>
            <p>${this.dialogModel.nextParagraph}</p>
          </div>
          ${this.additionalParamsComponents}
        </div>
        <eui-base-v0-button slot="bottom" id="Cancel" @click=${() => this.handleClick("Cancel")}
          >${cancelLabel}</eui-base-v0-button
        >
        <eui-base-v0-button
          slot="bottom"
          id="Terminate"
          warning
          .disabled=${this.isLoading}
          @click=${() => this.handleClick("Terminate")}
          >${submitLabel}</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }
}

TerminateDialog.register();
