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
 * Component FileUploadDialog is defined as
 * `<e-file-upload-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new FileUploadDialog();
 *
 * Declaratively create component
 * @example
 * <e-file-upload-dialog></e-file-upload-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./fileUploadDialog.css";
import { showNotification, isValidTimeoutRange } from "../../../utils/CommonUtils";
import { INVALID_TIMEOUT_ERR_MSG } from "../../../constants/Messages";

@definition("e-file-upload-dialog", {
  style,
  home: "file-upload-dialog",
  props: {
    label: { attribute: true, type: "string", default: "Upload File" },
    fileBanner: { attribute: false, type: "string", default: "Please select file..." },
    percentage: { attribute: true, type: "string", default: "0" },
    uploading: { attribute: false, type: "boolean", default: false },
    isFileSelected: { attribute: false, type: "boolean", default: false },
    isValidTimeout: { attribute: false, type: "boolean", default: true },
    importButtonDisabled: { attribute: false, type: "boolean", default: false },
    accept: { attribute: true, type: "string", default: null },
    userDefinedData: { attribute: false, type: "object", default: {} }
  }
})
export default class FileUploadDialog extends LitComponent {
  getProgress() {
    return this.uploading
      ? html`
          <eui-base-v0-progress-bar .value=${this.percentage}></eui-base-v0-progress-bar>
        `
      : html``;
  }

  handleEvent(event) {
    switch (event.type) {
      case "eui-dialog:cancel":
        this.bubble("fileUploadDialog:cancel", {});
        break;
      case "click": {
        const { name: fileName } = this.file;
        const userDefinedData = {
          ...this.userDefinedData,
          description: "Onboarded using E-VNFM GUI",
          fileName
        };
        const eventDetail = { userDefinedData, file: this.file };

        this.bubble("fileUploadDialog:upload", eventDetail);
        this.uploading = true;
        break;
      }
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  setFile(event) {
    const { files } = event.currentTarget;

    if (files.length > 0) {
      [this.file] = files;
      const filename = this.file.name;
      if (filename.includes(".csar") || filename.includes(".zip")) {
        this.fileBanner = filename;
        this.isFileSelected = true;
      } else {
        showNotification("File type not supported", `Only ${this.accept}`, true);
      }
    }
  }

  _setTextField(event) {
    const { value } = event.currentTarget;
    this.isValidTimeout = this._validateTimeout(value);
    if (this.isValidTimeout) {
      this._sendEvent("onboarding.timeout", value);
    }
  }

  _validateTimeout(timeOut) {
    const invalidTimeoutSelector = this.shadowRoot.querySelector("#errorMessage");
    if (timeOut.length === 0) {
      invalidTimeoutSelector.style.display = "none";
      return true;
    }
    if (isValidTimeoutRange(timeOut)) {
      invalidTimeoutSelector.style.display = "none";
      return true;
    }
    invalidTimeoutSelector.style.display = "block";
    return false;
  }

  _sendEvent(name, value) {
    if (value === "" || value === null) {
      delete this.userDefinedData[name];
    } else {
      this.userDefinedData[name] = value;
    }
  }

  _shouldUploadButtonDisabled() {
    return !this.isValidTimeout || !this.isFileSelected || this.uploading;
  }

  render() {
    return html`
      <eui-base-v0-dialog label=${this.label} show="true" @eui-dialog:cancel=${this}>
        <div slot="content">
          <div class="content">
            <eui-base-v0-text-field
              id="fileUpload-textField"
              placeholder=${this.fileBanner}
              disabled
            ></eui-base-v0-text-field>
            <eui-base-v0-file-input
              id="fileUpload-importButton"
              class="import-button"
              accept=${this.accept}
              ?disabled=${this.uploading}
              @change=${this.setFile.bind(this)}
              >Select file</eui-base-v0-file-input
            >
            ${this.getProgress()}
          </div>
          <div class="content">
            <div class="timeOut-textField">
              <label htmlFor="timeOut">Timeout (minute)</label>
              <eui-base-v0-text-field
                id="timeOut"
                @input=${this._setTextField.bind(this)}
                value="120"
                placeholder="Defaulted to 120 min"
                ?disabled=${this.uploading}
              ></eui-base-v0-text-field>
            </div>
            <div id="error">
              <small>
                <span id="errorMessage" class="errorMessage">${INVALID_TIMEOUT_ERR_MSG}</span>
              </small>
            </div>
          </div>
          <div class="content">
            <eui-base-v0-checkbox
              id="skipImage-checkBox"
              @change=${e => this._sendEvent("skipImageUpload", e.detail.checked)}
              ?disabled=${this.uploading}
            >
              Skip Image Upload
            </eui-base-v0-checkbox>
          </div>
        </div>
        <eui-base-v0-button
          id="fileUpload-uploadButton"
          slot="bottom"
          primary
          ?disabled=${this._shouldUploadButtonDisabled()}
          @click=${this}
        >
          Onboard
        </eui-base-v0-button>
      </eui-base-v0-dialog>
    `;
  }
}

FileUploadDialog.register();
