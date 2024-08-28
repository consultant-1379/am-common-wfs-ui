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
import { App, html } from "@eui/app";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";

// components
import "../../../components/generic-multi-panel/src/GenericMultiPanel";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";
import "../../../components/generic-dialog/src/GenericDialog";
import "../../../components/file-upload-dialog/src/FileUploadDialog";

// styles
import style from "./packages.css";

// helpers
import { DialogModel } from "../../../components/generic-dialog/src/DialogModel";
import { FILTERING_EVENT, buildPackagesQueryParameterJson } from "../../../utils/FilterUtils";
import { DELETE_PACKAGE_EVENT, DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";
import {
  PACKAGES_ETSI_URL,
  CONTENT_TYPE_OCTET_STREAM_HEADER,
  executePutRequest,
  getCancelToken,
  isCancel
} from "../../../utils/RestUtils";
import {
  PACKAGES_PAGE_COLUMNS,
  formatBackendPackageData,
  accessDenied,
  checkPermission,
  checkPermissions,
  showNotification,
  showOnboardingErrorNotification,
  SYNC_INTERVAL
} from "../../../utils/CommonUtils";
import {
  PACKAGES_PAGE,
  ONBOARD_PACKAGE_BUTTON,
  CANCEL_PACKAGE_ONBOARD,
  FAILED_PACKAGE_ONBOARD,
  COMPLETED_PACKAGE_ONBOARD,
  COMPLETED_PACKAGE_ONBOARD_MESSAGE,
  COMPLETED_DELETE_PACKAGE,
  COMPLETED_DELETE_PACKAGE_MESSAGE,
  CANCEL_BUTTON,
  TERMINATION_PACKAGE_MESSAGE,
  DELETE_PACKAGE_BUTTON,
  GENERIC_ERROR_MESSAGE,
  ONBOARDING_SERVICE_UNAVAILABLE
} from "../../../constants/Messages";
import {
  PACKAGES_RESOURCE_NAME,
  PACKAGES_ONBOARDING_RESOURCE_NAME
} from "../../../constants/GenericConstants";
import {
  fetchPackages,
  fetchPackageInfo,
  deletePackage,
  postPackage
} from "../../../api/onboarding";

/**
 * Packages is defined as
 * `<e-packages>`
 *
 * Imperatively create application
 * @example
 * let app = new Packages();
 *
 * Declaratively create application
 * @example
 * <e-packages></e-packages>
 *
 * @extends {App}
 */
@definition("e-packages", {
  style,
  props: {
    response: { attribute: false },
    data: { attributes: false, type: "array", default: [] },
    pageName: { attribute: false, type: "string", default: PACKAGES_PAGE },
    showFileUploadDialog: { attribute: false, type: "boolean", default: false },
    showPackageDeleteDialog: { attribute: false, type: "boolean", default: false },
    percentage: { attribute: false, type: "string", default: "0" },
    packageIds: { attributes: false, type: "array", default: [] }
  }
})
export default class Packages extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.addEventListener(FILTERING_EVENT, event => this.handleFilteringEvent(event));
    this.defaultPackagesQueryParameterAsJson = buildPackagesQueryParameterJson({});
    this.checkPermissions = checkPermissions.bind(this);

    this._fetchPackages = this._fetchPackages.bind(this);
    this._fetchPackageInfo = this._fetchPackageInfo.bind(this);
    this._deletePackage = this._deletePackage.bind(this);
    this._postPackage = this._postPackage.bind(this);
  }

  componentDidConnect() {
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
    const { availability = {} } = this.appConfiguration;
    this.isPackagesAvailable = availability.packages;
    this.checkPermissions(this._enableCallback);
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(this._enableCallback);
    }
  }

  componentWillDisconnect() {
    clearTimeout(this.requestInterval);
    clearTimeout(this.requestDetailedInterval);
  }

  /**
   * Fetch packages
   *
   * @returns {Promise<void>}
   */
  async _fetchPackages() {
    try {
      const queryParameterAsJson = {
        ...this.packagesQueryParameterAsJson,
        // TODO uncomment when backend will be ready
        verbosity: "ui"
      };

      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      const { packages = [] } = await fetchPackages(queryParameterAsJson);

      this.data = formatBackendPackageData(packages);

      this.requestInterval = setTimeout(this._fetchPackages, SYNC_INTERVAL * 2);
    } catch (error) {
      this.data = [];
      console.error("Error when fetching packages: ", error);
    }
  }

  async _fetchPackageInfo(packageId) {
    const hasPackage = this.packageIds.includes(packageId);

    if (this.requestDetailedInterval) {
      clearTimeout(this.requestDetailedInterval);
    }

    if (!hasPackage) {
      return false;
    }

    try {
      const { onboardingState, title, detail } = await fetchPackageInfo({ packageId });

      if (onboardingState === "ONBOARDED") {
        this._removePackageId(packageId);
      } else if (title === "Onboarding Failed" && detail !== undefined) {
        this._removePackageId(packageId);
        showOnboardingErrorNotification(detail);
      }
    } catch (error) {
      this._removePackageId(packageId);
      showNotification(GENERIC_ERROR_MESSAGE, ONBOARDING_SERVICE_UNAVAILABLE, true, 5000);
    }

    this.checkOnboardingErrors(packageId);
    return true;
  }

  async _deletePackage(packageId, showSuccessNotification) {
    try {
      await deletePackage({ packageId });

      if (showSuccessNotification) {
        showNotification(COMPLETED_DELETE_PACKAGE, COMPLETED_DELETE_PACKAGE_MESSAGE, false, 7000);
      }

      await this._fetchPackages();
    } catch (error) {
      console.error("Error when delete package: ", error);
    }
  }

  async _postPackage() {
    try {
      const { id } = await postPackage({ userDefinedData: this.userDefinedData });

      this.handleUpload(id);
    } catch (error) {
      this.showFileUploadDialog = null;
      console.error("Error when create package: ", error);
    }
  }

  async handleUpload(id) {
    this.uploadPackageId = id;
    if (this.uploadFile) {
      const config = {
        onUploadProgress: progressEvent => {
          this.percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        },
        headers: CONTENT_TYPE_OCTET_STREAM_HEADER
      };

      this.packageIds.push(id);

      this.checkOnboardingErrors(id);

      const cancelToken = getCancelToken();

      this.source = cancelToken.source();
      config.cancelToken = this.source.token;

      await executePutRequest(
        `${PACKAGES_ETSI_URL}/${id}/package_content`,
        this.uploadFile,
        config,
        this._successUploadingCallback,
        this._errorUploadingCallback
      );
    }
  }

  _successUploadingCallback = () => {
    this.percentage = "0";
    this.uploadFile = null;
    showNotification(COMPLETED_PACKAGE_ONBOARD, COMPLETED_PACKAGE_ONBOARD_MESSAGE, false);
    this.showFileUploadDialog = null;
    this.source = null;
  };

  _errorUploadingCallback = error => {
    if (isCancel(error)) {
      showNotification(CANCEL_PACKAGE_ONBOARD, null, false);
    }

    // TODO workaround for overlapping notification (need to refactoring axios interceptors)
    if (typeof error.response === "string") {
      showNotification(FAILED_PACKAGE_ONBOARD, error.response, true);
    }

    this._deletePackage(this.uploadPackageId);
    this.showFileUploadDialog = null;
    this.percentage = "0";
    this.uploadFile = null;
    this.source = null;
  };

  handleFilteringEvent(event) {
    const selectedFilters = event.detail;

    this.packagesQueryParameterAsJson = buildPackagesQueryParameterJson(selectedFilters);
    this._fetchPackages();
  }

  addQuerySelectors() {
    window.querySelectorDeep = function qsDeep(htmlIdentifier) {
      return querySelectorDeep(htmlIdentifier);
    };
    window.querySelectorAllDeep = function qsAllDeep(htmlIdentifier) {
      return querySelectorAllDeep(htmlIdentifier);
    };
  }

  _enableCallback() {
    if (this.isPackagesAvailable) {
      this.packagesQueryParameterAsJson = this.defaultPackagesQueryParameterAsJson;
      this._setButton();
      this._fetchPackages();
    }
  }

  // TODO - Require changes in render to account for error and page load scenarios

  _renderPackagesPage() {
    return html`
      <e-generic-multi-panel
        .data=${this.data}
        .permissions=${this.userInformation.permissions}
        .pageName=${this.pageName}
        .columns=${PACKAGES_PAGE_COLUMNS}
        @delete-package=${this}
      ></e-generic-multi-panel>
      ${this.showFileUploadDialog ? this._renderFileContentDialog() : html``}
    `;
  }

  _addOnboardingButton() {
    const button = document.createElement("eui-base-v0-button");
    button.setAttribute("id", "packages_onboarding_button");
    button.textContent = ONBOARD_PACKAGE_BUTTON;
    button.primary = true;
    button.title = ONBOARD_PACKAGE_BUTTON;
    button.addEventListener("click", () => {
      this._getOnboardingDialog();
    });
    if (this.appActions) {
      this.appActions.appendChild(button);
    }
    return button;
  }

  _getOnboardingDialog() {
    this.showFileUploadDialog = true;
  }

  _setButton() {
    if (
      checkPermission(this.userInformation, PACKAGES_RESOURCE_NAME) &&
      checkPermission(this.userInformation, PACKAGES_ONBOARDING_RESOURCE_NAME)
    ) {
      if (
        checkPermission(this.userInformation, PACKAGES_RESOURCE_NAME).includes("POST") &&
        checkPermission(this.userInformation, PACKAGES_ONBOARDING_RESOURCE_NAME).includes("PUT")
      ) {
        if (this.onboardingButton === null || this.onboardingButton === undefined)
          this.onboardingButton = this._addOnboardingButton();
      }
    }
  }

  _renderFileContentDialog() {
    return html`
      <e-file-upload-dialog
        label=${"Uploading file"}
        content=${this.fileDialogContent}
        percentage=${this.percentage}
        accept=${".csar"}
        @fileUploadDialog:cancel=${this}
        @fileUploadDialog:upload=${this}
      >
      </e-file-upload-dialog>
    `;
  }

  handleEvent(event) {
    switch (event.type) {
      case "fileUploadDialog:cancel":
        this.showFileUploadDialog = null;
        if (this.source) {
          this.source.cancel("Cancel Upload");
        }
        break;
      case "fileUploadDialog:upload":
        this.uploadFile = event.detail.file;
        this.userDefinedData = event.detail.userDefinedData;
        this._postPackage();
        break;
      case DELETE_PACKAGE_EVENT:
        this.showPackageDeleteDialog = true;
        this.deletePackageData = { id: event.detail.appPkgId, name: event.detail.appCompositeName };
        break;
      case DIALOG_BUTTON_CLICK_EVENT:
        if (event.detail.selected === CANCEL_BUTTON) {
          this.showPackageDeleteDialog = false;
        } else if (event.detail.selected === DELETE_PACKAGE_BUTTON) {
          this._deletePackage(this.deletePackageData.id, true);
          this.showPackageDeleteDialog = false;
        }
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  checkOnboardingErrors(id) {
    this.requestDetailedInterval = setTimeout(() => this._fetchPackageInfo(id), SYNC_INTERVAL * 2);
  }

  _removePackageId(id) {
    const idIndex = this.packageIds.indexOf(id);

    if (idIndex !== -1) {
      this.packageIds.splice(idIndex, 1);
    }
  }

  _renderDeletePackageDialog() {
    const deletePackageDialog = new DialogModel(
      "Confirm delete package",
      TERMINATION_PACKAGE_MESSAGE.replace("<PACKAGE>", this.deletePackageData.name)
    );
    const buttons = [CANCEL_BUTTON, DELETE_PACKAGE_BUTTON];
    deletePackageDialog.setButtonLabels(buttons);
    deletePackageDialog.setWarningButtonIndex(1);
    return html`
      <e-generic-dialog .dialogModel=${deletePackageDialog} @dialog-button-click=${this}>
      </e-generic-dialog>
    `;
  }

  _renderUnavailablePackages() {
    return html`
      <e-unavailable-page-component title="Packages page is not available">
      </e-unavailable-page-component>
    `;
  }

  render() {
    const packagesAvailability = this.isPackagesAvailable
      ? this._renderPackagesPage()
      : this._renderUnavailablePackages();
    return html`
      ${this.isValidPermission ? packagesAvailability : accessDenied()}
      ${this.showPackageDeleteDialog ? this._renderDeletePackageDialog() : html``}
    `;
  }
}

/**
 * Register the component as e-packages.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// Packages.register();
