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

// common
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

// components
import "../../generic-multi-panel/src/GenericMultiPanel";

// styles
import style from "./wizardStepPackageSelection.css";

// helpers
import { getQueryParam, stripQueryParam } from "../../../utils/RestUtils";
import { PACKAGES_COLUMNS, formatBackendPackageData } from "../../../utils/CommonUtils";
import { ONBOARDED_PACKAGES } from "../../../constants/Messages";
import { FILTERING_EVENT, buildPackagesQueryParameterJson } from "../../../utils/FilterUtils";
import {
  UPDATE_SELECTED_PACKAGE_DATA_EVENT,
  WIZARD_VALIDATE_STEP_EVENT,
  WIZARD_CHANGE_EVENT
} from "../../../constants/Events";
import {
  PACKAGE_PARAM_NAME,
  PACKAGES_BASE_QUERY,
  LCM_OPERATION_UPGRADE,
  LCM_OPERATION_INSTANTIATE
} from "../../../constants/GenericConstants";
import { ENABLED } from "../../../constants/States";
import { fetchPackages } from "../../../api/onboarding";

/**
 * Component WizardStepPackageSelection is defined as
 * `<e-wizard-step-package-selection>`
 *
 * @property {object} data - data from the API call for the Packages table.
 * Imperatively create component
 * @example
 * let component = new WizardStepPackageSelection();
 *
 * Declaratively create component
 * @example
 * <e-wizard-step-package-selection></e-wizard-step-package-selection>
 *
 * @extends {LitComponent}
 */
@definition("e-wizard-step-package-selection", {
  style,
  props: {
    data: { attributes: false, type: "object", default: {} },
    lcmOperation: { attribute: false, type: "string", default: LCM_OPERATION_INSTANTIATE }
  }
})
export default class WizardStepPackageSelection extends LitComponent {
  constructor() {
    super();

    this.addEventListener(FILTERING_EVENT, event => this.handleFilteringEvent(event));
    this.defaultPackagesQueryParameterAsJson = buildPackagesQueryParameterJson(
      {},
      PACKAGES_BASE_QUERY
    );
    this.packagesQueryParameterAsJson = this.defaultPackagesQueryParameterAsJson;

    this._fetchPackages = this._fetchPackages.bind(this);
  }

  componentDidConnect() {
    this._setPackageId();
    this._fetchPackages();
    this.bubble("validate-step", { stepId: "packageSelection", isValid: false });
  }

  get isLcmOperationUpgrade() {
    return this.lcmOperation === LCM_OPERATION_UPGRADE;
  }

  /**
   * Fetch packages
   *
   * @returns {Promise<void>}
   */
  async _fetchPackages() {
    try {
      const response = await fetchPackages(this.packagesQueryParameterAsJson);
      const packages = formatBackendPackageData(response.packages) || [];

      this.data = packages.filter(filterPackagesByOperationalState);

      if (this.packageId !== "") {
        this._sendSelectedPackageInfo();
      }

      if (!this.isLcmOperationUpgrade) {
        this.data = this.data.filter(filterPackagesWithErrorInOperation, this);
      }
    } catch (error) {
      this.data = error;
      console.error("Error when fetching packages: ", error);
    }
  }

  _setPackageId() {
    const url = window.location.href;

    if (url.includes(PACKAGE_PARAM_NAME)) {
      this.packageId = getQueryParam(url, PACKAGE_PARAM_NAME).parameterValue;
    }
  }

  _sendSelectedPackageInfo() {
    this.data.forEach(item => {
      if (this.packageId === item.appPkgId) {
        item.selected = true;
        this.bubble("validate-step", { stepId: "packageSelection", isValid: true });
        this.bubble(UPDATE_SELECTED_PACKAGE_DATA_EVENT, item);
      }
    });
  }

  handleFilteringEvent(event) {
    const selectedFilters = event.detail;

    this.packagesQueryParameterAsJson = buildPackagesQueryParameterJson(
      selectedFilters,
      PACKAGES_BASE_QUERY
    );
    this._fetchPackages();
  }

  handleEvent(event) {
    this.bubble(UPDATE_SELECTED_PACKAGE_DATA_EVENT, event.detail[0]);
    let url = window.location.href;
    if (event.detail.length > 0 && Object.keys(event.detail[0]).length) {
      const selectedPackageIdParam = `${PACKAGE_PARAM_NAME}=${event.detail[0].appPkgId}`;
      if (url.includes(PACKAGE_PARAM_NAME)) {
        const currentPackageIdParam = getQueryParam(url, PACKAGE_PARAM_NAME).parameter;
        url = url.replace(currentPackageIdParam, selectedPackageIdParam);
      } else {
        url = `${url}${url.includes("?") ? "&" : "?"}${selectedPackageIdParam}`;
      }
      window.history.replaceState({}, document.title, url);
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "packageSelection", isValid: true });
    } else {
      url = stripQueryParam(url, PACKAGE_PARAM_NAME);
      window.history.replaceState({}, document.title, url);
      this.bubble(WIZARD_VALIDATE_STEP_EVENT, { stepId: "packageSelection", isValid: false });
    }
    this.bubble(WIZARD_CHANGE_EVENT, null);
  }

  render() {
    return html`
      <e-generic-multi-panel
        @row-selected="${this}"
        .data=${this.data}
        .pageName=${ONBOARDED_PACKAGES}
        .columns=${PACKAGES_COLUMNS}
      ></e-generic-multi-panel>
    `;
  }
}

/**
 * Register the component as e-wizard-step-package-selection.
 * Registration can be done at a later time and with a different name
 */
WizardStepPackageSelection.register();

/**
 * Filter packages with unsupported instantiate operation
 *
 * @param {object} item: package with basic data
 * @returns {boolean}
 */
function filterPackagesWithErrorInOperation(item) {
  const { supportedOperations = [] } = item;

  if (supportedOperations.length === 0) {
    return true;
  }

  return supportedOperations.some(
    operation =>
      operation.operationName === "instantiate" && operation.supported && operation.error === null
  );
}

/**
 * Filter packages with operational state `DISABLED`
 *
 * @param {object} item: package with basic data
 * @returns {array}
 */
function filterPackagesByOperationalState(item) {
  const { operationalState = ENABLED } = item;

  return operationalState === ENABLED;
}
