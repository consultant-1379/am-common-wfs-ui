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
 * Component ContextMenu is defined as
 * `<e-context-menu>`
 *
 * Imperatively create component
 * @example
 * let component = new ContextMenu();
 *
 * Declaratively create component
 * @example
 * <e-context-menu></e-context-menu>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./contextMenu.css";
import {
  PACKAGES_PAGE,
  RESOURCES_PAGE,
  OPERATIONS_PAGE,
  CLEAN_UP,
  TERMINATE,
  SCALE,
  UPGRADE,
  GO_TO_DETAILS,
  INSTANTIATE,
  ADD_NODE,
  DELETE_NODE,
  DELETE_PACKAGE,
  ROLLBACK,
  HEAL,
  BACKUP,
  DELETE_BACKUP,
  EXPORT_BACKUP,
  RESOURCE_DETAILS_PAGE_BACKUPS_TAB,
  DEREGISTER_CLUSTER,
  UPGRADE_CLUSTER_CONFIG,
  UPGRADE_DEFAULT_CLUSTER_CONFIG,
  CISM_CLUSTERS_PAGE,
  ROLLBACK_OPERATION,
  FAIL_OPERATION,
  RESOURCE_DETAILS_OPERATIONS_PAGE,
  ERROR_MESSAGE,
  MODIFY_VNF_INFO,
  SYNC
} from "../../../constants/Messages";
import {
  DIALOG_TERMINATE_EVENT,
  DIALOG_REMOVE_IDENTIFIER_EVENT,
  DIALOG_DELETE_NODE_EVENT,
  GO_TO_ADD_NODE_EVENT,
  GO_TO_SCALE_RESOURCE_EVENT,
  DELETE_PACKAGE_EVENT,
  DIALOG_ROLLBACK_EVENT,
  GO_TO_HEAL_RESOURCE_EVENT,
  DIALOG_BACKUP_EVENT,
  DIALOG_DELETE_BACKUP_EVENT,
  DIALOG_EXPORT_BACKUP_EVENT,
  DEREGISTER_CLUSTER_EVENT,
  UPGRADE_CLUSTER_CONFIG_EVENT,
  UPGRADE_DEFAULT_CLUSTER_CONFIG_EVENT,
  ROLLBACK_OPERTION_EVENT,
  FAIL_OPERATION_EVENT,
  VIEW_MESSAGE_EVENT,
  DIALOG_MODIFY_VNF_EVENT,
  DIALOG_SYNC_EVENT
} from "../../../constants/Events";
import {
  ADD_NODE_RESOURCE_NAME,
  DELETE_NODE_RESOURCE_NAME,
  INSTANTIATE_RESOURCE_NAME,
  INSTANTIATED,
  NOT_INSTANTIATED,
  RESOURCE_RESOURCE_NAME,
  TERMINATE_RESOURCE_NAME,
  UPGRADE_RESOURCE_NAME,
  SCALE_RESOURCE_NAME,
  PACKAGE_RESOURCE_NAME,
  ROLLBACK_RESOURCE_NAME,
  BACKUP_RESOURCE_NAME,
  HEAL_RESOURCE_NAME,
  CLUSTER_RESOURCE_NAME,
  ROLLBACK_OPERATION_RESOURCE_NAME,
  FAIL_OPERATION_RESOURCE_NAME,
  NOT_IN_USE,
  IN_USE,
  SYNC_RESOURCE_NAME
} from "../../../constants/GenericConstants";
import {
  FAILED,
  FAILED_TEMP,
  ROLLED_BACK,
  COMPLETED,
  ONBOARDED,
  ERROR,
  CREATED,
  ENABLED
} from "../../../constants/States";

const NOT_AVAILABLE_MENU_ITEM = [
  SYNC,
  UPGRADE,
  TERMINATE,
  CLEAN_UP,
  ADD_NODE,
  DELETE_NODE,
  ROLLBACK,
  HEAL,
  BACKUP,
  FAIL_OPERATION
];

const SUPPORTED_LCM_OPERATION = {
  [UPGRADE]: ["change_package", "change_current_package"],
  [SCALE]: ["scale"],
  [ROLLBACK]: ["rollback"],
  [HEAL]: ["heal"],
  [TERMINATE]: ["terminate"],
  [MODIFY_VNF_INFO]: ["modify_information"],
  [SYNC]: ["sync"],
  [INSTANTIATE]: ["instantiate"]
};

@definition("e-context-menu", {
  style,
  props: {
    rowData: { attribute: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string" },
    permissions: { attribute: false, type: "object", default: {} },
    availability: { attribute: false, type: "object", default: {} }
  }
})
export default class ContextMenu extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
    this._isStateHidden = this._isStateHidden.bind(this);
    this.contextData = [
      {
        value: UPGRADE,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, FAILED, ROLLED_BACK],
        rsname: UPGRADE_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: SCALE,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, FAILED, ROLLED_BACK],
        rsname: SCALE_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: ROLLBACK,
        page: RESOURCES_PAGE,
        operationState: [COMPLETED],
        rsname: ROLLBACK_RESOURCE_NAME,
        scope: "GET"
      },
      {
        value: BACKUP,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, ROLLED_BACK],
        rsname: BACKUP_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: DELETE_BACKUP,
        page: RESOURCE_DETAILS_PAGE_BACKUPS_TAB,
        rsname: BACKUP_RESOURCE_NAME,
        scope: "DELETE"
      },
      {
        value: HEAL,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, ROLLED_BACK, FAILED, FAILED_TEMP],
        rsname: HEAL_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: CLEAN_UP,
        page: RESOURCES_PAGE,
        state: NOT_INSTANTIATED,
        operationState: [FAILED, ROLLED_BACK],
        rsname: RESOURCE_RESOURCE_NAME,
        scope: "DELETE"
      },
      {
        value: TERMINATE,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, FAILED, ROLLED_BACK],
        rsname: TERMINATE_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: ADD_NODE,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, ROLLED_BACK],
        addedToOss: "True",
        rsname: ADD_NODE_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: MODIFY_VNF_INFO,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, FAILED, ROLLED_BACK],
        rsname: RESOURCE_RESOURCE_NAME,
        scope: "PATCH"
      },
      {
        value: SYNC,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, FAILED, ROLLED_BACK],
        rsname: SYNC_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: DELETE_NODE,
        page: RESOURCES_PAGE,
        state: INSTANTIATED,
        operationState: [COMPLETED, ROLLED_BACK, FAILED],
        addedToOss: "False",
        rsname: DELETE_NODE_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: INSTANTIATE,
        page: PACKAGES_PAGE,
        rsname: INSTANTIATE_RESOURCE_NAME,
        onboardingState: [ONBOARDED],
        operationalStates: [ENABLED],
        scope: "POST"
      },
      {
        value: DELETE_PACKAGE,
        page: PACKAGES_PAGE,
        rsname: PACKAGE_RESOURCE_NAME,
        onboardingState: [CREATED, ERROR, ONBOARDED],
        usageState: NOT_IN_USE,
        scope: "DELETE"
      },
      {
        value: EXPORT_BACKUP,
        page: RESOURCE_DETAILS_PAGE_BACKUPS_TAB,
        backupStatus: "COMPLETE",
        scope: "POST",
        rsname: BACKUP_RESOURCE_NAME
      },
      { value: GO_TO_DETAILS, page: PACKAGES_PAGE, scope: "GET" },
      { value: GO_TO_DETAILS, page: RESOURCES_PAGE, scope: "GET" },
      {
        value: UPGRADE_CLUSTER_CONFIG,
        page: CISM_CLUSTERS_PAGE,
        rsname: CLUSTER_RESOURCE_NAME,
        scope: "PUT"
      },
      {
        value: UPGRADE_DEFAULT_CLUSTER_CONFIG,
        page: CISM_CLUSTERS_PAGE,
        rsname: CLUSTER_RESOURCE_NAME,
        scope: "PATCH"
      },
      {
        value: DEREGISTER_CLUSTER,
        page: CISM_CLUSTERS_PAGE,
        rsname: CLUSTER_RESOURCE_NAME,
        scope: "DELETE"
      },
      {
        value: ROLLBACK_OPERATION,
        page: OPERATIONS_PAGE,
        state: INSTANTIATED,
        operationState: [FAILED_TEMP],
        rsname: ROLLBACK_OPERATION_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: FAIL_OPERATION,
        page: OPERATIONS_PAGE,
        state: INSTANTIATED,
        operationState: [FAILED_TEMP],
        rsname: FAIL_OPERATION_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: ROLLBACK_OPERATION,
        page: RESOURCE_DETAILS_OPERATIONS_PAGE,
        state: INSTANTIATED,
        operationState: [FAILED_TEMP],
        rsname: ROLLBACK_OPERATION_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: FAIL_OPERATION,
        page: RESOURCE_DETAILS_OPERATIONS_PAGE,
        state: INSTANTIATED,
        operationState: [FAILED_TEMP],
        rsname: FAIL_OPERATION_RESOURCE_NAME,
        scope: "POST"
      },
      {
        value: ERROR_MESSAGE,
        page: RESOURCE_DETAILS_OPERATIONS_PAGE,
        state: INSTANTIATED,
        operationState: [FAILED_TEMP, FAILED, ROLLED_BACK]
      }
    ];
  }

  componentDidConnect() {
    this.specificPageContextData = this._getPageSpecificData(this.pageName);
  }

  handleEvent(event) {
    switch (event.target.attributes.value.value) {
      case "Go-to-details-page":
        if (this.pageName === PACKAGES_PAGE) {
          this.bubble("packageDetails-click", this.rowData);
        } else if (this.pageName === RESOURCES_PAGE) {
          this.bubble("resourceDetails-click", this.rowData);
        }
        break;
      case "Instantiate":
        this.bubble("instantiatePackage-click", this.rowData);
        break;
      case "Terminate":
        this.bubble(DIALOG_TERMINATE_EVENT, this.rowData);
        break;
      case "Upgrade":
        this.bubble("go-to-upgrade-wizard", this.rowData);
        break;
      case "Scale":
        this.bubble(GO_TO_SCALE_RESOURCE_EVENT, this.rowData);
        break;
      case "Clean-up":
        this.bubble(DIALOG_REMOVE_IDENTIFIER_EVENT, this.rowData);
        break;
      case "Add-node-to-ENM":
        this.bubble(GO_TO_ADD_NODE_EVENT, this.rowData);
        break;
      case "Delete-node-from-ENM":
        this.bubble(DIALOG_DELETE_NODE_EVENT, this.rowData);
        break;
      case "Delete-package":
        this.bubble(DELETE_PACKAGE_EVENT, this.rowData);
        break;
      case "Rollback":
        if (
          this.pageName === RESOURCE_DETAILS_OPERATIONS_PAGE ||
          this.pageName === OPERATIONS_PAGE
        ) {
          this.bubble(ROLLBACK_OPERTION_EVENT, this.rowData);
        } else {
          this.bubble(DIALOG_ROLLBACK_EVENT, this.rowData);
        }
        break;
      case "Heal":
        this.bubble(GO_TO_HEAL_RESOURCE_EVENT, this.rowData);
        break;
      case "Backup":
        this.bubble(DIALOG_BACKUP_EVENT, this.rowData);
        break;
      case "Export-to-external-location":
        this.bubble(DIALOG_EXPORT_BACKUP_EVENT, this.rowData);
        break;
      case "Delete":
        this.bubble(DIALOG_DELETE_BACKUP_EVENT, this.rowData);
        break;
      case "Deregister-cluster":
        this.bubble(DEREGISTER_CLUSTER_EVENT, this.rowData);
        break;
      case "Update-cluster-config":
        this.bubble(UPGRADE_CLUSTER_CONFIG_EVENT, this.rowData);
        break;
      case "Make-default":
        this.bubble(UPGRADE_DEFAULT_CLUSTER_CONFIG_EVENT, this.rowData);
        break;
      case "Force-fail":
        this.bubble(FAIL_OPERATION_EVENT, this.rowData);
        break;
      case "View-error-message":
        this.bubble(VIEW_MESSAGE_EVENT, this.rowData);
        break;
      case "Modify-VNF-Information":
        this.bubble(DIALOG_MODIFY_VNF_EVENT, this.rowData);
        break;
      case "Sync":
        this.bubble(DIALOG_SYNC_EVENT, this.rowData);
        break;
      default:
        console.log(`Unexpected event [${event.type}] is received.`);
    }
  }

  _getPageSpecificData(pageName) {
    return this.contextData.filter(function getPageData(data) {
      return data.page === pageName;
    });
  }

  _filterContextMenu(contextDataInstance) {
    if (this.rowData) {
      const { supportedOperations = [], error = null, operationalState = ENABLED } = this.rowData;

      // Validation for View error message
      if (!error && contextDataInstance.value === ERROR_MESSAGE) {
        return null;
      }

      if (
        !contextDataInstance.page.includes("Operations") &&
        contextDataInstance.state &&
        contextDataInstance.state !== this.rowData.instantiationState
      ) {
        return html``;
      }

      if (
        !contextDataInstance.page.includes("Operations") &&
        contextDataInstance.addedToOss &&
        this.rowData.addedToOss === contextDataInstance.addedToOss
      ) {
        return html``;
      }
      if (
        contextDataInstance.value === SCALE &&
        (this.rowData.scalingInfo === null ||
          (this.rowData.lifecycleOperationType === "Change_vnfpkg" &&
            this.rowData.operationState === "Failed"))
      ) {
        return html``;
      }

      if (contextDataInstance.rsname) {
        if (!this.permissions[contextDataInstance.rsname]) {
          return html``;
        }
        const scopeInPermissions = this.permissions[contextDataInstance.rsname].includes(
          contextDataInstance.scope
        );
        if (!scopeInPermissions) {
          return html``;
        }
      }

      if (contextDataInstance.operationalStates) {
        const { operationalStates } = contextDataInstance;
        const operationalStateRaw = operationalState.toUpperCase();

        if (!this._isStateMatch(operationalStates, operationalStateRaw)) {
          return html``;
        }
      }

      if (contextDataInstance.operationState) {
        const { operationState } = contextDataInstance;
        const operationStateRowData = this.rowData.operationState.toUpperCase();

        if (!this._isStateMatch(operationState, operationStateRowData)) {
          return html``;
        }
      }

      if (contextDataInstance.onboardingState) {
        const { onboardingState } = contextDataInstance;
        const onboardingStateRowData = this.rowData.onboardingState.toUpperCase();

        if (!this._isStateMatch(onboardingState, onboardingStateRowData)) {
          return html``;
        }
      }

      if (
        contextDataInstance.usageState &&
        contextDataInstance.usageState !== this.rowData.usageState
      ) {
        return html``;
      }

      if (
        !contextDataInstance.page.includes("Operations") &&
        contextDataInstance.value === ROLLBACK &&
        (this.rowData.downgradeSupported === undefined ||
          this.rowData.downgradeSupported === false ||
          this.rowData.lifecycleOperationType === INSTANTIATE)
      ) {
        return html``;
      }

      if (
        contextDataInstance.value === HEAL &&
        (this.rowData.healSupported === undefined || this.rowData.healSupported === false)
      ) {
        return html``;
      }

      if (
        contextDataInstance.backupStatus &&
        contextDataInstance.backupStatus !== this.rowData.status
      ) {
        return html``;
      }

      if (
        contextDataInstance.page === RESOURCE_DETAILS_OPERATIONS_PAGE &&
        contextDataInstance.value === ERROR_MESSAGE &&
        !this.rowData.error
      ) {
        return html``;
      }

      // If operation has an error logic will be skipped
      if (!validateOperation(supportedOperations, contextDataInstance.value)) {
        return null;
      }

      if (
        this.pageName === CISM_CLUSTERS_PAGE &&
        this.rowData.status === IN_USE &&
        contextDataInstance.value === DEREGISTER_CLUSTER
      ) {
        return html``;
      }

      if (
        this.pageName === CISM_CLUSTERS_PAGE &&
        this.rowData.isDefault === "Yes" &&
        contextDataInstance.value === UPGRADE_DEFAULT_CLUSTER_CONFIG
      ) {
        return html``;
      }

      if (
        !this.availability.packages &&
        NOT_AVAILABLE_MENU_ITEM.includes(contextDataInstance.value)
      ) {
        return html``;
      }

      return this._getContextMenu(contextDataInstance);
    }
    return html``;
  }

  _isStateMatch(operationState, operationStateRowData) {
    return (
      (Array.isArray(operationState) && operationState.includes(operationStateRowData)) ||
      operationState === operationStateRowData
    );
  }

  _getContextMenu(data) {
    let baseMenuId = "unknown";
    const dataValue = data.value.replace(/ /g, "-");
    let styleValue = "";
    switch (this.pageName) {
      case RESOURCES_PAGE:
        baseMenuId = `${this.rowData.vnfInstanceName}__${this.rowData.clusterName}`;
        styleValue = "min-width: 160px;";
        break;
      case PACKAGES_PAGE:
        baseMenuId = this.rowData.appPkgId;
        break;
      case RESOURCE_DETAILS_PAGE_BACKUPS_TAB:
        baseMenuId = `${this.rowData.name}`;
        break;
      case CISM_CLUSTERS_PAGE:
        baseMenuId = this.rowData.name;
        break;
      case OPERATIONS_PAGE:
        baseMenuId = `${this.rowData.vnfInstanceName}__${this.rowData.clusterName}`;
        break;
      case RESOURCE_DETAILS_OPERATIONS_PAGE:
        baseMenuId = `${this.rowData.vnfInstanceName}__${this.rowData.clusterName}`;
        break;
      default:
        console.log(`Unexpected pageName [${this.pageName}].`);
        break;
    }
    const menuId = `${dataValue}__${baseMenuId}`;
    return html`
      <div
        id=${menuId}
        menu-item
        tabindex="0"
        class="menu-option"
        value=${dataValue}
        @click="${this}"
        style="${styleValue}"
      >
        ${data.value}
      </div>
    `;
  }

  _isStateHidden() {
    return (
      this.rowData.operationState === "Rolling_back" &&
      (this.pageName === "Details Operations" || this.pageName === "Operations")
    );
  }

  render() {
    return this._isStateHidden()
      ? null
      : html`
          <div>
            <eui-base-v0-dropdown data-type="click" more="true">
              ${this.specificPageContextData.map(data => this._filterContextMenu(data))}
            </eui-base-v0-dropdown>
          </div>
        `;
  }
}

ContextMenu.register();

/**
 * Validate supported LCM operation
 *
 * @private
 * @param {array} supportedOperations: array of supported operations
 * @param {string} operation: specific operation
 * @returns {boolean}
 */
function validateOperation(supportedOperations = [], operation = "") {
  const LCMOperations = SUPPORTED_LCM_OPERATION[operation] || [];

  if (supportedOperations.length === 0) {
    return true;
  }

  return LCMOperations.length
    ? supportedOperations.some(item => LCMOperations.includes(item.operationName) && item.supported)
    : true;
}
