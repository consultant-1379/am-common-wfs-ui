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
 * Component InstantiateWizardComponent is defined as
 * `<e-instantiate-wizard-component>`
 *
 * Imperatively create component
 * @example
 * let component = new InstantiateWizardComponent();
 *
 * Declaratively create component
 * @example
 * <e-instantiate-wizard-component></e-instantiate-wizard-component>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import "@eui/layout";
import { LitComponent, html } from "@eui/lit-component";
import style from "./instantiateWizardComponent.css";
import "../../wizard-step-package-selection/src/WizardStepPackageSelection";
import "../../wizard-step-infrastructure/src/WizardStepInfrastructure";
import "../../wizard-step-general-attributes/src/WizardStepGeneralAttributes";
import "../../wizard-step-additional-attributes/src/WizardStepAdditionalAttributes";
import "../../wizard-step-summary/src/WizardStepSummary";
import "../../generic-dialog/src/GenericDialog";
import {
  executeSimplePostRequest,
  executeSimpleDeleteRequest,
  VNF_IDENTIFIER,
  INSTANTIATE_URL,
  CONTENT_TYPE_JSON_HEADER,
  CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER
} from "../../../utils/RestUtils";
import { DialogModel } from "../../generic-dialog/src/DialogModel";
import {
  removeEmptyOrNullParams,
  isWizardFinishButtonEnabled,
  setWizardFinishButtonEnabled,
  removeNavigationOfNextStepsInWizard,
  accessDenied,
  isEmptyString,
  checkIsInputMethodOfType,
  removeNullDeployableModules
} from "../../../utils/CommonUtils";
import {
  INSTANTIATE_OPERATION_STARTED,
  INSTANTIATE_MESSAGE,
  SEE_RESOURCE_LIST_BUTTON,
  SEE_OPERATION_LIST_BUTTON
} from "../../../constants/Messages";
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
  LCM_OPERATION_INSTANTIATE,
  INPUT_METHOD_EDIT,
  INPUT_METHOD_ALL
} from "../../../constants/GenericConstants";

@definition("e-instantiate-wizard-component", {
  style,
  props: {
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
        skipVerification: false,
        helmNoHooks: false,
        cleanUpResources: true,
        manoControlledScaling: false,
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
    resourceInstantiationStarted: { attribute: false, type: "boolean" },
    lcmOperation: { attribute: false, type: "string", default: LCM_OPERATION_INSTANTIATE },
    fileUploaded: { attribute: false, type: "object", default: {} },
    isValidPermission: { attribute: false, type: "boolean" },
    selectedStepId: { attribute: false, type: "string", default: "packageSelection" }
  }
})
export default class InstantiateWizardComponent extends LitComponent {
  constructor() {
    super();

    this.addEventListener(DIALOG_BUTTON_CLICK_EVENT, event => this.handleEvent(event));
    this.watchForWizard = this.watchForWizard.bind(this);
    this.observerWizard = null;
  }

  _checkIsInputMethodOfType(inputMethodType) {
    return checkIsInputMethodOfType(this.additionalAttributesInputMethod, inputMethodType);
  }

  _sendInstantiateRequest() {
    const body = {
      vnfdId: this.selectedPackage.appDescriptorId,
      vnfInstanceName: this.generalAttributes.instanceName,
      vnfInstanceDescription: this.generalAttributes.description
    };
    executeSimplePostRequest(
      VNF_IDENTIFIER,
      body,
      CONTENT_TYPE_JSON_HEADER,
      this._createIdentifierSuccessCallback,
      this._errorCallback
    );
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

  componentWillDisconnect() {
    this.observerWizard.disconnect();
  }

  componentDidConnect() {
    this.nextTick(this.watchForWizard);
  }

  _createIdentifierSuccessCallback = response => {
    const instantiateVnfRequest = {};
    instantiateVnfRequest.clusterName = this.infrastructure.cluster;
    instantiateVnfRequest.additionalParams = {};
    instantiateVnfRequest.additionalParams.namespace = this.infrastructure.namespace;
    const {
      instanceName,
      applicationTimeOut,
      disableOpenapiValidation,
      skipJobVerification,
      skipVerification,
      helmNoHooks,
      cleanUpResources,
      manoControlledScaling,
      extensions,
      instantiationLevelId,
      targetScaleLevelInfo,
      helmClientVersion
    } = this.generalAttributes;
    instantiateVnfRequest.extensions = extensions;
    instantiateVnfRequest.additionalParams.releaseName = instanceName;
    if (!isEmptyString(applicationTimeOut)) {
      instantiateVnfRequest.additionalParams.applicationTimeOut = applicationTimeOut;
    }

    // should be skipped if targetScaleLevelInfo is specified
    if (!isEmptyString(instantiationLevelId)) {
      instantiateVnfRequest.instantiationLevelId = instantiationLevelId;
    }

    if (targetScaleLevelInfo && targetScaleLevelInfo.length) {
      instantiateVnfRequest.targetScaleLevelInfo = targetScaleLevelInfo.filter(
        aspect => aspect.scaleLevel !== null
      );
    }

    instantiateVnfRequest.additionalParams.disableOpenapiValidation = disableOpenapiValidation;
    instantiateVnfRequest.additionalParams.skipJobVerification = skipJobVerification;
    instantiateVnfRequest.additionalParams.skipVerification = skipVerification;
    instantiateVnfRequest.additionalParams.helmNoHooks = helmNoHooks;
    instantiateVnfRequest.additionalParams.cleanUpResources = cleanUpResources;
    instantiateVnfRequest.additionalParams.manoControlledScaling = manoControlledScaling;
    instantiateVnfRequest.additionalParams.helm_client_version = isEmptyString(helmClientVersion)
      ? "3.8"
      : helmClientVersion;

    let data = {};
    let headers = {};
    if (this._checkIsInputMethodOfType(INPUT_METHOD_EDIT)) {
      this._setAdditionalAttributes(instantiateVnfRequest);
      headers = CONTENT_TYPE_JSON_HEADER;
      data = instantiateVnfRequest;
    } else if (this.fileUploaded && this.fileUploaded.name) {
      data = new FormData();
      data.append("valuesFile", this.fileUploaded);
      headers = CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER;
      if (this._checkIsInputMethodOfType(INPUT_METHOD_ALL)) {
        this._setAdditionalAttributes(instantiateVnfRequest);
      }
      data.append("instantiateVnfRequest", JSON.stringify(instantiateVnfRequest));
    }

    this.vnfIdentifier = response.data.id;
    executeSimplePostRequest(
      INSTANTIATE_URL.replace(":vnfInstanceId", this.vnfIdentifier),
      data,
      headers,
      this._instantiateSuccessCallback,
      this._instantiateErrorCallback
    );
  };

  _setAdditionalAttributes(instantiateVnfRequest) {
    instantiateVnfRequest.flavourId = this.additionalAttributes.flavourId;
    instantiateVnfRequest.localizationLanguage = this.additionalAttributes.localizationLanguage;
    instantiateVnfRequest.additionalParams = removeEmptyOrNullParams(
      instantiateVnfRequest.additionalParams,
      this.additionalAttributes
    );
  }

  _errorCallback = () => {
    setWizardFinishButtonEnabled(true, LCM_OPERATION_INSTANTIATE);
  };

  _instantiateSuccessCallback = response => {
    if (response.status === 202) {
      this.resourceInstantiationStarted = true;
    }
  };

  _instantiateErrorCallback = () => {
    executeSimpleDeleteRequest(
      `${VNF_IDENTIFIER}/${this.vnfIdentifier}`,
      { "content-type": "application/json" },
      this._deleteIdentifierSuccessCallback,
      this._deleteIdentifierErrorCallback
    );
    setWizardFinishButtonEnabled(true, LCM_OPERATION_INSTANTIATE);
  };

  _deleteIdentifierSuccessCallback = () => {};

  _deleteIdentifierErrorCallback = () => {
    setWizardFinishButtonEnabled(true, LCM_OPERATION_INSTANTIATE);
  };

  handleEvent(event) {
    switch (event.type) {
      case UPDATE_SELECTED_PACKAGE_DATA_EVENT:
        if (!Object.prototype.hasOwnProperty.call(event.detail, "appCompositeName")) {
          this.selectedPackage = {};
        } else {
          this.selectedPackage = event.detail;
        }
        this.additionalAttributesInputMethod = [INPUT_METHOD_EDIT];
        this.additionalAttributesComponents = [];
        this.additionalAttributes = {};
        break;
      case UPDATE_INFRASTRUCTURE_DATA_EVENT:
        this.infrastructure = { ...this.infrastructure, ...event.detail };
        break;
      case UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT:
        this.generalAttributes = {
          ...removeEmptyOrNullParams(this.generalAttributes, event.detail)
        };
        removeNullDeployableModules(this.generalAttributes);
        break;
      case UPDATE_VNFD_DATA:
        this.vnfdData = event.detail;
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
          this._sendInstantiateRequest();
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
      INSTANTIATE_OPERATION_STARTED,
      INSTANTIATE_MESSAGE.replace("<RESOURCE>", resourceName)
    );

    const buttons = [SEE_RESOURCE_LIST_BUTTON, SEE_OPERATION_LIST_BUTTON];
    dialog.setButtonLabels(buttons);
    dialog.setPrimaryButtonIndex(1);
    return html`
      <e-generic-dialog .dialogModel=${dialog}></e-generic-dialog>
    `;
  }

  _renderInstantiateWizardComponent() {
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
          <e-wizard-step-package-selection
            .lcmOperation=${this.lcmOperation}
            .selected=${this.selectedStepId === "packageSelection"}
          >
          </e-wizard-step-package-selection>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="Infrastructure" id="infrastructure">
          <e-wizard-step-infrastructure
            .lcmOperation=${this.lcmOperation}
            .selectedPackage=${this.selectedPackage}
            .additionalAttributes=${this.additionalAttributes}
            .selected=${this.selectedStepId === "infrastructure"}
          >
          </e-wizard-step-infrastructure>
        </eui-layout-v0-wizard-step>

        <eui-layout-v0-wizard-step step-title="General attributes" id="generalAttributes">
          <e-wizard-step-general-attributes
            .selectedPackage=${this.selectedPackage}
            .lcmOperation=${this.lcmOperation}
            .infrastructure=${this.infrastructure}
            .descriptorVersion=${this.selectedPackage.descriptorVersion}
            .selected=${this.selectedStepId === "generalAttributes"}
            .resource=${{}}
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
            .isUpgrade=${false}
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
            .selected=${this.selectedStepId === "summary"}
          >
          </e-wizard-step-summary>
        </eui-layout-v0-wizard-step>
        ${this.resourceInstantiationStarted
          ? this.renderDialog(this.generalAttributes.instanceName)
          : ``}
      </eui-layout-v0-wizard>
    `;
  }

  render() {
    return html`
      ${this.isValidPermission ? this._renderInstantiateWizardComponent() : accessDenied()}
    `;
  }
}
InstantiateWizardComponent.register();
