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
 * Component GenericKeyValuePairInputGroup is defined as
 * `<e-generic-key-value-pair-input-group>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyValuePairInputGroup();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-value-pair-input-group></e-generic-key-value-pair-input-group>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericKeyValuePairInputGroup.css";
import {
  GENERIC_KV_PAIR_INPUT_DELETE_EVENT,
  GENERIC_KV_PAIR_INPUT_CHANGE_EVENT,
  GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT
} from "../../../constants/Events";
import {
  KEY_ALREADY_EXISTS_ERROR_MESSAGE,
  AT_LEAST_ONE_KV_PAIR_ERROR_MESSAGE
} from "../../../constants/Messages";
import { GenericKeyValuePairInput } from "../../generic-key-value-pair-input/src/GenericKeyValuePairInput";
import { isEmptyString } from "../../../utils/CommonUtils";

/**
 * @property {String} keyTitle - Title displayed for key field
 * @property {String} valueTitle - Title displayed for value field.
 * @property {String} fileTooltipText - Text displayed when hover over on tooltip
 */
@definition("e-generic-key-value-pair-input-group", {
  style,
  home: "generic-key-value-pair-input-group",
  props: {
    keyTitle: { attribute: true, type: "string", default: "Key" },
    valueTitle: { attribute: true, type: "string", default: "Value" },
    fileTooltipText: { attribute: true, type: "string", default: "Attach a File" }
  }
})
export default class GenericKeyValuePairInputGroup extends LitComponent {
  componentDidUpgrade() {
    // contains all K/V input which either key or value is not empty. Using set to avoid duplicates.
    this.nonEmptyKeyValueInputs = new Set();
    this.keyValuePairGroup = this.shadowRoot.querySelector(".keyValuePairGroup");
    this._addKeyValuePair();
  }

  handleEvent(event) {
    switch (event.type) {
      case GENERIC_KV_PAIR_INPUT_DELETE_EVENT: {
        this._handleKeyValuePairDelete(event);
        break;
      }
      case GENERIC_KV_PAIR_INPUT_CHANGE_EVENT: {
        this._handleKeyValuePairChange(event);
        break;
      }
      default:
        break;
    }
  }

  _handleKeyValuePairChange(event) {
    event.stopPropagation();
    const keyValueInput = event.target;
    if (keyValueInput) {
      if (!keyValueInput.isEmpty()) {
        this.nonEmptyKeyValueInputs.add(keyValueInput);
        this._toggleAtLeastOneKVPairErrorMessage();
        this._checkDuplicateKeys();
      } else {
        this.nonEmptyKeyValueInputs.delete(keyValueInput);
        this._toggleAtLeastOneKVPairErrorMessage();
        this._checkDuplicateKeys();
      }
      this.bubble(GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT, {});
    }
  }

  _handleKeyValuePairDelete(event) {
    event.stopPropagation();
    const deletedKeyValueInput = event.target;
    this._toggleDeleteButton();
    if (this.nonEmptyKeyValueInputs.has(deletedKeyValueInput)) {
      this.nonEmptyKeyValueInputs.delete(deletedKeyValueInput);
    }
    this._toggleAtLeastOneKVPairErrorMessage();
    this._checkDuplicateKeys();
    this.bubble(GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT, {});
  }

  _toggleAtLeastOneKVPairErrorMessage() {
    const firstKeyValueInput = this.keyValueInputList[0];
    const hasAtLeastOneNonEmptyKeyValuePair = this.nonEmptyKeyValueInputs.size === 1;
    const hasNoNonEmptyKeyValuePair = this.nonEmptyKeyValueInputs.size === 0;
    if (hasAtLeastOneNonEmptyKeyValuePair) {
      const errorCanBeHidden = firstKeyValueInput.isEmpty();
      if (errorCanBeHidden) {
        firstKeyValueInput._hideKeyErrorField();
        firstKeyValueInput.isValid = true;
      }
    } else if (hasNoNonEmptyKeyValuePair) {
      firstKeyValueInput._showKeyErrorField(AT_LEAST_ONE_KV_PAIR_ERROR_MESSAGE);
    }
  }

  _checkDuplicateKeys() {
    const elementsToCheck = [...this.nonEmptyKeyValueInputs].filter(
      element => !isEmptyString(element.getKey())
    );
    const elementsSeparatedByKeys = this._separateElementsByKeys(elementsToCheck);
    Object.entries(elementsSeparatedByKeys).forEach(([, elementsWithSameKey]) => {
      if (elementsWithSameKey.length > 1) {
        elementsWithSameKey.forEach(element =>
          element._showKeyErrorField(KEY_ALREADY_EXISTS_ERROR_MESSAGE)
        );
      } else {
        elementsWithSameKey.forEach(element => {
          element.validateInput();
        });
      }
    });
  }

  _separateElementsByKeys(elementsToCheck) {
    const elementsSeparatedByKeys = {};
    elementsToCheck.forEach(element => {
      const key = element.getKey();
      if (elementsSeparatedByKeys[key]) {
        elementsSeparatedByKeys[key].push(element);
      } else {
        elementsSeparatedByKeys[key] = [element];
      }
    });
    return elementsSeparatedByKeys;
  }

  _addKeyValuePair() {
    const newKeyValueInput = new GenericKeyValuePairInput();
    newKeyValueInput.addEventListener(GENERIC_KV_PAIR_INPUT_DELETE_EVENT, this);
    newKeyValueInput.addEventListener(GENERIC_KV_PAIR_INPUT_CHANGE_EVENT, this);
    newKeyValueInput.className = "keyValuePair";
    newKeyValueInput.fileTooltipText = this.fileTooltipText;
    this.keyValuePairGroup.appendChild(newKeyValueInput);
    this._toggleDeleteButton();
  }

  _updateKeyValueInputList() {
    this.keyValueInputList = [...this.keyValuePairGroup.children];
  }

  _toggleDeleteButton() {
    this._updateKeyValueInputList();
    const numOfElements = this.keyValueInputList.length;
    if (numOfElements > 0) {
      this.keyValueInputList[0].deleteButtonDisabled = numOfElements === 1;
    }
  }

  validateInput() {
    this._toggleAtLeastOneKVPairErrorMessage();
    return this.keyValueInputList.every(input => input.isValid);
  }

  getData() {
    const data = {};
    [...this.nonEmptyKeyValueInputs].forEach(input => {
      data[input.getKey()] = input.getValue();
    });
    return data;
  }

  isEmpty() {
    return this.nonEmptyKeyValueInputs.size === 0;
  }

  render() {
    return html`
      <div class="container">
        <div class="keyValuePairTitle">
          <label id="keyTitle">${this.keyTitle}</label>
          <label id="valueTitle">${this.valueTitle}</label>
        </div>
        <div class="keyValuePairGroup"></div>
        <div class="addKeyValuePairBtnContainer">
          <eui-base-v0-button
            id="addKeyValuePairBtn"
            icon="plus"
            @click=${() => this._addKeyValuePair()}
          >
            Add key/value pair
          </eui-base-v0-button>
        </div>
      </div>
    `;
  }
}

/**
 * Register the component as e-generic-key-value-pair-input-group.
 * Registration can be done at a later time and with a different name
 */
GenericKeyValuePairInputGroup.register();
