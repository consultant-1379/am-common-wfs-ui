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
 * Component GenericAccordion is defined as
 * `<e-generic-accordion>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericAccordion();
 *
 * Declaratively create component
 * @example
 * <e-generic-accordion></e-generic-accordion>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericAccordion.css";

/**
 * @property {Boolean} open - set accordion state opened/closed
 * @property {String} accordionTitle - title for the accordion
 */
@definition("e-generic-accordion", {
  style,
  home: "generic-accordion",
  props: {
    open: { attribute: false, type: Boolean },
    accordionTitle: { attribute: true, type: String, default: "Accordion" }
  }
})
export default class GenericAccordion extends LitComponent {
  constructor() {
    super();
    this._handleAccordionClick = this._handleAccordionClick.bind(this);
  }

  _handleAccordionClick() {
    this.open = !this.open;
  }

  render() {
    const icon = this.open ? "chevron-up" : "chevron-down";
    const titleDiv = html`
      <div class="accordion-title" @click=${this._handleAccordionClick}>
        ${this.accordionTitle}
        <eui-base-v0-icon name="${icon}" size="16px"></eui-base-v0-icon>
      </div>
    `;

    const contentDiv = html`
      <div class=${this.open ? "accordion-opened" : "accordion-closed"}>
        <slot></slot>
      </div>
    `;

    return html`
      ${titleDiv}${contentDiv}
    `;
  }
}

/**
 * Register the component as e-generic-accordion.
 * Registration can be done at a later time and with a different name
 */
GenericAccordion.register();
