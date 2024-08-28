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
 * Component GenericKeyValueInput is defined as
 * `<e-generic-key-value-pair-input>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyValuePairInput();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-value-pair-input></e-generic-key-value-pair-input>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericKeyValuePairInput.css";
import "../../generic-text-field/src/GenericTextField";
import "../../generic-key-value-file-text-input/src/GenericKeyValueFileTextInput";
import { isEmptyString } from "../../../utils/CommonUtils";
import { KEY_EMPTY_ERROR_MESSAGE, VALUE_EMPTY_ERROR_MESSAGE } from "../../../constants/Messages";
import {
  GENERIC_KV_PAIR_FILE_TEXT_INPUT_CHANGE_EVENT,
  GENERIC_KV_PAIR_INPUT_CHANGE_EVENT,
  GENERIC_KV_PAIR_INPUT_DELETE_EVENT,
  INPUT
} from "../../../constants/Events";

/**
 * @property {string} fileTooltipText - the text displayed when hover over on the file tooltip
 * @property {String} keyValidationMessage - message displayed when key is invalid
 * @property {Boolean} isValid - Indicate if current input is valid
 * @property {Boolean} deleteButtonDisabled - toggle if the delete button will be disabled
 */
@definition("e-generic-key-value-pair-input", {
  style,
  home: "generic-key-value-pair-input",
  props: {
    fileTooltipText: { attribute: true, type: "string", default: "Attach File" },
    keyValidationMessage: { attribute: false, type: "string", default: "" },
    isValid: { attribute: false, type: "boolean", default: true },
    deleteButtonDisabled: { attribute: true, type: "boolean", default: false }
  }
})
export class GenericKeyValuePairInput extends LitComponent {
  componentDidUpgrade() {
    this.keyField = this.shadowRoot.querySelector(".key e-generic-text-field");
    this.valueField = this.shadowRoot.querySelector(".value e-generic-key-value-file-text-input");
    this.errorField = this.shadowRoot.querySelector(".key .error");
  }

  handleEvent(event) {
    switch (event.type) {
      case GENERIC_KV_PAIR_FILE_TEXT_INPUT_CHANGE_EVENT:
      case INPUT: {
        event.stopPropagation();
        this.validateInput();
        this._bubbleChangeEvent();
        break;
      }
      default:
        break;
    }
  }

  validateInput() {
    const isKeyEmpty = isEmptyString(this.getKey());
    const isValueEmpty = this.valueField.isEmpty();

    if (isKeyEmpty && isValueEmpty) {
      this._hideErrorField();
      return true;
    }

    let isValidInput = true;
    if (isKeyEmpty) {
      isValidInput = false;
      this._showKeyErrorField(KEY_EMPTY_ERROR_MESSAGE);
    } else {
      this._hideKeyErrorField();
    }

    if (isValueEmpty) {
      isValidInput = false;
      this._showValueErrorField(VALUE_EMPTY_ERROR_MESSAGE);
    } else {
      isValidInput = !isKeyEmpty && this.valueField.validateInput();
    }

    if (isValidInput) {
      this._hideErrorField();
    }

    return isValidInput;
  }

  isEmpty() {
    return isEmptyString(this.getKey()) && this.valueField.isEmpty();
  }

  _showKeyErrorField(message) {
    this.isValid = false;
    this.keyValidationMessage = message;
    this.errorField.removeAttribute("hidden");
  }

  _hideKeyErrorField() {
    this.keyValidationMessage = "";
    this.errorField.setAttribute("hidden", "");
  }

  _showValueErrorField(message) {
    this.isValid = false;
    this.valueField._showErrorField(message);
  }

  _showErrorField(keyMessage, valueMessage) {
    this.isValid = false;
    this._showKeyErrorField(keyMessage);
    this._showValueErrorField(valueMessage);
  }

  _hideErrorField() {
    this.isValid = true;
    this._hideKeyErrorField();
    this.valueField._hideErrorField();
  }

  _removeSelf = () => {
    if (this.deleteButtonDisabled) {
      return;
    }
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
    this.bubble(GENERIC_KV_PAIR_INPUT_DELETE_EVENT, {});
  };

  _bubbleChangeEvent() {
    this.bubble(GENERIC_KV_PAIR_INPUT_CHANGE_EVENT, {});
  }

  getKey() {
    return this.keyField ? this.keyField.getValue() : "";
  }

  getValue() {
    return this.valueField ? this.valueField.getValue() : "";
  }

  render() {
    return html`
      <div class="container">
        <div class="key">
          <e-generic-text-field
            class="textField"
            placeholder=" "
            @input=${this}
          ></e-generic-text-field>
          <div id="keyFieldValidationError" class="error" hidden>
            <small>${this.keyValidationMessage}</small>
          </div>
        </div>
        <div class="value">
          <e-generic-key-value-file-text-input
            @genericKeyValueFileTextInput:change=${this}
            file-tooltip-text=${this.fileTooltipText}
            accept=""
          ></e-generic-key-value-file-text-input>
        </div>
        <div class="delete">
          <eui-v0-icon
            id="deleteKeyValuePairIcon"
            name="trashcan"
            @click=${() => this._removeSelf()}
            ?disabled=${this.deleteButtonDisabled}
          ></eui-v0-icon>
        </div>
      </div>
    `;
  }
}

GenericKeyValuePairInput.register();
