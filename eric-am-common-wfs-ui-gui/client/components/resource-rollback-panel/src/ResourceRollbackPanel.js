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
import "@eui/layout";
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

// styles
import style from "./resourceRollbackPanel.css";

// helpers
import {
  _componentHasDropdownOptions,
  createTextAreaField,
  createTextField,
  createDatePicker,
  createBooleanDropdown,
  _sendDefaults,
  readConfigFile,
  replaceStringCharacter,
  _isSecretAttribute,
  _isFieldForPassword,
  createSecretTextField,
  createSecretPasswordField,
  createDropDown
} from "../../../utils/AdditionalParamUtils";
import { isPasswordType, isComplexType } from "../../../utils/CommonUtils";
import {
  ROLLBACK_WARNING_MESSAGE,
  ROLLBACK_PARAMS_MESSAGE,
  SKIP_JOB_VERIFICATION
} from "../../../constants/Messages";
import { ROLLBACK_EVENT, UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT } from "../../../constants/Events";

/**
 * Component ResourceRollbackPanel is defined as
 * `<e-resource-rollback-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceRollbackPanel();
 *
 * Declaratively create component
 * @example
 * <e-resource-rollback-panel></e-resource-rollback-panel>
 *
 * @extends {LitComponent}
 */
@definition("e-resource-rollback-panel", {
  style,
  home: "resource-rollback-panel",
  props: {
    data: { attribute: true, type: "object", default: {} },
    objectArray: { attribute: false, type: "array", default: [] },
    validParameters: { attribute: false, type: "boolean", default: true },
    isLoading: { attribute: false, type: "boolean", default: false }
  }
})
export default class ResourceRollbackPanel extends LitComponent {
  constructor() {
    super();

    this.handleEvent = this.handleEvent.bind(this);
    this.onSkipJobVerificationHandler = this.onSkipJobVerificationHandler.bind(this);
  }

  componentDidConnect() {
    this.additionalAttributesComponents = [];
    this.secretAttributesComponents = [];
    this.additionalParameters = [];
    this.secretAttributes = [];
  }

  componentDidReceiveProps(previous) {
    if (previous.isLoading) {
      this.isLoading = false;
    }

    if (previous.data != null && this.data.instanceId !== previous.data.instanceId) {
      if (this.data.rollback) {
        this._separateAttributes(
          this.parseDataForComponents(this.data.rollback.additionalParameters)
        );

        this._parseAttributes(this.additionalParameters);

        if (this.data.instanceId) {
          this.nextTick(this.setInitialPasswords);
        }
      }
    }
  }

  /**
   * Invoke specific function in next tick
   *
   * @param {function} callback: function which will be invoke with delay
   * @returns {void}
   */
  nextTick(callback) {
    setTimeout(callback.bind(this), 1);
  }

  setInitialPasswords() {
    const targetNodes = this.shadowRoot.querySelectorAll("eui-base-v0-password-field");
    const elements = Array.from(targetNodes);

    elements.forEach(element => {
      const { name = "" } = element;
      const secret =
        this.additionalParameters.find(item => {
          const { metadata } = item || {};
          const { chart_param: param } = metadata || {};

          return param === name;
        }) || {};
      const value = secret.default || secret.default === 0 ? secret.default : "";

      element.value = value;
    });
  }

  parseDataForComponents(data) {
    const result = [];

    if (data === null || data === undefined || data.length === 0) {
      return result;
    }

    const keys = Object.keys(data);

    keys.forEach(item => {
      if (!data[item].metadata) {
        data[item].metadata = {};
      }

      if (!data[item].metadata.chart_param) {
        data[item].metadata.chart_param = item;
      }

      // if default value is undefined then it will be rewritten by `defaultValue`
      if (data[item].default === undefined) {
        // if boolean value is a string value then convert it to boolean
        if (data[item].type === "boolean" && typeof data[item].defaultValue === "string") {
          data[item].default = data[item].defaultValue === "true";
        } else {
          data[item].default = data[item].defaultValue;
        }
      }

      if (data[item].entrySchema !== null) {
        data[item].entry_schema = data[item].entrySchema;
      }

      if (isComplexType(data[item]) && !data[item].entrySchema) {
        data[item].entry_schema = { type: "string" };
      }

      data[item].type = isPasswordType(data[item].metadata.chart_param)
        ? "password"
        : data[item].type;
    });

    const values = Object.values(data);

    values.forEach(item => {
      result.push(item);
    });
    return result;
  }

  _parseAttributes(data) {
    if (!data || data.length === 0) {
      return;
    }

    data.forEach(component => {
      if (component.type === "boolean") {
        this._createSpecificAdditionalAttributeInput(
          "boolean",
          component,
          this.additionalAttributesComponents
        );
      } else if (component.type === "file") {
        this._createSpecificAdditionalAttributeInput(
          "file",
          component,
          this.additionalAttributesComponents
        );
      } else if (component.type === "timestamp") {
        this._createSpecificAdditionalAttributeInput(
          "date",
          component,
          this.additionalAttributesComponents
        );
      } else if (component.type === "map") {
        const map = {
          name: component.metadata.chart_param,
          complexType: component.type,
          type: component.entry_schema.type,
          required: component.required,
          isValid: true
        };
        this.objectArray.push(map);
        this._createSpecificAdditionalAttributeInput(
          "map",
          component,
          this.additionalAttributesComponents
        );
      } else if (component.type === "list") {
        const list = {
          name: component.metadata.chart_param,
          complexType: component.type,
          type: component.entry_schema.type,
          required: component.required,
          isValid: true
        };
        this.objectArray.push(list);
        this._createSpecificAdditionalAttributeInput(
          "list",
          component,
          this.additionalAttributesComponents
        );
      } else if (component.type === "password") {
        this._createSpecificAdditionalAttributeInput(
          "password",
          component,
          this.additionalAttributesComponents
        );
      } else {
        this._createSpecificAdditionalAttributeInput(
          "string",
          component,
          this.additionalAttributesComponents
        );
      }
    });
    if (this.secretAttributes.length !== 0) {
      this.secretAttributes.forEach(component => {
        if (_isFieldForPassword(component)) {
          this._createSpecificAdditionalAttributeInput(
            "password",
            component,
            this.secretAttributesComponents
          );
        } else {
          this._createSpecificAdditionalAttributeInput(
            "secret",
            component,
            this.secretAttributesComponents
          );
        }
      });
    }
  }

  _createSpecificAdditionalAttributeInput(type, component, attributeComponents) {
    let specificHtml;
    switch (type) {
      case "boolean":
        specificHtml = createBooleanDropdown(component, this);
        break;
      case "date":
        specificHtml = createDatePicker(component, this);
        break;
      case "secret":
        specificHtml = createSecretTextField(component, this);
        break;
      case "file":
        specificHtml = this.createFileInputField(component);
        break;
      case "password":
        specificHtml = createSecretPasswordField(component, this);
        break;
      case "map":
      case "list":
        specificHtml = createTextAreaField(component, this);
        break;
      default:
        if (_componentHasDropdownOptions(component)) {
          specificHtml = createDropDown(component, this);
        } else {
          specificHtml = createTextField(component, this);
        }
    }

    const additionalAttribute = this._createGenericAdditionalAttributeInput(
      component,
      specificHtml
    );
    _sendDefaults(component, this);
    attributeComponents.push(additionalAttribute);
  }

  _separateAttributes(data) {
    if (data != null) {
      data.forEach(component => {
        const param = component.metadata.chart_param;

        if (_isSecretAttribute(param)) {
          this.secretAttributes.push(component);
        } else {
          this.additionalParameters.push(component);
        }
      });
    }
  }

  _getSelectedComplexTypeByName(name) {
    let selectedComplexType = {};

    this.objectArray.forEach(object => {
      if (object.name === name) {
        selectedComplexType = object;
      }
    });

    return selectedComplexType;
  }

  _setIsValidFieldInSelectedComplexType(name, value) {
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].name === name) {
        this.objectArray[i].isValid = value;
        break;
      }
    }
    this._isValidComplexType();
  }

  _isValidComplexType() {
    this.validParameters = true;
    for (let i = 0; i < this.objectArray.length; i += 1) {
      if (this.objectArray[i].isValid === false) {
        this.validParameters = false;
        break;
      }
    }
  }

  _createGenericAdditionalAttributeInput(component, specificHtml) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${component.metadata.chart_param}${component.required ? " *" : ""}
        </div>
        <div class="divTableCell">
          ${specificHtml}
        </div>
      </div>
    `;
  }

  createFileInputField(component) {
    return html`
      <div class="divTableRow">
        <div class="inlineBlock">
          <eui-base-v0-text-field
            id=${replaceStringCharacter(component.metadata.chart_param)}
            placeholder="Select file to import"
            disabled
          >
          </eui-base-v0-text-field>
        </div>
        <eui-base-v0-file-input
          class="editAttribute"
          name=${component.metadata.chart_param}
          @change=${readConfigFile.bind(this)}
          style="width:110px;"
        >
          Select file
        </eui-base-v0-file-input>
      </div>
    `;
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        this.isLoading = true;
        this.bubble(ROLLBACK_EVENT);
        break;
      default:
        console.log(`Unexpected event [${event.type}] is received.`);
    }
  }

  returnToResources() {
    window.EUI.Router.goto(`resources`);
  }

  onSkipJobVerificationHandler(event) {
    const { name, checked } = event.detail;

    this.bubble(UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT, { [name]: checked });
  }

  renderVerificationSection() {
    const hasVerificationInAdditionalAttrSection = Boolean(
      this.additionalAttributes && this.additionalAttributes.skipJobVerification
    );

    if (hasVerificationInAdditionalAttrSection) {
      return null;
    }

    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          <p><b>Verification</b></p>
        </div>
      </div>
      <eui-base-v0-checkbox
        id="skipJobVerification"
        class="notBold td"
        name="skipJobVerification"
        @change=${event => this.onSkipJobVerificationHandler(event)}
      >
        <span class="skip-job-verification">${SKIP_JOB_VERIFICATION}</span>
      </eui-base-v0-checkbox>
    `;
  }

  _generatePanel() {
    const submitLabel = this.isLoading ? "Rolling back..." : "Rollback";
    const cancelLabel = this.isLoading ? "Close" : "Cancel";

    return html`
      <eui-layout-v0-multi-panel-tile tile-title="Rollback ${this.data.vnfInstanceName}">
        <div slot="content">
          <div class="rollbackinfo">
            <p>You are about to perform a rollback on ${this.data.vnfInstanceName}</p>
          </div>
          <div class="divTableBody">
            <div class="divTableRow">
              <div class="divTableCell">
                <div class="rollback-version-holder">
                  <div class="rollback-label">Current package version</div>
                </div>
              </div>
              <div class="divTableCell">
                <div class="rollback-version">
                  ${this.data.rollback.sourceDowngradePackageInfo.packageVersion}
                </div>
              </div>
            </div>
            <div class="divTableRow">
              <div class="divTableCell">
                <div class="rollback-version-holder">
                  <div class="rollback-label">Rollback package version</div>
                </div>
              </div>
              <div class="divTableCell">
                <div class="rollback-version">
                  ${this.data.rollback.targetDowngradePackageInfo.packageVersion}
                </div>
              </div>
            </div>
          </div>
          <div class="warningMessage">
            <eui-v0-icon slot="icon" name="info" class="parametersInfo-icon"></eui-v0-icon>
            <p class="parametersInfo">${ROLLBACK_PARAMS_MESSAGE}</p>
          </div>
          <div class="divTableBody">
            ${this.additionalAttributesComponents.length !== 0
              ? html`
                  <div class="divTableRow">
                    <div class="divTableCell">
                      <p><b>Additional parameters</b></p>
                    </div>
                  </div>
                  ${this.additionalAttributesComponents}
                `
              : html``}
            ${this.secretAttributes.length !== 0
              ? html`
                  <div class="divTableRow">
                    <div class="divTableCell">
                      <p><b>Secret attributes:</b></p>
                    </div>
                  </div>
                `
              : html``}
            ${this.secretAttributesComponents} ${this.renderVerificationSection()}
          </div>
        </div>
        <div slot="footer">
          <div class="rollback-form-footer">
            <div class="rollback-footer-message">
              ${ROLLBACK_WARNING_MESSAGE}
            </div>
            <eui-base-v0-button id="cancel-rollback" @click=${this.returnToResources}
              >${cancelLabel}</eui-base-v0-button
            >
            <eui-base-v0-button
              class="rollback-button"
              id="rollback"
              @click=${this}
              primary="true"
              ?disabled=${!this.validParameters || this.isLoading}
              >${submitLabel}</eui-base-v0-button
            >
          </div>
        </div>
      </eui-layout-v0-multi-panel-tile>
    `;
  }

  render() {
    return html`
      ${Object.keys(this.data).length !== 0 ? this._generatePanel() : html``}
    `;
  }
}

ResourceRollbackPanel.register();
