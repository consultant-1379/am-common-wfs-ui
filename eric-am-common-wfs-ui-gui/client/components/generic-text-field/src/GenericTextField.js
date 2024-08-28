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
 * Component GenericTextField is defined as
 * `<e-generic-text-field>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericTextField();
 *
 * Declaratively create component
 * @example
 * <e-generic-text-field></e-generic-text-field>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html, nothing } from "@eui/lit-component";
import style from "./genericTextField.css";
import { GENERIC_TEXT_FIELD_RESET_EVENT } from "../../../constants/Events";

/**
 * @property {boolean} encryptable - textfield value will be shown as encrypted/decrypted with an eye icon to toggle.
 * @property {boolean} clearable - value can be cleared with an 'X' icon.
 */
@definition("e-generic-text-field", {
  style,
  home: "generic-text-field",
  props: {
    id: { attribute: true, type: "string", default: "" },
    value: { attribute: true, type: "string", default: "" },
    style: { attribute: true, type: "string", default: "" },
    placeholder: { attribute: true, type: "string", default: "" },
    readonly: { attribute: true, type: "boolean", default: false },
    encryptable: { attribute: true, type: "boolean", default: false },
    clearable: { attribute: true, type: "boolean", default: false },
    disabled: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericTextField extends LitComponent {
  componentDidUpgrade() {
    this.textField = this.shadowRoot.querySelector("eui-base-v0-text-field");
    if (this.encryptable) {
      window.setTimeout(this.encryptText.bind(this), 0);
    }
  }

  getValue() {
    return this.shadowRoot.querySelector("eui-base-v0-text-field").value;
  }

  setValue(value) {
    this.shadowRoot.querySelector("eui-base-v0-text-field").value = value;
  }

  reset() {
    this.textField.value = undefined;
  }

  encryptText() {
    const inputField = this.textField.shadowRoot.querySelector(
      "div.input-group div.input__prefix__suffix input"
    );
    if (inputField) {
      inputField.setAttribute("type", "password");
    }
  }

  decryptText() {
    const inputField = this.textField.shadowRoot.querySelector(
      "div.input-group div.input__prefix__suffix input"
    );
    if (inputField) {
      inputField.setAttribute("type", "text");
    }
  }

  _toggleEncryption() {
    const inputField = this.textField.shadowRoot.querySelector(
      "div.input-group div.input__prefix__suffix input"
    );

    if (inputField) {
      const inputType = inputField.type === "password" ? "text" : "password";
      inputField.setAttribute("type", inputType);
    }
  }

  /**
   * Render the <e-generic-text-field> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-text-field
        id=${this.id}
        placeholder=${this.placeholder}
        value=${this.value}
        style=${this.style}
        ?readonly=${this.readonly}
        ?disabled=${this.disabled}
      >
        ${this.encryptable && !this.clearable
          ? html`
              <span slot="icon">
                <eui-v0-icon name="eye" @click=${() => this._toggleEncryption()}></eui-v0-icon>
              </span>
            `
          : nothing}
        ${this.clearable && !this.encryptable
          ? html`
              <span slot="icon">
                <eui-v0-icon
                  name="cross"
                  @click=${() => {
                    this.reset();
                    this.bubble(GENERIC_TEXT_FIELD_RESET_EVENT, {});
                  }}
                ></eui-v0-icon>
              </span>
            `
          : nothing}
      </eui-base-v0-text-field>
    `;
  }
}

/**
 * Register the component as e-generic-text-field.
 * Registration can be done at a later time and with a different name
 */
GenericTextField.register();
