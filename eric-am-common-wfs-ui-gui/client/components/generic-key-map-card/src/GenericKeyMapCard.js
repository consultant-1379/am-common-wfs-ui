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
 * Component GenericKeyMapCard is defined as
 * `<e-generic-key-map-card>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyMapCard();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-map-card></e-generic-key-map-card>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html, nothing } from "@eui/lit-component";
import style from "./genericKeyMapCard.css";
import "../../generic-key-value-pair-input-group/src/GenericKeyValuePairInputGroup";
import {
  GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT,
  GENERIC_KEY_MAP_CARD_CHANGE_EVENT,
  GENERIC_KEY_MAP_CARD_DELETE_EVENT
} from "../../../constants/Events";

@definition("e-generic-key-map-card", {
  style,
  home: "generic-key-map-card",
  props: {
    collapsed: { attribute: true, type: "boolean", default: false },
    cardTitle: { attribute: true, type: "string", default: "Attribute" },
    keyTitle: { attribute: true, type: "string", default: "Key" },
    keyTextFieldValue: { attribute: false, type: "string", default: "" },
    keyValidationMessage: { attribute: true, type: "string", default: "" },
    toolTipWarningMessage: {
      attribute: true,
      type: "string",
      default: "One or more invalid inputs"
    },
    isValid: { attribute: false, type: "boolean", default: true },
    disabled: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericKeyMapCard extends LitComponent {
  componentDidUpgrade() {
    this.errorField = this.shadowRoot.querySelector("#errorMessage");
    this.keyValuePairInputGroup = this.shadowRoot.querySelector(
      "e-generic-key-value-pair-input-group"
    );
    this.warningIcon = this.shadowRoot.querySelector("#warningTooltip");
  }

  handleEvent(event) {
    switch (event.type) {
      case GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT: {
        this.bubble(GENERIC_KEY_MAP_CARD_CHANGE_EVENT, this);
        break;
      }
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  toggleIcon = () => {
    this.collapsed = !this.collapsed;
  };

  _onKeyTextFieldChange(event) {
    this.keyTextFieldValue = event.target.value;
    this.bubble(GENERIC_KEY_MAP_CARD_CHANGE_EVENT, this);
  }

  onToggleHideContent = () => {
    const contentArea = this.shadowRoot.querySelector("#content");
    if (contentArea.style.display === "none") {
      this.showContent();
    } else {
      this.hideContent();
    }
  };

  showContent() {
    const genericKeyMapCard = this.shadowRoot.querySelector("eui-layout-v0-card");
    const contentArea = this.shadowRoot.querySelector("#content");
    genericKeyMapCard.subtitle = "";
    contentArea.style.display = "block";
  }

  hideContent() {
    const genericKeyMapCard = this.shadowRoot.querySelector("eui-layout-v0-card");
    const keyTextFieldValue = this.shadowRoot.querySelector("#keyTextField").value;
    const contentArea = this.shadowRoot.querySelector("#content");
    if (!(keyTextFieldValue === "") && !(keyTextFieldValue === null)) {
      genericKeyMapCard.subtitle = keyTextFieldValue;
    }
    contentArea.style.display = "none";
  }

  disableCard() {
    this.collapsed = true;
    this.disabled = true;
    this.hideContent();
  }

  _handleChevronClick(event) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.toggleIcon(this);
    this.onToggleHideContent();
  }

  _removeSelf() {
    if (this.disabled) {
      return;
    }
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
    this.bubble(GENERIC_KEY_MAP_CARD_DELETE_EVENT, this);
  }

  getData() {
    const data = this.shadowRoot.querySelector("e-generic-key-value-pair-input-group").getData();
    return data;
  }

  _validateInput() {
    const isKeyTextFieldValid =
      this.shadowRoot.querySelector("#errorMessage").getAttribute("hidden") === "";
    const isKeyValuePairInputValid = this.keyValuePairInputGroup.validateInput();
    this.isValid = isKeyTextFieldValid && isKeyValuePairInputValid;
    return this.isValid;
  }

  _showErrorField(message) {
    this.keyValidationMessage = message;
    this.errorField.removeAttribute("hidden");
  }

  _hideErrorField() {
    this.keyValidationMessage = "";
    this.errorField.setAttribute("hidden", "");
  }

  /**
   * Render the <e-generic-key-map-card> component. This function is called each time a
   * prop changes.
   */

  _renderGenericKeyMapCard() {
    return html`
      <eui-layout-v0-card
        card-title=${this.cardTitle}
        @click=${e => {
          e.currentTarget.selected = false;
        }}
      >
        <div slot="content">
          <div id="content" class="content">
            <label htmlFor="keyTextField">${this.keyTitle}</label>
            <div id="keyTextFieldContainer">
              <eui-base-v0-text-field
                id="keyTextField"
                @input=${this._onKeyTextFieldChange.bind(this)}
                placeholder="${this.keyTitle}"
              ></eui-base-v0-text-field>
              <div id="errorMessage" class="errorMessage" hidden>
                <small>${this.keyValidationMessage}</small>
              </div>
            </div>
            ${this._addKeyValuePairInputGroup()}
          </div>
        </div>
        ${this._addWarningIcon()} ${this._addDeleteCardIcon()} ${this._addChevronIcon()}
      </eui-layout-v0-card>
    `;
  }

  _addDeleteCardIcon() {
    return html`
      <eui-base-v0-tooltip
        slot="action"
        message="Delete"
        position="bottom-end"
        class="deleteCardIcon"
        id="deleteCardIcon"
      >
        <eui-v0-icon
          name="trashcan"
          @click=${() => this._removeSelf()}
          ?disabled=${this.disabled}
        ></eui-v0-icon>
      </eui-base-v0-tooltip>
    `;
  }

  _addChevronIcon() {
    return html`
      <eui-base-v0-tooltip
        id="chevronTooltip"
        slot="action"
        message="${this.collapsed ? "Expand" : "Collapse"}"
        position="bottom-end"
        class="collapseIcon"
      >
        <eui-v0-icon
          name="${this.collapsed ? "chevron-down" : "chevron-up"}"
          @click=${e => this._handleChevronClick(e)}
          ?disabled=${this.disabled}
        ></eui-v0-icon>
      </eui-base-v0-tooltip>
    `;
  }

  _addWarningIcon() {
    return !this.isValid
      ? html`
          <eui-base-v0-tooltip
            id="warningTooltip"
            class="warningTooltip"
            message=${this.toolTipWarningMessage}
            slot="action"
            position="left"
          >
            <eui-v0-icon name="triangle-warning" color="red"> </eui-v0-icon>
          </eui-base-v0-tooltip>
        `
      : nothing;
  }

  _addKeyValuePairInputGroup() {
    return html`
      <e-generic-key-value-pair-input-group
        id="keyValuePairInputGroup"
        @genericKeyValuePairInputGroup:change=${this}
      ></e-generic-key-value-pair-input-group>
    `;
  }

  render() {
    return html`
      <div class="generic-ui-card">
        ${this._renderGenericKeyMapCard()}
      </div>
    `;
  }
}

/**
 * Register the component as e-generic-key-map-card.
 * Registration can be done at a later time and with a different name
 */
GenericKeyMapCard.register();
