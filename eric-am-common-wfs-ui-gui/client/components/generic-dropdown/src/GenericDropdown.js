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
 * Component GenericDropdown is defined as
 * `<e-generic-dropdown>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericDropdown();
 *
 * Declaratively create component
 * @example
 * <e-generic-dropdown></e-generic-dropdown>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

export const DROPDOWN_ID = "eui-base-v0-dropdown";
export const TEXTFIELD_ID = "eui-base-v0-text-field";

/**
 * @property {String} data - dropdown data
 * @property {String} dataAttribute - Generic table data attribute responsible for data
 *
 * The dataAttribute and data properties are used to build the state/value of dropdown
 * as object {dataAttribute : selected data from dropdown}.
 *
 */

@definition("e-generic-dropdown", {
  props: {
    data: { attribute: false, type: "array", default: [] },
    dataAttribute: { attribute: false, type: "string", default: "" },
    dataType: { attribute: true, type: "string", default: "combo" },
    width: { attribute: true, type: "string", default: "150%" },
    label: { attribute: true, type: "string", default: "" },
    placeholder: { attribute: true, type: "string", default: "Write or select..." },
    disabled: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericDropdown extends LitComponent {
  getValue() {
    const dropdown = this.shadowRoot.querySelector(DROPDOWN_ID);
    if (dropdown && dropdown.value.length > 0) {
      const dropdownValue = {};
      dropdownValue[this.dataAttribute] = dropdown.value.trim();
      return dropdownValue;
    }
    return null;
  }

  reset() {
    const dropdown = this.shadowRoot.querySelector(DROPDOWN_ID);
    const inputfield = dropdown.shadowRoot.querySelector(TEXTFIELD_ID);
    inputfield.value = "";
  }

  /**
   * Render the <e-generic-dropdown> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-dropdown
        data-type=${this.dataType}
        width=${this.width}
        label=${this.label}
        placeholder=${this.placeholder}
        .data=${this.data}
        ?disabled=${this.disabled}
      ></eui-base-v0-dropdown>
    `;
  }
}
/**
 * Register the component as e-generic-dropdown.
 * Registration can be done at a later time and with a different name
 */
GenericDropdown.register();
