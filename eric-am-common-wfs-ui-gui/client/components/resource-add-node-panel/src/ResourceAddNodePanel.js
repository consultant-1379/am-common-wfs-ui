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
 * Component ResourceAddNodePanel is defined as
 * `<e-resource-add-node-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceAddNodePanel();
 *
 * Declaratively create component
 * @example
 * <e-resource-add-node-panel></e-resource-add-node-panel>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import "@eui/layout";
import style from "./resourceAddNodePanel.css";
import {
  ADD_NODE_CONFIRMATION_MESSAGE,
  ADD_NODE_SUCCESS_MESSAGE,
  FILE_UPLOAD_ERROR,
  ADD_NODE_OPERATION_STARTED,
  ADD_NODE_MESSAGE
} from "../../../constants/Messages";
import { showNotification, accessDenied, isEmpty } from "../../../utils/CommonUtils";
import {
  executeSimplePostRequest,
  ADD_NODE_URL,
  CONTENT_TYPE_JSON_HEADER,
  CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER
} from "../../../utils/RestUtils";

const FILE_BANNER_DEFAULT = "Select file to import";

/**
 * @property {string} resourceId - instance ID
 * @property {object} topologyAttributes - instantiateOssTopology attributes
 */
@definition("e-resource-add-node-panel", {
  style,
  home: "resource-add-node-panel",
  props: {
    resourceId: { attribute: false, type: "string", default: "" },
    vnfInstanceName: { attribute: false, type: "string", default: "" },
    topologyAttributes: { attribute: false, type: "object", default: {} },
    addNodeRequestParameters: { attribute: false, type: "object", default: {} },
    valuesFileOrEditFieldsRadioComponents: { attribute: true, type: "array", default: [] },
    editTopologyAttributesComponents: { attribute: true, type: "array", default: [] },
    uploadTopologyAttributesComponents: { attribute: true, type: "array", default: [] },
    isFileInputMethod: { attribute: false, type: "boolean", default: true },
    isFileNameProvided: { attribute: false, type: "boolean", default: false },
    fileBanner: { attribute: false, type: "string", default: FILE_BANNER_DEFAULT },
    fileUploaded: { attribute: false, type: "object", default: {} },
    isValidPermission: { attribute: false, type: "boolean" }
  }
})
export default class ResourceAddNodePanel extends LitComponent {
  componentDidConnect() {
    this.valuesFileOrEditFieldsRadioComponents = [];
    this.editTopologyAttributesComponents = [];
    this.uploadTopologyAttributesComponents = [];
    this.fileUploaded = {};
    this.fileBanner = FILE_BANNER_DEFAULT;
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (this.topologyAttributes && previous.topologyAttributes) {
      if (this.topologyAttributes && previous.topologyAttributes !== this.topologyAttributes) {
        this.createComponents();
      }
    }
  }

  componentWillDisconnect() {
    this._clearFileInput();
  }

  createComponents() {
    if (!isEmpty(this.topologyAttributes)) {
      if (typeof this.topologyAttributes.networkElementType === "undefined") {
        showNotification("Error", "Error querying instance information", true, 10000);
        return;
      }
      this.showAttributeFields();
      this.createFileOrFieldsRadioButtons("fileUploadOrAttributeFieldsRadio", "Edit Attributes", [
        "Edit Attributes",
        "Upload Values File"
      ]);
    }
  }

  createFileOrFieldsRadioButtons(name, value, radioTypes) {
    const radioButtons = html`
      <div class="file-or-fields-radio-holder">
        <div class="content">
          ${this._generateFileOrFieldsRadioButtons(name, value, radioTypes)}
        </div>
      </div>
    `;
    this.valuesFileOrEditFieldsRadioComponents.push(radioButtons);
  }

  _generateFileOrFieldsRadioButtons(name, value, radioTypes) {
    const radioComponents = [];
    radioTypes.forEach(option => {
      radioComponents.push(html`
        <eui-base-v0-radio-button
          class="radio"
          name=${`${name}-${option}`}
          @change=${this.toggleFileUploadOrTextFields.bind(this)}
          group=${name}
          ?checked=${value === option}
          >${option}</eui-base-v0-radio-button
        >
      `);
    });
    return radioComponents;
  }

  toggleFileUploadOrTextFields(event) {
    const topologyFields = this.shadowRoot.querySelectorAll(".topology-attribute-field");
    const importAttributesFileButton = this.shadowRoot.querySelector(
      ".import-attributes-file-button"
    );

    if (event.detail.value === "Upload Values File") {
      this.isFileInputMethod = true;
      this.addNodeRequestParameters.fileUploaded = {};
      importAttributesFileButton.disabled = false;
      this.fileBanner = this.fileUploaded.name || FILE_BANNER_DEFAULT;
      topologyFields.forEach(field => {
        field.disabled = true;
      });
    } else if (event.detail.value === "Edit Attributes") {
      this.isFileInputMethod = false;
      delete this.addNodeRequestParameters.fileUploaded;
      importAttributesFileButton.disabled = true;
      this.fileBanner = FILE_BANNER_DEFAULT;
      topologyFields.forEach(field => {
        field.disabled = false;
      });
    }
  }

  showAttributeFields() {
    Object.keys(this.topologyAttributes).forEach(attributeName => {
      if (
        typeof this.topologyAttributes[attributeName].defaultValue === "undefined" ||
        this.topologyAttributes[attributeName].defaultValue === null
      ) {
        this.topologyAttributes[attributeName].defaultValue = "";
      }
    });

    this.createSectionTitle.call(this, "Network Element");
    this.createTextField.call(
      this,
      "Managed Element ID",
      this.vnfInstanceName ? this.vnfInstanceName : ""
    );
    this.createTextField.call(
      this,
      "Network Element Type",
      this.topologyAttributes.networkElementType.defaultValue
    );
    this.createTextField.call(
      this,
      "Network Element Version",
      this.topologyAttributes.networkElementVersion.defaultValue
    );
    this.createTextField.call(
      this,
      "Network Element Username",
      this.topologyAttributes.networkElementUsername.defaultValue
    );
    this.createPasswordField.call(this, "Network Element Password", "");
    this.createTextField.call(
      this,
      "Node IP Address",
      this.topologyAttributes.nodeIpAddress.defaultValue
    );
    this.createTextField.call(
      this,
      "Community String",
      this.topologyAttributes.communityString.defaultValue
    );
    if (!this._isValueUndefinedOrNull(this.topologyAttributes.timeZone)) {
      this.createTextField.call(
        this,
        "Time Zone",
        this._isValueUndefinedOrNull(this.topologyAttributes.timeZone.defaultValue)
          ? ""
          : this.topologyAttributes.timeZone.defaultValue
      );
    }

    this.createSectionTitle.call(this, "SNMP");
    this.createTextField.call(this, "SNMP Port", this.topologyAttributes.snmpPort.defaultValue);
    this.createTextField.call(
      this,
      "SNMP Version",
      this.topologyAttributes.snmpVersion.defaultValue
    );
    this.createDropdown.call(
      this,
      "SNMP Security Level",
      this.topologyAttributes.snmpSecurityLevel.defaultValue,
      ["AUTH_PRIV", "AUTH_NO_PRIV", "NO_AUTH_NO_PRIV"]
    );
    this.createTextField.call(
      this,
      "SNMP Security Name",
      this.topologyAttributes.snmpSecurityName.defaultValue
    );
    this.createTextField.call(
      this,
      "SNMP Auth Protocol",
      this.topologyAttributes.snmpAuthProtocol.defaultValue
    );
    this.createTextField.call(
      this,
      "SNMP Priv Protocol",
      this.topologyAttributes.snmpPrivProtocol.defaultValue
    );
    this.createPasswordField.call(this, "SNMP Auth Password", "");
    this.createPasswordField.call(this, "SNMP Privacy Password", "");
    this.createSectionTitle.call(this, "Other");
    this.createSwitchButtons.call(
      this,
      "PM Function",
      this.topologyAttributes.pmFunction.defaultValue,
      {
        true: "On",
        false: "Off"
      }
    );
    this.createSwitchButtons.call(
      this,
      "CM Node Heartbeat Supervision",
      this.topologyAttributes.cmNodeHeartbeatSupervision.defaultValue,
      {
        true: "Enable",
        false: "Disable"
      }
    );
    this.createSwitchButtons.call(
      this,
      "FM Alarm Supervision",
      this.topologyAttributes.fmAlarmSupervision.defaultValue,
      {
        true: "Enable",
        false: "Disable"
      }
    );
    this.createTextField.call(
      this,
      "Net Conf Port",
      this.topologyAttributes.netConfPort.defaultValue
    );
    this.createTextArea.call(
      this,
      "Sub Networks",
      this.topologyAttributes.subNetworks.defaultValue
    );
    this.createTextField.call(
      this,
      "Transport Protocol",
      this.topologyAttributes.transportProtocol.defaultValue
    );
  }

  createTextField(label, value) {
    const name = this.createNameFromLabel(label);
    const textField = html`
      <tr>
        <td class="topology-attribtute-field-label">${label}</td>
        <td>
          <eui-base-v0-text-field
            placeholder=${label}
            name=${name}
            @input=${this._setField.bind(this)}
            value=${value}
            class="topology-attribute-field"
          >
          </eui-base-v0-text-field>
        </td>
      </tr>
    `;
    this._sendDefaults(name, value);
    this.editTopologyAttributesComponents.push(textField);
  }

  createSectionTitle(name) {
    const title = html`
      <tr>
        <td colspan="2">
          <div class="topology-attributes-section-label">${name}</div>
        </td>
      </tr>
    `;
    this.editTopologyAttributesComponents.push(title);
  }

  createPasswordField(label, value) {
    const name = this.createNameFromLabel(label);
    const passwordField = html`
      <tr>
        <td class="topology-attribtute-field-label">${label}</td>
        <td>
          <eui-base-v0-password-field
            placeholder=${label}
            name=${name}
            @input=${this._setField.bind(this)}
            class="topology-attribute-field"
          ></eui-base-v0-password-field>
        </td>
      </tr>
    `;
    this._sendDefaults(name, value);
    this.editTopologyAttributesComponents.push(passwordField);
  }

  createTextArea(label, value) {
    const name = this.createNameFromLabel(label);
    const textArea = html`
      <tr>
        <td class="topology-attribtute-field-label">${label}</td>
        <td>
          <eui-base-v0-textarea
            placeholder=${label}
            name=${name}
            @input=${this._setField.bind(this)}
            value=${value}
            class="topology-attribute-field"
          ></eui-base-v0-textarea>
        </td>
      </tr>
    `;
    this._sendDefaults(name, value);
    this.editTopologyAttributesComponents.push(textArea);
  }

  createSwitchButtons(label, value, switchData) {
    const name = this.createNameFromLabel(label);
    const switchButtons = html`
      <tr>
        <td class="topology-attribtute-field-label">${label}</td>
        <td>
          <eui-base-v0-switch
            ?on=${value === "true"}
            label-on=${switchData.true}
            label-off=${switchData.false}
            name=${name}
            @change=${this._setSwitchToggled.bind(this, name)}
            class="topology-attribute-field"
          ></eui-base-v0-switch>
        </td>
      </tr>
    `;
    this._sendDefaults(name, value);
    this.editTopologyAttributesComponents.push(switchButtons);
  }

  createDropdown(label, value, options) {
    const name = this.createNameFromLabel(label);
    const dropdown = html`
      <tr>
        <td class="topology-attribtute-field-label">${label}</td>
        <td>
          <eui-base-v0-dropdown
            label=${value || "Not Set"}
            data-type="single"
            class="topology-attribute-field"
          >
            ${this._generateDropdown(name, value, options)}
          </eui-base-v0-dropdown>
        </td>
      </tr>
    `;
    this._sendDefaults(name, value);
    this.editTopologyAttributesComponents.push(dropdown);
  }

  _generateDropdown(name, value, options) {
    const dropdownOptions = [];
    options.forEach(option => {
      dropdownOptions.push(html`
        <eui-base-v0-radio-button
          menu-item
          name=${`${name}-${option}`}
          @change=${this._setDropdownSelection.bind(this)}
          group=${name}
          ?checked=${value === option}
          >${option}</eui-base-v0-radio-button
        >
      `);
    });
    return dropdownOptions;
  }

  _setFile(event) {
    const fileIndex = 0;
    const { files } = event.currentTarget;
    const filename = files[fileIndex].name;
    if (filename.includes(".yaml") || filename.includes(".yml")) {
      this.fileBanner = filename;
      this.fileUploaded = files[fileIndex];
      this.isFileNameProvided = true;
    } else {
      this._clearFileInput();
      const fileType = new RegExp(".[A-Za-z]").test(filename) ? "" : filename.split(".")[1];
      showNotification(
        "File type not supported",
        FILE_UPLOAD_ERROR.replace("<FILETYPE>", fileType),
        true
      );
    }
    this._sendEvent("fileUploaded", this.fileUploaded);
  }

  _clearFileInput() {
    const importAttributesFileButton = this.shadowRoot.querySelector(
      ".import-attributes-file-button"
    );
    if (importAttributesFileButton) {
      const input = importAttributesFileButton.shadowRoot.querySelector("input[type='file']");
      input.value = "";
    }
    this.isFileNameProvided = false;
    this.fileBanner = FILE_BANNER_DEFAULT;
    this.fileUploaded = {};
  }

  _setField(event) {
    const { name } = event.currentTarget;
    const { value } = event.currentTarget;
    this._sendEvent(name, value);
  }

  _setSwitchToggled(name, event) {
    this._sendEvent(name, event.detail.on);
  }

  _setDropdownSelection(event) {
    const { group } = event.detail;
    const { value } = event.detail;
    this._sendEvent(group, value);
  }

  _isValueUndefinedOrNull(val) {
    return val === undefined || val === null;
  }

  createNameFromLabel(label) {
    const words = label.split(" ");
    for (let index = 0; index < words.length; index += 1) {
      if (index === 0) {
        words[index] = words[index].toLowerCase();
      } else {
        words[index] = words[index].charAt(0) + words[index].substring(1).toLowerCase();
      }
    }
    return words.join("");
  }

  createLabelFromName(name) {
    const words = name.split(/(?=[A-Z])/);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }

  _sendDefaults(name, value) {
    if (name != null && value != null) {
      this._sendEvent(name, value);
    }
  }

  _sendEvent(name, value) {
    if (value === null || value === "") {
      // no need to send empty fields in JSON
      delete this.addNodeRequestParameters[name];
    } else {
      this.addNodeRequestParameters[name] = value;
    }
    if (this.isFileInputMethod !== true) {
      delete this.addNodeRequestParameters.fileUploaded;
    }
  }

  _sendAddNodeRequest(requestData) {
    let body = {};
    let headers = {};
    const { topologyAttributes } = requestData;
    const { resourceId } = requestData;
    if (topologyAttributes.fileUploaded) {
      body = new FormData();
      body.append("valuesFile", topologyAttributes.fileUploaded);
      headers = CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER;
    } else {
      body = {
        additionalAttributes: topologyAttributes
      };
      headers = CONTENT_TYPE_JSON_HEADER;
    }
    executeSimplePostRequest(
      ADD_NODE_URL.replace(":vnfInstanceId", resourceId),
      body,
      headers,
      this._addNodeSuccessCallback,
      this._addNodeErrorCallback
    );
  }

  _addNodeSuccessCallback = () => {
    showNotification(
      "Success",
      `${ADD_NODE_SUCCESS_MESSAGE.replace("<RESOURCE>", this.vnfInstanceName)}`,
      false,
      5000
    );
  };

  _addNodeErrorCallback = () => {};

  returnToResources() {
    window.EUI.Router.goto(`resources`);
  }

  handleClick() {
    const details = { resourceId: this.resourceId, topologyAttributes: {} };
    if (this.addNodeRequestParameters.fileUploaded) {
      details.topologyAttributes.fileUploaded = this.fileUploaded;
    } else {
      details.topologyAttributes = this.addNodeRequestParameters;
    }
    showNotification(
      ADD_NODE_OPERATION_STARTED,
      ADD_NODE_MESSAGE.replace("<RESOURCE>", this.vnfInstanceName),
      false,
      5000
    );
    this._sendAddNodeRequest(details);
    this.returnToResources();
  }

  _renderResourceAddNodePanel() {
    return html`
      <eui-layout-v0-multi-panel-tile maximize tile-title="Add node to ENM">
        <div slot="content">
          <div slot="my-header">
            <p>${ADD_NODE_CONFIRMATION_MESSAGE.replace("<RESOURCE>", this.vnfInstanceName)}</p>
          </div>
          <div class="override-attributes-section-label">Override Topology Attributes</div>
            <div class="add-node-panel">
              <div class="upload-or-fields-radios">${
                this.valuesFileOrEditFieldsRadioComponents
              }</div>
              <div class="upload-file-holder">
                <div class="content">
                  <eui-base-v0-text-field placeholder=${
                    this.fileBanner
                  } disabled></eui-base-v0-text-field>
                  <eui-base-v0-file-input
                    class="import-attributes-file-button"
                    accept=".yaml,.yml"
                    @change=${this._setFile.bind(this)}
                    style="line-height: 30px;"
                  >Select file</eui-base-v0-file-input>
                </div>
              </div>
              <div class="topology-attributes-holder">
                <table>${this.editTopologyAttributesComponents}</table>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <eui-base-v0-button @click="${this.returnToResources}">Cancel</eui-base-v0-button>
          <eui-base-v0-button
            primary="true"
            .topologyAttributes=${this.topologyAttributes}
            @click=${this.handleClick.bind(this)}
            class="confirm-add-node"
            ?disabled=${this.isFileInputMethod && !this.isFileNameProvided}
          >
            Add node
          </eui-base-v0-button >
        </div>
      </eui-layout-v0-multi-panel-tile>
    `;
  }

  /**
   * Render the <e-resource-add-node-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      ${this.isValidPermission ? this._renderResourceAddNodePanel() : accessDenied()}
    `;
  }
}
/**
 * Register the component as e-resource-add-node-panel.
 * Registration can be done at a later time and with a different name
 */
ResourceAddNodePanel.register();
