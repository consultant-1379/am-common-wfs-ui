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
import { returnExtension } from "../../../../../utils/CommonUtils";

// styles
import style from "./UpgradeClusterConfigDialog.css";

const DEFAULT_FORM_DATA = {
  clusterName: "",
  clusterConfig: {},
  description: "",
  skipSameClusterVerification: false,
  isDefault: false
};

const IS_DEFAULT_TOOLTIP = "Make another cluster as default one";

/**
 * Component UpgradeClusterConfigDialog is defined as
 * `<e-upgrade-cluster-config-dialog>`
 *
 * @fires UpgradeClusterConfigDialog#dialog-button-click
 * @fires UpgradeClusterConfigDialog#submit
 *
 * @property {boolean} show - show the dialog.
 * @property {boolean} data - full data about table row.
 *
 * Imperatively create component
 * @example
 * let component = new UpgradeClusterConfigDialog();
 *
 * Declaratively create component
 * @example
 * <e-upgrade-cluster-config-dialog></e-upgrade-cluster-config-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-upgrade-cluster-config-dialog", {
  style,
  props: {
    show: { attribute: true, type: "boolean", default: false },
    data: { attribute: true, type: "object" },
    formData: { attribute: true, type: "object", default: DEFAULT_FORM_DATA },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class UpgradeClusterConfigDialog extends LitComponent {
  constructor() {
    super();

    this.dialogHandler = this.dialogHandler.bind(this);
    this.closeEvent = this.closeEvent.bind(this);
    this.setSkipVerification = this.setSkipVerification.bind(this);
    this.setIsDefault = this.setIsDefault.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setConfig = this.setConfig.bind(this);
  }

  componentDidReceiveProps(oldValue) {
    const { show } = oldValue;

    if (show === false && this.show === true) {
      this.formData.clusterName = `${this.data.name}.config`;
      this.formData.description = this.data.description;
      this.formData.isDefault = this.isCurrentlyDefault();

      this.isLoading = false;
    }
  }

  get fileInputPlaceholder() {
    const { name = "Select file to upload" } = this.formData.clusterConfig;

    return name;
  }

  get fileExtension() {
    const { name = "" } = this.formData.clusterConfig;

    return returnExtension(name);
  }

  get errorMessage() {
    return this.hasWrongExtension && this.formData.clusterConfig.name
      ? `File type ".${this.fileExtension}" not supported, only ".config" files are supported.`
      : "";
  }

  get isValidForm() {
    return !this.hasWrongExtension;
  }

  get hasWrongExtension() {
    return this.fileExtension !== "config";
  }

  isCurrentlyDefault() {
    return this.data.isDefault === "Yes";
  }

  setDescription(event) {
    this.formData.description = event.target.getValue();
  }

  setSkipVerification(event) {
    this.formData.skipSameClusterVerification = event.target.checked;
  }

  setIsDefault(event) {
    this.formData.isDefault = event.target.checked;
  }

  setConfig(event) {
    const [file] = event.target.files;

    this.formData = { ...this.formData };
    this.formData.clusterConfig = file;
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
  const submitLabel = this.isLoading ? "Uploading..." : "Upload";
  const cancelLabel = this.isLoading ? "Close" : CANCEL_BUTTON;

  return html`
    <eui-base-v0-dialog label="Update cluster config" .show=${this.show} no-cancel>
      <div slot="content">
        <div class="form--wrapper">
          <div class="form--info">Update cluster config for '${this.data.name}'</div>
          <div class="form-item">
            <div class="label">Upload File*</div>
            <div class="form-item--upload-file">
              <eui-base-v0-text-field
                class="file-input"
                id=${"fileInput"}
                placeholder=${this.fileInputPlaceholder}
                disabled
              >
              </eui-base-v0-text-field>
              <eui-base-v0-file-input
                class="select-file"
                name=${"fileInput"}
                accept=".config"
                .disabled=${this.isLoading}
                @change=${this.setConfig}
              >
                Select file
              </eui-base-v0-file-input>
            </div>
            <span class="errorMessage">${this.errorMessage}</span>
          </div>
          <div class="form-item">
            <div class="label">Description</div>
            <e-generic-text-area
              id="description"
              placeholder="Enter a description"
              style="width: 305px"
              value=${this.formData.description}
              @input=${this.setDescription}
            ></e-generic-text-area>
          </div>
          <div class="form-item">
            <eui-base-v0-checkbox
              id="skipVerificationCheckbox"
              name="skipVerificationCheckbox"
              .disabled=${this.isLoading}
              @change=${this.setSkipVerification}
            >
              Skip cluster verification
            </eui-base-v0-checkbox>
          </div>
          <div class="form-item">
            ${renderIsDefaultCheckboxItem.call(this)}
          </div>
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
        .disabled=${!this.isValidForm || this.isLoading}
        >${submitLabel}</eui-base-v0-button
      >
    </eui-base-v0-dialog>
  `;
}

function renderIsDefaultCheckboxItem() {
  if (this.isCurrentlyDefault()) {
    return html`
      <eui-base-v0-tooltip message=${IS_DEFAULT_TOOLTIP} position="top">
        ${renderIsDefaultCheckbox.call(this)}
      </eui-base-v0-tooltip>
    `;
  }
  return html`
    ${renderIsDefaultCheckbox.call(this)}
  `;
}

function renderIsDefaultCheckbox() {
  return html`
    <eui-base-v0-checkbox
      id="isDefaultCheckbox"
      name="isDefaultCheckbox"
      ?checked=${this.formData.isDefault}
      ?disabled=${this.isCurrentlyDefault() || this.isLoading}
      @change=${this.setIsDefault}
    >
      Is default
    </eui-base-v0-checkbox>
  `;
}

/**
 * Register the component as e-upgrade-cluster-config-dialog.
 * Registration can be done at a later time and with a different name
 */
UpgradeClusterConfigDialog.register();
