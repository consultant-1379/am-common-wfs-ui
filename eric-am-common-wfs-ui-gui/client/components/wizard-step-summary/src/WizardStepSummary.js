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
 * Component WizardStepSummary is defined as
 * `<e-wizard-step-summary>`
 *
 * Imperatively create component
 * @example
 * let component = new WizardStepSummary();
 *
 * Declaratively create component
 * @example
 * <e-wizard-step-summary></e-wizard-step-summary>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./wizardStepSummary.css";
import "../../generic-key-value-list/src/GenericKeyValueList";
import {
  getLongestKey,
  convertValueToStringIfObject,
  checkIsInputMethodOfType,
  findAssociatedArtifacts,
  isPasswordType
} from "../../../utils/CommonUtils";
import "../../file-content-dialog/src/FileContentDialog";
import {
  LCM_OPERATION_INSTANTIATE,
  LCM_OPERATION_UPGRADE,
  INPUT_METHOD_EDIT,
  INPUT_METHOD_FILE
} from "../../../constants/GenericConstants";
import { WIZARD_VALIDATE_STEP_EVENT } from "../../../constants/Events";
import "../../generic-accordion/src/GenericAccordion";

@definition("e-wizard-step-summary", {
  style,
  props: {
    selectedPackage: { attribute: false, type: "object", default: {} },
    infrastructure: { attribute: false, type: "object", default: {} },
    generalAttributes: { attribute: false, type: "object", default: {} },
    additionalAttributes: { attribute: false, type: "object", default: {} },
    lcmOperation: { attribute: false, type: "string", default: LCM_OPERATION_INSTANTIATE },
    inputMethod: { attribute: false, type: "array", default: [INPUT_METHOD_EDIT] },
    fileUploaded: { attribute: false, type: "object", default: {} },
    showFileContentDialog: { attribute: false, type: "boolean", default: false }
  }
})
export default class WizardStepSummary extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidConnect() {
    // TODO: add validation
    this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "summary", isValid: true });
  }

  handleEvent(event) {
    switch (event.type) {
      case "cell-clicked":
        this.fileContent = event.target.cellValue;
        this.fileLabel = event.target.id;
        if (event.detail.hasAttribute("truncated")) {
          this.showFileContentDialog = true;
        }
        break;
      case "fileContentDialog:cancel":
        this.showFileContentDialog = null;
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  createGeneralSummaryInfoMapFromStepData() {
    const keyValueMap = {};
    keyValueMap["Resource instance name"] = this.generalAttributes.instanceName;
    keyValueMap.Type = this.selectedPackage.appProductName;
    keyValueMap["Package version"] = this.selectedPackage.descriptorVersion;
    keyValueMap["Software version"] = this.selectedPackage.appSoftwareVersion;
    keyValueMap.Cluster = this.infrastructure.cluster;
    keyValueMap.Namespace = this.infrastructure.namespace;
    keyValueMap.Description = this.generalAttributes.description;
    return keyValueMap;
  }

  createListComponent(keyValueMap, width) {
    return html`
      <ul class="summary-key-value-list">
        ${Object.keys(keyValueMap).map(key => {
          let value =
            keyValueMap[key] != null && keyValueMap[key].length !== 0 ? keyValueMap[key] : "-";
          value = convertValueToStringIfObject(value, isPasswordType(key));
          return html`
            <li class="summary-key-value-list-item">
              <div class="summary-key" style="width:${width}" title=${key}>${key}</div>
              <div class="summary-value" title="${value}">
                <e-custom-cell
                  id=${key}
                  @cell-clicked=${this}
                  .hideContextMenu=${true}
                  .cellValue=${value}
                >
                </e-custom-cell>
              </div>
            </li>
          `;
        })}
      </ul>
    `;
  }

  getLcmOperationMessage() {
    switch (this.lcmOperation) {
      case LCM_OPERATION_UPGRADE:
        return LCM_OPERATION_UPGRADE;
      default:
        return LCM_OPERATION_INSTANTIATE;
    }
  }

  createFileNameComponent(fileUploaded, maxKeyWidth) {
    const fileNameAttribute = {};
    let fileName = null;
    if (fileUploaded) {
      fileName = fileUploaded.name;
    }
    fileNameAttribute["Uploaded yaml file"] = fileName;
    return this.createListComponent(fileNameAttribute, maxKeyWidth);
  }

  getAdditionalAttributesWithoutSecrets(keyValueMap) {
    const additionalAttributesWithoutSecrets = {};

    Object.keys(keyValueMap).forEach(key => {
      if (this.isNotSecretAttribute(key)) {
        additionalAttributesWithoutSecrets[key] = keyValueMap[key];
      }
    });
    return additionalAttributesWithoutSecrets;
  }

  areSecretAttributesPresent(attributes) {
    return (
      Object.prototype.hasOwnProperty.call(attributes, "day0.configuration.secretname") ||
      Object.prototype.hasOwnProperty.call(attributes, "day0.configuration.secrets")
    );
  }

  isNotSecretAttribute(attribute) {
    return attribute.indexOf("day0.configuration") === -1;
  }

  writeAboutSecretsIfPresent(additionalAttributes, maxKeyWidth) {
    const secretAttributes = { "Secret attributes": "Secrets related information is hidden" };
    let specificHtml = "";
    if (this.areSecretAttributesPresent(additionalAttributes)) {
      specificHtml = this.createListComponent(secretAttributes, maxKeyWidth);
    }
    return specificHtml;
  }

  _renderAdditionalAttributes(maxKeyWidth) {
    const additionalAttributesWithoutSecrets = this.getAdditionalAttributesWithoutSecrets(
      this.additionalAttributes
    );

    if (checkIsInputMethodOfType(this.inputMethod, INPUT_METHOD_EDIT)) {
      return html`
        ${this.createListComponent(additionalAttributesWithoutSecrets, maxKeyWidth)}
        ${this.writeAboutSecretsIfPresent(this.additionalAttributes, maxKeyWidth)}
      `;
    }
    if (checkIsInputMethodOfType(this.inputMethod, INPUT_METHOD_FILE)) {
      return html`
        ${this.createFileNameComponent(this.fileUploaded, maxKeyWidth)}
      `;
    }

    return html`
      ${this.createFileNameComponent(this.fileUploaded, maxKeyWidth)}
      ${this.createListComponent(additionalAttributesWithoutSecrets, maxKeyWidth)}
      ${this.writeAboutSecretsIfPresent(this.additionalAttributes, maxKeyWidth)}
    `;
  }

  _renderDeployableModules(maxKeyWidth) {
    const { extensions } = this.generalAttributes;

    if (
      extensions !== undefined &&
      extensions.deployableModules !== undefined &&
      Object.keys(extensions.deployableModules).length !== 0
    ) {
      const deployableModulesMap = {};
      Object.entries(extensions.deployableModules).forEach(([key, value]) => {
        const associatedArtifacts = findAssociatedArtifacts(
          key,
          this.generalAttributes.deployableModulesData
        );
        const moduleName =
          associatedArtifacts.length === 0 ? key : `${key} (${associatedArtifacts.join(", ")})`;
        deployableModulesMap[moduleName] = value;
      });
      return html`
        <e-generic-accordion accordion-title="Deployable Modules">
          ${this.createListComponent(deployableModulesMap, maxKeyWidth)}
        </e-generic-accordion>
      `;
    }
    return html``;
  }

  _renderFileContentDialog() {
    return html`
      <e-file-content-dialog
        label=${this.fileLabel}
        content=${this.fileContent}
        @fileContentDialog:cancel=${this}
      >
      </e-file-content-dialog>
    `;
  }

  render() {
    const generalSummaryInfoMap = this.createGeneralSummaryInfoMapFromStepData();
    const generalSummaryKeys = Object.keys(generalSummaryInfoMap);
    const additionalAttributesKeys = Object.keys(this.additionalAttributes);
    const maxKeyWidth = getLongestKey(generalSummaryKeys, additionalAttributesKeys, "em");

    return html`
      <div class="content">
        <div class="summary-title">
          You are about to ${this.getLcmOperationMessage().toLowerCase()} a resource with the
          following attributes:
        </div>
        <div class="general-summary-info">
          ${this.createListComponent(generalSummaryInfoMap, maxKeyWidth)}
        </div>
        ${this._renderDeployableModules(maxKeyWidth)}
        <e-generic-accordion accordion-title="Additional attributes">
          ${this._renderAdditionalAttributes(maxKeyWidth)}
        </e-generic-accordion>
      </div>
      ${this.showFileContentDialog ? this._renderFileContentDialog() : html``}
    `;
  }
}

WizardStepSummary.register();
