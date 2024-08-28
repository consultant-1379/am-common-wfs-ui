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
 * Component GenericInlineDescription is defined as
 * `<e-generic-inline-description>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericInlineDescription();
 *
 * Declaratively create component
 * @example
 * <e-generic-inline-description></e-generic-inline-description>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericInlineDescription.css";

/**
 * @property {string} text - text to be shown.
 * @property {boolean} show - show/hide text area.
 * @property {string} height - height of the text area.
 * @property {string} truncateButtonText - button title.
 * @property {string} hideButton - show/hide content in styling.
 */
@definition("e-generic-inline-description", {
  style,
  props: {
    text: { attribute: false, type: "string", default: "" },
    show: { attribute: false, type: "boolean", default: false },
    height: { attribute: false, type: "string", default: "height: auto;" },
    truncateButtonText: { attribute: false, type: "string", default: "See more" },
    hideButton: { attribute: false, type: "string", default: "display: none" }
  }
})
export default class GenericInlineDescription extends LitComponent {
  componentDidConnect() {
    /* TODO: this needs to be fixed to account for the amount of available space.
    it also needs to auto-adjust on window resize */
    if (this.text.length > 320) {
      this.hideButton = "display: inline-block";
    }
  }

  showMore() {
    if (this.show) {
      this.show = false;
      this.height = "height: 2.4em";
      this.truncateButtonText = "See more";
    } else {
      this.show = true;
      this.height = "height: auto";
      this.truncateButtonText = "See less";
    }
  }

  render() {
    return html`
      <div class="content">
        <div class="descriptionText" style=${this.height}>${this.text}</div>
        <span class="more" style=${this.hideButton} @click=${this.showMore.bind(this)}>
          ${this.truncateButtonText}
        </span>
      </div>
    `;
  }
}

/**
 * Register the component as e-generic-inline-description.
 * Registration can be done at a later time and with a different name
 */
GenericInlineDescription.register();
