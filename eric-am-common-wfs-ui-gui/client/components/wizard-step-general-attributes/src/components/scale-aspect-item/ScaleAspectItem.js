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

// helpers
import { DYNAMIC_SCALE_VALIDATION_POLICY } from "../../../../../constants/ValidationPolicies";

// styles
import style from "./ScaleAspectItem.css";

/**
 * Component ScaleAspectItem is defined as
 * `<e-scale-aspect-item>`
 *
 * Imperatively create component
 * @example
 * let component = new ScaleAspectItem();
 *
 * Declaratively create component
 * @example
 * <e-scale-aspect-item></e-scale-aspect-item>
 *
 * @extends {LitComponent}
 */
@definition("e-scale-aspect-item", {
  style,
  props: {
    data: { attribute: true, type: "object" },
    value: { attribute: false, type: "string", default: "" },
    defaultInstantiationLevel: { attribute: true, type: "object", default: {} }
  }
})
export default class ScaleAspectItem extends LitComponent {
  constructor() {
    super();

    this.stylesInjected = false;
    this.handleInput = this.handleInput.bind(this);
    this.setStylesOnce = this.setStylesOnce.bind(this);
    this.initDefaultData = this.initDefaultData.bind(this);
  }

  componentDidConnect() {
    const { scale_info: scaleInfo = {} } = this.defaultInstantiationLevel;
    const { aspectId = "" } = this.data;
    const { scale_level: scaleLevel = 0 } = scaleInfo[aspectId] || {};

    this.value = scaleLevel;

    this.nextTick(this.initDefaultData);
  }

  /**
   * Getter for e-validation-checker element
   *
   * @returns {Element}
   */
  get validatorEl() {
    return this.shadowRoot.querySelector("e-validation-checker");
  }

  /**
   * Getter for eui-base-v0-text-field element
   *
   * @returns {Element}
   */
  get textFieldEl() {
    if (this.shadowRoot) {
      return this.shadowRoot.querySelector("eui-base-v0-text-field");
    }

    return null;
  }

  /**
   * Invoke specific function in next tick
   *
   * @param {function} callback: function which will be invoke with delay
   * @returns {void}
   */
  nextTick(callback) {
    setTimeout(callback, 1);
  }

  /**
   * Initialize default data
   *
   * @returns {void}
   */
  initDefaultData() {
    const event = { target: { value: this.value } };

    this.handleInput(event);
  }

  /**
   * Will update styles for eui-base-v0-text-field
   *
   * @returns {void}
   */
  setStylesOnce() {
    const customStyles = document.createElement("style");

    customStyles.innerHTML = ".input{width: 40px;}.textfield__icon{display: none;}";

    this.textFieldEl.shadowRoot.appendChild(customStyles);
    this.stylesInjected = true;
  }

  /**
   * Input handler
   *
   * @param {object}: event - event of input
   * @returns {void}
   */
  handleInput(event) {
    const { value } = event.target;

    this.value = value;

    const isValid = this.validatorEl.validate(this.value);

    this.bubble("scale-aspect:changed", {
      scaleLevel: this.value !== "" ? Number(this.value) : null,
      aspectId: this.data.aspectId,
      isValid
    });
  }

  render() {
    const { aspectId, max_scale_level: maxScaleLevel, name } = this.data;
    const aspectName = name[0].toUpperCase() + name.slice(1);

    if (!this.stylesInjected) {
      this.nextTick(this.setStylesOnce);
    }

    return html`
      <div class="fieldHeader scale-level--title">${aspectName}<span>(${aspectId})</span></div>
      <div class="contentExtension is-centered">
        <div class="mr-10">Scale level</div>
        <eui-base-v0-text-field
          class="scale-level--input"
          placeholder=${aspectId}
          @input=${this.handleInput}
          value=${this.value}
        ></eui-base-v0-text-field>
        <e-validation-checker
          class="validator scale-level--message"
          .validationPolicies=${DYNAMIC_SCALE_VALIDATION_POLICY({ min: 0, max: maxScaleLevel })}
        ></e-validation-checker>
      </div>
    `;
  }
}

/**
 * Register the component as e-scale-aspect-item.
 * Registration can be done at a later time and with a different name
 */
ScaleAspectItem.register();
