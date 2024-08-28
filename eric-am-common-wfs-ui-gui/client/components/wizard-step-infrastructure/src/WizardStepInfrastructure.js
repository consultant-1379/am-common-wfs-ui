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

// components
import "../../generic-key-value-list/src/GenericKeyValueList";
import "../../generic-combo-box/src/GenericComboBox";
import "../../generic-inline-description/src/GenericInlineDescription";
import "../../validation-checker/src/ValidationChecker";

// style
import style from "./wizardStepInfrastructure.css";

// services
import { logger } from "../../../utils/logger.service";

// helpers
import { fetchClusters, fetchValidationForClusterAndNamespace } from "../../../api/orchestrator";
import {
  CLUSTER_DESCRIPTION_INSTANTIATE,
  NAMESPACE_DESCRIPTION_INSTANTIATE,
  CLUSTER_DESCRIPTION_UPGRADE,
  NAMESPACE_DESCRIPTION_UPGRADE
} from "../../../constants/Messages";
import {
  UPDATE_INFRASTRUCTURE_DATA_EVENT,
  WIZARD_VALIDATE_STEP_EVENT,
  WIZARD_CHANGE_EVENT
} from "../../../constants/Events";
import { NAMESPACE_VALIDATION_POLICY } from "../../../constants/ValidationPolicies";
import { LCM_OPERATION_INSTANTIATE } from "../../../constants/GenericConstants";

/**
 * Component WizardStepInfrastructure is defined as
 * `<e-wizard-step-infrastructure>`
 *
 * Imperatively create component
 * @example
 * let component = new WizardStepInfrastructure();
 *
 * Declaratively create component
 * @example
 * <e-wizard-step-infrastructure></e-wizard-step-infrastructure>
 *
 * @extends {LitComponent}
 */
@definition("e-wizard-step-infrastructure", {
  style,
  props: {
    hasExtraUnmodifiableData: { attribute: false, type: "boolean", default: false },
    clusterNamesList: { attribute: false, type: "array", default: [] },
    cluster: { attribute: false, type: "string", default: "" },
    namespace: { attribute: false, type: "string", default: "" },
    validNamespace: { attribute: false, type: "boolean", default: false },
    selectedPackage: { attribute: false, type: "object", default: {} },
    additionalAttributes: { attribute: false, type: "object", default: {} },
    selected: { attribute: true, type: "boolean", default: false },
    lcmOperation: { attribute: false, type: "string", default: "" }
  }
})
export default class WizardStepInfrastructure extends LitComponent {
  constructor() {
    super();

    this.isClusterSelected = false;

    this._clusterHandle = this._clusterHandle.bind(this);
    this._toggleChecker = this._toggleChecker.bind(this);
    this._fetchClusters = this._fetchClusters.bind(this);
    this._fetchValidationForClusterAndNamespace = this._fetchValidationForClusterAndNamespace.bind(
      this
    );
  }

  componentDidConnect() {
    this._createMapForPackageSelectionData();
    this._fetchClusters();

    this.bubble(WIZARD_VALIDATE_STEP_EVENT, {
      stepId: "infrastructure",
      isValid: this._isStepValid()
    });
  }

  componentDidRender() {
    if (this.hasExtraUnmodifiableData) {
      this.bubble("validate-step", { stepId: "infrastructure", isValid: true });
    }
  }

  componentDidReceiveProps(e) {
    if (this.getIsInstantiate) {
      this._initNamespaceField(e);
    }

    if (e.selected === false && this.selected === true) {
      this._isStepValid();
    }
  }

  /**
   * Getters for lcm operation instantiate
   *
   * @returns {boolean}
   */
  get getIsInstantiate() {
    return LCM_OPERATION_INSTANTIATE === this.lcmOperation;
  }

  /**
   * Getters for cluster names
   *
   * @returns {object}
   */
  get clusterNamesListParsed() {
    return this.clusterNamesList.map(cluster => {
      const [clusterName] = String(cluster.name).split(".");

      return {
        label: clusterName,
        value: clusterName
      };
    });
  }

  /**
   * Getters for default cluster name
   *
   * @returns {string}
   */
  get clusterNameDefault() {
    const cluster = this.clusterNamesList.find(item => item.isDefault) || {};
    const [clusterName] = String(cluster.name || "").split(".");

    return clusterName;
  }

  /**
   * Fetch clusters
   *
   * @returns {Promise<void>}
   */
  async _fetchClusters() {
    try {
      const { items = [] } = await fetchClusters({ getAllConfigs: true });

      this.clusterNamesList = items;
    } catch (error) {
      console.error("Error when updating cluster config: ", error);
    }
  }

  /**
   * Fetch clusters
   *
   * @returns {Promise<void>}
   */
  async _fetchValidationForClusterAndNamespace(payload) {
    try {
      await fetchValidationForClusterAndNamespace(payload);

      this.isClusterSelected = true;
      this._isStepValid();
    } catch (error) {
      const { data } = error.response || {};
      const { detail = "" } = data || {};

      this.isClusterSelected = false;
      this._isStepValid(detail);

      console.error("Error when updating cluster config: ", error);
    }
  }

  _createMapForPackageSelectionData() {
    const keyValueMap = {};

    keyValueMap["Package name"] = this.selectedPackage.appCompositeName;
    keyValueMap.Type = this.selectedPackage.appProductName;
    keyValueMap.Provider = this.selectedPackage.appProvider;
    keyValueMap["Package version"] = this.selectedPackage.descriptorVersion;
    keyValueMap["Software version"] = this.selectedPackage.appSoftwareVersion;
    keyValueMap.Description = this.selectedPackage.description;

    return keyValueMap;
  }

  _createMapForUpgradeInfrastructure() {
    const keyValueMap = {};

    keyValueMap.Cluster = this.cluster;
    keyValueMap.Namespace = this.namespace;

    return keyValueMap;
  }

  _createDescriptionMapForUpgradeInfrastructure() {
    const infrastructureDescriptionMap = {};

    infrastructureDescriptionMap.Cluster = CLUSTER_DESCRIPTION_UPGRADE;
    infrastructureDescriptionMap.Namespace = NAMESPACE_DESCRIPTION_UPGRADE;

    return infrastructureDescriptionMap;
  }

  /**
   * Event handler for last initial step in `e-generic-combo-box`
   *
   * @param {Event} event: event which include link to `e-generic-combo-box` element
   * @returns {void}
   */
  _clusterHandle(event) {
    this._setCluster(event.detail);
  }

  handleEvent(event) {
    switch (event.target.id) {
      case "cluster-name":
        this._setCluster(event.target);
        this._validateClusterAndNamespace();
        this._isStepValid();
        break;
      case "namespace-name":
        this.namespace = event.target.value;
        this._validateClusterAndNamespace(event);
        break;
      default:
        console.log(`Unexpected event target [${event.target}] received.`);
    }
    this.bubble(WIZARD_CHANGE_EVENT, null);
  }

  _setCluster(target) {
    const selectedCluster = target.getValue();
    const { length: countClusters } = this.clusterNamesListParsed;

    if (selectedCluster && countClusters) {
      this.isClusterSelected = true;
      this.cluster = selectedCluster[target.attribute];
    } else {
      this.isClusterSelected = false;
    }
  }

  _validateClusterAndNamespace(event) {
    if (event) {
      this._setChecker(event);
      this.isClusterSelected = this.namespace === "" && this.cluster;
      this._isStepValid();
    }

    if (this.namespace && this.cluster) {
      const payload = { clusterNameAndNamespace: `${this.cluster}/${this.namespace}` };

      this._fetchValidationForClusterAndNamespace(payload);
    }
  }

  _setChecker(event) {
    const inputId = event.currentTarget.id;
    const selectedElement = `e-validation-checker.${inputId}-validation`;

    this.checker = this.shadowRoot.querySelector(selectedElement);
  }

  /**
   * Toggle styles for namespace validator
   *
   * @returns {void}
   */
  _toggleChecker() {
    if (this.shadowRoot) {
      const checkerEl = this.shadowRoot.querySelector(".namespace-name-validation");

      checkerEl.style.display = this.namespace ? "block" : "none";
    }
  }

  _isStepValid(errorMessage) {
    const clusterMatch = {
      isClusterValid: this.isClusterSelected,
      message: errorMessage
    };

    this.validNamespace = this.namespace
      ? this.checker.validate(this.namespace, clusterMatch)
      : true;

    this._toggleChecker(this.validNamespace);
    if (this.validNamespace && this.isClusterSelected) {
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "infrastructure", isValid: true });
      this.bubble(UPDATE_INFRASTRUCTURE_DATA_EVENT, {
        cluster: this.cluster,
        namespace: this.namespace
      });
    } else {
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "infrastructure", isValid: false });
    }
  }

  _createDropDown() {
    return html`
      <e-generic-combo-box
        data-type="single"
        id="cluster-name"
        width="11rem"
        class="select"
        .data=${this.clusterNamesListParsed}
        .defaultValue=${this.clusterNameDefault}
        attribute="clusterName"
        @click=${this}
        @input=${this}
        @combobox:rendered=${this._clusterHandle}
      ></e-generic-combo-box>
    `;
  }

  _renderInfrastructureInstantiate() {
    return html`
      <div class="infrastructureFieldHolder">
        <div class="fieldHeader">Cluster *</div>
        <e-generic-inline-description
          class="description"
          id="cluster-description"
          .text=${CLUSTER_DESCRIPTION_INSTANTIATE}
        >
        </e-generic-inline-description>
        <div class="fieldValue">
          <div class="table">
            <div class="tr">
              <div class="td">
                <div class="dropdown">
                  ${this._createDropDown()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="infrastructureFieldHolder">
        <div class="fieldHeader">Namespace</div>
        <e-generic-inline-description
          class="description"
          id="namespace-description"
          .text=${NAMESPACE_DESCRIPTION_INSTANTIATE}
        >
        </e-generic-inline-description>
        <div class="fieldValue">
          <div class="table">
            <div class="tr">
              <div class="td">
                <div class="textField">
                  <eui-base-v0-text-field
                    fullwidth=${true}
                    id="namespace-name"
                    placeholder="Namespace"
                    @input=${this}
                    value=${this.namespace}
                  >
                  </eui-base-v0-text-field>
                </div>
              </div>
              <div class="td">
                <e-validation-checker
                  class="checker namespace-name-validation"
                  .validationPolicies=${NAMESPACE_VALIDATION_POLICY}
                ></e-validation-checker>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _initNamespaceField(oldValue) {
    const { selectedPackage = {} } = oldValue || {};

    if (selectedPackage.appPkgId !== this.selectedPackage.appPkgId) {
      this.namespace = this.selectedPackage.defaultNamespace || "";
    }

    if (selectedPackage.defaultNamespace !== this.selectedPackage.defaultNamespace) {
      this.namespace = "";

      if (
        this.selectedPackage.defaultNamespace &&
        this.selectedPackage.defaultNamespace !== this.namespace
      ) {
        this.namespace = this.selectedPackage.defaultNamespace || "";
        this._validateClusterAndNamespace({ currentTarget: { id: "namespace-name" } });
      }
    }

    logger.log("_initNamespaceField - namespace:", this.namespace);
  }

  render() {
    return html`
      <div class="infrastructure-content">
        <div class="package-column">
          <div class="package-panel">
            <div class="heading">Package</div>
            <e-generic-key-value-list
              .keyValueMap=${this._createMapForPackageSelectionData()}
              vertical
            ></e-generic-key-value-list>
          </div>
        </div>
        <div class="infrastructure-column">
          <div class="infrastructure-panel">
            <div class="heading">Infrastructure</div>
            ${this.hasExtraUnmodifiableData
              ? html`
                  <div class="infrastructure-read-only-fields">
                    <e-generic-key-value-list
                      .keyValueMap=${this._createMapForUpgradeInfrastructure()}
                      vertical
                      .descriptionMap=${this._createDescriptionMapForUpgradeInfrastructure()}
                      .hasDescription="${true}"
                      }
                    ></e-generic-key-value-list>
                  </div>
                `
              : this._renderInfrastructureInstantiate()}
          </div>
        </div>
      </div>
    `;
  }
}

WizardStepInfrastructure.register();
