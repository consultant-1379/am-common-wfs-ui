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
 * Component ValidationChecker is defined as
 * `<e-validation-checker>`
 *
 * Imperatively create component
 * @example
 * let component = new ValidationChecker();
 *
 * Declaratively create component
 * @example
 * <e-validation-checker></e-validation-checker>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./validationChecker.css";

@definition("e-validation-checker", {
  style,
  home: "validation-checker",
  props: {
    validationPolicies: { attribute: false, type: Object, default: {} },
    value: { attribute: false, type: String },
    validationResults: { attribute: false, type: Array, default: [] }
  }
})
export default class ValidationChecker extends LitComponent {
  validate = (value, clusterMatch) => {
    this.validationResults = [];

    const {
      maxLength,
      isRequired,
      patterns,
      maxRange,
      minLength,
      between
    } = this.validationPolicies;

    if (between && between.max && value) {
      const { min = 0, max } = between;

      this.validationResults.push({
        isValid: min <= Number(value) && Number(value) <= max,
        message: between.message || `Value must be between ${min} and ${max}`
      });
    }

    if (maxLength && maxLength.value) {
      this.validationResults.push({
        isValid: value.length <= maxLength.value,
        message: maxLength.message || `Maximum length is ${maxLength.value}`
      });
    }

    if (minLength && minLength.value) {
      this.validationResults.push({
        isValid: value.length >= minLength.value,
        message: minLength.message || `Minimum length is ${minLength.value}`
      });
    }

    if (isRequired && isRequired.value === true) {
      this.validationResults.push({
        isValid: value.length !== 0,
        message: isRequired.message || "Field canot be empty."
      });
    }

    if (patterns && patterns.length > 0) {
      patterns.forEach(item => {
        this.validationResults.push({
          isValid: new RegExp(item.pattern).test(value),
          message: item.message
        });
      });
    }

    if (maxRange && maxRange.value) {
      this.validationResults.push({
        isValid: parseInt(value, 10) <= maxRange.value,
        message: maxRange.message
      });
    }

    if (clusterMatch) {
      this.validationResults.push({
        isValid: clusterMatch.isClusterValid,
        message: clusterMatch.message || "Must select a valid cluster for the namespace"
      });
    }

    this.validationResults = [...this.validationResults];
    return this.validationResults.every(item => item.isValid);
  };

  render() {
    const getRuleIcon = isValid => {
      if (isValid === true) {
        return html`
          <eui-v0-icon class="icon" name="check" color="green"></eui-v0-icon>
        `;
      }

      if (isValid === false) {
        return html`
          <eui-v0-icon class="icon" name="cross" color="red"></eui-v0-icon>
        `;
      }

      return "";
    };

    return html`
      ${this.validationResults.map(
        item =>
          html`
            <h5>
              <div class="flex-container">
                <div class="flex-child">
                  ${getRuleIcon(item.isValid)}
                </div>
                <div class="flex-child">
                  ${item.message}
                </div>
              </div>
            </h5>
          `
      )}
    `;
  }
}

/**
 * Register the component as e-validation-checker.
 * Registration can be done at a later time and with a different name
 */
ValidationChecker.register();
