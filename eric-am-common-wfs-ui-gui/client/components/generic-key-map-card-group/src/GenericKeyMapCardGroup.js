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
 * Component GenericKeyMapCardGroup is defined as
 * `<e-generic-key-map-card-group>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyMapCardGroup();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-map-card-group></e-generic-key-map-card-group>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericKeyMapCardGroup.css";
import "../../generic-key-map-card/src/GenericKeyMapCard";
import { isEmptyString } from "../../../utils/CommonUtils";
import {
  GENERIC_KEY_MAP_CARD_CHANGE_EVENT,
  GENERIC_KEY_MAP_CARD_DELETE_EVENT,
  GENERIC_KEY_MAP_CARD_GROUP_CHANGE_EVENT
} from "../../../constants/Events";

@definition("e-generic-key-map-card-group", {
  style,
  home: "generic-key-map-card-group",
  props: {
    label: { attribute: false, type: "string", default: "" },
    keyMapCardTitle: { attribute: false, type: "string", default: "Attributes" },
    cardKeyTitle: { attribute: false, type: "string", default: "Object name" },
    addButtonText: { attribute: false, type: "string", default: "Add object" },
    disabled: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericKeyMapCardGroup extends LitComponent {
  constructor() {
    super();
    this.changedStateCards = new Set();
    this.elementsSeparatedByKeys = {};
  }

  componentDidReceiveProps(prev) {
    super.componentDidReceiveProps(prev);
    if (this.disabled === true) {
      const cards = [...this.shadowRoot.querySelector("#cards").children];
      cards.forEach(card => card.disableCard());
    } else if (prev.disabled === true && this.disabled === false) {
      const cards = [...this.shadowRoot.querySelector("#cards").children];
      cards.forEach(card => {
        card.disabled = false;
      });
    }
  }

  _addCard() {
    const content = this.shadowRoot.querySelector("#cards");
    const genericKeyMapCard = document.createElement("e-generic-key-map-card");
    genericKeyMapCard.addEventListener(GENERIC_KEY_MAP_CARD_CHANGE_EVENT, this);
    genericKeyMapCard.addEventListener(GENERIC_KEY_MAP_CARD_DELETE_EVENT, this);
    genericKeyMapCard.className = "card";
    genericKeyMapCard.cardTitle = this.keyMapCardTitle;
    genericKeyMapCard.keyTitle = this.cardKeyTitle;
    genericKeyMapCard.keyValidationMessage = `${this.keyMapCardTitle} is duplicated`;
    content.append(genericKeyMapCard);
  }

  validateInput() {
    const cards = this.changedStateCards;
    const checkForEachInput = [];
    this._checkDuplicateKeys();
    cards.forEach(element => {
      checkForEachInput.push(element._validateInput());
    });

    return checkForEachInput.every(result => result === true);
  }

  _filterNonEmptyKeysElements() {
    const nonEmptyKeysElements = new Set();
    this.changedStateCards.forEach(element => {
      if (isEmptyString(element.keyTextFieldValue)) {
        element._showErrorField(`${element.keyTitle} cannot be empty`);
      } else {
        nonEmptyKeysElements.add(element);
      }
    });
    return nonEmptyKeysElements;
  }

  _checkDuplicateKeys() {
    const elementsSeparatedByKeys = this._separateElementsByKeys(
      this._filterNonEmptyKeysElements()
    );
    Object.entries(elementsSeparatedByKeys).forEach(([, elementsWithSameKey]) => {
      if (elementsWithSameKey.length > 1) {
        elementsWithSameKey.forEach(element =>
          element._showErrorField(`${element.keyTitle} is duplicated`)
        );
      } else {
        elementsWithSameKey.forEach(element => {
          element._hideErrorField();
        });
      }
    });
  }

  handleEvent(event) {
    switch (event.type) {
      case GENERIC_KEY_MAP_CARD_CHANGE_EVENT: {
        const genericKeyMapCard = event.detail;
        this._handleKeyMapCardChange(genericKeyMapCard);
        break;
      }
      case GENERIC_KEY_MAP_CARD_DELETE_EVENT: {
        this._handleKeyMapCardDelete(event.detail);
        break;
      }
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _handleKeyMapCardDelete(deletedGenericKeyMapCard) {
    if (this.changedStateCards.has(deletedGenericKeyMapCard)) {
      this.changedStateCards.delete(deletedGenericKeyMapCard);
    }
    this.validateInput();
    this.bubble(GENERIC_KEY_MAP_CARD_GROUP_CHANGE_EVENT, {});
  }

  _handleKeyMapCardChange(changedGenericKeyMapCard) {
    this.changedStateCards.add(changedGenericKeyMapCard);
    this.validateInput();
    this.bubble(GENERIC_KEY_MAP_CARD_GROUP_CHANGE_EVENT, {});
  }

  _separateElementsByKeys(elementsToCheck) {
    const elementsSeparatedByKeys = {};
    elementsToCheck.forEach(element => {
      const key = element.keyTextFieldValue;
      if (!isEmptyString(key) && elementsSeparatedByKeys[key]) {
        elementsSeparatedByKeys[key].push(element);
      } else {
        elementsSeparatedByKeys[key] = [element];
      }
    });
    return elementsSeparatedByKeys;
  }

  getData() {
    const data = {};
    const cards = [...this.shadowRoot.querySelector("#cards").children];
    cards.forEach(input => {
      if (!isEmptyString(input.keyTextFieldValue)) {
        data[input.keyTextFieldValue] = input.getData();
      }
    });
    return data;
  }

  render() {
    return html`
      <div>
        <div id="content">
          <eui-base-v0-button
            icon="plus"
            @click=${() => this._addCard()}
            ?disabled=${this.disabled}
            id="addCardBtn"
          >
            ${this.addButtonText}
          </eui-base-v0-button>
        </div>
        <div id="cards"></div>
      </div>
    `;
  }
}

/**
 * Register the component as e-generic-key-map-card-group.
 * Registration can be done at a later time and with a different name
 */
GenericKeyMapCardGroup.register();
