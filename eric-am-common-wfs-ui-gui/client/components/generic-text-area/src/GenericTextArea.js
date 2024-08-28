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
 * Component GenericTextArea is defined as
 * `<e-generic-text-area>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericTextArea();
 *
 * Declaratively create component
 * @example
 * <e-generic-text-area></e-generic-text-area>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericTextArea.css";

/**
 * @property {boolean} propOne - show active/inactive state.
 * @property {boolean} propTwo - show active/inactive state.
 */
@definition("e-generic-text-area", {
  style,
  home: "generic-text-area",
  props: {
    id: { attribute: true, type: "string", default: "" },
    value: { attribute: true, type: "string", default: "" },
    style: { attribute: true, type: "string", default: "" },
    placeholder: { attribute: true, type: "string", default: "" }
  }
})
export default class GenericTextArea extends LitComponent {
  getValue() {
    return this.shadowRoot.querySelector("eui-base-v0-textarea").value;
  }

  reset() {
    this.shadowRoot.querySelector("eui-base-v0-textarea").value = undefined;
  }

  /**
   * Render the <e-generic-text-area> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-textarea
        id=${this.id}
        placeholder=${this.placeholder}
        style=${this.style}
        value=${this.value}
      ></eui-base-v0-textarea>
    `;
  }
}

/**
 * Register the component as e-generic-text-area.
 * Registration can be done at a later time and with a different name
 */
GenericTextArea.register();
