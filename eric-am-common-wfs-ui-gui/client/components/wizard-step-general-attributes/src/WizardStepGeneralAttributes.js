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

/* eslint no-nested-ternary: 0 */

// common
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

// components
import "./components/scale-aspect-item/ScaleAspectItem";
import "./components/extension-item/ExtensionItem"; // eslint-disable-line
import "../../generic-text-field/src/GenericTextField";
import "../../generic-text-area/src/GenericTextArea";
import "../../generic-dropdown/src/GenericDropdown";

// styles
import style from "./wizardStepGeneralAttributes.css";

// helpers
import { formatBackendSinglePackageData } from "../../../utils/CommonUtils";
import {
  DISABLE_K8S_OPENAPI_VALIDATION,
  SKIP_JOB_VERIFICATION,
  SKIP_JOB_VERIFICATION_DESC,
  SKIP_VERIFICATION,
  SKIP_VERIFICATION_DESCRIPTION,
  HELM_NO_HOOKS,
  HELM_NO_HOOKS_DESC,
  SKIP_MERGING_PREVIOUS_VALUES,
  SKIP_MERGING_PREVIOUS_VALUES_DESC,
  MANUAL_CONTROL_SCALING,
  MANUAL_CONTROL_SCALING_DESC,
  CLEAN_UP_RESOURCES_DESCRIPTION,
  CLEAN_UP_RESOURCES,
  PERSIST_SCALE_INFO,
  PERSIST_SCALE_INFO_DESC,
  PERSIST_DM_CONFIGURATION
} from "../../../constants/Messages";
import {
  UPDATE_SELECTED_PACKAGE_DATA_EVENT,
  UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT,
  WIZARD_VALIDATE_STEP_EVENT,
  WIZARD_CHANGE_EVENT,
  UPDATE_VNFD_DATA
} from "../../../constants/Events";
import {
  INSTANCE_NAME_VALIDATION_POLICY,
  TIMEOUT_VALIDATION_POLICY,
  HELM_FILE_VERSION_POLICY
} from "../../../constants/ValidationPolicies";
import {
  VNFLCM_INTERFACES_INSTANTIATE,
  VNFLCM_INTERFACES_UPGRADE,
  LCM_OPERATION_UPGRADE
} from "../../../constants/GenericConstants";
import { fetchPackage } from "../../../api/onboarding";

// types
import { ExtensionTypes } from "./components/extension-item/ExtensionItem"; // eslint-disable-line

const SCALE_LEVEL_TYPES = {
  Manual: "Manual",
  Dynamic: "Dynamic"
};

/**
 * Component WizardStepGeneralAttributes is defined as
 * `<e-wizard-step-general-attributes>`
 *
 * Imperatively create component
 * @example
 * let component = new WizardStepGeneralAttributes();
 *
 * Declaratively create component
 * @example
 * <e-wizard-step-general-attributes></e-wizard-step-general-attributes>
 *
 * @extends {LitComponent}
 */
@definition("e-wizard-step-general-attributes", {
  style,
  props: {
    infrastructure: { attribute: false, type: "object", default: {} },
    instanceName: { attribute: false, type: "string", default: "" },
    persistScaleInfo: { attribute: true, type: "boolean", default: false },
    currentInstantiationLevelIdWhenUpgrade: { attribute: false, type: "string", default: "" },
    extensionsData: { attribute: false, type: "array", default: [] },
    deployableModulesData: { attribute: false, type: "array", default: [] },
    instantiationLevelsData: { attribute: false, type: "object", default: [] },
    selectedPackage: { attribute: false, type: "object", default: {} },
    extensionsWithAspects: { attribute: false, type: "object", default: { extensions: {} } },
    lcmOperation: { attribute: false, type: "string", default: "" },
    description: { attribute: false, type: "string", default: "" },
    descriptorVersion: { attribute: false, type: "string", default: "" },
    validApplicationTimeOut: { attribute: false, type: "boolean", default: true },
    hasExtraUnmodifiableData: { attribute: false, type: "boolean", default: false },
    resource: { attribute: true, type: "object", default: {} },
    releaseNameErrorMessages: {
      attribute: false,
      type: "array",
      default: []
    },
    instantiationLevelId: { attribute: false, type: "string", default: "" },
    targetScaleLevelInfo: { attribute: false, type: "array", default: [] },
    scaleLevelType: { attribute: false, type: "string", default: SCALE_LEVEL_TYPES.Manual },
    defaultGeneralProperties: { attribute: false, type: "object", default: {} }
  }
})
export default class WizardStepGeneralAttributes extends LitComponent {
  constructor() {
    super();

    this.handleEvent = this.handleEvent.bind(this);
    this.setScaleType = this.setScaleType.bind(this);
    this.handleAspectChanged = this.handleAspectChanged.bind(this);
    this._fetchPackage = this._fetchPackage.bind(this);
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (this.selectedPackage && previous.selectedPackage) {
      if (
        this.selectedPackage.appPkgId &&
        previous.selectedPackage.appPkgId !== this.selectedPackage.appPkgId
      ) {
        this._setEmptyExtensionsBeforeFetchingNewAttributes();
        this._fetchPackage(this.selectedPackage.appPkgId);
      }
    }
  }

  componentDidConnect() {
    this.bubble(WIZARD_VALIDATE_STEP_EVENT, {
      stepId: "generalAttributes",
      isValid: this.hasExtraUnmodifiableData
    });
    this.isValidInstanceName = this.hasExtraUnmodifiableData;
  }

  get hasDeployableModules() {
    const { extensionsData = [] } = this || {};

    return Boolean(
      extensionsData.filter(
        extension => extension.extensionName === ExtensionTypes.deployableModules
      ).length
    );
  }

  get getDefaultGeneralPropertyValues() {
    return this.defaultGeneralProperties || {};
  }

  /**
   * Fetch package
   *
   * @returns {Promise<void>}
   */
  async _fetchPackage(packageId) {
    let additionalAttributes = [];

    try {
      const response = await fetchPackage({ packageId });

      const data = formatBackendSinglePackageData(
        response,
        this.getVNFLCMType(),
        this.getVNFLCMType()
      );

      additionalAttributes = data.descriptorModel || [];
      this.defaultGeneralProperties = data.defaultGeneralProperties;
      this.extensionsData = data.vnfInfoModifiableAttributesExtensions;
      this.deployableModulesData = data.deployableModules;
      [this.instantiationLevelsData] = data.instantiationLevels;
      this._setInstantiationLevelId(this.instantiationLevelsData);

      // init package with vnfd params
      this.bubble(UPDATE_SELECTED_PACKAGE_DATA_EVENT, data);
    } catch (error) {
      console.error("Error when fetching package or parsing descriptor: ", error);
    } finally {
      this.bubble(UPDATE_VNFD_DATA, additionalAttributes);
      // init default general attribute
      this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, this.getDefaultGeneralPropertyValues);
    }
  }

  handleEvent(event) {
    switch (event.target.id) {
      case "instance-name":
        this.instanceName = event.target.value;
        this.isValidInstanceName = this._validateInput(event);
        if (this.isValidInstanceName) {
          this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, { instanceName: this.instanceName });
        }
        break;
      case "description":
        this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, { description: event.target.getValue() });
        break;
      case "application-timeout":
        this.appTimeOut = event.target.value;
        this.validApplicationTimeOut = this._validateInput(event);
        if (this.validApplicationTimeOut) {
          this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
            applicationTimeOut: this.appTimeOut
          });
        }
        break;
      case "helm-client-version":
        this.helmClientVersion = event.target.value;
        this.validApplicationTimeOut = this._validateInput(event);
        if (this.validApplicationTimeOut) {
          this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
            helmClientVersion: this.helmClientVersion
          });
        }
        break;
      case "instantiation-level-id":
        this.instantiationLevelId = event.detail.value;
        this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
          instantiationLevelId: this.instantiationLevelId,
          targetScaleLevelInfo: []
        });
        break;

      default:
        console.log(`Unexpected event target [${event.target}] received.`);
    }

    this.validateFields();

    this.bubble(WIZARD_CHANGE_EVENT, null);
  }

  validateFields() {
    const isInValid = this.targetScaleLevelInfo.some(aspect => !aspect.isValid);

    if (
      this.isValidInstanceName &&
      this.validApplicationTimeOut &&
      !isInValid &&
      this.hasEnableDeploymentModules
    ) {
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "generalAttributes", isValid: true });
    } else {
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "generalAttributes", isValid: false });
    }
  }

  handleAspectChanged(event) {
    const { detail } = event;

    // should be skipped if `targetScaleLevelInfo` is specified
    this.instantiationLevelId = undefined;

    const aspect = this.targetScaleLevelInfo.find(item => item.aspectId === detail.aspectId);

    if (aspect) {
      this.targetScaleLevelInfo = this.targetScaleLevelInfo.map(item => {
        return item.aspectId === detail.aspectId ? detail : item;
      });
    } else {
      this.targetScaleLevelInfo.push(detail);
    }

    const isInValid =
      this.targetScaleLevelInfo.some(item => !item.isValid) ||
      !this.isValidInstanceName ||
      !this.validApplicationTimeOut;
    const targetScaleLevelInfo = this.targetScaleLevelInfo.map(item => {
      return {
        scaleLevel: item.scaleLevel,
        aspectId: item.aspectId
      };
    });

    this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "generalAttributes", isValid: !isInValid });
    this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
      targetScaleLevelInfo,
      instantiationLevelId: undefined
    });
    this.bubble(WIZARD_CHANGE_EVENT, null);
  }

  _validateInput(event) {
    const inputId = event.currentTarget.id;
    const { value } = event.currentTarget;
    const selectedElement = `e-validation-checker.${inputId}-validation`;
    const checker = this.shadowRoot.querySelector(selectedElement);
    return checker.validate(value);
  }

  _createMapForInfrastructureData() {
    const keyValueMap = {};
    keyValueMap.Cluster = this.infrastructure.cluster;
    keyValueMap.Namespace = this.infrastructure.namespace;
    return keyValueMap;
  }

  _onCheckboxChange(event) {
    const { name } = event.currentTarget;
    const { checked } = event.currentTarget;
    const attribute = {};
    attribute[name] = checked;
    this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, attribute);
  }

  _setInstantiationLevelId = instantiationLevelsData => {
    if (
      instantiationLevelsData &&
      instantiationLevelsData.instantiationLevelName &&
      instantiationLevelsData.value &&
      instantiationLevelsData.value.default_level
    ) {
      this.instantiationLevelId = instantiationLevelsData.value.default_level;
    } else if (
      instantiationLevelsData &&
      instantiationLevelsData.instantiationLevelName &&
      instantiationLevelsData.value
    ) {
      [this.instantiationLevelId] = instantiationLevelsData.value.levels;
    } else {
      this.instantiationLevelId = "";
    }
    this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
      instantiationLevelId: this.instantiationLevelId
    });
  };

  getVNFLCMType() {
    switch (this.lcmOperation) {
      case LCM_OPERATION_UPGRADE:
        return VNFLCM_INTERFACES_UPGRADE;
      default:
        return VNFLCM_INTERFACES_INSTANTIATE;
    }
  }

  setScaleType(event) {
    const { aspectName } = event.detail;
    const group = event.detail.group.replace("extension-", "");

    if (this.extensionsWithAspects.extensions[group] === undefined) {
      this.extensionsWithAspects.extensions[group] = {};
    }

    this.extensionsWithAspects.extensions[group][aspectName] = event.detail.label;

    if (group === ExtensionTypes.deployableModules) {
      this.excludeUnchangedExtensionFields(group, aspectName, event.detail.label);
      this.validateFields();
    }

    this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, this.extensionsWithAspects);
  }

  get hasEnableDeploymentModules() {
    const { deployableModules } = this.extensionsWithAspects.extensions;

    if (deployableModules === undefined) {
      return true;
    }

    const { extensionsData = {} } = this;
    const deployableModulesData =
      extensionsData.find(
        ({ extensionName }) => extensionName === ExtensionTypes.deployableModules
      ) || {};
    const { defaults } = deployableModulesData;
    const deployableModulesPared = Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [key, deployableModules[key] || value])
    );

    return Object.values(deployableModulesPared).some(value => value === "enabled");
  }

  excludeUnchangedExtensionFields(group, key, value) {
    const { extensionsData = {} } = this;
    const deployableModulesData = extensionsData.find(
      ({ extensionName }) => extensionName === ExtensionTypes.deployableModules
    );

    if (deployableModulesData.defaults[key] === value) {
      this.extensionsWithAspects.extensions[group][key] = null;
    }
  }

  _renderExtensionRadioButtons() {
    const { persistScaleInfo, resource = {}, lcmOperation } = this;
    const { extensions: resourceExtensions = {} } = resource || {};
    const extensions = this.extensionsData.filter(
      extension => extension.extensionName === ExtensionTypes.vnfControlledScaling
    );
    const hasExtensions = Boolean(extensions.length);

    return html`
      ${hasExtensions
        ? html`
            <div class="fieldHeader mb-10">Extensions</div>
          `
        : null}
      ${extensions.map(extension => {
        const existingAspects = resourceExtensions[extension.extensionName] || {};

        return html`
          <e-extension-item
            .extensionTypes=${ExtensionTypes.vnfControlledScaling}
            .data=${extension}
            .existingAspects=${existingAspects}
            .persistScaleInfo=${persistScaleInfo}
            .isUpgrade=${lcmOperation === LCM_OPERATION_UPGRADE}
            @extension-item:changed=${this.setScaleType}
          />
        `;
      })}
    `;
  }

  _renderExtensionDeployableModuleRadioButtons() {
    const { persistDMConfig, resource = {}, lcmOperation } = this;
    const { extensions: resourceExtensions = {} } = resource || {};

    return html`
      ${this.extensionsData
        .filter(extension => extension.extensionName === ExtensionTypes.deployableModules)
        .map(extension => {
          const existingAspects = resourceExtensions[extension.extensionName] || {};

          return html`
            <e-extension-item
              .extensionTypes=${ExtensionTypes.deployableModules}
              .data=${extension}
              .existingAspects=${existingAspects}
              .persistScaleInfo=${persistDMConfig}
              .additionData=${{ deployableModulesData: this.deployableModulesData }}
              .isUpgrade=${lcmOperation === LCM_OPERATION_UPGRADE}
              @extension-item:changed=${this.setScaleType}
            />
          `;
        })}
    `;
  }

  _renderInstantiationLevelDropdown() {
    const instantiationLevelIdComponent = [];
    if (this.instantiationLevelsData.instantiationLevelName) {
      const instantiationLevelsOptions = [];
      this.instantiationLevelsData.value.levels.forEach(level => {
        instantiationLevelsOptions.push({ level, value: level });
      });

      instantiationLevelIdComponent.push(html`
        <div>
          <div class="fieldHeader">Instantiation Level ID</div>
          <e-generic-dropdown
            id="instantiation-level-id"
            label=${this.instantiationLevelId}
            data-type="single"
            width="17rem"
            .data=${instantiationLevelsOptions}
            class="select"
            @change=${this}
          ></e-generic-dropdown>
        </div>
      `);
    }
    return instantiationLevelIdComponent;
  }

  handleChangeScaleType(type) {
    this.scaleLevelType = type;

    if (type === SCALE_LEVEL_TYPES.Manual) {
      this._setInstantiationLevelId(this.instantiationLevelsData);
      this.targetScaleLevelInfo = [];

      this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
        targetScaleLevelInfo: this.targetScaleLevelInfo
      });
    }
  }

  _renderScaleSection() {
    const { scaleLevelType } = this;
    const { scalingAspects = [] } = this.selectedPackage;
    const { instantiationLevelName } = this.instantiationLevelsData;

    if (!instantiationLevelName) {
      return null;
    }

    if (instantiationLevelName && scalingAspects.length === 0) {
      return this._renderInstantiationLevelDropdown();
    }

    return html`
      <div class="fieldHeader mb-10">Scale level</div>
      <div class="contentExtension">
        <eui-base-v0-radio-button
          name="manual-scale-level"
          group="scale-level"
          id="manualScaleLevel"
          ?checked=${scaleLevelType === SCALE_LEVEL_TYPES.Manual}
          @change=${this.handleChangeScaleType.bind(this, SCALE_LEVEL_TYPES.Manual)}
          >Instantiation Scale Level</eui-base-v0-radio-button
        >
        <eui-base-v0-radio-button
          class="radio"
          name="dynamic-scale-level"
          group="scale-level"
          id="dynamicScaleLevel"
          ?checked=${scaleLevelType === SCALE_LEVEL_TYPES.Dynamic}
          @change=${this.handleChangeScaleType.bind(this, SCALE_LEVEL_TYPES.Dynamic)}
          >Dynamic Scale Level</eui-base-v0-radio-button
        >
      </div>

      ${scaleLevelType === SCALE_LEVEL_TYPES.Manual
        ? this._renderInstantiationLevelDropdown()
        : this._renderDynamicScaleLevelSection()}
    `;
  }

  _renderDynamicScaleLevelWarning() {
    return html`
      <div class="mb-10">
        <eui-v0-icon name="triangle-warning" color="#d97833"></eui-v0-icon>
        <span>For non set scale level default values will be applied from package vnfd</span>
      </div>
    `;
  }

  _renderDynamicScaleLevelSection() {
    const { scalingAspects = [], instantiationLevelsObj = {} } = this.selectedPackage;
    const { default_level: defaultLevel = "", levels = {} } = instantiationLevelsObj;
    const defaultInstantiationLevel = levels[defaultLevel] || {};
    const { targetScaleLevelInfo = [] } = this;
    const hasWarning = targetScaleLevelInfo.some(item => item.scaleLevel === null);

    return html`
      <div class="fieldHeader mb-10">Target Scale Level Info</div>
      ${hasWarning ? this._renderDynamicScaleLevelWarning() : null}
      ${scalingAspects.map(
        aspect =>
          html`
            <e-scale-aspect-item
              id=${aspect.aspectId}
              class="dynamic-scale-level"
              .data=${aspect}
              .defaultInstantiationLevel=${defaultInstantiationLevel}
              @scale-aspect:changed=${this.handleAspectChanged}
            />
          `
      )}
    `;
  }

  _renderInstantiationLevelText() {
    const instantiationLevel = this._defineInstantiationLevelId();
    if (instantiationLevel !== "") {
      return html`
        <div class="notBold">
          <div class="fieldHeader">Instantiation Level ID</div>
          <div class="fieldValue">${instantiationLevel}</div>
        </div>
      `;
    }
    return null;
  }

  _setEmptyExtensionsBeforeFetchingNewAttributes() {
    this.bubble(UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT, {
      extensions: {}
    });
    this.extensionsData = [];
    this.extensionsWithAspects.extensions = {};
  }

  _defineInstantiationLevelId() {
    if (this.currentInstantiationLevelIdWhenUpgrade !== "") {
      return this.currentInstantiationLevelIdWhenUpgrade;
    }
    return this.instantiationLevelId;
  }

  render() {
    return html`
      <div class="content">
        <div class="column">
          <div class="infrastructure">
            <div class="heading">Infrastructure</div>
            <div class="infrastructureFields">
              <e-generic-key-value-list
                .keyValueMap=${this._createMapForInfrastructureData()}
                vertical
              ></e-generic-key-value-list>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="generalAttrs">
            <div class="heading">General Attributes</div>
            <div class="generalAttrFields">
              <div class="notBold">
                <div class="fieldHeader">Version</div>
                <div class="fieldValue">${this.descriptorVersion}</div>
              </div>
              <div class="instanceName">
                ${this.hasExtraUnmodifiableData
                  ? html`
                      <div class="notBold">
                        <div class="fieldHeader">Resource instance name</div>
                        <div class="fieldValue">${this.instanceName}</div>
                      </div>
                    `
                  : html`
                      <div class="fieldHeader">Resource instance name *</div>
                      <div class="fieldValue">
                        <div class="table">
                          <div class="tr">
                            <div class="td">
                              <eui-base-v0-text-field
                                fullwidth=${true}
                                id="instance-name"
                                placeholder="Resource instance name"
                                @input=${this}
                                value=${this.instanceName}
                              >
                              </eui-base-v0-text-field>
                            </div>
                            <div class="td">
                              <e-validation-checker
                                class="checker instance-name-validation"
                                .validationPolicies=${INSTANCE_NAME_VALIDATION_POLICY}
                              ></e-validation-checker>
                            </div>
                          </div>
                        </div>
                      </div>
                    `}
              </div>
            </div>

            <div class="description">
              <div class="fieldHeader">Description</div>
              <div class="fieldValue">
                <e-generic-text-area
                  id="description"
                  placeholder="Description"
                  style="width:100%"
                  @input=${this}
                  value=${this.description}
                ></e-generic-text-area>
              </div>
            </div>

            <div class="appTimeOut">
              <div class="fieldHeader">Application timeout (sec)</div>
              <div class="fieldValue">
                <div class="table">
                  <div class="tr">
                    <div class="td">
                      <eui-base-v0-text-field
                        id="application-timeout"
                        placeholder="Application timeout"
                        @input=${this}
                        value=${this.getDefaultGeneralPropertyValues.applicationTimeOut}
                      ></eui-base-v0-text-field>
                    </div>
                    <div class="td">
                      <e-validation-checker
                        class="checker application-timeout-validation"
                        .validationPolicies=${TIMEOUT_VALIDATION_POLICY}
                      ></e-validation-checker>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="helmClientVersion">
              <div class="fieldHeader">Helm client version</div>
              <div class="fieldValue">
                <div class="table">
                  <div class="tr">
                    <div class="td">
                      <eui-base-v0-text-field
                        id="helm-client-version"
                        placeholder="Version"
                        @input=${this}
                        value=${this.getDefaultGeneralPropertyValues.helmClientVersion}
                      ></eui-base-v0-text-field>
                    </div>
                    <div class="td">
                      <e-validation-checker
                        class="checker helm-client-version-validation"
                        .validationPolicies=${HELM_FILE_VERSION_POLICY}
                      ></e-validation-checker>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="k8sOpenapiValidation">
              <div class="fieldHeader">Kubernetes OpenAPI Schema validation</div>
              <div class="fieldValue">
                <eui-base-v0-checkbox
                  id="k8sOpenapiValidation"
                  class="notBold"
                  name="disableOpenapiValidation"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.disableOpenapiValidation}
                >
                  <span class="disable-validation">${DISABLE_K8S_OPENAPI_VALIDATION}</span>
                </eui-base-v0-checkbox>
              </div>
            </div>

            <div class="skipVerifications">
              <div class="fieldHeader">Verification</div>
              <div class="fieldValue">
                <div class="notBold descriptionText">${SKIP_JOB_VERIFICATION_DESC}</div>
                <eui-base-v0-checkbox
                  id="skipJobVerification"
                  class="notBold td"
                  name="skipJobVerification"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.skipJobVerification}
                >
                  <span class="skip-job-verification">${SKIP_JOB_VERIFICATION}</span>
                </eui-base-v0-checkbox>
              </div>
              <div class="fieldValue">
                <div class="notBold descriptionText">${SKIP_VERIFICATION_DESCRIPTION}</div>
                <eui-base-v0-checkbox
                  id="skipVerification"
                  class="notBold td"
                  name="skipVerification"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.skipVerification}
                >
                  <span class="skip-verification">${SKIP_VERIFICATION}</span>
                </eui-base-v0-checkbox>
              </div>
            </div>
            <div class="helmNoHooks">
              <div class="fieldHeader">Helm hooks</div>
              <div class="fieldValue">
                <div class="notBold descriptionText">${HELM_NO_HOOKS_DESC}</div>
                <eui-base-v0-checkbox
                  id="helmNoHooks"
                  class="notBold td"
                  name="helmNoHooks"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.helmNoHooks}
                >
                  <span class="helm-no-hooks">${HELM_NO_HOOKS}</span>
                </eui-base-v0-checkbox>
              </div>
            </div>
            <div class="skipMergingPreviousValues">
              ${this.hasExtraUnmodifiableData
                ? html`
               <div class="fieldHeader">Merging previous values</div>
                <div class="fieldValue">
                 <div class="notBold descriptionText">${SKIP_MERGING_PREVIOUS_VALUES_DESC}</div>
                 <eui-base-v0-checkbox
                   id="skipMergingPreviousValues"
                    class="notBold td"
                    name="skipMergingPreviousValues"
                   @change=${e => this._onCheckboxChange(e)}
                   .checked=${this.getDefaultGeneralPropertyValues.skipMergingPreviousValues}
                 >
                   <span class="skip-merging-previous-values">${SKIP_MERGING_PREVIOUS_VALUES}</span>
                 </eui-base-v0-checkbox>
                </div>
              </div>
            `
                : null}
            </div>
            <div class="cleanUpResources">
              <div class="fieldHeader">Clean up resources</div>
              <div class="fieldValue">
                <div class="notBold descriptionText">${CLEAN_UP_RESOURCES_DESCRIPTION}</div>
                <eui-base-v0-checkbox
                  id="cleanUpResources"
                  class="notBold td"
                  name="cleanUpResources"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.cleanUpResources}
                >
                  <span class="clean-up-resources">${CLEAN_UP_RESOURCES}</span>
                </eui-base-v0-checkbox>
              </div>
            </div>
            <div class="manoControlledScaling">
              <div class="fieldHeader">Manual controlled scaling</div>
              <div class="fieldValue">
                <div class="notBold descriptionText">${MANUAL_CONTROL_SCALING_DESC}</div>
                <eui-base-v0-checkbox
                  id="manoControlledScaling"
                  class="notBold td"
                  name="manoControlledScaling"
                  @change=${e => this._onCheckboxChange(e)}
                  .checked=${this.getDefaultGeneralPropertyValues.manoControlledScaling}
                >
                  <span class="mano-controlled-scaling">${MANUAL_CONTROL_SCALING}</span>
                </eui-base-v0-checkbox>
              </div>
            </div>
            <div class="persistScaleInfo">
              ${this.hasExtraUnmodifiableData
                ? html`
               <div class="fieldHeader">Persist Scale Info</div>
                <div class="fieldValue">
                 <div class="notBold descriptionText">${PERSIST_SCALE_INFO_DESC}</div>
                 <eui-base-v0-checkbox
                   id="persistScaleInfo"
                    class="notBold td"
                    name="persistScaleInfo"
                   @change=${e => this._onCheckboxChange(e)}
                   .checked=${this.getDefaultGeneralPropertyValues.persistScaleInfo}
                 >
                   <span class="persist-scale-info">${PERSIST_SCALE_INFO}</span>
                 </eui-base-v0-checkbox>
                </div>
              </div>
            `
                : null}
            </div>
            <div class="extensions">
              ${this._renderExtensionRadioButtons()}
            </div>
            <div class="deployableModules">
              ${this.hasDeployableModules
                ? this.getVNFLCMType() === VNFLCM_INTERFACES_UPGRADE
                  ? html`
                      <div class="fieldHeader mb-10">Deployable Modules</div>
                      <div class="persistDMConfiguration">
                        <div class="notBold">Persist Configuration</div>
                        <div class="fieldValue">
                          <eui-base-v0-checkbox
                            id="persistDMConfiguration"
                            class="notBold tr"
                            name="persistDMConfig"
                            @change=${e => this._onCheckboxChange(e)}
                            .checked=${this.getDefaultGeneralPropertyValues.persistDMConfig}
                          >
                            <span class="persist-dm-configuration"
                              >${PERSIST_DM_CONFIGURATION}</span
                            >
                          </eui-base-v0-checkbox>
                        </div>
                      </div>
                      <div>
                        ${this._renderExtensionDeployableModuleRadioButtons()}
                      </div>
                    `
                  : html`
                      <div class="fieldHeader mb-10">Deployable Modules</div>
                      <div>
                        ${this._renderExtensionDeployableModuleRadioButtons()}
                        ${!this.hasEnableDeploymentModules
                          ? html`
                              <p style="color:#ff0000">
                                Operation is not allowed if all deployable modules are disabled
                              </p>
                            `
                          : null}
                      </div>
                    `
                : null}
            </div>
            <div class="instantiationLevelId">
              ${this.hasExtraUnmodifiableData
                ? this._renderInstantiationLevelText()
                : this._renderScaleSection()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

WizardStepGeneralAttributes.register();
