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
import { html } from "@eui/lit-component";
import "../components/generic-datepicker/src/GenericDatepicker";
import "../components/generic-dropdown/src/GenericDropdown";
import "../components/generic-key-map-card-group/src/GenericKeyMapCardGroup";
import { isEmptyString, isEmpty } from "./CommonUtils";
import { UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT } from "../constants/Events";
import { SECRET_ATTRIBUTES, ADD_SECRET, SECRET_NAME } from "../constants/GenericConstants";
import { WRONG_COMPLEX_TYPE, WRONG_COMPLEX_TYPE_VALUES } from "../constants/Messages";

export function _sendEvent(name, value) {
  const attribute = {};
  attribute[name] = value;
  this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT, attribute);
}

export function _setTextFieldEvent(event) {
  const { name } = event.currentTarget;
  const { value } = event.currentTarget;
  _sendEvent.call(this, name, value);
}

export function _convertToInteger(value) {
  return Number(value);
}

export function _setIntegerFieldEvent(event) {
  const { name } = event.currentTarget;
  const { value } = event.currentTarget;
  _sendEvent.call(this, name, _convertToInteger(value));
}

export function _checkIfInteger(component) {
  return component.type === "integer";
}

export function replaceStringCharacter(name) {
  return name.replace(/\./g, "-");
}

export function _setValueAsObjectIfValid(name, value) {
  const complexType = this._getSelectedComplexTypeByName.call(this, name);
  if (complexType.isValid && !isEmptyString(value)) {
    value = JSON.parse(value);
  }
  _sendEvent.call(this, name, value);
}

export function _isTimestamp(value) {
  const date = new Date(value);
  const isNaNValue = Number.isNaN(date.getTime());
  const startWithCharacter = new RegExp("^[!@#\\$%\\^\\?&*;/\\)\\<>(+=. ,_-]").test(value);
  const endWithCharacter = new RegExp("[!@#\\$%\\^\\?&*;/\\)\\<>(+=. ,_-]$").test(value);
  return !isNaNValue && !startWithCharacter && !endWithCharacter;
}

export function _isFloat(value) {
  return Number(value) === value && value % 1 !== 0;
}

export function _isNotPrimitiveType(value) {
  return typeof value !== "boolean" && !Number.isInteger(value) && !_isFloat(value);
}

export function _isValidIntRange(value) {
  return value >= -2147483648 && value <= 2147483647;
}

export function _isEmptyObject(parsedValue) {
  return Object.keys(parsedValue).length === 0;
}

export function _isValidJSON(value) {
  if (!isEmptyString(value)) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
  }
  return true;
}

export function convertToValues(data, selected, name) {
  const result = [];
  data.forEach(item => {
    if (selected !== item) {
      result.push({ name, value: item });
    } else {
      result.push({ name, value: item, checked: true });
    }
  });
  return result;
}

export function _isCorrectType(complexType, value) {
  let isCorrectType = true;
  if (complexType === "list") {
    isCorrectType = Array.isArray(value);
  } else if (complexType === "map") {
    isCorrectType = Object.prototype.toString.call(value) === "[object Object]";
  }
  return isCorrectType;
}

export function _isValidValueType(type, value) {
  switch (type) {
    case "string":
      return typeof value === "string" || value instanceof String;
    case "int":
      return Number.isInteger(value) && _isValidIntRange(value);
    case "boolean":
      return typeof value === "boolean";
    case "float":
      return _isFloat(value) || Number.isInteger(value);
    case null:
      return value === null && undefined !== value;
    case "timestamp":
      return _isNotPrimitiveType(value) && _isTimestamp(value);
    default:
      return true;
  }
}

export function _convertDefaults(component) {
  if (component.default === undefined || !component.default) {
    return "";
  }
  if (_checkIfInteger(component)) {
    return _convertToInteger(component.default);
  }
  return component.default;
}

export function createTextField(component, source) {
  return html`
    <eui-base-v0-text-field
      name=${component.metadata.chart_param}
      @input=${_checkIfInteger(component)
        ? _setIntegerFieldEvent.bind(source)
        : _setTextFieldEvent.bind(source)}
      value=${_convertDefaults(component)}
      placeholder=${component.metadata.chart_param}
      fullwidth="true"
      class="editAttribute"
    ></eui-base-v0-text-field>
  `;
}

export function _componentHasDropdownOptions(component) {
  return (
    component.constraints &&
    component.constraints[0] &&
    component.constraints[0].valid_values &&
    component.constraints[0].valid_values.length > 0
  );
}

export function _setDatePickerValue(event) {
  this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT, event.target.getValue());
}

export function createDatePicker(component, source) {
  return html`
        <e-generic-datepicker
            class="editAttribute"
            @input=${_setDatePickerValue.bind(source)}
            @change=${_setDatePickerValue.bind(source)}
            .date=${component.default}
            .dataAttribute="${component.metadata.chart_param}"
        ></eui-base-v0-datepicker>
      `;
}

export const BOOLEAN_DROPDOWN_OPTIONS = {
  None: undefined,
  True: true,
  False: false
};

export function _selectDropdownValue(event) {
  const { name, value } = event.detail;
  if (event.currentTarget.classList.contains("booleanDropdown")) {
    _sendEvent.call(this, name, BOOLEAN_DROPDOWN_OPTIONS[value.trim()]);
  } else {
    _sendEvent.call(this, name, value.trim());
  }
}

export function createDropDown(component, source) {
  const data = convertToValues(
    component.constraints[0].valid_values,
    component.default,
    component.metadata.chart_param
  );
  return html`
    <e-generic-dropdown
      label=${component.metadata.chart_param}
      data-type="single"
      width="17rem"
      .data=${data}
      class="editAttribute"
      @change=${_selectDropdownValue.bind(source)}
    ></e-generic-dropdown>
  `;
}

export function createBooleanDropdown(component, source) {
  const data = Object.entries(BOOLEAN_DROPDOWN_OPTIONS).map(([value, booleanValue]) => ({
    name: component.metadata.chart_param,
    value,
    checked:
      value === "None" && component.default === null ? true : booleanValue === component.default
  }));

  return html`
    <e-generic-dropdown
      label=${component.metadata.chart_param}
      data-type="single"
      width="17rem"
      .data=${data}
      class="editAttribute booleanDropdown"
      @change=${_selectDropdownValue.bind(source)}
    ></e-generic-dropdown>
  `;
}

export function _isEmptyAndNotRequired(name, value) {
  const complexType = this._getSelectedComplexTypeByName.call(this, name);
  const isEmptyStringValue = isEmptyString(value);
  return isEmptyStringValue && !complexType.required;
}

export function _setDisplayNoneForError(name, errorName) {
  const fieldClass = `#${replaceStringCharacter(name)} .${errorName}`;
  const invalidComplexTypeSelector = this.shadowRoot.querySelector(fieldClass);
  invalidComplexTypeSelector.style.display = "none";
}

export function _showErrorForField(fieldName, errorName, innerText) {
  const fieldClass = `#${replaceStringCharacter(fieldName)} .${errorName}`;
  const invalidComplexTypeSelector = this.shadowRoot.querySelector(fieldClass);
  if (innerText !== undefined) {
    invalidComplexTypeSelector.innerText = innerText;
  }
  invalidComplexTypeSelector.style.display = "block";
}

export function _validateEmptyComplexType(fieldName, value) {
  if (_isEmptyAndNotRequired.call(this, fieldName, value)) {
    _setDisplayNoneForError.call(this, fieldName, "errorJsonMessage");
    _setDisplayNoneForError.call(this, fieldName, "errorValuesMessage");
    _setDisplayNoneForError.call(this, fieldName, "errorTypeMessage");
    this._setIsValidFieldInSelectedComplexType(fieldName, true);
  } else {
    _setDisplayNoneForError.call(this, fieldName, "errorValuesMessage");
    _setDisplayNoneForError.call(this, fieldName, "errorTypeMessage");
    _showErrorForField.call(this, fieldName, "errorJsonMessage");
    this._setIsValidFieldInSelectedComplexType(fieldName, false);
  }
}

export function _isCorrectComplexType(name, value) {
  const selectedComplexType = this._getSelectedComplexTypeByName.call(this, name);
  const isCorrectType = _isCorrectType(selectedComplexType.complexType, value);
  if (isCorrectType) {
    _setDisplayNoneForError.call(this, name, "errorTypeMessage");
  } else {
    const innerText = WRONG_COMPLEX_TYPE.replace("<TYPE>", selectedComplexType.complexType);
    _showErrorForField.call(this, name, "errorTypeMessage", innerText);
  }

  this._setIsValidFieldInSelectedComplexType(name, isCorrectType);
  return isCorrectType;
}

export function _isValidComplexTypeValues(name, parsedValue) {
  if (_isEmptyObject(parsedValue)) return false;
  const selectedComplexType = this._getSelectedComplexTypeByName.call(this, name);
  let isValidValues = true;
  const complexTypeValues = Object.values(parsedValue);
  for (let i = 0; i < complexTypeValues.length; i += 1) {
    const isValidValue = _isValidValueType(selectedComplexType.type, complexTypeValues[i]);
    if (!isValidValue) {
      isValidValues = false;
      break;
    }
  }

  return isValidValues;
}

export function _validateComplexTypeValues(name, jsonValue) {
  const isValidValues = _isValidComplexTypeValues.call(this, name, jsonValue);
  if (isValidValues) {
    _setDisplayNoneForError.call(this, name, "errorValuesMessage");
  } else {
    const selectedComplexType = this._getSelectedComplexTypeByName.call(this, name);
    const innerText = WRONG_COMPLEX_TYPE_VALUES.replace("<TYPE>", selectedComplexType.type);
    _showErrorForField.call(this, name, "errorValuesMessage", innerText);
  }

  this._setIsValidFieldInSelectedComplexType(name, isValidValues);
}

export function _validateComplexTypeJSON(name, value) {
  const isValidJSON = _isValidJSON(value);
  if (isValidJSON) {
    _setDisplayNoneForError.call(this, name, "errorJsonMessage");
  } else {
    _setDisplayNoneForError.call(this, name, "errorValuesMessage");
    _setDisplayNoneForError.call(this, name, "errorTypeMessage");
    _showErrorForField.call(this, name, "errorJsonMessage");
  }

  this._setIsValidFieldInSelectedComplexType(name, isValidJSON);
  return isValidJSON;
}

export function _validateNotEmptyComplexType(name, value) {
  const isValidJson = _validateComplexTypeJSON.call(this, name, value);
  if (isValidJson) {
    const jsonValue = JSON.parse(value);
    const isCorrectComplexType = _isCorrectComplexType.call(this, name, jsonValue);
    if (isCorrectComplexType) {
      _validateComplexTypeValues.call(this, name, jsonValue);
    }
  }
}

export function _validateComplexType(name, value) {
  if (isEmptyString(value)) {
    _validateEmptyComplexType.call(this, name, value);
  } else {
    _validateNotEmptyComplexType.call(this, name, value);
  }
}

export function _setTextAreaField(event) {
  const { name } = event.currentTarget;
  const { value } = event.currentTarget;
  _validateComplexType.call(this, name, value);
  _setValueAsObjectIfValid.call(this, name, value);
}

export function _setKeyMapCardGroup(event) {
  const cardGroup = event.currentTarget;
  const name = cardGroup.label;
  const data = cardGroup.getData();
  const value = isEmpty(data) ? undefined : data;
  const complexType = this._getSelectedComplexTypeByName.call(this, name);
  complexType.isValid = cardGroup.validateInput();
  _sendEvent.call(this, name, value);
}

export function createSecretTextField(component, source) {
  return html`
    <eui-base-v0-text-field
      name=${component.metadata.chart_param}
      @input=${_setTextFieldEvent.bind(source)}
      value=${component.default || component.default === 0 ? component.default : ""}
      placeholder=${component.metadata.chart_param}
      disabled
      fullwidth="true"
    ></eui-base-v0-text-field>
  `;
}

export function createSecretPasswordField(component, source) {
  return html`
    <eui-base-v0-password-field
      id=${replaceStringCharacter(component.metadata.chart_param)}
      name=${component.metadata.chart_param}
      @input=${_setTextFieldEvent.bind(source)}
      value=${component.default || component.default === 0 ? component.default : ""}
      placeholder=${component.metadata.chart_param}
      fullwidth="true"
      class="editAttribute"
    ></eui-base-v0-password-field>
  `;
}

export function _isSecretAttribute(attribute) {
  return attribute.includes("day0.configuration");
}

export function _isFieldForPassword(component) {
  const param = component.metadata.chart_param;

  return param.includes("day0.configuration") && param.includes("value");
}

export function _isFieldForMultiSecrets(component) {
  const param = component.metadata.chart_param;

  return param.includes("day0.configuration") && param.includes("secrets");
}

export function createTextAreaField(component, source) {
  const defaultValue = component.default;
  const textArea = html`
    <eui-base-v0-textarea
      name=${component.metadata.chart_param}
      @input=${_setTextAreaField.bind(source)}
      value=${defaultValue || defaultValue === 0 ? JSON.stringify(defaultValue) : ""}
      placeholder=${component.metadata.chart_param}
      fullwidth="true"
      class="editAttribute"
    ></eui-base-v0-textarea>
    <div id=${replaceStringCharacter(component.metadata.chart_param)}>
      <small><span class="errorJsonMessage">${"Invalid JSON"}</span></small>
    </div>
    <div id=${replaceStringCharacter(component.metadata.chart_param)}>
      <small><span class="errorTypeMessage">${WRONG_COMPLEX_TYPE}</span></small>
    </div>
    <div id=${replaceStringCharacter(component.metadata.chart_param)}>
      <small><span class="errorValuesMessage">${WRONG_COMPLEX_TYPE_VALUES}</span></small>
    </div>
  `;
  return textArea;
}

export function createMultiSecretCardGroup(component, source) {
  return html`
    <e-generic-key-map-card-group
      name=${component.metadata.chart_param}
      .label=${component.metadata.chart_param}
      .keyMapCardTitle=${SECRET_ATTRIBUTES}
      .cardKeyTitle=${SECRET_NAME}
      .addButtonText=${ADD_SECRET}
      @genericKeyMapCardGroup:change=${_setKeyMapCardGroup.bind(source)}
      class="editAttribute"
    ></e-generic-key-map-card-group>
  `;
}

export function _isEmptyAndRequired(name, value) {
  const complexType = this._getSelectedComplexTypeByName.call(this, name);
  const isEmptyStringValue = isEmptyString(value);
  return complexType.required && isEmptyStringValue;
}

export function _sendDefaults(component, source) {
  if (component.default != null && component.default.toString().length > 0) {
    if (component.type === "list" || component.type === "map") {
      _sendEvent.call(source, component.metadata.chart_param, component.default);
    } else if (component.type === "integer") {
      _sendEvent.call(source, component.metadata.chart_param, component.default);
    } else {
      _sendEvent.call(source, component.metadata.chart_param, component.default.toString());
    }
  }
}

export function _setDisplayNoneForValuesError(name) {
  const fieldClass = `#${replaceStringCharacter(name)} .errorValuesMessage`;
  const invalidComplexTypeSelector = this.shadowRoot.querySelector(fieldClass);
  invalidComplexTypeSelector.style.display = "none";
}

export function _setDisplayNoneForTypeError(name) {
  const fieldClass = `#${replaceStringCharacter(name)} .errorTypeMessage`;
  const invalidComplexTypeSelector = this.shadowRoot.querySelector(fieldClass);
  invalidComplexTypeSelector.style.display = "none";
}

export function readConfigFile(event) {
  const { name } = event.currentTarget;
  const { files } = event.currentTarget;
  const element = this.shadowRoot.querySelector(`#${replaceStringCharacter(name)}`);
  if (files.length > 0) {
    const file = files[0];
    const reader = new window.FileReader();
    reader.fileName = files[0].name;
    element.placeholder = reader.fileName;
    reader.onload = () => {
      _sendEvent.call(this, name, reader.result);
    };
    reader.readAsText(file);
  }
}

export function reOrderSecretAttributes() {
  const indexOfMultiSecret = this.secretAttributes.findIndex(
    attribute =>
      attribute.metadata && attribute.metadata.chart_param === "day0.configuration.secrets"
  );
  if (indexOfMultiSecret !== -1) {
    const [multiSecretComponent] = this.secretAttributes.splice(indexOfMultiSecret, 1);
    this.secretAttributes.push(multiSecretComponent);
  }
}
