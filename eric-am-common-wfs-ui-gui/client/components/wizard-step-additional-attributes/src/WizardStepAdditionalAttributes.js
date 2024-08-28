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
 * Component WizardStepAdditionalAttributes is defined as
 * `<e-wizard-step-additional-attributes>`
 *
 * Imperatively create component
 * @example
 * let component = new WizardStepAdditionalAttributes();
 *
 * Declaratively create component
 * @example
 * <e-wizard-step-additional-attributes></e-wizard-step-additional-attributes>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./wizardStepAdditionalAttributes.css";
import "../../generic-dropdown/src/GenericDropdown";
import "../../generic-datepicker/src/GenericDatepicker";
import {
  showNotification,
  checkIsInputMethodOfType,
  isEmptyString,
  ADDITIONAL_ATTRIBUTES_BLACK_LIST
} from "../../../utils/CommonUtils";
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
  createSecretTextField,
  createSecretPasswordField,
  createDropDown,
  _setDisplayNoneForError,
  _sendEvent,
  _isValidJSON,
  _showErrorForField,
  createMultiSecretCardGroup,
  reOrderSecretAttributes
} from "../../../utils/AdditionalParamUtils";
import "../../generic-inline-description/src/GenericInlineDescription";
import {
  WIZARD_FILE_UPLOAD_FAILED_ERROR_HEADER,
  WIZARD_FILE_UPLOAD_FAILED_ERROR_BODY,
  WIZARD_FILE_UPLOAD_DESC
} from "../../../constants/Messages";
import {
  INPUT_METHOD_EDIT,
  INPUT_METHOD_FILE,
  INPUT_METHOD_ALL
} from "../../../constants/GenericConstants";
import {
  UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT,
  UPDATE_ADDITIONAL_ATTRIBUTES_METHOD_EVENT,
  WIZARD_VALIDATE_STEP_EVENT
} from "../../../constants/Events";

// services
import { logger } from "../../../utils/logger.service";

@definition("e-wizard-step-additional-attributes", {
  style,
  props: {
    data: { attribute: false, type: "array", default: [] },
    selectedPackage: { attribute: true, type: "object", default: {} },
    renderedData: { attribute: false, type: "array", default: [] },
    additionalAttributesComponents: { attribute: false, type: "array", default: [] },
    additionalAttributes: { attribute: true, type: "object", default: {} },
    fileBanner: { attribute: false, type: "string", default: "Select file to import" },
    fileName: { attribute: false, type: "string", default: "Select file to import" },
    inputMethod: { attribute: false, type: "array", default: [INPUT_METHOD_EDIT] },
    isFilenameProvided: { attribute: false, type: "boolean", default: false },
    generalAttributes: { attribute: false, type: "array", default: [] },
    secretAttributes: { attribute: false, type: "array", default: [] },
    objectArray: { attribute: false, type: "array", default: [] },
    isValidValuesYaml: { attribute: false, type: "boolean", default: true },
    step: { attribute: true, type: "string" },
    isUpgrade: { attribute: true, type: "boolean", default: false }
  }
})
export default class WizardStepAdditionalAttributes extends LitComponent {
  componentDidReceiveProps(previous) {
    this.bubble(WIZARD_VALIDATE_STEP_EVENT, {
      stepId: "additionalAttributes",
      isValid: this._isWizardValid()
    });

    if (this.step !== "packageSelection" && this._shouldRenderComponents(previous)) {
      this.createComponents();
      this.renderedData = this.data;

      this.nextTick(this.setInitialPasswords);
    }
  }

  /**
   * Getter for package id
   *
   * @returns {string}
   */
  get getPackageId() {
    return this.selectedPackage.appPkgId || "";
  }

  get getGeneralFilteredAttributes() {
    const operation = this.isUpgrade ? "Upgrade" : "Instantiate";

    return ADDITIONAL_ATTRIBUTES_BLACK_LIST[operation];
  }

  get getRequiredFields() {
    logger.log("Additional attributes step - this.data: ", this.data);
    return this.data
      .filter(filterAdditionalAttributesByRequired, this)
      .map(mapAdditionalAttributesByChartParam);
  }

  _isWizardValid() {
    if (this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)) {
      return this._isValidRequiredFields();
    }
    if (this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)) {
      return this._isValidComplexType() && this.isValidValuesYaml;
    }
    if (this._checkIsInputMethodOfType(INPUT_METHOD_FILE)) {
      return this.isFilenameProvided;
    }
    if (this._checkIsInputMethodOfType(INPUT_METHOD_ALL)) {
      return this._isValidComplexType() && this.isValidValuesYaml && this.isFilenameProvided;
    }
    return false;
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

  _shouldRenderComponents(oldValues) {
    const dataIsEqual = JSON.stringify(this.data) === JSON.stringify(this.renderedData);
    const { selectedPackage = {} } = oldValues || {};
    const oldProductId = selectedPackage.appPkgId || "";

    if (
      (oldProductId === "" && this.getPackageId) ||
      (this.data.length !== 0 && !dataIsEqual) ||
      oldProductId !== this.getPackageId ||
      (this.renderedData.length && !this.data.length)
    ) {
      return true;
    }

    return false;
  }

  _isValidRequiredFields() {
    const isValid = this.getRequiredFields.some(nameAA => {
      return this.additionalAttributes[nameAA] === undefined;
    });

    return !isValid;
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

  _checkIsInputMethodOfType(inputMethodType) {
    return checkIsInputMethodOfType(this.inputMethod, inputMethodType);
  }

  _onAdditionalAttributesInputMethodChange() {
    const editAttributeField = this.shadowRoot.querySelectorAll(".editAttribute");
    const inputMethodCheckboxes = this.shadowRoot.querySelectorAll(".inputMethodCheckbox[checked]");
    this.inputMethod = [...inputMethodCheckboxes].map(checkbox => checkbox.name);
    if (this._checkIsInputMethodOfType(INPUT_METHOD_ALL)) {
      editAttributeField.forEach(component => {
        component.removeAttribute("disabled");
      });
    } else if (this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)) {
      this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT, null);
      editAttributeField.forEach(component => {
        component.removeAttribute("disabled");
      });
    } else if (this._checkIsInputMethodOfType(INPUT_METHOD_FILE)) {
      editAttributeField.forEach(component => {
        component.setAttribute("disabled", "");
      });
    }
    this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_METHOD_EVENT, this.inputMethod);
  }

  createComponents() {
    if (this.data.length === 0) {
      this.additionalAttributesComponents = [];

      return;
    }

    this._separateAttributes();
    this.generalAttributes.forEach(component => {
      if (component.type === "boolean") {
        this._createSpecificAdditionalAttributeInput("boolean", component);
      } else if (component.type === "timestamp") {
        this._createSpecificAdditionalAttributeInput("date", component);
      } else if (component.type === "file") {
        this._createSpecificAdditionalAttributeInput("file", component);
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
      } else if (component.type === "password") {
        this._createSpecificAdditionalAttributeInput("password", component);
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
      case "multiSecrets":
        specificHtml = createMultiSecretCardGroup(component, this);
        break;
      case "file":
        specificHtml = this.createFileInputField(component);
        break;
      case "password":
        specificHtml = createSecretPasswordField(component, this);
        break;
      case "map":
      case "list":
        specificHtml = createTextAreaField(component, this);
        break;
      default:
        if (_componentHasDropdownOptions(component)) {
          specificHtml = createDropDown(component, this);
        } else if (component.metadata.chart_param === "values.yaml") {
          specificHtml = this.createValuesYamlField(component);
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
      <div class="tr">
        <div class="td paddingInputTd">
          ${component.metadata.chart_param}${component.required ? " *" : ""}
          ${
            component.metadata.chart_param === "values.yaml"
              ? html`
                  <span class="label-suffix">(JSON should be in regular format)</span>
                `
              : null
          }
          <div class="input">
            ${specificHtml}
          </div>
        </div>
        <div class="td paddingDescriptionTd" style=${this._getDescriptionAlign(component)}>
          <e-generic-inline-description .text=${component.description}>
        </div>
      </div>
    `;
  }

  _getDescriptionAlign(component) {
    return _isFieldForMultiSecrets(component) ? "vertical-align: top" : "";
  }

  createSecretTextField(component) {
    return html`
      <eui-base-v0-text-field
        name=${component.metadata.chart_param}
        @input=${this._setTextField.bind(this)}
        value=${component.default || component.default === 0 ? component.default : ""}
        placeholder=${component.metadata.chart_param}
        disabled
        fullwidth="true"
      ></eui-base-v0-text-field>
    `;
  }

  createSecretPasswordField(component) {
    return html`
      <eui-base-v0-password-field
        name=${component.metadata.chart_param}
        @input=${this._setTextField.bind(this)}
        value=${component.default || component.default === 0 ? component.default : ""}
        placeholder=${component.metadata.chart_param}
        fullwidth="true"
        class="editAttribute"
      ></eui-base-v0-password-field>
    `;
  }

  _setIsValidFieldInSelectedComplexType(name, value) {
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].name === name) {
        this.objectArray[i].isValid = value;
        break;
      }
    }
  }

  _getSelectedComplexTypeByName(name) {
    let selectedComplexType = {};
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].name === name) {
        selectedComplexType = this.objectArray[i];
        break;
      }
    }
    return selectedComplexType;
  }

  createFileInputField(component) {
    return html`
      <div class="tr">
        <div class="td" style="padding-top: 0px">
          <div class="inlineBlock">
            <eui-base-v0-text-field
              id=${replaceStringCharacter(component.metadata.chart_param)}
              placeholder=${this.fileBanner}
              disabled
            >
            </eui-base-v0-text-field>
          </div>
          <eui-base-v0-file-input
            class="editAttribute"
            name=${component.metadata.chart_param}
            @change=${readConfigFile.bind(this)}
            style="line-height: 30px;"
            >Select file</eui-base-v0-file-input
          >
        </div>
      </div>
    `;
  }

  createSecretTitle() {
    const title = html`
      <div class="tr">
        <div class="td paddingInputTd">
          <div class="secret-title">
            Secret attributes:
          </div>
        </div>
      </div>
    `;
    this.additionalAttributesComponents.push(title);
  }

  _separateAttributes() {
    this.generalAttributes.length = 0;
    this.secretAttributes.length = 0;
    const hiddenAttributes = this.isUpgrade
      ? ADDITIONAL_ATTRIBUTES_BLACK_LIST.Upgrade
      : ADDITIONAL_ATTRIBUTES_BLACK_LIST.Instantiate;

    this.data.forEach(component => {
      const param = component.metadata.chart_param;

      if (hiddenAttributes.includes(param)) {
        return false;
      }

      if (_isSecretAttribute(param)) {
        this.secretAttributes.push(component);
      } else {
        this.generalAttributes.push(component);
      }

      return true;
    });
  }

  createValuesYamlField(component) {
    const textField = html`
      <eui-base-v0-text-field
        name=${component.metadata.chart_param}
        @input=${this._setValuesYamlField.bind(this)}
        value=${component.default || component.default === 0 ? component.default : ""}
        placeholder=${component.metadata.chart_param}
        fullwidth="true"
        class="editAttribute"
      ></eui-base-v0-text-field>
      <div id=${replaceStringCharacter(component.metadata.chart_param)}>
        <small><span class="errorValuesYaml">${"Invalid JSON"}</span></small>
      </div>
    `;
    return textField;
  }

  _setValuesYamlField(event) {
    const { name } = event.currentTarget;
    const { value } = event.currentTarget;
    this._validateValuesYaml(name, value);
    _sendEvent.call(this, name, value);
  }

  _validateValuesYaml(name, value) {
    if (!isEmptyString(value)) {
      const isValidJSON = _isValidJSON(value);
      if (!isValidJSON) {
        _showErrorForField.call(this, name, "errorValuesYaml");
        this.isValidValuesYaml = false;
      } else {
        _setDisplayNoneForError.call(this, name, "errorValuesYaml");
        this.isValidValuesYaml = true;
      }
    } else {
      _setDisplayNoneForError.call(this, name, "errorValuesYaml");
      this.isValidValuesYaml = true;
    }
  }

  setFile(event) {
    const { files } = event.currentTarget;

    if (files.length > 0) {
      const file = files[0];
      const fileName = files[0].name;
      if (fileName.includes(".yaml") || fileName.includes(".yml")) {
        this.isFilenameProvided = true;
        this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT, file);
        this.fileName = fileName;
      } else {
        showNotification(
          WIZARD_FILE_UPLOAD_FAILED_ERROR_HEADER,
          WIZARD_FILE_UPLOAD_FAILED_ERROR_BODY,
          true
        );
      }
    }
  }

  _renderInputMethodCheckboxes() {
    const checkboxTypes = [
      ["Upload values file", INPUT_METHOD_FILE],
      ["Input UI values", INPUT_METHOD_EDIT]
    ];
    const checkboxComponents = [];

    checkboxTypes.forEach(option => {
      checkboxComponents.push(html`
        <eui-base-v0-checkbox
          class="inlineBlock inputMethodCheckbox"
          name=${option[1]}
          @change=${e => this._onAdditionalAttributesInputMethodChange(e)}
          group="additionalAttributes"
          ?checked=${this.inputMethod.includes(option[1])}
        >
          ${option[0]}
        </eui-base-v0-checkbox>
      `);
    });

    const component = {};
    component.metadata = {};
    component.metadata.chart_param = "Attribute input method";
    const specificHtml = html`
      ${checkboxComponents}
    `;
    return html`
      ${this._createGenericAdditionalAttributeInput(component, specificHtml)}
    `;
  }

  _renderFileUsage() {
    return html`
      <div class="tr">
        <div class="td paddingInputTd bottomBorder">
          <div class="inlineBlock">
            <eui-base-v0-text-field
              placeholder=${!this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)
                ? this.fileName
                : this.fileBanner}
              disabled
            ></eui-base-v0-text-field>
          </div>
          <eui-base-v0-file-input
            accept=".yaml,.yml"
            @change=${this.setFile.bind(this)}
            ?disabled=${this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)}
            style="line-height: 30px;"
            >Select file</eui-base-v0-file-input
          >
        </div>
        <div class="td paddingDescriptionTd bottomBorder">
          ${WIZARD_FILE_UPLOAD_DESC}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="centeredParent">
        <div class="table">
          ${this._renderInputMethodCheckboxes()} ${this._renderFileUsage()}
          ${this.additionalAttributesComponents}
        </div>
      </div>
    `;
  }
}

WizardStepAdditionalAttributes.register();

export function filterAdditionalAttributesByRequired(item) {
  return item.required && !this.getGeneralFilteredAttributes.includes(item.metadata.chart_param);
}

export function mapAdditionalAttributesByChartParam(item) {
  const { metadata } = item || {};
  const { chart_param: chartParam } = metadata || {};

  return chartParam || "";
}
