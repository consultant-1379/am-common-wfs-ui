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
 * Component GenericDatepicker is defined as
 * `<e-generic-datepicker>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericDatepicker();
 *
 * Declaratively create component
 * @example
 * <e-generic-datepicker></e-generic-datepicker>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

/**
 * @property {String} date - date in YYYY-MM-DD format
 * @property {String} dataAttribute - Generic table data attribute responsible for date
 *
 * The dataAttribute and date properties are used to build the state/value of datepicker
 * as object {dataAttribute : date}.
 *
 */
@definition("e-generic-datepicker", {
  props: {
    date: { attribute: true, type: "string", default: "" },
    dataAttribute: { attribute: true, type: "string", default: "" },
    disabled: { attribute: true, type: "boolean", default: false }
  }
})
export default class GenericDatepicker extends LitComponent {
  getValue() {
    const datepicker = this.shadowRoot.querySelector("eui-base-v0-datepicker");
    let dateValue = datepicker.date;
    if (dateValue === undefined || dateValue === null || dateValue.length === 0) {
      dateValue = "";
      this.date = this.placeholder;
    } else {
      this.date = dateValue;
    }
    const datepickerValue = {};
    datepickerValue[this.dataAttribute] = dateValue;

    return datepickerValue;
  }

  reset() {
    this.date = "";
    const datepicker = this.shadowRoot.querySelector("eui-base-v0-datepicker");
    datepicker.date = "";
  }

  handleEvent = event => {
    this.date = event.target.date;
  };

  /**
   * Render the <e-generic-datepicker> component. This function is called each time a
   * prop changes.
   */
  render() {
    if (this.disabled) {
      let placeholder = this.date;
      if (placeholder === "") {
        placeholder = "YYYY-MM-DD";
      }
      return html`
        <eui-base-v0-text-field placeholder=${placeholder} disabled=""></eui-base-v0-text-field>
      `;
    }
    return html`
      <eui-base-v0-datepicker
        @change=${this}
        @input=${this}
        .date=${this.date}
      ></eui-base-v0-datepicker>
    `;
  }
}

/**
 * Register the component as e-generic-datepicker.
 * Registration can be done at a later time and with a different name
 */
GenericDatepicker.register();
