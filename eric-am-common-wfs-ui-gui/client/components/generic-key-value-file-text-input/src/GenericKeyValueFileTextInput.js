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
/**
 * Component GenericKeyValueFileUploader is defined as
 * `<e-generic-key-value-file-uploader>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyValueFileUploader();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-value-file-uploader></e-generic-key-value-file-uploader>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import "../../generic-file-input/src/GenericFileInput";
import style from "./genericKeyValueFileTextInput.css";
import {
  GENERIC_TEXT_FIELD_RESET_EVENT,
  GENERIC_KV_PAIR_FILE_TEXT_INPUT_CHANGE_EVENT,
  INPUT
} from "../../../constants/Events";
import { _isValidJSON } from "../../../utils/AdditionalParamUtils";
import {
  isEmptyString,
  returnExtension,
  isFileInputEmpty,
  validateFileExtension,
  compressJSONString
} from "../../../utils/CommonUtils";
import {
  INVALID_JSON_FORMAT_ERROR_MESSAGE,
  INVALID_FILE_EXTENSION_ERROR_MESSAGE,
  VALUE_EMPTY_ERROR_MESSAGE
} from "../../../constants/Messages";
import {
  INPUT_METHOD_FILE,
  INPUT_METHOD_EDIT,
  INPUT_METHOD_ALL
} from "../../../constants/GenericConstants";
/**
 * @property {String} fileTooltipText - text to show when hover over on file icon
 * @property {String} allowedInputMethod - to indicate which input method the current component is using
 * @property {object} file - the file object selected by file uploader button
 * @property {string} value - the value of the input
 * @property {Boolean} isValid - Indicate that if current input isValid
 * @property {String} validationMessage - message to show if input is invalid
 * @property {String} accept - file extensions that the file input accept e.g. '.json'
 * @property {Boolean} required - if true there much be an input either by text field/file input
 */
@definition("e-generic-key-value-file-text-input", {
  style,
  home: "generic-key-value-file-text-input",
  props: {
    fileTooltipText: { attribute: true, type: "string", default: "Attach File" },
    allowedInputMethod: { attribute: false, type: "string", default: INPUT_METHOD_ALL },
    file: { attribute: false, type: "object", default: null },
    value: { attribute: false, type: "string", default: "" },
    isValid: { attribute: false, type: "boolean", default: true },
    validationMessage: { attribute: false, type: "string", default: "" },
    accept: { attribute: true, type: "string", default: ".json" },
    required: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericKeyValueFileTextInput extends LitComponent {
  componentDidUpgrade() {
    this.textField = this.shadowRoot.querySelector("e-generic-text-field");
    this.fileInput = this.shadowRoot.querySelector("e-generic-file-input");
    this.errorField = this.shadowRoot.querySelector(".error");
  }

  handleEvent(event) {
    switch (event.type) {
      case INPUT: {
        this._switchBetweenTextFieldAndFileInput(event);
        break;
      }
      case GENERIC_TEXT_FIELD_RESET_EVENT: {
        this.reset();
        break;
      }
      default:
        break;
    }
  }

  _switchBetweenTextFieldAndFileInput(event) {
    event.stopPropagation();
    const { target } = event;
    if (target.className === "textField") {
      this.value = this.textField.getValue();
      this.allowedInputMethod = !isEmptyString(this.value) ? INPUT_METHOD_EDIT : INPUT_METHOD_ALL;
      this.validateInput();
      this._bubbleChangeEvent();
    } else if (target.className === "fileInput") {
      this.value = "";
      [this.file] = target.files;
      this._changeTextFieldToBanner(this.file.name);
      if (validateFileExtension(this.file, this.fileInput.accept)) {
        this.fileInput.readFileContentAsString().then(content => {
          this.value = content;
          if (this.validateInput()) {
            if (this._isJsonFile(this.file)) {
              this.value = compressJSONString(content);
            }
          }
          this._bubbleChangeEvent();
        });
      } else {
        this._showErrorField(INVALID_FILE_EXTENSION_ERROR_MESSAGE);
        this._bubbleChangeEvent();
      }
    }
  }

  _changeTextFieldToBanner(fileName) {
    this.textField.setValue(fileName);
    this.textField.decryptText();
    this.allowedInputMethod = INPUT_METHOD_FILE;
  }

  validateInput() {
    if (this.required) {
      if (this.isEmpty()) {
        this._showErrorField(VALUE_EMPTY_ERROR_MESSAGE);
        return false;
      }
    }

    if (this.allowedInputMethod === INPUT_METHOD_FILE) {
      if (!validateFileExtension(this.file, this.fileInput.accept)) {
        this._showErrorField(INVALID_FILE_EXTENSION_ERROR_MESSAGE);
        return false;
      }

      if (this._isJsonFile(this.file) && !_isValidJSON(this.value)) {
        this._showErrorField(INVALID_JSON_FORMAT_ERROR_MESSAGE);
        return false;
      }
    }

    this._hideErrorField();
    return true;
  }

  _isJsonFile(file) {
    return returnExtension(file.name) === "json";
  }

  _hideErrorField() {
    this.isValid = true;
    this.validationMessage = "";
    this.errorField.setAttribute("hidden", "");
  }

  _showErrorField(message) {
    this.isValid = false;
    this.validationMessage = message;
    this.errorField.removeAttribute("hidden");
  }

  reset() {
    this.fileInput.reset();
    this.textField.reset();
    this.file = null;
    this.value = "";
    this.allowedInputMethod = INPUT_METHOD_ALL;
    this.textField.encryptText();
    this.validateInput();
    this._bubbleChangeEvent();
  }

  getValue() {
    return this.value;
  }

  _bubbleChangeEvent() {
    this.bubble(GENERIC_KV_PAIR_FILE_TEXT_INPUT_CHANGE_EVENT, {
      value: this.getValue(),
      isValid: this.isValid
    });
  }

  isEmpty() {
    return isEmptyString(this.textField.getValue()) && isFileInputEmpty(this.fileInput);
  }

  render() {
    return html`
      <div class="container">
        <div class="textFieldContainer">
          <e-generic-text-field
            class="textField"
            placeholder=" "
            @input=${this}
            @genericTextField:reset=${this}
            ?encryptable=${this.allowedInputMethod === INPUT_METHOD_EDIT ||
              this.allowedInputMethod === INPUT_METHOD_ALL}
            ?disabled=${this.allowedInputMethod === INPUT_METHOD_FILE}
            ?clearable=${this.allowedInputMethod === INPUT_METHOD_FILE}
          ></e-generic-text-field>
        </div>
        <eui-base-v0-tooltip message=${this.fileTooltipText} position="top">
          <e-generic-file-input
            id="uploadFileButton"
            class="fileInput"
            @input=${this}
            ?disabled=${this.allowedInputMethod === INPUT_METHOD_EDIT}
            accept=${this.accept}
            borderless
          ></e-generic-file-input>
        </eui-base-v0-tooltip>
      </div>
      <div id="valueError" class="error" hidden>
        <small>${this.validationMessage}</small>
      </div>
    `;
  }
}

GenericKeyValueFileTextInput.register();
