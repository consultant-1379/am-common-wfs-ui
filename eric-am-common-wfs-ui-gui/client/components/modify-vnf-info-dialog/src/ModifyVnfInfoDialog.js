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
import "../../generic-text-area/src/GenericTextArea";

// styles
import style from "./modifyVnfInfoDialog.css";

// helpers
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";

/**
 * Component ModifyVnfInfoDialog is defined as
 * `<e-modify-vnf-info-dialog>`
 *
 * @property {Boolean} propOne - show active/inactive state.
 * @property {String} propTwo - shows the "Hello World" string.
 *
 * Imperatively create component
 * @example
 * let component = new ModifyVnfInfoDialog();
 *
 * Declaratively create component
 * @example
 * <e-modify-vnf-info-dialog></e-modify-vnf-info-dialog>
 *
 * @extends {LitComponent}
 */
@definition("e-modify-vnf-info-dialog", {
  style,
  home: "modify-vnf-info-dialog",
  props: {
    data: { attribute: false, type: "object", default: {} },
    dialogModel: { attribute: true, type: "object" },
    dialogContents: { attribute: false, type: "array", default: [] },
    extensionOptions: {
      attribute: true,
      type: "array",
      default: ["ManualControlled", "CISMControlled"]
    },
    additionalParams: { attribute: false, type: "object", default: {} },
    extensions: { attribute: false, type: "object", default: {} },
    vnfControlledScaling: { attribute: false, type: "object", default: {} },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class ModifyVnfInfoDialog extends LitComponent {
  componentDidConnect() {
    if (this.data) {
      this.createComponents();
    }
  }

  createComponents() {
    this.createDescription.call(this);
    this.createExtensions();
  }

  createDescription() {
    if (this.data.vnfInstanceDescription) {
      this.createDescriptionSection.call(this, this.data.vnfInstanceDescription);
    } else {
      this.createDescriptionSection.call(this, "");
    }
  }

  createDescriptionSection(descriptionValue) {
    const textField = html`
      <div class="description">
        <div class="label">
          <p>Description</p>
        </div>
        ${this._createTextArea.call(
          this,
          "Description",
          "vnfInstanceDescription",
          descriptionValue
        )}
      </div>
    `;
    this.dialogContents.push(textField);
  }

  _setTextField(event) {
    const name = event.currentTarget.id;
    const { value } = event.currentTarget.shadowRoot.querySelector("eui-base-v0-textarea");

    this._sendEvent(name, value);
  }

  _createTextArea(placeholder, name, value) {
    return html`
      <div class="input">
        <e-generic-text-area
          placeholder=${placeholder}
          name=${name}
          id=${name}
          style="width: 350px "
          @input=${this._setTextField.bind(this)}
          value=${value}
        >
        </e-generic-text-area>
      </div>
    `;
  }

  createExtensionsSection(vnfControlledScaling) {
    const extensionRadioComponents = [];
    const textField = html`
      <div class="label">
        <p>Extensions</p>
      </div>
    `;

    extensionRadioComponents.push(textField);
    Object.entries(vnfControlledScaling).forEach(([key, value]) => {
      const fieldName = `${key}`;
      const elementName = `${value}`;
      extensionRadioComponents.push(html`
        <div class="fieldExtensionHeader">${fieldName}</div>
        <div class="contentExtension">
          ${this._generateRadioButtons("extension-vnfControlledScaling", elementName, fieldName)}
        </div>
      `);
    });
    this.dialogContents.push(extensionRadioComponents);
  }

  createExtensions() {
    if (this.data.extensions && this.data.extensions.vnfControlledScaling) {
      this.createExtensionsSection(this.data.extensions.vnfControlledScaling);
    }
  }

  _generateRadioButtons(name, value, aspectName) {
    return this.extensionOptions.map(option => {
      const id = option.replace(/\s+/g, "-");

      this.vnfControlledScaling[aspectName] = value;
      this.extensions.vnfControlledScaling = this.vnfControlledScaling;
      this._sendEvent("extensions", this.extensions);

      return html`
        <eui-base-v0-radio-button
          class="radio"
          name=${`${name}-${id}-${aspectName}`}
          data-aspect=${aspectName}
          @change=${event => this.updateExtensions(event)}
          group=${name}
          id=${`${name}-${id}-${aspectName}`}
          ?checked=${value === option}
          >${option}</eui-base-v0-radio-button
        >
      `;
    });
  }

  updateExtensions(event) {
    const { aspect: aspectName } = event.currentTarget.dataset;

    this.vnfControlledScaling[aspectName] = event.detail.label;
    this.extensions.vnfControlledScaling = this.vnfControlledScaling;
    this._sendEvent("extensions", this.extensions);
  }

  handleClick(buttonLabel) {
    const eventDetail = {};

    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    eventDetail.additionalParams = this.additionalParams;

    if (buttonLabel === "Modify") {
      this.isLoading = true;
    }

    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
  }

  _sendEvent(name, value) {
    if (value === "" || value === null) {
      delete this.additionalParams[name];
    } else {
      this.additionalParams[name] = value;
    }
  }

  /**
   * Render the <e-modify-vnf-info-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    const submitLabel = this.isLoading ? "Modifying..." : "Modify";
    const cancelLabel = this.isLoading ? "Close" : "Cancel";

    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>
            <p>${this.dialogModel.content}</p>
          </div>
          <div>
            ${this.dialogContents}
          </div>
        </div>
        <eui-base-v0-button slot="bottom" id="Cancel" @click=${() => this.handleClick("Cancel")}
          >${cancelLabel}</eui-base-v0-button
        >
        <eui-base-v0-button
          slot="bottom"
          id="Modify"
          primary
          .disabled=${this.isLoading}
          @click=${() => this.handleClick("Modify")}
          >${submitLabel}</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Register the component as e-modify-vnf-info-dialog.
 * Registration can be done at a later time and with a different name
 */
ModifyVnfInfoDialog.register();
