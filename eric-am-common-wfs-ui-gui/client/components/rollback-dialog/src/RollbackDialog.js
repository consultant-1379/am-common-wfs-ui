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
/**
 * Component RollbackDialog is defined as
 * `<e-rollback-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new RollbackDialog();
 *
 * Declaratively create component
 * @example
 * <e-rollback-dialog></e-rollback-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./rollbackDialog.css";
import {
  CURRENT_VERSION,
  ROLLBACK_VERSION,
  APPLICATION_TIMEOUT,
  APPLICATION_TIMEOUT_DESCRIPTION,
  INVALID_TIMEOUT_ERR_MSG
} from "../../../constants/Messages";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";
import { isValidTimeoutRange } from "../../../utils/CommonUtils";

/**
 * @property {object} dialogModel - message related to selected operation
 * @property {array} additionalParamsComponents - contains HTML components
 */

@definition("e-rollback-dialog", {
  style,
  home: "rollback-dialog",
  props: {
    data: { attribute: false, type: "object", default: {} },
    dialogModel: { attribute: true, type: "object" },
    validApplicationTimeOut: { attribute: false, type: "boolean", default: true },
    additionalParamsComponents: { attribute: false, type: "array", default: [] },
    additionalParams: { attribute: false, type: "object", default: {} }
  }
})
export default class RollbackDialog extends LitComponent {
  componentDidConnect() {
    this.createComponents();
  }

  createComponents() {
    if (this.data.source) {
      this._createRollbackFields();
    } else {
      this._createDowngradeFields();
    }
  }

  _createDowngradeFields() {
    this.createDescriptionField.call(
      this,
      CURRENT_VERSION,
      this.data.downgradePackageInfo.sourceDowngradePackageInfo.packageVersion
    );
    this.createDescriptionField.call(
      this,
      ROLLBACK_VERSION,
      this.data.downgradePackageInfo.targetDowngradePackageInfo.packageVersion
    );
    this.createTextField.call(
      this,
      APPLICATION_TIMEOUT,
      "applicationTimeOut",
      "3600",
      APPLICATION_TIMEOUT_DESCRIPTION.replace("<OPERATION>", "rollback")
    );
  }

  _createRollbackFields() {
    this.createDescriptionField.call(this, CURRENT_VERSION, this.data.target);
    this.createDescriptionField.call(this, ROLLBACK_VERSION, this.data.source);
  }

  handleClick(buttonLabel) {
    const eventDetail = {};
    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    eventDetail.additionalParams = this.additionalParams;
    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
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

  _validateTimeout(timeOut, fieldClass) {
    this.element = this.shadowRoot.querySelector("#Rollback");
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

  createDescriptionField(label, version) {
    const textField = html`
      <div class="table">
        <div class="leftTableCell version">
          ${label}
        </div>
        <div class="rightTableCell">
          <p>${version}</p>
        </div>
      </div>
    `;
    this.additionalParamsComponents.push(textField);
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
    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>
            <p>${this.dialogModel.content}</p>
          </div>
          <div class="v_information">
            ${this.additionalParamsComponents}
          </div>
          <div class="warning">
            <p>${this.dialogModel.nextParagraph}</p>
          </div>
        </div>
        ${this.dialogModel.buttonLabels.map(
          (buttonLabel, index) =>
            html`
              <eui-base-v0-button
                slot="bottom"
                id=${buttonLabel.replace(/\s/, "")}
                @click=${() => this.handleClick(buttonLabel)}
                ?primary=${index === this.dialogModel.indexOfPrimaryButton}
                ?warning=${index === this.dialogModel.indexOfWarningButton}
              >
                ${buttonLabel}
              </eui-base-v0-button>
            `
        )}
      </eui-base-v0-dialog>
    `;
  }
}

RollbackDialog.register();
