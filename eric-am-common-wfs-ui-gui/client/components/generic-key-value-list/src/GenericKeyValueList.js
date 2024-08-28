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
 * Component GenericKeyValueList is defined as
 * `<e-generic-key-value-list>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericKeyValueList();
 *
 * Declaratively create component
 * @example
 * <e-generic-key-value-list></e-generic-key-value-list>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./genericKeyValueList.css";
import "../../generic-inline-description/src/GenericInlineDescription";

/**
 * @property {boolean} vertical - if present will display the key above the value else display side by side
 * @property {map} keyValueMap - map object for all keys and values to render
 */
@definition("e-generic-key-value-list", {
  style,
  props: {
    vertical: { attribute: true, type: "boolean", default: false },
    keyValueMap: { attribute: false, type: "object", default: {} },
    hasDescription: { attribute: false, type: "boolean", default: false },
    descriptionMap: { attribute: false, type: "object", default: {} }
  }
})
export default class GenericKeyValueList extends LitComponent {
  createKeyValueDiv(currentHtmlContent, key) {
    let descriptionHtmlContent = "";
    if (this.keyValueMap[key] == null || this.keyValueMap[key] === "") {
      this.keyValueMap[key] = "-";
    }
    if (this.hasDescription) {
      descriptionHtmlContent = this.insertInlineDescription(key);
    }
    return html`
      ${currentHtmlContent}
      <div class="key-value-list-item">
        <div class="key-value-list-key ${this.vertical ? "vertical" : "horizontal"} ">
          <div class="align-keys ${this.vertical ? "vertical" : "horizontal"}">
            ${key}
          </div>
        </div>
        ${descriptionHtmlContent}
        <div
          class="key-value-list-value ${this.vertical ? "vertical" : "horizontal"}"
          title="${this.keyValueMap[key]}"
        >
          ${this.keyValueMap[key]}
        </div>
      </div>
    `;
  }

  insertInlineDescription(key) {
    return html`
      <e-generic-inline-description class="description" .text=${this.descriptionMap[key]}>
      </e-generic-inline-description>
    `;
  }

  createAllKeyValueDivs() {
    let currentHtmlContent = "";
    const keys = Object.keys(this.keyValueMap);
    for (let i = 0; i < keys.length; i += 1) {
      currentHtmlContent = this.createKeyValueDiv(currentHtmlContent, keys[i]);
    }
    return currentHtmlContent;
  }

  render() {
    return html`
      <div class="key-value-list">
        ${this.createAllKeyValueDivs()}
      </div>
    `;
  }
}

GenericKeyValueList.register();
