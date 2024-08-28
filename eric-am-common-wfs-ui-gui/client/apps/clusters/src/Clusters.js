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
import "../../../components/register-cluster-dialog/src/RegisterClusterDialog";
import "../../../components/generic-dialog/src/GenericDialog";
import "./components/upgrade-cluster-config-dialog/UpgradeClusterConfigDialog";
import "./components/upgrade-default-cluster-config-dialog/UpgradeDefaultClusterConfigDialog";
import "./components/deregister-cluster-dialog/DeregisterClusterDialog";

// styles
import style from "./clusters.css";

// helpers
import {
  fetchClusters,
  postClusterConfig,
  putClusterConfig,
  patchClusterConfig,
  deleteCluster
} from "../../../api/orchestrator";
import { CLUSTER_RESOURCE_NAME } from "../../../constants/GenericConstants";
import { DialogModel } from "../../../components/generic-dialog/src/DialogModel";
import {
  formatBackendClustersData,
  accessDenied,
  checkPermission,
  checkPermissions,
  showNotification,
  generateSubtitleByPage,
  checkIsLastRowOnPage,
  SYNC_INTERVAL
} from "../../../utils/CommonUtils";
import { setPaginationData } from "../../../utils/FilterUtils";
import {
  CISM_CLUSTERS_PAGE,
  REGISTER_CLUSTER_BUTTON,
  REGISTER_CLUSTER_UPLOAD_BUTTON,
  CANCEL_BUTTON
} from "../../../constants/Messages";
import {
  DIALOG_BUTTON_CLICK_EVENT,
  DEREGISTER_CLUSTER_EVENT,
  UPGRADE_CLUSTER_CONFIG_EVENT,
  UPGRADE_DEFAULT_CLUSTER_CONFIG_EVENT
} from "../../../constants/Events";

const defaultColumnsState = [
  { title: "Cluster name", attribute: "name", sortable: true },
  { title: "Usage state", attribute: "status", sortable: true },
  { title: "CRD namespace", attribute: "crdNamespace", sortable: true },
  { title: "Is default", attribute: "isDefault", sortable: false },
  { title: "Description", attribute: "description", sortable: false }
];

/**
 * Clusters is defined as
 * `<e-clusters>`
 *
 * Imperatively create application
 * @example
 * let app = new Clusters();
 *
 * Declaratively create application
 * @example
 * <e-clusters></e-clusters>
 *
 * @extends {App}
 */
@definition("e-clusters", {
  style,
  props: {
    clickedRegisterButton: { attribute: false, type: "boolean", default: false },
    data: { attributes: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string", default: CISM_CLUSTERS_PAGE },
    filterQueryJson: { attribute: false, type: "object", default: {} },
    subtitle: { attribute: false, type: "string", default: "" },
    deregisterClusterData: { attribute: false, type: "object" },
    upgradeClusterConfigData: { attribute: false, type: "object" },
    upgradeDefaultClusterConfigData: { attribute: false, type: "object" }
  }
})
export default class Clusters extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.columns = defaultColumnsState;
    this.checkPermissions = checkPermissions.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setPaginationData = setPaginationData.bind(this);
    this._putClusterConfig = this._putClusterConfig.bind(this);
    this._deleteCluster = this._deleteCluster.bind(this);
    this._patchClusterConfig = this._patchClusterConfig.bind(this);
    this._fetchClusters = this._fetchClusters.bind(this);
    this._postClusterConfig = this._postClusterConfig.bind(this);
  }

  /**
   * Event handler for `filters-changed` event
   *
   * @param {object} data: event object
   */
  _onFilterChange({ detail }) {
    this.setPaginationData(detail, defaultColumnsState);
    this._fetchClusters();
  }

  addQuerySelectors() {
    window.querySelectorDeep = function qsDeep(htmlIdentifier) {
      return querySelectorDeep(htmlIdentifier);
    };
    window.querySelectorAllDeep = function qsAllDeep(htmlIdentifier) {
      return querySelectorAllDeep(htmlIdentifier);
    };
  }

  /**
   * Fetch clusters
   *
   * @returns {Promise<void>}
   */
  async _fetchClusters() {
    try {
      const queryParameterAsJson = this.filterQueryJson;

      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      const response = await fetchClusters(queryParameterAsJson);

      this.data = response;
      this.subtitle = generateSubtitleByPage(response.page);

      this.requestInterval = setTimeout(this._fetchClusters, SYNC_INTERVAL);
    } catch (error) {
      this.data = {};
      console.error("Error when fetching cluster config: ", error);
    }
  }

  componentWillDisconnect() {
    clearTimeout(this.requestInterval);
    this.columns = defaultColumnsState;
    this.filterQueryJson = {};
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(this._enableCallback);
    }
  }

  componentDidConnect() {
    this.checkPermissions(this._enableCallback);
  }

  _enableCallback() {
    this._setButton();
    this._fetchClusters();
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        this.clickedRegisterButton = true;
        break;
      case DEREGISTER_CLUSTER_EVENT:
        this.deregisterClusterData = event.detail;
        break;
      case UPGRADE_CLUSTER_CONFIG_EVENT:
        this.upgradeClusterConfigData = event.detail;
        break;
      case UPGRADE_DEFAULT_CLUSTER_CONFIG_EVENT:
        this.upgradeDefaultClusterConfigData = event.detail;
        break;
      case DIALOG_BUTTON_CLICK_EVENT:
        if (event.detail.selected === CANCEL_BUTTON) {
          this.clickedRegisterButton = false;
          this.deregisterClusterData = null;
          this.upgradeClusterConfigData = null;
          this.upgradeDefaultClusterConfigData = null;
        } else if (event.detail.selected === REGISTER_CLUSTER_UPLOAD_BUTTON) {
          const requestData = event.detail.registerClusterRequestParameters;

          this._postClusterConfig(requestData);
        }
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _setButton() {
    if (checkPermission(this.userInformation, CLUSTER_RESOURCE_NAME)) {
      if (this.button === null || this.button === undefined)
        this.button = this._addRegisterClusterButton();
    }
  }

  _addRegisterClusterButton() {
    const button = document.createElement("eui-base-v0-button");
    button.textContent = REGISTER_CLUSTER_BUTTON;
    button.primary = true;
    button.addEventListener("click", event => this.handleEvent(event));
    if (this.appActions) {
      this.appActions.appendChild(button);
    }
    return button;
  }

  async _postClusterConfig(requestData) {
    const payload = new FormData();
    const { fileUploaded, description = "", crdNamespace = "", isDefault } = requestData;

    if (fileUploaded) {
      payload.append("clusterConfig", fileUploaded);
      payload.append("description", description);
      payload.append("crdNamespace", crdNamespace);
      payload.append("isDefault", isDefault);
    }

    try {
      await postClusterConfig(payload);

      showNotification("Success", `${"Registered"}`, false, 5000);
      await this._fetchClusters();
      this.clickedRegisterButton = false;
    } catch (error) {
      this.clickedRegisterButton = false;
      console.error("Error when register cluster config: ", error);
    }
  }

  _renderRegisterClusterDialog() {
    const registerClusterDialog = new DialogModel("Register cluster");
    const buttons = [CANCEL_BUTTON, REGISTER_CLUSTER_UPLOAD_BUTTON];
    registerClusterDialog.setButtonLabels(buttons);
    registerClusterDialog.setPrimaryButtonIndex(1);
    return html`
      <e-register-cluster-dialog
        @dialog-button-click=${this}
        .dialogModel=${registerClusterDialog}
      ></e-register-cluster-dialog>
    `;
  }

  async _deleteCluster(payload = {}) {
    try {
      const { clusterName } = payload.detail;

      await deleteCluster({ clusterName });

      const { page = {} } = this.data;

      if (checkIsLastRowOnPage(page)) {
        const prevPage = this.data.page.number - 1;

        this.data = { ...this.data, page: { ...this.data.page, number: prevPage } };
      } else {
        await this._fetchClusters();
      }

      showNotification("Success", "Deregistered", false);
    } catch (error) {
      console.error("Error when updating cluster config: ", error);
    } finally {
      this.deregisterClusterData = null;
    }
  }

  async _putClusterConfig(payload = {}) {
    try {
      await putClusterConfig(payload.detail);

      const { clusterName } = payload.detail;

      showNotification("Success", `Cluster config for ${clusterName} has been updated`, false);
    } catch (error) {
      console.error("Error when updating cluster config: ", error);
    } finally {
      this.upgradeClusterConfigData = null;
    }
  }

  async _patchClusterConfig(payload = {}) {
    try {
      await patchClusterConfig(payload.detail);
      await this._fetchClusters();

      const { clusterName } = payload.detail;

      showNotification("Success", `Cluster ${clusterName} has been set as default`, false);
    } catch (error) {
      console.error("Error when set default config: ", error);
    } finally {
      this.upgradeDefaultClusterConfigData = null;
    }
  }

  _renderClustersPage() {
    const data = this.data.items ? formatBackendClustersData(this.data.items) : [];

    return html`
      <e-generic-multi-panel
        .data=${data}
        .permissions=${this.userInformation.permissions}
        .pageName=${this.pageName}
        .subtitle=${this.subtitle}
        .columns=${this.columns}
        .pagination=${this.data.page}
        @filters-changed=${this._onFilterChange}
        @display-deregister-cluster-dialog=${this}
        @display-upgrade-cluster-config-dialog=${this}
        @display-upgrade-default-cluster-config-dialog=${this}
      ></e-generic-multi-panel>
      ${this.clickedRegisterButton ? this._renderRegisterClusterDialog() : null}

      <!-- DEREGISTER CLUSTER DIALOG -->
      <e-deregister-cluster-dialog
        ?show=${Boolean(this.deregisterClusterData)}
        .data=${this.deregisterClusterData}
        @dialog-button-click=${this}
        @submit=${this._deleteCluster}
      ></e-deregister-cluster-dialog>

      <!-- UPDATE CLUSTER CONFIG DIALOG -->
      <e-upgrade-cluster-config-dialog
        ?show=${Boolean(this.upgradeClusterConfigData)}
        .data=${this.upgradeClusterConfigData}
        @dialog-button-click=${this}
        @submit=${this._putClusterConfig}
      ></e-upgrade-cluster-config-dialog>

      <!-- SET DEFAULT CLUSTER CONFIG DIALOG -->
      <e-upgrade-default-cluster-config-dialog
        ?show=${Boolean(this.upgradeDefaultClusterConfigData)}
        .data=${this.upgradeDefaultClusterConfigData}
        @dialog-button-click=${this}
        @submit=${this._patchClusterConfig}
      ></e-upgrade-default-cluster-config-dialog>
    `;
  }

  render() {
    return html`
      ${this.isValidPermission ? this._renderClustersPage() : accessDenied()}
    `;
  }
}
