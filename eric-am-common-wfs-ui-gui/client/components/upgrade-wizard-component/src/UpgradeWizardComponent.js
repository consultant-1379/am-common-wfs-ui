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

// components
import "../../wizard-step-package-selection/src/WizardStepPackageSelection";
import "../../wizard-step-infrastructure/src/WizardStepInfrastructure";
import "../../wizard-step-general-attributes/src/WizardStepGeneralAttributes";
import "../../wizard-step-additional-attributes/src/WizardStepAdditionalAttributes";
import "../../wizard-step-summary/src/WizardStepSummary";
import "../../generic-dialog/src/GenericDialog";

// styles
import style from "./upgradeWizardComponent.css";

// models
import { DialogModel } from "../../generic-dialog/src/DialogModel";
import { Resource } from "../../../model/resources";

// helpers
import {
  CONTENT_TYPE_JSON_HEADER,
  CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER,
  getErrorMessage
} from "../../../utils/RestUtils";
import {
  DIALOG_BUTTON_CLICK_EVENT,
  UPDATE_SELECTED_PACKAGE_DATA_EVENT,
  UPDATE_INFRASTRUCTURE_DATA_EVENT,
  UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT,
  UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT,
  EUI_WIZARD_CANCEL_EVENT,
  EUI_WIZARD_FINISH_EVENT,
  WIZARD_VALIDATE_STEP_EVENT,
  UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT,
  UPDATE_ADDITIONAL_ATTRIBUTES_METHOD_EVENT,
  WIZARD_CHANGE_EVENT,
  UPDATE_VNFD_DATA
} from "../../../constants/Events";
import {
  SEE_RESOURCE_LIST_BUTTON,
  SEE_OPERATION_LIST_BUTTON,
  UPGRADE_OPERATION_STARTED,
  UPGRADE_MESSAGE
} from "../../../constants/Messages";
import {
  LCM_OPERATION_UPGRADE,
  INPUT_METHOD_EDIT,
  INPUT_METHOD_ALL
} from "../../../constants/GenericConstants";
import {
  removeEmptyOrNullParams,
  isWizardFinishButtonEnabled,
  setWizardFinishButtonEnabled,
  removeNavigationOfNextStepsInWizard,
  accessDenied,
  isEmptyString,
  checkIsInputMethodOfType,
  renderErrorDialog,
  removeNullDeployableModules
} from "../../../utils/CommonUtils";
import { fetchResource } from "../../../api/internal";
import { postChangeResource } from "../../../api/orchestrator";

/**
 * Component UpgradeWizardComponent is defined as
 * `<e-upgrade-wizard-component>`
 *
 * Imperatively create component
 * @example
 * let component = new UpgradeWizardComponent();
 *
 * Declaratively create component
 * @example
 * <e-upgrade-wizard-component></e-upgrade-wizard-component>
 *
 * @extends {LitComponent}
 */
@definition("e-upgrade-wizard-component", {
  style,
  props: {
    resourceId: { attribute: false, type: "string", default: "" },
    selectedPackage: { attribute: false, type: "object", default: {} },
    infrastructure: { attribute: false, type: "object", default: {} },
    vnfdData: { attribute: false, type: "array", default: [] },
    generalAttributes: {
      attribute: false,
      type: "object",
      default: {
        applicationTimeOut: "3600",
        disableOpenapiValidation: true,
        skipJobVerification: false,
        skipMergingPreviousValues: false,
        persistScaleInfo: true,
        persistDMConfig: false,
        helmClientVersion: "3.8",
        deployableModulesData: []
      }
    },
    additionalAttributes: { attribute: false, type: "object", default: {} },
    additionalAttributesComponents: { attribute: false, type: "array", default: [] },
    additionalAttributesInputMethod: {
      attribute: false,
      type: "array",
      default: [INPUT_METHOD_EDIT]
    },
    resourceUpgradeStarted: { attribute: false, type: "boolean" },
    lcmOperation: { attribute: false, type: "string", default: LCM_OPERATION_UPGRADE },
    fileUploaded: { attribute: false, type: "object", default: {} },
    isValidPermission: { attribute: false, type: "boolean" },
    currentInstantiationLevelId: { attribute: false, type: "string", default: "" },
    showErrorDialog: { attribute: false, type: "boolean", default: false },
    selectedStepId: { attribute: false, type: "string", default: "packageSelection" }
  }
})
export default class UpgradeWizardComponent extends LitComponent {
  constructor() {
    super();
    this.addEventListener(DIALOG_BUTTON_CLICK_EVENT, event => this.handleEvent(event));
    this.softwarePackages = {};
    this.resource = {};
    this.observerWizard = null;

    this.watchForWizard = this.watchForWizard.bind(this);
    this._fetchResource = this._fetchResource.bind(this);
    this._postChangeResource = this._postChangeResource.bind(this);
  }

  componentDidConnect() {
    this._fetchResource(this.resourceId);
    this.nextTick(this.watchForWizard);
  }

  componentWillDisconnect() {
    this.observerWizard.disconnect();
  }

  /**
   * Fetch resource
   *
   * @returns {Promise<void>}
   */
  async _fetchResource(resourceId) {
    try {
      const response = await fetchResource({ resourceId });

      this.resource = new Resource(response);
      this.infrastructure.cluster = this.resource.clusterName;
      this.infrastructure.namespace = this.resource.namespace;
      this.generalAttributes.instanceName = this.resource.vnfInstanceName;
      this.generalAttributes.description = this.resource.vnfInstanceDescription;
      this.currentInstantiationLevelId = this.resource.instantiationLevel;
    } catch (error) {
      console.error("Error when fetching resource: ", error);
    }
  }

  /**
   * Post change resource request
   *
   * @returns {Promise<void>}
   */
  async _postChangeResource(payload) {
    try {
      const response = await postChangeResource(payload);

      if (response.status === 202) {
        this.resourceUpgradeStarted = true;
      }
    } catch (error) {
      console.error("Error when clean up resource: ", error);
      setWizardFinishButtonEnabled(true, LCM_OPERATION_UPGRADE);
      this.errorData = getErrorMessage(error.response);
      this.showErrorDialog = true;
    }
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
   * Watcher for `eui-layout-v0-wizard` that update selectedStepId with active wizard step
   *
   * @returns {void}
   */
  watchForWizard() {
    const targetNode = this.shadowRoot.querySelector("eui-layout-v0-wizard");
    const config = { attributes: true, subtree: true };

    const callback = mutationList => {
      mutationList.forEach(mutation => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "selected" &&
          this.selectedStepId !== mutation.target.id
        ) {
          this.selectedStepId = mutation.target.id;
        }
      });
    };

    /* global MutationObserver */
    this.observerWizard = new MutationObserver(callback);
    this.observerWizard.observe(targetNode, config);
  }

  _checkIsInputMethodOfType(inputMethodType) {
    return checkIsInputMethodOfType(this.additionalAttributesInputMethod, inputMethodType);
  }

  _sendUpgradeRequest() {
    const changeCurrentVnfPkgRequest = {};
    const {
      applicationTimeOut = 3600,
      skipJobVerification = false,
      persistScaleInfo = true,
      cleanUpResources = false,
      disableOpenapiValidation = true,
      helmNoHooks = false,
      skipMergingPreviousValues = false,
      manoControlledScaling = false,
      skipVerification = false,
      persistDMConfig = false,
      helmClientVersion,
      extensions
    } = this.generalAttributes;

    this.showErrorDialog = false;

    changeCurrentVnfPkgRequest.vnfdId = this.selectedPackage.appDescriptorId;
    changeCurrentVnfPkgRequest.additionalParams = {};

    if (!isEmptyString(applicationTimeOut)) {
      changeCurrentVnfPkgRequest.additionalParams.applicationTimeOut = applicationTimeOut;
    }

    // TODO need to redo this section
    changeCurrentVnfPkgRequest.additionalParams.disableOpenapiValidation = disableOpenapiValidation;
    changeCurrentVnfPkgRequest.additionalParams.skipJobVerification = skipJobVerification;
    changeCurrentVnfPkgRequest.additionalParams.persistScaleInfo = persistScaleInfo;
    changeCurrentVnfPkgRequest.additionalParams.cleanUpResources = cleanUpResources;
    changeCurrentVnfPkgRequest.additionalParams.helmNoHooks = helmNoHooks;
    changeCurrentVnfPkgRequest.additionalParams.skipMergingPreviousValues = skipMergingPreviousValues;
    changeCurrentVnfPkgRequest.additionalParams.manoControlledScaling = manoControlledScaling;
    changeCurrentVnfPkgRequest.additionalParams.skipVerification = skipVerification;
    changeCurrentVnfPkgRequest.additionalParams.persistDMConfig = persistDMConfig;
    changeCurrentVnfPkgRequest.additionalParams.helm_client_version = isEmptyString(
      helmClientVersion
    )
      ? "3.8"
      : helmClientVersion;

    changeCurrentVnfPkgRequest.extensions = extensions;

    let data = {};
    let headers = {};

    if (this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)) {
      changeCurrentVnfPkgRequest.additionalParams = removeEmptyOrNullParams(
        changeCurrentVnfPkgRequest.additionalParams,
        this.additionalAttributes
      );
      headers = CONTENT_TYPE_JSON_HEADER;
      data = changeCurrentVnfPkgRequest;
    } else if (this.fileUploaded && this.fileUploaded.name) {
      data = new FormData();
      data.append("valuesFile", this.fileUploaded);
      headers = CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER;
      if (this._checkIsInputMethodOfType(INPUT_METHOD_ALL)) {
        changeCurrentVnfPkgRequest.additionalParams = removeEmptyOrNullParams(
          changeCurrentVnfPkgRequest.additionalParams,
          this.additionalAttributes
        );
      }
      data.append("changeCurrentVnfPkgRequest", JSON.stringify(changeCurrentVnfPkgRequest));
    }

    const payload = {
      resourceId: this.resource.instanceId,
      data,
      headers
    };

    this._postChangeResource(payload);
  }

  handleEvent(event) {
    switch (event.type) {
      case UPDATE_SELECTED_PACKAGE_DATA_EVENT:
        if (!Object.prototype.hasOwnProperty.call(event.detail, "appCompositeName")) {
          this.selectedPackage = {};
        } else {
          this.selectedPackage = { ...this.selectedPackage, ...event.detail };
        }
        this.additionalAttributesInputMethod = [INPUT_METHOD_EDIT];
        this.additionalAttributesComponents = [];
        this.additionalAttributes = {};
        break;
      case UPDATE_INFRASTRUCTURE_DATA_EVENT:
        this.infrastructure = { ...this.infrastructure, ...event.detail };
        break;
      case UPDATE_VNFD_DATA:
        this.vnfdData = event.detail;
        break;
      case UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT:
        this.generalAttributes = { ...this.generalAttributes, ...event.detail };
        removeNullDeployableModules(this.generalAttributes);
        break;
      case UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT:
        this.additionalAttributes = {
          ...removeEmptyOrNullParams(this.additionalAttributes, event.detail)
        };
        break;
      case UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT:
        if (event.detail) {
          this.fileUploaded = event.detail;
        }
        break;
      case UPDATE_ADDITIONAL_ATTRIBUTES_METHOD_EVENT:
        if (event.detail) {
          this.additionalAttributesInputMethod = event.detail;
        }
        break;
      case EUI_WIZARD_CANCEL_EVENT:
        window.history.back();
        break;
      case WIZARD_CHANGE_EVENT:
        removeNavigationOfNextStepsInWizard.call(this);
        break;
      case EUI_WIZARD_FINISH_EVENT:
        if (isWizardFinishButtonEnabled()) {
          setWizardFinishButtonEnabled(false);
          this._sendUpgradeRequest();
        }
        break;
      case WIZARD_VALIDATE_STEP_EVENT: {
        const step = this.shadowRoot.querySelector(
          `eui-layout-v0-wizard-step#${event.detail.stepId}`
        );
        step.valid = event.detail.isValid;
        break;
      }
      case DIALOG_BUTTON_CLICK_EVENT: {
        const selectedButton = event.detail.selected;
        if (selectedButton === SEE_RESOURCE_LIST_BUTTON) {
          window.EUI.Router.goto(`resources`);
        } else if (selectedButton === SEE_OPERATION_LIST_BUTTON) {
          window.EUI.Router.goto(`operations`);
        }
        break;
      }
      default:
        console.log(`Unexpected event [${event.type}] is received.`);
    }
  }

  renderDialog(resourceName) {
    const dialog = new DialogModel(
      UPGRADE_OPERATION_STARTED,
      UPGRADE_MESSAGE.replace("<RESOURCE>", resourceName)
    );

    const buttons = [SEE_RESOURCE_LIST_BUTTON, SEE_OPERATION_LIST_BUTTON];
    dialog.setButtonLabels(buttons);
    dialog.setPrimaryButtonIndex(1);
    return html`
      <e-generic-dialog .dialogModel=${dialog}></e-generic-dialog>
    `;
  }

  _renderUpgradeWizardComponent() {
    return html`
      <eui-layout-v0-wizard
        @eui-wizard:finish=${this}
        @eui-wizard:cancel=${this}
        @update-selected-package-data=${this}
        @update-infrastructure-data=${this}
        @update-general-attributes-data=${this}
        @update-additional-attributes-data=${this}
        @update-additional-attributes-file=${this}
        @update-additional-attributes-method=${this}
        @wizard-change=${this}
        @validate-step=${this}
        @update-vnfd-data=${this}
        maximize
      >
        <eui-layout-v0-wizard-step step-title="Package selection" id="packageSelection">
          <e-wizard-step-package-selection> </e-wizard-step-package-selection>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="Infrastructure" id="infrastructure">
          <e-wizard-step-infrastructure
            .hasExtraUnmodifiableData="${true}"
            .cluster=${this.infrastructure.cluster}
            .namespace=${this.infrastructure.namespace}
            .selectedPackage=${this.selectedPackage}
          >
          </e-wizard-step-infrastructure>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="General attributes" id="generalAttributes">
          <e-wizard-step-general-attributes
            .hasExtraUnmodifiableData="${true}"
            .infrastructure=${this.infrastructure}
            .selectedPackage=${this.selectedPackage}
            .lcmOperation=${this.lcmOperation}
            .instanceName=${this.generalAttributes.instanceName}
            .persistScaleInfo=${this.generalAttributes.persistScaleInfo}
            .currentInstantiationLevelIdWhenUpgrade=${this.currentInstantiationLevelId}
            .description=${this.generalAttributes.description}
            .descriptorVersion=${this.selectedPackage.descriptorVersion}
            .resource=${this.resource}
          >
          </e-wizard-step-general-attributes>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="Additional attributes" id="additionalAttributes">
          <e-wizard-step-additional-attributes
            .data=${this.vnfdData}
            .inputMethod=${this.additionalAttributesInputMethod}
            .additionalAttributesComponents=${this.additionalAttributesComponents}
            .selectedPackage=${this.selectedPackage}
            .selected=${this.selectedStepId === "additionalAttributes"}
            .step=${this.selectedStepId}
            .additionalAttributes=${this.additionalAttributes}
            .isUpgrade=${true}
          >
          </e-wizard-step-additional-attributes>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="Summary" id="summary">
          <e-wizard-step-summary
            .selectedPackage=${this.selectedPackage}
            .infrastructure=${this.infrastructure}
            .generalAttributes=${this.generalAttributes}
            .additionalAttributes=${this.additionalAttributes}
            .inputMethod=${this.additionalAttributesInputMethod}
            .fileUploaded=${this.fileUploaded}
            .lcmOperation=${this.lcmOperation}
          >
          </e-wizard-step-summary>
        </eui-layout-v0-wizard-step>

        ${this.resourceUpgradeStarted ? this.renderDialog(this.generalAttributes.instanceName) : ``}
      </eui-layout-v0-wizard>
    `;
  }

  render() {
    return html`
      ${this.isValidPermission ? this._renderUpgradeWizardComponent() : accessDenied()}
      ${this.showErrorDialog
        ? renderErrorDialog(this.errorData.title, this.errorData.description, () => {
            this.showErrorDialog = false;
          })
        : html``}
    `;
  }
}
/**
 * Register the component as e-upgrade-wizard-component.
 * Registration can be done at a later time and with a different name
 */
UpgradeWizardComponent.register();
