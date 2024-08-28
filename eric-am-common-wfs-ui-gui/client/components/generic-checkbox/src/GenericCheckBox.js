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
 * Component FilterCheckboxCombo is defined as
 * `<e-filter-checkbox-combo>`
 *
 * Imperatively create component
 * @example
 * let component = new FilterCheckBox();
 *
 * Declaratively create component
 * @example
 * <e-generic-checkbox></e-generic-checkbox>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import { getStateCustomIcon } from "../../../utils/CommonUtils";

/**
 * @property {String} data - data is used for Checkbox name and label
 * @property {String} dataAttribute - Generic table data attribute responsible for checkbox value
 * @property {boolean} isCustomValue - Checks whether checkbox value needs a custom icon
 * The dataAttribute and data properties are used to build the state/value of checkbox
 * as object {dataAttribute : data}.
 *
 */
@definition("e-generic-checkbox", {
  props: {
    data: { attribute: false, type: "string", default: "" },
    dataAttribute: { attribute: false, type: "string", default: "" },
    isCustomValue: { attribute: false, type: "boolean" }
  }
})
export default class GenericCheckBox extends LitComponent {
  getValue() {
    const checkBox = this.shadowRoot.querySelector("eui-base-v0-checkbox");
    if (checkBox.checked) {
      const checkBoxValue = {};
      checkBoxValue[this.dataAttribute] = this.data;
      return checkBoxValue;
    }
    return null;
  }

  reset() {
    const checkBox = this.shadowRoot.querySelector("eui-base-v0-checkbox");
    if (checkBox.checked) {
      checkBox.checked = false;
    }
  }

  /**
   * Render the <e-generic-checkbox> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-checkbox name=${this.data}>
        ${this.isCustomValue ? this.getCustomeCellLabel(this.data) : this.data}
      </eui-base-v0-checkbox>
    `;
  }

  getCustomeCellLabel(cellValue) {
    const item = getStateCustomIcon(cellValue);
    return html`
      ${item} ${cellValue}
    `;
  }
}

/**
 * Register the component as e-generic-checkbox.
 * Registration can be done at a later time and with a different name
 */
GenericCheckBox.register();
