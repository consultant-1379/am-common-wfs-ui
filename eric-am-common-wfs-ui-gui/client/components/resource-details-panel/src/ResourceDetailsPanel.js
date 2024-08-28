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
import { html, LitComponent } from "@eui/lit-component";

// components
import "../../custom-cell-state/src/CustomCellState";
import "../../additional-attributes-tab/src/AdditionalAttributesTab";
import "../../operations-history-list/src/OperationsHistoryList";
import "../../resource-operations-details/src/ResourceOperationsDetails";
import "../../resource-backups-details/src/ResourceBackupsDetails";
import "../../resource-backups-list/src/ResourceBackupsList";

// models
import { Resource } from "../../../model/resources";

// styles
import style from "./resourceDetailsPanel.css";

// helpers
import {
  convertValueToStringIfObject,
  filterData,
  sortCol,
  sortState,
  RESOURCE_COMPONENTS_COLUMNS,
  showNotification
} from "../../../utils/CommonUtils";
import {
  NO_RESOURCE_SELECTED,
  REQUEST_BRO_SUCCESS_NOTIFICATION_MESSAGE,
  RESOURCE_DETAILS_OPERATIONS_PAGE
} from "../../../constants/Messages";
import {
  DELETE_BACKUP_EVENT,
  CONFIRM_EXPORT_BACKUP_EVENT,
  REFRESH_OPERATIONS_DATA_EVENT
} from "../../../constants/Events";
import { fetchPods, fetchResource } from "../../../api/internal";
import { postExportBackups, deleteBackup, fetchBackups } from "../../../api/orchestrator";

const GENERAL_INFO_ATTRS = {
  row1: {
    instanceId: "Resource instance id",
    lifecycleOperationType: "Last operation",
    operationState: "Last operation state",
    vnfdId: "VNF descriptor id",
    vnfProductName: "Type",
    vnfdVersion: "Package version"
  },
  row2: {
    vnfSoftwareVersion: "Software version",
    sourcePackage: "Source package",
    clusterName: "Cluster",
    namespace: "Namespace",
    addedToOss: "Added to ENM",
    lastStateChanged: "Last modified at"
  },
  row3: {
    vnfInstanceDescription: "Description"
  }
};

const TABS = {
  generalInfo: "General information",
  components: "Components",
  operations: "Operations",
  additionalAttributes: "Additional attributes",
  backups: "Backups"
};

const PREFIX_FOR_ASPECT_KEY = "aspect--";

/**
 * Component ResourceDetailsPanel is defined as
 * `<e-resource-details-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceDetailsPanel();
 *
 * Declaratively create component
 * @example
 * <e-resource-details-panel></e-resource-details-panel>
 *
 * @property {object} selected - selected resource.
 * @property {string} pageStyle - css property tag.
 * @property {array} backupsData - resource backups data.
 * @property {array} additionalAttributesData - additional attributes data.
 * @property {array} componentsData - data for components tab.
 * @property {boolean} sidePanel - indicates if this is in a side panel or full screen
 * @property {String} componentsFilterText - stores the value for component filter
 *
 * @extends {LitComponent}
 */
@definition("e-resource-details-panel", {
  style,
  props: {
    selected: { attribute: false, type: "object", default: {} },
    pageStyle: { attribute: false, type: "string", default: "" },
    backupsData: { attribute: false, type: "array", default: [] },
    additionalAttributesData: { attribute: false, type: "array", default: [] },
    componentsData: { attribute: false, type: "array", default: [] },
    operationsData: { attribute: false, type: "array", default: [] },
    sidePanel: { attribute: false, type: "boolean", default: false },
    componentsFilterText: { attribute: false, type: "string", default: "" },
    permissions: { attribute: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string", default: RESOURCE_DETAILS_OPERATIONS_PAGE },
    availability: { attribute: false, type: "object", default: {} },
    isPodsLoading: { attribute: false, type: Boolean, default: false }
  }
})
export default class ResourceDetailsPanel extends LitComponent {
  constructor() {
    super();

    this.selectedTab = "";
    this.componentsData = [];
    this.componentsError = "";
    this.operationsData = {};
    this.componentColumns = [
      {
        title: "State",
        attribute: RESOURCE_COMPONENTS_COLUMNS.state,
        width: "102px",
        sortable: true,
        isColState: true
      },
      { title: "Component name", attribute: RESOURCE_COMPONENTS_COLUMNS.name, sortable: true }
    ];

    this.handleEvent = this.handleEvent.bind(this);
    this._fetchPods = this._fetchPods.bind(this);
    this._fetchResource = this._fetchResource.bind(this);
    this._fetchBackups = this._fetchBackups.bind(this);
    this._postExportBackups = this._postExportBackups.bind(this);
    this._deleteBackup = this._deleteBackup.bind(this);
  }

  componentDidConnect() {
    this.filterComponentsData();
  }

  componentWillDisconnect() {
    this.componentsFilterText = "";
  }

  componentDidReceiveProps(prev) {
    super.componentDidReceiveProps(prev);
    if (this.selected && Object.keys(this.selected).length !== 0) {
      if (prev.selected !== this.selected) {
        if (this.selected.additionalParams) {
          this.additionalAttributesData = Object.entries(this.selected.additionalParams).map(
            ([K, V]) => ({ parameter: K, value: V })
          );
          this.convertAttributesValuesToStringIfObject();
        }
      }
      if (prev.selected.instanceId !== this.selected.instanceId) {
        if (this.selectedTab === TABS.components) {
          this._fetchPods();
        } else if (this.selectedTab === TABS.operations) {
          this._fetchResource();
        } else if (this.selectedTab === TABS.backups) {
          this._fetchBackups();
        }
      }
    } else {
      this.componentsFilterText = "";
    }
    this.filterComponentsData();
  }

  get hasTerminatedState() {
    const { lastLifecycleOperation = {} } = this.selected;
    const { lifecycleOperationType, operationState } = lastLifecycleOperation;

    return lifecycleOperationType === "TERMINATE" && operationState === "COMPLETED";
  }

  /**
   * Fetch pods
   *
   * @returns {Promise<void>}
   */
  async _fetchPods() {
    const { instanceId: resourceId } = this.selected;

    this.isPodsLoading = true;
    try {
      const response = await fetchPods({ resourceId });

      this.componentsData = sortState(response.pods, false, RESOURCE_COMPONENTS_COLUMNS.state);
      this.componentsError = "";
    } catch (error) {
      const { data } = error.response || {};
      const { detail } = data || {};

      this.componentsData = [];
      this.componentsError = detail || "";
      console.error("Error when fetching pods: ", error);
    } finally {
      this.isPodsLoading = false;
    }
  }

  /**
   * Fetch resource
   *
   * @returns {Promise<void>}
   */
  async _fetchResource() {
    try {
      const response = await fetchResource({ resourceId: this.selected.instanceId });
      const { lcmOperations } = new Resource(response);

      this.operationsData = lcmOperations;
    } catch (error) {
      console.error("Error when fetching resource: ", error);
    }
  }

  /**
   * Fetch backups
   *
   * @returns {Promise<void>}
   */
  async _fetchBackups() {
    const { instanceId: resourceId } = this.selected;

    try {
      const response = await fetchBackups({ resourceId });

      this.backupsData = response;
    } catch (error) {
      this.backupsData = [];
      console.error("Error when fetching resource: ", error);
    }
  }

  /**
   * Post export backups request
   *
   * @returns {Promise<void>}
   */
  async _postExportBackups(payload) {
    const data = this.createExportBackupRequest(payload);
    const { instanceId: resourceId } = this.selected;

    try {
      await postExportBackups({ data, resourceId });

      showNotification(
        "Export backup started",
        REQUEST_BRO_SUCCESS_NOTIFICATION_MESSAGE,
        false,
        5000
      );
    } catch (error) {
      console.error("Error when clean up resource: ", error);
    }
  }

  /**
   * Delete backup request
   *
   * @returns {Promise<void>}
   */
  async _deleteBackup(selectedBackup) {
    const { name: backupName, scope } = selectedBackup;
    const { instanceId: resourceId } = this.selected;

    try {
      await deleteBackup({ backupName, resourceId, scope });

      showNotification(
        "Delete backup started",
        REQUEST_BRO_SUCCESS_NOTIFICATION_MESSAGE,
        false,
        5000
      );
      this._fetchBackups();
    } catch (error) {
      console.error("Error when clean up resource: ", error);
    }
  }

  updateTabs() {
    const tabs = this.shadowRoot.querySelector("eui-layout-v0-tabs");
    if (tabs != null) {
      tabs.update();
    }
  }

  convertAttributesValuesToStringIfObject() {
    this.additionalAttributesData.forEach(attribute => {
      attribute.value = convertValueToStringIfObject(attribute.value);
    });
  }

  filterComponentsData() {
    const columnAttributes = this.componentColumns.map(col => col.attribute);
    this.filteredComponentsData = filterData(
      this.componentsFilterText,
      this.componentsData,
      columnAttributes
    );
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        window.EUI.Router.goto(`package-details?id=${this.selected.vnfPkgId}`);
        break;
      case "eui-tab:select":
        this.selectedTab = event.target.innerHTML;
        if (this.selectedTab === TABS.components) {
          this._fetchPods();
        } else if (this.selectedTab === TABS.operations) {
          this._fetchResource();
        } else if (this.selectedTab === TABS.backups) {
          this._fetchBackups();
        }
        break;
      case REFRESH_OPERATIONS_DATA_EVENT:
        this._fetchPods();
        break;
      case "input":
        this.componentsFilterText = event.target.value;
        break;
      case DELETE_BACKUP_EVENT:
        this._deleteBackup(event.detail);
        break;
      case CONFIRM_EXPORT_BACKUP_EVENT:
        this._postExportBackups(event.detail);
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  createExportBackupRequest(data) {
    const { backupName, scope, protocol, remoteUrl, userName, password } = data;
    const createExportBackupRequestData = {
      additionalParams: {
        backupName,
        scope,
        remote: {}
      }
    };

    const url = protocol.concat("://") + remoteUrl.value.trim();
    const user = userName.value.trim();
    let index = url.indexOf("//");

    index += 2;

    let updatedUrl = "";

    if (url.includes("http")) {
      updatedUrl = url;
    } else if (url.includes("sftp")) {
      updatedUrl = `${url.substring(0, index) + user}@${url.substring(index)}`;
      createExportBackupRequestData.additionalParams.remote.password = password.value.trim();
    }

    createExportBackupRequestData.additionalParams.remote.host = updatedUrl;

    return createExportBackupRequestData;
  }

  renderGeneralInformationTab() {
    const { deployableModules } = this.selected.extensions || {};

    const deployableModulesHtml = html`
      <p class="title-deploy-module">Deployable Modules</p>
      <div class="divTableBody">
        ${this.renderGeneralInformationRow(GENERAL_INFO_ATTRS.row3, 4)}
      </div>
    `;

    return html`
      <div class=${this.pageStyle}>
        <div class="divTableBody">
          ${this.renderGeneralInformationRow(GENERAL_INFO_ATTRS.row1, 1)}
        </div>
        <div class="divTableBody">
          ${this.renderGeneralInformationRow(GENERAL_INFO_ATTRS.row2, 2)}
        </div>
        <div class="divTableBody">
          ${this.renderGeneralInformationRow(GENERAL_INFO_ATTRS.row3, 3)}
        </div>
        ${deployableModules ? deployableModulesHtml : null}
      </div>
    `;
  }

  /**
   * Will generate object with attributes related to aspects fields in third row
   *
   * @returns {object}
   */
  generateAspectsFields() {
    try {
      const statuses = this.selected.instantiatedVnfInfo.scaleStatus || [];
      const scalingInfo = this.selected.scalingInfo || {};

      return statuses.reduce((acc, item) => {
        const { aspectId, scaleLevel } = item;
        const { name = "" } = scalingInfo[aspectId];
        const aspectName = name[0].toUpperCase() + name.slice(1);
        const title = `${aspectName} (${aspectId})`;

        acc[`${PREFIX_FOR_ASPECT_KEY}${item.aspectId}`] = {
          tooltip: scaleLevel,
          display: scaleLevel,
          title
        };

        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }

  generateDeployModulesFields() {
    try {
      const { deployableModules = {} } = this.selected.extensions || {};

      return Object.entries(deployableModules).reduce((acc, item) => {
        const [deployName, deployValue] = item;

        acc[`${PREFIX_FOR_ASPECT_KEY}${deployName}`] = {
          tooltip: deployValue,
          display: deployValue,
          title: deployName
        };

        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }

  renderGeneralInformationRow(rowData, rowCounter) {
    if (rowCounter === 3) {
      const aspects = this.generateAspectsFields();

      rowData = { ...aspects, ...rowData };
    }

    if (rowCounter === 4) {
      const deployModules = this.generateDeployModulesFields();

      rowData = { ...deployModules };
    }

    return Object.entries(rowData).map(([key, value]) => {
      let displayLabel = this.selected[key];
      let tooltipLabel = this.selected[key];

      if (key === "sourcePackage") {
        displayLabel = html`
          <a @click="${this.handleEvent}" href="JavaScript:void(0)"> ${displayLabel}</a>
        `;
      } else if (key === "operationState") {
        displayLabel = html`
          <e-custom-cell-state .cellValue=${displayLabel}> </e-custom-cell-state>
        `;
      }

      // handler for Description field
      if (key === "vnfInstanceDescription") {
        const hasContent =
          this.selected.vnfInstanceDescription && this.selected.vnfInstanceDescription.length > 0;

        if (!hasContent) {
          return null;
        }
      }

      // handler for aspect fields
      if (key.includes(PREFIX_FOR_ASPECT_KEY)) {
        const { tooltip, display, title } = value;

        tooltipLabel = tooltip;
        displayLabel = display;
        value = title;
      }

      return html`
        <div class=${rowCounter === 1 ? "divTableRow firstRow" : "divTableRow"}>
          <div class="divTableCell">${value}</div>
          <div class="divTableCell" title=${tooltipLabel}>
            ${displayLabel}
          </div>
        </div>
      `;
    });
  }

  renderComponentsTab() {
    return html`
      ${this.componentsError.length === 0
        ? html`
            <span class="heading">Components</span> (${this.filteredComponentsData.length})
            <div class="filter">
              <eui-base-v0-text-field
                placeholder="Filter by typing Component name.."
                value=${this.componentsFilterText}
                @input="${this.handleEvent}"
                ><eui-v0-icon slot="icon" name="search"></eui-v0-icon>
              </eui-base-v0-text-field>
            </div>
            <div class="table" id="resource-details-component-table">
              <e-generic-table
                compact
                dashed
                .columns=${this.componentColumns}
                .data=${this.filteredComponentsData}
                @eui-table:sort="${sortCol}"
              >
              </e-generic-table>
            </div>
          `
        : html`
            <div class="pods-error--wrapper">
              <div>
                <div class="pods-error--title">
                  <eui-v0-icon name="info"></eui-v0-icon>
                  <span>No information</span>
                </div>
                <p class="pods-error--message">${this.componentsError}</p>
              </div>
            </div>
          `}
    `;
  }

  renderOperationsTab() {
    return html`
      <e-resource-operations-details
        .operationsData=${this.operationsData}
        .permissions=${this.permissions}
        .availability=${this.availability}
        @refresh-data=${this}
        .pageName=${this.pageName}
      ></e-resource-operations-details>
    `;
  }

  renderOperationsListTab() {
    return html`
      <e-operations-history-list .data=${this.operationsData}></e-operations-history-list>
    `;
  }

  renderBackupsTab() {
    return html`
      <e-resource-backups-details
        .backupsData=${this.backupsData}
        @confirm-export-backup=${this}
        @delete-backup=${this}
        .permissions=${this.permissions}
      ></e-resource-backups-details>
    `;
  }

  renderBackupsListTab() {
    return html`
      <e-resource-backups-list .backupsData=${this.backupsData}> </e-resource-backups-list>
    `;
  }

  renderAdditionalAttributesTab() {
    return html`
      <e-additional-attributes-tab
        .additionalAttributesData=${this.additionalAttributesData}
      ></e-additional-attributes-tab>
    `;
  }

  /**
   * Render the <e-resources-details> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      ${Object.keys(this.selected).length
        ? html`
            <eui-layout-v0-tabs>
              <eui-layout-v0-tab id="resourceGeneralInfo" selected @eui-tab:select=${this}
                >General information</eui-layout-v0-tab
              >
              ${this.hasTerminatedState
                ? null
                : html`
                    <eui-layout-v0-tab id="resourceComponents" @eui-tab:select=${this}
                      >Components</eui-layout-v0-tab
                    >
                  `}
              <eui-layout-v0-tab id="resourceOperations" @eui-tab:select=${this}
                >Operations</eui-layout-v0-tab
              >
              <eui-layout-v0-tab id="resourceAdditionalAttributes" @eui-tab:select=${this}
                >Additional attributes</eui-layout-v0-tab
              >
              ${this.hasTerminatedState
                ? null
                : html`
                    <eui-layout-v0-tab id="resourceBackups" @eui-tab:select=${this}
                      >Backups</eui-layout-v0-tab
                    >
                  `}
              <div slot="content">
                ${this.renderGeneralInformationTab()}
              </div>
              ${this.hasTerminatedState
                ? null
                : html`
                    <div slot="content">
                      ${this.isPodsLoading
                        ? html`
                            <div class="loader-wrapper">
                              <eui-base-v0-loader size="medium"></eui-base-v0-loader>
                            </div>
                          `
                        : this.renderComponentsTab()}
                    </div>
                  `}
              <div slot="content">
                ${this.sidePanel ? this.renderOperationsListTab() : this.renderOperationsTab()}
              </div>
              <div slot="content">
                ${this.renderAdditionalAttributesTab()}
              </div>
              ${this.hasTerminatedState
                ? null
                : html`
                    <div slot="content">
                      ${this.sidePanel ? this.renderBackupsListTab() : this.renderBackupsTab()}
                    </div>
                  `}
            </eui-layout-v0-tabs>
          `
        : html`
            <p>${NO_RESOURCE_SELECTED}</p>
          `}
    `;
  }
}

/**
 * Register the component as e-resource-details-panel.
 * Registration can be done at a later time and with a different name
 */
ResourceDetailsPanel.register();
