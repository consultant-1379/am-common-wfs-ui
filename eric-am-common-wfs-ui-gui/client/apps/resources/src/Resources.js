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
import "../../../components/generic-dialog/src/GenericDialog";
import "../../../components/terminate-dialog/src/TerminateDialog";
import "../../../components/generic-multi-panel/src/GenericMultiPanel";
import "../../../components/clean-up-dialog/src/CleanUpDialog";
import "../../../components/backup-local-dialog/src/BackupLocalDialog";
import "../../../components/modify-vnf-info-dialog/src/ModifyVnfInfoDialog";
import "./components/sync-dialog/SyncDialog";
import "./components/delete-node-dialog/DeleteNodeDialog";

// models
import { Resource } from "../../../model/resources";
import { DialogModel } from "../../../components/generic-dialog/src/DialogModel";

// styles
import style from "./resources.css";

// helpers
import { postTerminateVnfInstance, postDeleteNode } from "../../../api/vnf-instance";
import { buildPackagesQueryParameterJson, setPaginationData } from "../../../utils/FilterUtils";
import {
  accessDenied,
  checkPermission,
  checkPermissions,
  renderTerminateDialog,
  showNotification,
  parseDescriptorModel,
  renderBackupToLocalDialog,
  generateSubtitleByPage,
  renderErrorDialog,
  SYNC_INTERVAL
} from "../../../utils/CommonUtils";
import {
  RESOURCES_PAGE,
  CANCEL_BUTTON,
  INSTANTIATE_NEW_BUTTON,
  TERMINATE_BUTTON,
  OPERATION_STARTED_MESSAGE,
  NO_PACKAGE_ONBOARDED,
  CLEAN_UP_BUTTON,
  CLEAN_UP_CONFIRMATION_MESSAGE_SINGLE,
  HEAL_NO_CAUSES_MSG,
  MODIFY_VNF_INFO,
  MODIFY_VNF_INFO_MESSAGE,
  MODIFY_VNF_INFO_BUTTON,
  SYNC_SUCCESS_MSG_TITLE,
  SYNC_SUCCESS_MSG_DESC
} from "../../../constants/Messages";
import {
  DIALOG_BUTTON_CLICK_EVENT,
  DIALOG_TERMINATE_EVENT,
  GO_TO_UPGRADE_WIZARD_EVENT,
  DIALOG_REMOVE_IDENTIFIER_EVENT,
  GO_TO_ADD_NODE_EVENT,
  GO_TO_SCALE_RESOURCE_EVENT,
  GO_TO_HEAL_RESOURCE_EVENT,
  DIALOG_DELETE_NODE_EVENT,
  DIALOG_ROLLBACK_EVENT,
  CREATE_BACKUP_EVENT,
  CANCEL_BACKUP_EVENT,
  DIALOG_BACKUP_EVENT,
  DIALOG_MODIFY_VNF_EVENT,
  DIALOG_SYNC_EVENT
} from "../../../constants/Events";
import {
  INSTANTIATE_RESOURCE_NAME,
  PACKAGES_BASE_QUERY
} from "../../../constants/GenericConstants";
import { fetchResources, fetchResource, fetchDowngradeInfo } from "../../../api/internal";
import { fetchPackages, fetchPackage } from "../../../api/onboarding";
import {
  fetchScopes,
  postCleanUp,
  postBackUp,
  postSync,
  patchResource
} from "../../../api/orchestrator";

const defaultColumnsState = [
  { title: "Resource instance name", attribute: "vnfInstanceName", sortable: true },
  { title: "Type", attribute: "vnfProductName", sortable: true },
  { title: "Software version", attribute: "vnfSoftwareVersion", sortable: true },
  { title: "Package version", attribute: "vnfdVersion", sortable: true },
  { title: "Last operation", attribute: "lifecycleOperationType", sortable: true },
  {
    title: "Last operation state",
    attribute: "operationState",
    sortable: true,
    isColState: true
  },
  { title: "Cluster", attribute: "clusterName", sortable: true },
  { title: "Last modified at", attribute: "lastStateChanged", sortable: true }
];

/**
 * Resources is defined as
 * `<e-resources>`
 *
 * Imperatively create application
 * @example
 * let app = new Resources();
 *
 * Declaratively create application
 * @example
 * <e-resources></e-resources>
 *
 * @extends {App}
 */
@definition("e-resources", {
  style,
  props: {
    response: { attribute: false },
    data: { attributes: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string", default: RESOURCES_PAGE },
    terminateData: { attribute: false, type: "object" },
    deleteNodeData: { attribute: false, type: "object" },
    cleanUpData: { attribute: false, type: "object" },
    rollbackData: { attribute: false, type: "object" },
    healData: { attribute: false, type: "object" },
    healResourceData: { attribute: false, type: "object" },
    causesAbsent: { attribute: false, type: "boolean", default: false },
    showBackupDialog: { attribute: false, type: "boolean", default: false },
    syncData: { attribute: false, type: "object" },
    modifyVnfInfoData: { attribute: false, type: "object" },
    showRollbackNotSupportedDialog: { attribute: false, type: "boolean", default: false },
    subtitle: { attribute: false, type: "string", default: "" },
    filterQueryJson: { attribute: false, type: "object", default: {} }
  }
})
export default class Resources extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.columns = defaultColumnsState;
    this.packagesQueryParameterAsJson = buildPackagesQueryParameterJson({}, PACKAGES_BASE_QUERY);
    this.scopesData = [];
    this.backupResource = {};
    this.checkPermissions = checkPermissions.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setPaginationData = setPaginationData.bind(this);

    this._postSync = this._postSync.bind(this);
    this._postDeleteNode = this._postDeleteNode.bind(this);
    this._fetchResources = this._fetchResources.bind(this);
    this._fetchPackages = this._fetchPackages.bind(this);
    this._fetchScopes = this._fetchScopes.bind(this);
    this._fetchResource = this._fetchResource.bind(this);
    this._fetchPackage = this._fetchPackage.bind(this);
    this._fetchDowngradeInfo = this._fetchDowngradeInfo.bind(this);
    this._checkPackages = this._checkPackages.bind(this);
    this._postCleanUp = this._postCleanUp.bind(this);
    this._postBackUp = this._postBackUp.bind(this);
    this._postTerminate = this._postTerminate.bind(this);
    this._patchResource = this._patchResource.bind(this);
  }

  componentDidConnect() {
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
    const { availability = {} } = this.appConfiguration;
    this.isPackagesAvailable = availability.packages;
    this.checkPermissions(this._enableCallback);
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (
      this.userInformation.tokenId !== undefined &&
      previous.state &&
      previous.state.tokenId !== this.userInformation.tokenId
    ) {
      this.checkPermissions(this._enableCallback);
    }
  }

  componentWillDisconnect() {
    clearTimeout(this.requestInterval);
    clearTimeout(this.packageRequestInterval);
  }

  /**
   * Fetch resources
   *
   * @returns {Promise<void>}
   */
  async _fetchResources() {
    try {
      const queryParameterAsJson = this.filterQueryJson;

      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      const response = await fetchResources(queryParameterAsJson);

      this.data = response;
      this.unfilteredData = response.items.reduce(
        (resources, resource) => [...resources, new Resource(resource)],
        []
      );
      this.subtitle = generateSubtitleByPage(response.page);

      this.requestInterval = setTimeout(this._fetchResources, SYNC_INTERVAL);
    } catch (error) {
      this.data = [];
      console.error("Error when fetching resources: ", error);
    }
  }

  /**
   * Fetch packages
   *
   * @returns {Promise<void>}
   */
  async _fetchPackages() {
    try {
      const queryParameterAsJson = this.packagesQueryParameterAsJson;

      if (this.packageRequestInterval) {
        clearTimeout(this.packageRequestInterval);
      }

      const { packages = [] } = await fetchPackages(queryParameterAsJson);

      this.dataPackage = packages;

      if (this.dataPackage.length !== 0) {
        clearTimeout(this.packageRequestInterval);

        this.button.disabled = false;
        this.button.title = INSTANTIATE_NEW_BUTTON;
      } else {
        this.packageRequestInterval = setTimeout(this._fetchPackages, SYNC_INTERVAL);
      }
    } catch (error) {
      this.dataPackage = [];
      console.error("Error when fetching packages: ", error);
    }
  }

  /**
   * Fetch scopes
   *
   * @returns {Promise<void>}
   */
  async _fetchScopes(resource) {
    try {
      const convertedData = [];
      const response = await fetchScopes(resource);

      this.showBackupDialog = true;

      if (response.length !== 0) {
        response.forEach(item => convertedData.push({ name: item, value: item }));
      }

      if (convertedData.length !== 0) {
        convertedData[0].checked = true;
      }

      this.scopesData = convertedData;
    } catch (error) {
      this.showBackupDialog = false;
      console.error("Error when fetching scopes: ", error);
    }
  }

  /**
   * Fetch resource
   *
   * @returns {Promise<void>}
   */
  async _fetchResource(resource) {
    try {
      const response = await fetchResource({ resourceId: resource.instanceId });

      this.healResourceData = null;
      this.healData = response;
    } catch (error) {
      console.error("Error when fetching resource: ", error);
      throw error;
    }
  }

  /**
   * Fetch package
   *
   * @returns {Promise<void>}
   */
  async _fetchPackage(healData) {
    try {
      const response = await fetchPackage({ packageId: healData.vnfPkgId });

      parseDescriptorModel(this.healData, response.descriptorModel, "heal");

      this.healResourceData = this.healData;

      if (this.healResourceData.causes) {
        window.EUI.Router.goto(`resource-heal?resourceId=${this.healResourceData.instanceId}`);
      } else {
        this.causesAbsent = true;
      }
    } catch (error) {
      this.healData = null;
      this.healResourceData = null;

      console.error("Error when fetching package or parsing descriptor: ", error);
      throw error;
    }
  }

  /**
   * Fetch downgrade info
   *
   * @returns {Promise<void>}
   */
  async _fetchDowngradeInfo(resource) {
    this.showRollbackNotSupportedDialog = false;

    try {
      const response = await fetchDowngradeInfo({ resourceId: resource.instanceId });

      const sourceInfo = response.sourceDowngradePackageInfo;
      const targetInfo = response.targetDowngradePackageInfo;

      this.rollbackData.downgradePackageInfo = {};
      this.rollbackData.downgradePackageInfo.sourceDowngradePackageInfo = sourceInfo;
      this.rollbackData.downgradePackageInfo.targetDowngradePackageInfo = targetInfo;

      window.EUI.Router.goto(`resource-rollback?resourceId=${this.rollbackData.instanceId}`);
    } catch (error) {
      this.rollbackData = null;
      this.showRollbackNotSupportedDialog = true;
      this.rollbackErrorLabel = "Rollback";
      this.rollbackErrorMessage = error.response.data.detail;

      console.error("Error when fetching downgrade info: ", error);
    }
  }

  /**
   * Fetch products after instantiate
   *
   * @returns {Promise<void>}
   */
  async _checkPackages() {
    try {
      if (this.packageRequestInterval) {
        clearTimeout(this.packageRequestInterval);
      }

      const { packages = [] } = await fetchPackages(this.packagesQueryParameterAsJson);

      this.dataPackage = packages;

      if (this.dataPackage.length === 0) {
        this.button.disabled = true;
        this.button.title = NO_PACKAGE_ONBOARDED;
        this._fetchPackages();

        showNotification("No Package Available", NO_PACKAGE_ONBOARDED, true, 5000, "operations");
      } else {
        clearTimeout(this.packageRequestInterval);
        window.EUI.Router.goto(`instantiate-wizard`);
      }
    } catch (error) {
      console.error("Error when fetching products: ", error);
    }
  }

  /**
   * Post cleanup request
   *
   * @returns {Promise<void>}
   */
  async _postCleanUp(resourceId) {
    const { additionalParams } = this;

    if (this.cleanUpData.clusterName) {
      additionalParams.clusterName = this.cleanUpData.clusterName;
    }

    try {
      await postCleanUp({ data: additionalParams, resourceId });

      this.cleanUpData = null;
      this._fetchResources();

      showNotification(
        "Clean up has started",
        OPERATION_STARTED_MESSAGE,
        false,
        5000,
        "operations"
      );
    } catch (error) {
      this.cleanUpData = null;
      console.error("Error when clean up resource: ", error);
    }
  }

  /**
   * Post backup request
   *
   * @returns {Promise<void>}
   */
  async _postBackUp(additionalParams) {
    const data = { additionalParams };
    const { vnfInstanceName, instanceId: resourceId } = this.backupResource;

    try {
      await postBackUp({ data, resourceId });

      showNotification("Backup started", `${vnfInstanceName} is being backed up`, false, 5000);
    } catch (error) {
      console.error("Error when backup resource: ", error);
    }
  }

  /**
   * Post delete node
   *
   * @returns {Promise<void>}
   */
  async _postDeleteNode(payload = {}) {
    try {
      await postDeleteNode(payload.detail);

      showNotification(
        "Node Removed Successfully",
        `Node has been removed from ENM successfully`,
        false
      );
    } catch (error) {
      console.error("Error when deleting node: ", error);
    } finally {
      this.deleteNodeData = null;
    }
  }

  /**
   * Post terminate
   *
   * @returns {Promise<void>}
   */
  async _postTerminate(payload) {
    try {
      await postTerminateVnfInstance(payload);
      showNotification(
        "Termination has started",
        OPERATION_STARTED_MESSAGE,
        false,
        5000,
        "operations"
      );
    } catch (error) {
      console.error("Error when initiate terminate operation: ", error);
    } finally {
      this.terminateData = null;
    }
  }

  /**
   * Post sync request
   *
   * @returns {Promise<void>}
   */
  async _postSync(payload = {}) {
    const { instanceId: resourceId, vnfInstanceName = "", body: data } = payload.detail;

    try {
      await postSync({ data, resourceId });
      showNotification(
        SYNC_SUCCESS_MSG_TITLE,
        SYNC_SUCCESS_MSG_DESC.replace("<RESOURCE>", vnfInstanceName)
      );
    } catch (error) {
      console.error("Error when backup resource: ", error);
    }
  }

  /**
   * Patch resource request
   *
   * @returns {Promise<void>}
   */
  async _patchResource() {
    const { additionalParams: data } = this;
    const { instanceId: resourceId } = this.modifyVnfInfoData;

    try {
      await patchResource({ resourceId, data });

      this.modifyVnfInfoData = null;
      showNotification(
        "Modification of VNF Info started",
        OPERATION_STARTED_MESSAGE,
        false,
        5000,
        "operations"
      );
    } catch (error) {
      this.modifyVnfInfoData = null;
      console.error("Error when update resource: ", error);
    }
  }

  /**
   * Event handler for `filters-changed` event
   *
   * @param {object} data: event object
   */
  _onFilterChange({ detail }) {
    this.setPaginationData(detail, defaultColumnsState, "lcmOperationDetails/stateEnteredTime");
    this._fetchResources();
  }

  async handleEvent(event) {
    switch (event.type) {
      case DIALOG_TERMINATE_EVENT:
        this.terminateData = event.detail;
        break;
      case DIALOG_REMOVE_IDENTIFIER_EVENT:
        this.cleanUpData = event.detail;
        break;
      case GO_TO_ADD_NODE_EVENT:
        window.EUI.Router.goto(`resource-add-node?resourceId=${event.detail.instanceId}`);
        break;
      case GO_TO_SCALE_RESOURCE_EVENT:
        window.EUI.Router.goto(`resource-scale?resourceId=${event.detail.instanceId}`);
        break;
      case DIALOG_DELETE_NODE_EVENT:
        this.deleteNodeData = event.detail;
        break;
      case DIALOG_ROLLBACK_EVENT:
        this.rollbackData = event.detail;
        this._fetchDowngradeInfo(event.detail);
        break;
      case GO_TO_HEAL_RESOURCE_EVENT:
        try {
          await this._fetchResource(event.detail);
          this._fetchPackage(this.healData);
        } catch (error) {
          showNotification("Error", "Request for instance details failed", true, 5000);
        }
        break;
      case DIALOG_MODIFY_VNF_EVENT:
        this.modifyVnfInfoData = event.detail;
        break;
      case DIALOG_BUTTON_CLICK_EVENT:
        if (event.detail.selected === CANCEL_BUTTON || event.detail.selected === "Ok") {
          this.modifyVnfInfoData = null;
          this.terminateData = null;
          this.cleanUpData = null;
          this.deleteNodeData = null;
          this.rollbackData = null;
          this.causesAbsent = false;
          this.syncData = null;
        } else if (event.detail.selected === TERMINATE_BUTTON) {
          this.additionalParams = event.detail.additionalParams;
          const payload = parsePayloadForTerminateOperation.call(this);

          this._postTerminate(payload);
        } else if (event.detail.selected === CLEAN_UP_BUTTON) {
          this.additionalParams = event.detail.additionalParams;
          this._postCleanUp(this.cleanUpData.instanceId);
          this.cleanUpData = null;
        } else if (event.detail.selected === MODIFY_VNF_INFO_BUTTON) {
          this.additionalParams = event.detail.additionalParams;
          this._patchResource();
        }
        break;
      case GO_TO_UPGRADE_WIZARD_EVENT:
        window.EUI.Router.goto(`upgrade-wizard?resourceId=${event.detail.instanceId}`);
        break;
      case DIALOG_BACKUP_EVENT:
        this.backupResource.vnfInstanceName = event.detail.vnfInstanceName;
        this.backupResource.instanceId = event.detail.instanceId;
        this._fetchScopes(this.backupResource);
        break;
      case CREATE_BACKUP_EVENT:
        this.showBackupDialog = false;
        this._postBackUp(event.detail);
        break;
      case CANCEL_BACKUP_EVENT:
        this.showBackupDialog = false;
        break;
      case DIALOG_SYNC_EVENT:
        this.syncData = event.detail;
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _generateCausesNotPresentDialog() {
    const healDialog = new DialogModel("Causes Not Present", HEAL_NO_CAUSES_MSG);
    const buttons = ["Ok"];
    healDialog.setButtonLabels(buttons);
    healDialog.setPrimaryButtonIndex(1);
    return html`
      <e-generic-dialog .dialogModel=${healDialog} @dialog-button-click=${this}></e-generic-dialog>
    `;
  }

  _addInstantiateButton() {
    const button = document.createElement("eui-base-v0-button");
    button.textContent = INSTANTIATE_NEW_BUTTON;
    button.primary = true;
    button.title = NO_PACKAGE_ONBOARDED;
    button.disabled = true;
    button.addEventListener("click", () => {
      this._checkPackages();
    });
    if (this.appActions) {
      this.appActions.appendChild(button);
    }
    return button;
  }

  // TODO Need to investigate correct way of sharing common methods, scrips, etc...
  addQuerySelectors() {
    window.querySelectorDeep = function qsDeep(htmlIdentifier) {
      return querySelectorDeep(htmlIdentifier);
    };
    window.querySelectorAllDeep = function qsAllDeep(htmlIdentifier) {
      return querySelectorAllDeep(htmlIdentifier);
    };
  }

  _enableCallback() {
    this._fetchResources();
    if (this.isPackagesAvailable) {
      this._setButton();
      this._fetchPackages();
    }
  }

  _setButton() {
    if (checkPermission(this.userInformation, INSTANTIATE_RESOURCE_NAME)) {
      if (this.button === null || this.button === undefined)
        this.button = this._addInstantiateButton();
    }
  }

  _renderCleanUpDialog() {
    const cleanUpDialog = new DialogModel(
      "Confirm clean up",
      CLEAN_UP_CONFIRMATION_MESSAGE_SINGLE.replace("<RESOURCE>", this.cleanUpData.vnfInstanceName)
    );
    const buttons = [CANCEL_BUTTON, CLEAN_UP_BUTTON];
    cleanUpDialog.setButtonLabels(buttons);
    cleanUpDialog.setPrimaryButtonIndex(1);
    return html`
      <e-clean-up-dialog
        .dialogModel=${cleanUpDialog}
        @dialog-button-click=${this}
        .data=${this.cleanUpData}
      >
      </e-clean-up-dialog>
    `;
  }

  _renderModifyVnfInfoDialog() {
    const modifyVnfInfoDialog = new DialogModel(
      MODIFY_VNF_INFO,
      MODIFY_VNF_INFO_MESSAGE.replace("<RESOURCE>", this.modifyVnfInfoData.vnfInstanceName)
    );
    const buttons = [CANCEL_BUTTON, MODIFY_VNF_INFO_BUTTON];
    modifyVnfInfoDialog.setButtonLabels(buttons);
    modifyVnfInfoDialog.setPrimaryButtonIndex(1);
    return html`
      <e-modify-vnf-info-dialog
        .dialogModel=${modifyVnfInfoDialog}
        @dialog-button-click=${this}
        .data=${this.modifyVnfInfoData}
      >
      </e-modify-vnf-info-dialog>
    `;
  }

  _renderResourcesPage() {
    let data;

    if (this.unfilteredData) {
      data = this.unfilteredData.filter(
        resource =>
          !(
            resource.lifecycleOperationType === "Terminate" &&
            resource.operationState === "Completed"
          )
      );
    }

    return html`
      <e-generic-multi-panel
        .data=${data}
        .permissions=${this.userInformation.permissions}
        .availability=${this.appConfiguration.availability}
        .pageName=${this.pageName}
        .columns=${this.columns}
        .pagination=${this.data.page}
        .subtitle=${this.subtitle}
        @filters-changed=${this._onFilterChange}
        @display-terminate-dialog=${this}
        @dialog-button-click=${this}
        @go-to-upgrade-wizard=${this}
        @display-remove-identifier-dialog=${this}
        @go-to-resource-add-node=${this}
        @go-to-resource-scale-node=${this}
        @display-delete-node-dialog=${this}
        @display-rollback-dialog=${this}
        @go-to-resource-heal-node=${this}
        @display-backup-local-dialog=${this}
        @display-modify-vnf-dialog=${this}
        @dialog-sync:show=${this}
      ></e-generic-multi-panel>
      ${this.terminateData ? renderTerminateDialog(this.terminateData, this) : html``}
      ${this.cleanUpData ? this._renderCleanUpDialog() : html``}
      ${this.causesAbsent ? this._generateCausesNotPresentDialog() : html``}
      ${this.showBackupDialog ? renderBackupToLocalDialog(this.scopesData, this, this) : html``}
      ${this.modifyVnfInfoData ? this._renderModifyVnfInfoDialog() : html``}
      ${this.showRollbackNotSupportedDialog
        ? renderErrorDialog(this.rollbackErrorLabel, this.rollbackErrorMessage, () => {
            this.showRollbackNotSupportedDialog = false;
          })
        : html``}

      <!-- SYNC DIALOG -->
      <e-sync-dialog
        ?show=${Boolean(this.syncData)}
        .data=${this.syncData}
        @dialog-button-click=${this}
        @submit=${this._postSync}
      ></e-sync-dialog>

      <!-- DELETE NODE DIALOG -->
      <e-delete-node-dialog
        ?show=${Boolean(this.deleteNodeData)}
        .data=${this.deleteNodeData}
        @dialog-button-click=${this}
        @submit=${this._postDeleteNode}
      ></e-delete-node-dialog>
    `;
  }

  // TODO - Require changes in render to account for error and page load scenarios
  render() {
    return html`
      ${this.isValidPermission ? this._renderResourcesPage() : accessDenied()}
    `;
  }
}

/**
 * Parse params for terminate operation
 *
 * @private
 * @returns {object}
 */
function parsePayloadForTerminateOperation() {
  const { additionalParams, terminateData = {} } = this;

  return {
    terminationType: "FORCEFUL",
    gracefulTerminationTimeout: 0,
    vnfInstanceId: terminateData.instanceId,
    additionalParams: {
      ...additionalParams,
      ...(terminateData.clusterName && { clusterName: terminateData.clusterName }),
      ...{ deleteIdentifier: true }
    }
  };
}
