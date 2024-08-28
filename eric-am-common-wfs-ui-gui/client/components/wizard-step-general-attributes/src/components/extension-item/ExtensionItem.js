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

// styles
import style from "./ExtensionItem.css";

// helpers
import { findAssociatedArtifacts } from "../../../../../utils/CommonUtils";

export const ExtensionTypes = {
  vnfControlledScaling: "vnfControlledScaling",
  deployableModules: "deployableModules"
};

/**
 * Component ExtensionItem is defined as
 * `<e-extension-item>`
 *
 * Imperatively create component
 * @example
 * let component = new ExtensionItem();
 *
 * Declaratively create component
 * @example
 * <e-extension-item></e-extension-item>
 *
 * @extends {LitComponent}
 */
@definition("e-extension-item", {
  style,
  props: {
    extensionTypes: { attribute: true, type: "string" },
    additionData: { attribute: true, type: "object", default: {} },
    data: { attribute: true, type: "object", default: {} },
    persistScaleInfo: { attribute: true, type: "boolean" },
    existingAspects: { attribute: true, type: "object", default: {} },
    isUpgrade: { attribute: true, type: "boolean" },
    form: { attribute: false, type: "object", default: {} }
  }
})
export default class ExtensionItem extends LitComponent {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidReceiveProps(previous) {
    if (this.persistScaleInfo === true && previous.persistScaleInfo === false) {
      this.getData.forEach(([aspect, value]) => {
        const isExistingAspect = this.existingAspects[aspect];
        const currentValue = isExistingAspect ? this.form[aspect] : value;
        const payload = {
          aspect,
          group: this.elementName,
          label: currentValue,
          value: currentValue
        };

        this.handleChange({ detail: payload });
      });
    }
  }

  /**
   * Getter for options
   *
   * @returns {array}
   */
  get options() {
    const { options = [] } = this.data;

    return options;
  }

  /**
   * Getter for element name
   *
   * @returns {string}
   */
  get elementName() {
    const { extensionName } = this.data;

    return `extension-${extensionName}`;
  }

  /**
   * Getter for extension name
   *
   * @returns {string}
   */
  get extensionName() {
    return this.data.extensionName || "";
  }

  /**
   * Getter for extension fields
   *
   * @returns {array}
   */
  get extensionFields() {
    return Object.entries(this.data.defaults) || [];
  }

  /**
   * Getter for mapped logic
   *
   * @returns {array}
   */
  get extensionFieldsMappedDefaults() {
    const aspectsObj = this.extensionFields.reduce((acc, [aspectName, value]) => {
      const valueFromResource = this.existingAspects[aspectName] || value;

      acc[aspectName] = valueFromResource;
      return acc;
    }, {});

    return aspectsObj;
  }

  get getData() {
    if (this.isUpgrade) {
      const aspectsMappedWithForm = Object.entries(this.extensionFieldsMappedDefaults).map(
        ([aspectName, value]) => {
          const isExistingAspect = this.existingAspects[aspectName];
          const newValue =
            !isExistingAspect && this.form[aspectName] ? this.form[aspectName] : value;

          return [aspectName, newValue];
        }
      );
      let data = null;

      if (this.extensionTypes === ExtensionTypes.vnfControlledScaling) {
        data = this.persistScaleInfo ? aspectsMappedWithForm : Object.entries(this.form);
      }

      if (this.extensionTypes === ExtensionTypes.deployableModules) {
        const noInitialState = Object.entries(this.form).length === 0;

        // initial data will be from package
        if (noInitialState) {
          data = this.extensionFields;
        } else {
          data = this.persistScaleInfo ? aspectsMappedWithForm : Object.entries(this.form);
        }
      }

      return data;
    }

    return this.extensionFields;
  }

  parseLabel(field) {
    if (this.extensionTypes === ExtensionTypes.vnfControlledScaling) {
      return `${field} ${this.extensionName}`;
    }

    if (this.extensionTypes === ExtensionTypes.deployableModules) {
      const { deployableModulesData } = this.additionData;
      const associatedArtifacts = findAssociatedArtifacts(field, deployableModulesData);

      return associatedArtifacts.length > 0
        ? `${field} (${associatedArtifacts.join(", ")})`
        : field;
    }

    return "";
  }

  /**
   * Change handle
   *
   * @param {object}: event - event of change
   * @returns {void}
   */
  handleChange(event) {
    const { aspect: aspectName } = event.detail.aspect ? event.detail : event.currentTarget.dataset;

    this.form = { ...this.form, [aspectName]: event.detail.value };
    this.bubble("extension-item:changed", { ...event.detail, aspectName });
  }

  render() {
    return html`
      ${this.getData.map(
        ([field, value]) => html`
          <div class="fieldExtensionHeader">${this.parseLabel(field)}</div>
          <div class="contentExtension">
            ${this.renderRadioButtons({ field, value })}
          </div>
        `
      )}
    `;
  }

  renderRadioButtons(params) {
    const { field: aspectName, value } = params;
    const isExistingAspect = this.existingAspects[aspectName];

    return this.options.map(option => {
      const id = option.replace(/\s+/g, "-");

      return html`
        <eui-base-v0-radio-button
          class="radio"
          name=${`${this.elementName}-${id}-${aspectName}`}
          data-aspect=${aspectName}
          @change=${this.handleChange}
          group=${this.elementName}
          id=${`${this.elementName}-${id}-${aspectName}`}
          ?checked=${value === option}
          ?disabled=${this.persistScaleInfo && isExistingAspect}
          >${option}</eui-base-v0-radio-button
        >
      `;
    });
  }
}

/**
 * Register the component as e-scale-aspect-item.
 * Registration can be done at a later time and with a different name
 */
ExtensionItem.register();
