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

// common libraries
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import { querySelectorAllDeep } from "query-selector-shadow-dom";

// constants
export const COMBOBOX_ID = "eui-base-v0-combo-box";
export const TEXTFIELD_ID = "eui-base-v0-text-field";

/**
 * Component GenericComboBox is defined as
 * `<e-generic-combo-box>`
 *
 * @fires GenericComboBox#combobox:rendered
 *
 * @property {Array} data - combobox data
 * @property {String} defaultValue - default value
 * @property {String} attribute
 * @property {String} width
 * @property {String} placeholder - placeholder for input
 *
 * Imperatively create component
 * @example
 * let component = new GenericComboBox();
 *
 * Declaratively create component
 * @example
 * <e-generic-combo-box></e-generic-combo-box>
 *
 * @extends {LitComponent}
 */
@definition("e-generic-combo-box", {
  props: {
    data: { attribute: false, type: "array", default: [] },
    defaultValue: { attribute: true, type: "string", default: "" },
    attribute: { attribute: true, type: "string", default: "" },
    width: { attribute: true, type: "string", default: "140%" },
    placeholder: { attribute: true, type: "string", default: "Write or select..." }
  }
})
export default class GenericComboBox extends LitComponent {
  get comboboxEl() {
    return this.shadowRoot && this.shadowRoot.querySelector(COMBOBOX_ID);
  }

  componentDidRender() {
    const { data = [], menuItems = [] } = this.comboboxEl;

    if ((data && data.length) !== (menuItems && menuItems.length)) {
      this.comboboxEl.setMenuItems(this.comboboxEl.data);
      this.initDefaultValue();
    }
  }

  getValue() {
    if (this.comboboxEl && this.comboboxEl.value.length > 0) {
      const comboBoxValue = {};

      comboBoxValue[this.attribute] = this.comboboxEl.value;
      return comboBoxValue;
    }

    return null;
  }

  setValue(value) {
    this.comboboxEl.value = value;
  }

  reset() {
    this.comboboxEl.value = "";
  }

  /**
   * Fire status that combobox is ready
   *
   * @event GenericComboBox#combobox:rendered
   * @type {Component}
   */
  initDefaultValue() {
    if (this.defaultValue) {
      setTimeout(() => {
        const menuEls = Array.from(querySelectorAllDeep('div[menu-item=""]'));
        const menuElSelected = menuEls.find(el => el.textContent === this.defaultValue);

        this.setValue(this.defaultValue);
        menuElSelected.click();
        this.bubble("combobox:rendered", this);
      }, 1);
    }
  }

  /**
   * Render the <e-generic-combo-box> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-combo-box
        width=${this.width}
        label=${this.label}
        placeholder=${this.placeholder}
        .data=${this.data}
      ></eui-base-v0-combo-box>
    `;
  }
}
/**
 * Register the component as e-generic-combo-box.
 * Registration can be done at a later time and with a different name
 */
GenericComboBox.register();
