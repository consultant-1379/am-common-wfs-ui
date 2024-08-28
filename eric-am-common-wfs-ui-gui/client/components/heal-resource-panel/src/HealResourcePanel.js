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
 * Component HealResourcePanel is defined as
 * `<e-heal-resource-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new HealResourcePanel();
 *
 * Declaratively create component
 * @example
 * <e-heal-resource-panel></e-heal-resource-panel>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import "@eui/layout";
import style from "./healResourcePanel.css";
import "../../generic-combo-box/src/GenericComboBox";
import "../../generic-text-field/src/GenericTextField";
import "../../generic-table/src/GenericTable";
import "../../generic-datepicker/src/GenericDatepicker";
import {
  APPLICATION_TIMEOUT,
  HEAL_NO_CAUSES_MSG,
  INVALID_TIMEOUT_ERR_MSG,
  HEAL_CONFIRMATION_MESSAGE,
  HEAL_STARTED_NOTIFICATION,
  OPERATION_STARTED_MESSAGE,
  MISSING_PASSWORD_ERR_MSG
} from "../../../constants/Messages";
import {
  HEAL_URL,
  executeSimplePostRequest,
  CONTENT_TYPE_JSON_HEADER
} from "../../../utils/RestUtils";
import {
  _componentHasDropdownOptions,
  createTextAreaField,
  createTextField,
  createDatePicker,
  createBooleanDropdown,
  _sendDefaults,
  readConfigFile,
  replaceStringCharacter,
  _isSecretAttribute,
  _isFieldForPassword,
  _isFieldForMultiSecrets,
  createMultiSecretCardGroup,
  createSecretTextField,
  createSecretPasswordField,
  createDropDown,
  reOrderSecretAttributes
} from "../../../utils/AdditionalParamUtils";
import {
  isValidTimeoutRange,
  accessDenied,
  removeEmptyOrNullParams,
  isEmptyString,
  showNotification
} from "../../../utils/CommonUtils";

@definition("e-heal-resource-panel", {
  style,
  home: "heal-resource-panel",
  props: {
    data: {
      attribute: true,
      type: "array",
      default: []
    },
    vnfInstanceName: {
      attribute: false,
      type: "string",
      default: ""
    },
    resourceId: {
      attribute: false,
      type: "string",
      default: ""
    },
    isValidPermission: {
      attribute: false,
      type: "boolean"
    },
    comboValue: {
      attribute: false,
      type: "string",
      default: ""
    },
    applicationTimeOut: {
      attribute: false,
      type: "string",
      default: "3600"
    },
    validTimeout: {
      attribute: false,
      type: "boolean",
      default: true
    },
    healResourceData: {
      attribute: true,
      type: "object",
      default: {}
    },
    causes: {
      attribute: true,
      type: "array",
      default: []
    },
    validCause: {
      attribute: false,
      type: "boolean",
      default: false
    },
    confirmResourceHeal: {
      attribute: false,
      type: "boolean",
      default: false
    },
    generalAttributes: {
      attribute: false,
      type: "array",
      default: []
    },
    secretAttributes: {
      attribute: false,
      type: "array",
      default: []
    },
    objectArray: {
      attribute: false,
      type: "array",
      default: []
    },
    backupPassword: {
      attribute: false,
      type: "string",
      default: ""
    },
    backupFileReference: {
      attribute: false,
      type: "string",
      default: ""
    }
  }
})
export default class HealResourcePanel extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidReceiveProps(previous) {
    const hasDifferentData =
      previous.healResourceData != null &&
      this.healResourceData.instanceId !== previous.healResourceData.instanceId;

    if (hasDifferentData) {
      this._parseAttributes(this._getHealAdditionalParams());
    }

    if (hasDifferentData && this.healResourceData.instanceId) {
      this.nextTick(this.setInitialPasswords);
    }
  }

  componentDidConnect() {
    this.validAppTimeout = true;
    this.validTimeout = true;
    this.confirmResourceHeal = false;
    this.additionalAttributesComponents = [];
    this.validCause = false;
  }

  /**
   * Invoke specific function in next tick
   *
   * @param {function} callback: function which will be invoke with delay
   * @returns {void}
   */
  nextTick(callback) {
    setTimeout(callback.bind(this), 1);
  }

  setInitialPasswords() {
    const targetNodes = this.shadowRoot.querySelectorAll("eui-base-v0-password-field");
    const elements = Array.from(targetNodes);

    elements.forEach(element => {
      const { name = "" } = element;
      const secret =
        this.generalAttributes.find(item => {
          const { metadata } = item || {};
          const { chart_param: param } = metadata || {};

          return param === name;
        }) || {};
      const value = secret.default || secret.default === 0 ? secret.default : "";

      element.value = value;
    });
  }

  handleEvent(event) {
    switch (event.target.id) {
      case "cause-combo-box":
        this._validateCauseDropDownBoxValue(event);
        break;
      case "applicationTimeOut":
        this.applicationTimeOut = event.target.value;
        this.validAppTimeout = this._validateTimeout(this.applicationTimeOut, "applicationTimeOut");
        break;
      case "invalid-heal-cause":
        this.returnToResources();
        break;
      case "heal-perform-button":
        this.confirmResourceHeal = true;
        break;
      case "cancel-heal-confirmation":
        this.confirmResourceHeal = false;
        break;
      case "heal-confirmation":
        this.handleHealClick();
        break;
      case "restorePassword":
        this.backupPassword = event.target.value;
        this._validateRestorePassword();
        break;
      case "restoreBackupReference":
        this.backupFileReference = event.target.value;
        this._validateRestorePassword();
        break;
      default:
        console.log(`Unexpected event [${event.target.id}] is received.`);
    }
  }

  renderHealResourcePanel() {
    return html`
      <eui-layout-v0-multi-panel-tile tile-title="Heal ${this.vnfInstanceName}">
        <div slot="content">
          ${this._generateContent()}
        </div>
        ${this._generateHealButtons()}
      </eui-layout-v0-multi-panel-tile>
    `;
  }

  _generateContent() {
    if (!this.healResourceData.descriptorModel) {
      return html``;
    }
    if (this.healResourceData.descriptorModel && !this.healResourceData.causes) {
      return this._generateCausesNotPresentDialog();
    }
    return this._generateHealPanel();
  }

  _generateCausesNotPresentDialog() {
    return html`
      <eui-base-v0-dialog label="Causes Not Present" no-cancel="true" show="true">
        <div slot="content" class="no-scroll dialog__content">
          ${HEAL_NO_CAUSES_MSG}
        </div>
        <eui-base-v0-button slot="bottom" id="invalid-heal-cause" @click="${this.handleEvent}"
          >Ok</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }

  _generateHealPanel() {
    return html`
      <div class="divTableBody">
        <div class="divTableRow">
          <div class="divTableCell">
            <p><b>Cause *</b></p>
          </div>
          <div class="divTableCell">
            <div class="heal-type-combo">${this._createComboDropdownBox()}</div>
          </div>
        </div>
        <div class="divTableRow">
          <div class="divTableCell">
            <p><b>Additional parameters</b></p>
          </div>
        </div>
        ${this._createApplicationTimeout()} ${this.additionalAttributesComponents}
      </div>
    `;
  }

  _generateCauseComboBox() {
    return html`
      <eui-base-v0-combo-box
        class="combo-box"
        .data=${this.causes}
        placeholder="Please select..."
        id="cause-combo-box"
        @click=${this}
        @change=${this}
      ></eui-base-v0-combo-box>
    `;
  }

  _createComboDropdownBox() {
    if (!(Array.isArray(this.data) && this.data.length !== 0)) {
      if (this.healResourceData.causes && Object.keys(this.healResourceData.causes).length !== 0) {
        this.data = this._convertCausesToValues();
        this.causes = [...this.data];
      }
    }
    return html`
      <div class="heal-type-combo-holder">
        <div class="content">
          ${this._generateCauseComboBox()}
        </div>
      </div>
    `;
  }

  _convertCausesToValues() {
    const result = [];
    const causes = Object.values(this.healResourceData.causes);
    causes.forEach(item => {
      result.push({
        value: item
      });
    });
    return result;
  }

  _validateCauseDropDownBoxValue(event) {
    const { value } = event.target;
    const dropDownValueExists = this.data.filter(obj => obj.value === value);
    if (Array.isArray(dropDownValueExists) && dropDownValueExists.length !== 0) {
      this.comboValue = value;
      this.validCause = true;
      this.cause = value;
    } else {
      this.comboValue = "";
      this.validCause = false;
      this.cause = "";
    }
  }

  _parseAttributes(data) {
    if (!data || data.length === 0) {
      return;
    }
    this._separateAttributes(data);
    this.generalAttributes.forEach(component => {
      if (component.type === "boolean") {
        this._createSpecificAdditionalAttributeInput("boolean", component);
      } else if (component.type === "file") {
        this._createSpecificAdditionalAttributeInput("file", component);
      } else if (component.type === "timestamp") {
        this._createSpecificAdditionalAttributeInput("date", component);
      } else if (component.type === "map") {
        const map = {
          name: component.metadata.chart_param,
          complexType: component.type,
          type: component.entry_schema.type,
          required: component.required,
          isValid: true
        };
        this.objectArray.push(map);
        this._createSpecificAdditionalAttributeInput("map", component);
      } else if (component.type === "list") {
        const list = {
          name: component.metadata.chart_param,
          complexType: component.type,
          type: component.entry_schema.type,
          required: component.required,
          isValid: true
        };
        this.objectArray.push(list);
        this._createSpecificAdditionalAttributeInput("list", component);
      } else if (component.metadata.chart_param === "restore.password") {
        const specificHtml = this._createRestorePasswordTextField(component);
        _sendDefaults(component, this);
        this.additionalAttributesComponents.push(specificHtml);
      } else if (component.type === "password") {
        this._createSpecificAdditionalAttributeInput("password", component);
      } else if (component.metadata.chart_param === "restore.backupFileReference") {
        this.backupFileReference = component.default;
        const specificHtml = this._createRestoreRef(component);
        const additionalAttribute = this._createGenericAdditionalAttributeInput(
          component,
          specificHtml
        );
        _sendDefaults(component, this);
        this.additionalAttributesComponents.push(additionalAttribute);
      } else {
        this._createSpecificAdditionalAttributeInput("string", component);
      }
    });
    if (this.secretAttributes.length !== 0) {
      this.createSecretTitle();
      reOrderSecretAttributes.call(this);

      this.secretAttributes.forEach(component => {
        if (_isFieldForPassword(component)) {
          this._createSpecificAdditionalAttributeInput("password", component);
        } else if (_isFieldForMultiSecrets(component)) {
          const map = {
            name: component.metadata.chart_param,
            complexType: component.type,
            type: component.entry_schema.type,
            required: component.required,
            isValid: true
          };
          this.objectArray.push(map);
          this._createSpecificAdditionalAttributeInput("multiSecrets", component);
        } else {
          this._createSpecificAdditionalAttributeInput("secret", component);
        }
      });
    }
  }

  createSecretTitle() {
    const title = html`
      <div class="divTableRow">
        <div class="divTableCell">
          <div class="secret-title">
            Secret attributes:
          </div>
        </div>
      </div>
    `;
    this.additionalAttributesComponents.push(title);
  }

  _separateAttributes(data) {
    this.generalAttributes.length = 0;
    this.secretAttributes.length = 0;

    data.forEach(component => {
      const param = component.metadata.chart_param;

      if (_isSecretAttribute(param)) {
        this.secretAttributes.push(component);
      } else {
        this.generalAttributes.push(component);
      }
    });
  }

  _createSpecificAdditionalAttributeInput(type, component) {
    let specificHtml;
    switch (type) {
      case "boolean":
        specificHtml = createBooleanDropdown(component, this);
        break;
      case "date":
        specificHtml = createDatePicker(component, this);
        break;
      case "secret":
        specificHtml = createSecretTextField(component, this);
        break;
      case "file":
        specificHtml = this.createFileInputField(component);
        break;
      case "password":
        specificHtml = createSecretPasswordField(component, this);
        break;
      case "multiSecrets":
        specificHtml = createMultiSecretCardGroup(component, this);
        break;
      case "map":
      case "list":
        specificHtml = createTextAreaField(component, this);
        break;
      default:
        if (_componentHasDropdownOptions(component)) {
          specificHtml = createDropDown(component, this);
        } else {
          specificHtml = createTextField(component, this);
        }
    }

    const additionalAttribute = this._createGenericAdditionalAttributeInput(
      component,
      specificHtml
    );
    _sendDefaults(component, this);
    this.additionalAttributesComponents.push(additionalAttribute);
  }

  _createGenericAdditionalAttributeInput(component, specificHtml) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${component.metadata.chart_param}${component.required ? " *" : ""}
        </div>
        <div class="divTableCell">
          ${specificHtml}
        </div>
      </div>
    `;
  }

  _getHealAdditionalParams() {
    const result = [];

    if (this.healResourceData.length === 0 || !this.healResourceData.descriptorModel) {
      return result;
    }

    const keys = Object.values(this.healResourceData.descriptorModel);

    keys.forEach(item => {
      result.push(item);
    });

    return result;
  }

  _validateTimeout(timeOut, id) {
    const field = `.${id}.invalidTimeout`;
    const invalidTimeoutSelector = this.shadowRoot.querySelector(field);

    if (timeOut.length === 0 || isValidTimeoutRange(timeOut)) {
      invalidTimeoutSelector.style.display = "none";
      this.validTimeout = true;
      return true;
    }
    invalidTimeoutSelector.style.display = "block";
    this.validTimeout = false;
    return false;
  }

  _validateRestorePassword() {
    const field = `.restorePassword.missingPassword`;
    const missingPasswordSelector = this.shadowRoot.querySelector(field);

    if (this.backupFileReference.length !== 0 && this.backupPassword.length === 0) {
      missingPasswordSelector.style.display = "block";
    } else {
      missingPasswordSelector.style.display = "none";
    }
  }

  _createApplicationTimeout() {
    return this._createTimeoutTextField(APPLICATION_TIMEOUT, "applicationTimeOut");
  }

  _generateHealButtons() {
    return html`
      <div slot="footer">
        <div class="heal-form-footer">
          <eui-base-v0-button @click="${this.returnToResources}">Cancel</eui-base-v0-button>
          <eui-base-v0-button
            class="heal-perform-button"
            id="heal-perform-button"
            @click="${this.handleEvent}"
            primary="true"
            ?disabled=${this._HealDisabled()}
            >Heal</eui-base-v0-button
          >
        </div>
      </div>
    `;
  }

  returnToResources() {
    window.EUI.Router.goto(`resources`);
  }

  renderHealConfirmationDialog() {
    return html`
      <eui-base-v0-dialog label="Heal" no-cancel="true" show="true">
        <div slot="content" class="no-scroll">
          <div slot="content" class="heal-confirm-dialog-holder">${HEAL_CONFIRMATION_MESSAGE}</div>
        </div>
        <eui-base-v0-button slot="bottom" id="cancel-heal-confirmation" @click="${this.handleEvent}"
          >Cancel</eui-base-v0-button
        >
        <eui-base-v0-button
          slot="bottom"
          id="heal-confirmation"
          @click="${this.handleEvent}"
          primary="true"
          warning="true"
          >Heal</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }

  _HealDisabled() {
    return !(
      this.validCause &&
      this.validAppTimeout &&
      this._isValidComplexType() &&
      this._isValidRestoreInfo()
    );
  }

  render() {
    return html`
      ${this.isValidPermission ? this.renderHealResourcePanel() : accessDenied()}
      ${this.confirmResourceHeal ? this.renderHealConfirmationDialog() : ``}
    `;
  }

  _getSelectedComplexTypeByName(name) {
    let selectedComplexType = {};
    this.objectArray.forEach(object => {
      if (object.name === name) {
        selectedComplexType = object;
      }
    });
    return selectedComplexType;
  }

  _setIsValidFieldInSelectedComplexType(name, value) {
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].name === name) {
        this.objectArray[i].isValid = value;
        break;
      }
    }
  }

  _createTimeoutTextField(label, name) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${label}
        </div>
        <div class="divTableCell">
          <eui-base-v0-text-field
            placeholder=${label}
            name=${name}
            id=${name}
            @input=${event => this.handleEvent(event)}
            value="3600"
            fullwidth=${true}
          >
          </eui-base-v0-text-field>

          <small
            ><span class="errorMessage ${name} invalidTimeout"
              >${INVALID_TIMEOUT_ERR_MSG}</span
            ></small
          >
        </div>
      </div>
    `;
  }

  _createRestorePasswordTextField(component) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${component.metadata.chart_param}
        </div>
        <div class="divTableCell">
          <eui-base-v0-password-field
            placeholder=${component.metadata.chart_param}
            name=${component.metadata.chart_param}
            id="restorePassword"
            @input=${event => this.handleEvent(event)}
            fullwidth=${true}
          ></eui-base-v0-password-field>

          <small
            ><span class="errorMessage restorePassword missingPassword"
              >${MISSING_PASSWORD_ERR_MSG}</span
            ></small
          >
        </div>
      </div>
    `;
  }

  _createRestoreRef(component) {
    return html`
      <eui-base-v0-text-field
        name=${component.metadata.chart_param}
        id="restoreBackupReference"
        @input=${event => this.handleEvent(event)}
        value=${component.default || component.default === 0 ? component.default : ""}
        placeholder=${component.metadata.chart_param}
        fullwidth="true"
        class="editAttribute"
      ></eui-base-v0-text-field>
    `;
  }

  _isValidComplexType() {
    let isValid = true;
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].isValid === false) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  _isValidRestoreInfo() {
    return !(this.backupFileReference.length !== 0 && this.backupPassword.length === 0);
  }

  createFileInputField(component) {
    return html`
      <div class="divTableRow">
        <div class="inlineBlock">
          <eui-base-v0-text-field
            id=${replaceStringCharacter(component.metadata.chart_param)}
            placeholder="Select file to import"
            disabled
          >
          </eui-base-v0-text-field>
        </div>
        <eui-base-v0-file-input
          class="editAttribute"
          name=${component.metadata.chart_param}
          @change=${readConfigFile.bind(this)}
          style="width:110px;"
        >
          Select file
        </eui-base-v0-file-input>
      </div>
    `;
  }

  handleHealClick() {
    this._sendHealRequest();
    this.confirmResourceHeal = false;
    window.EUI.Router.goto(`resources`);
  }

  _parseDataForHealRequest() {
    const healVnfRequest = {};
    healVnfRequest.cause = this.cause;
    healVnfRequest.additionalParams = removeEmptyOrNullParams({}, this.additionalAttributes);

    if (!isEmptyString(this.applicationTimeOut)) {
      healVnfRequest.additionalParams.applicationTimeOut = this.applicationTimeOut;
    }

    return healVnfRequest;
  }

  _sendHealRequest() {
    const healVnfRequest = this._parseDataForHealRequest();

    const headers = CONTENT_TYPE_JSON_HEADER;

    executeSimplePostRequest(
      HEAL_URL.replace(":vnfInstanceId", this.resourceId),
      healVnfRequest,
      headers,
      this._successCallback,
      this._errorCallback
    );
  }

  _successCallback = () => {
    showNotification(
      `${HEAL_STARTED_NOTIFICATION}`,
      `${OPERATION_STARTED_MESSAGE}`,
      false,
      5000,
      "operations"
    );
  };

  _errorCallback = () => {};
}

/**
 * Register the component as e-heal-resource-panel.
 * Registration can be done at a later time and with a different name
 */
HealResourcePanel.register();
