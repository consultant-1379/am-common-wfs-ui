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

import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./registerClusterDialog.css";
import "../../generic-text-area/src/GenericTextArea";
import {
  FILE_CONFIG_UPLOAD_ERROR_INVALID_TYPE,
  FILE_CONFIG_UPLOAD_ERROR_NO_TYPE,
  INVALID_CRD_NAMESPACE,
  INVALID_NAMESPACE_PATTERN
} from "../../../constants/Messages";
import {
  DEFAULT_CRD_NAMESPACE,
  CRD_NAMESPACE_PATTERN,
  KUBE_RESERVED_NAMESPACES
} from "../../../constants/GenericConstants";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";
import { returnExtension } from "../../../utils/CommonUtils";

/**
 * Component RegisterClusterDialog is defined as
 * `<e-register-cluster-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new RegisterClusterDialog();
 *
 * Declaratively create component
 * @example
 * <e-register-cluster-dialog></e-register-cluster-dialog>
 *
 * @property {object} dialogModel - message related to selected operation
 * @property {array} additionalComponents - contains HTML components
 * @property {object} additionalParams - stores optional additional param for terminate
 *
 * @extends {LitComponent}
 */
@definition("e-register-cluster-dialog", {
  style,
  home: "register-cluster-dialog",
  props: {
    dialogModel: { attribute: true, type: "object", default: {} },
    registerClusterRequestParameters: { attribute: false, type: "object", default: {} },
    additionalComponents: { attribute: false, type: "array", default: [] },
    isValidCrdNamespace: { attribute: false, type: "boolean", default: true },
    isValidFileUploaded: { attribute: false, type: "boolean", default: false },
    isUploading: { attribute: false, type: "boolean", default: false }
  }
})
export default class RegisterClusterDialog extends LitComponent {
  componentDidConnect() {
    this.createComponents();
  }

  createComponents() {
    this.createFileInputField.call(this, "Upload File*", "uploadFile");
    this.createTextInputField.call(this, "CRD namespace", "crdNamespace", DEFAULT_CRD_NAMESPACE);
    this.createDescriptionField.call(this, "Description", "description");
    this.createIsDefaultCheckBox.call(this, "Is default", "isDefault", false);
  }

  handleClick(buttonLabel) {
    const eventDetail = {};

    buttonLabel = buttonLabel === "Close" ? "Cancel" : buttonLabel;
    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    eventDetail.registerClusterRequestParameters = this.registerClusterRequestParameters;
    this.isUploading = true;

    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
  }

  _setDescription(event) {
    const name = event.target.id;
    const value = event.target.getValue();
    this.elementName = { name }.name;
    this._sendEvent(name, value);
  }

  _setCrdNamespace(event) {
    const { value } = event.target;
    const validationErrors = [];
    this._performNamespaceValidations(value, validationErrors);

    if (validationErrors.length > 0) {
      this._renderErrorMessage("block", validationErrors);
      this.isValidCrdNamespace = false;
      this._setUploadButton();
    } else {
      this._renderErrorMessage("none", "");
      this.isValidCrdNamespace = true;
      this._sendEvent("crdNamespace", value);
      this._setUploadButton();
    }
  }

  _performNamespaceValidations(value, validationErrors) {
    if (KUBE_RESERVED_NAMESPACES.includes(value)) {
      validationErrors.push(INVALID_CRD_NAMESPACE.replace("<NAMESPACE>", value));
    }
    if (!new RegExp(CRD_NAMESPACE_PATTERN).test(value)) {
      validationErrors.push(INVALID_NAMESPACE_PATTERN);
    }
  }

  _renderErrorMessage(attribute, errorMessage) {
    const crdErrorSpanSelector = this.shadowRoot.querySelector(".invalidCrdNamespace");
    crdErrorSpanSelector.style.display = attribute;
    crdErrorSpanSelector.innerText = errorMessage;
  }

  _sendDefaults(name, value) {
    if (name != null && value != null) {
      this._sendEvent(name, value);
    }
  }

  replaceStringCharacter(name) {
    return name.replace(/\./g, "-");
  }

  _setFile(event) {
    const fileIndex = 0;
    const { name } = event.currentTarget;
    const { files } = event.currentTarget;
    const filename = files[fileIndex].name;
    this._setFileNamePlaceholder(name, filename);
    this.fileUploaded = files[fileIndex];
    const fileType = returnExtension(filename);
    if (fileType === "config") {
      this._renderDisplayFileTypeError("none");
      this._sendEvent("fileUploaded", this.fileUploaded);
      this.isValidFileUploaded = true;
      this._setUploadButton();
    } else {
      this._renderDisplayFileTypeError("block", fileType);
      this.isValidFileUploaded = false;
      this._setUploadButton();
    }
  }

  _renderDisplayFileTypeError(attribute, fileType) {
    const errorMessage = this._setDisplayFileTypeError(fileType);
    const invalidFileTypeSelector = this.shadowRoot.querySelector(".invalidFileType");
    invalidFileTypeSelector.style.display = attribute;
    invalidFileTypeSelector.innerText = errorMessage;
  }

  _setDisplayFileTypeError(fileType) {
    if (fileType) {
      return FILE_CONFIG_UPLOAD_ERROR_INVALID_TYPE.replace(
        "<FILETYPE>",
        fileType ? `"${fileType}"` : ``
      );
    }
    return FILE_CONFIG_UPLOAD_ERROR_NO_TYPE;
  }

  _setUploadButton() {
    const element = this.shadowRoot.querySelector(`#${this.replaceStringCharacter("Upload")}`);
    element.disabled = !(this.isValidFileUploaded && this.isValidCrdNamespace);
  }

  _setFileNamePlaceholder(elementName, fileName) {
    const element = this.shadowRoot.querySelector(`#${this.replaceStringCharacter(elementName)}`);
    element.placeholder = fileName;
  }

  _setIsDefault(event) {
    const { name } = event.currentTarget;
    const { checked } = event.currentTarget;
    this._sendEvent(name, checked);
  }

  _sendEvent(name, value) {
    if (value === null || value === "") {
      delete this.registerClusterRequestParameters[name];
    } else {
      this.registerClusterRequestParameters[name] = value;
    }
  }

  createFileInputField(label, name, value) {
    const textField = html`
      <div class="label">${label}</div>

      <div class="uploadFile">
        <eui-base-v0-text-field
          class="fileInput"
          id=${"fileInput"}
          placeholder=${"Select file to upload"}
          disabled
        >
        </eui-base-v0-text-field>
        <eui-base-v0-file-input
          class="selectFile"
          name=${"fileInput"}
          accept=".config"
          @change=${this._setFile.bind(this)}
        >
          Select file
        </eui-base-v0-file-input>
      </div>
      <span class="errorMessage invalidFileType"></span>
    `;
    this._sendDefaults(name, value);
    this.additionalComponents.push(textField);
  }

  createDescriptionField(label, name, value) {
    const textField = html`
      <div class="table">
        <div class="leftTableCell">
          ${label}
          <div class="input">
            <e-generic-text-area
              id="description"
              placeholder="Enter a description"
              style="width: 305px"
              @input=${this._setDescription.bind(this)}
            ></e-generic-text-area>
          </div>
        </div>
      </div>
    `;
    this._sendDefaults(name, value);
    this.additionalComponents.push(textField);
  }

  createTextInputField(label, name, value) {
    const textField = html`
      <div class="crdNamespace">
        <div class="label">${label}</div>

        <div class="inputField">
          <eui-base-v0-text-field
            class="textInput"
            id="textInput"
            placeholder=${label}
            value=${value}
            @input=${this._setCrdNamespace.bind(this)}
          >
          </eui-base-v0-text-field>
        </div>
        <span class="errorMessage invalidCrdNamespace"></span>
      </div>
    `;
    this._sendDefaults(name, value);
    this.additionalComponents.push(textField);
  }

  createIsDefaultCheckBox(label, name, value) {
    const checkbox = html`
      <div class="table">
        <div class="leftTableCell">
          <eui-base-v0-checkbox
            name=${name}
            ?checked=${value}
            @change=${this._setIsDefault.bind(this)}
            id=${name}
          >
            ${label}
          </eui-base-v0-checkbox>
        </div>
      </div>
    `;
    this._sendDefaults(name, value);
    this.additionalComponents.push(checkbox);
  }

  _renderDialogButtons() {
    return html`
      ${this.dialogModel.buttonLabels.map((buttonLabel, index) => {
        if (buttonLabel === "Upload") {
          buttonLabel = this.isUploading ? "Uploading..." : "Upload";
        }

        if (buttonLabel === "Cancel") {
          buttonLabel = this.isUploading ? "Close" : "Cancel";
        }

        return html`
          <eui-base-v0-button
            slot="bottom"
            id=${buttonLabel}
            @click=${() => this.handleClick(buttonLabel)}
            ?primary=${index === this.dialogModel.indexOfPrimaryButton}
            ?warning=${index === this.dialogModel.indexOfWarningButton}
            ?disabled=${(this.registerClusterRequestParameters.fileUploaded === undefined &&
              buttonLabel === "Upload") ||
              buttonLabel === "Uploading..."}
          >
            ${buttonLabel}
          </eui-base-v0-button>
        `;
      })}
    `;
  }

  render() {
    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>
            <p>${this.dialogModel.content}</p>
            <p>${this.dialogModel.nextParagraph}</p>
          </div>
          ${this.additionalComponents}
        </div>
        ${this._renderDialogButtons()}
      </eui-base-v0-dialog>
    `;
  }
}

RegisterClusterDialog.register();
