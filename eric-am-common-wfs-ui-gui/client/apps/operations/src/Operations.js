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
import "../../../components/generic-dialog/src/GenericDialog";
import { DialogModel } from "../../../components/generic-dialog/src/DialogModel";
import "../../../components/force-fail-dialog/src/ForceFailDialog";
import "../../../components/rollback-dialog/src/RollbackDialog";

// styles
import style from "./operations.css";

// helpers
import { setPaginationData } from "../../../utils/FilterUtils";
import {
  accessDenied,
  checkPermissions,
  mapOperationsData,
  showNotification,
  generateSubtitleByPage,
  SYNC_INTERVAL
} from "../../../utils/CommonUtils";
import {
  OPERATIONS_PAGE,
  CANCEL_BUTTON,
  FORCE_FAIL_BUTTON,
  FORCE_FAIL_CONFIRMATION_MESSAGE_SINGLE,
  FAIL_OPERATION_MESSAGE,
  ROLLBACK_CONFIRMATION_MESSAGE,
  ROLLBACK_WARNING_MESSAGE,
  ROLLBACK_BUTTON
} from "../../../constants/Messages";
import {
  ROLLBACK_OPERTION_EVENT,
  FAIL_OPERATION_EVENT,
  DIALOG_BUTTON_CLICK_EVENT
} from "../../../constants/Events";
import { postRollback, postForceFail } from "../../../api/orchestrator";
import { fetchOperations, fetchRollbackInfo } from "../../../api/internal";

const defaultColumnsState = [
  { title: "Resource instance name", attribute: "vnfInstanceName", sortable: true },
  { title: "Cluster", attribute: "clusterName", sortable: true },
  { title: "Operation", attribute: "lifecycleOperationType", sortable: true },
  { title: "Operation state", attribute: "operationState", width: "15%", sortable: true },
  { title: "Type", attribute: "vnfProductName", sortable: true },
  { title: "Software version", attribute: "vnfSoftwareVersion", sortable: true },
  { title: "Timestamp", attribute: "stateEnteredTime", sortable: true },
  { title: "Modified by", attribute: "username", sortable: true }
];

/**
 * Operations is defined as
 * `<e-operations>`
 *
 * Imperatively create application
 * @example
 * let app = new Operations();
 *
 * Declaratively create application
 * @example
 * <e-operations></e-operations>
 *
 * @extends {App}
 */
@definition("e-operations", {
  style,
  props: {
    response: { attribute: false },
    data: { attributes: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string", default: OPERATIONS_PAGE },
    forceFailData: { attribute: false, type: "object" },
    rollbackData: { attribute: false, type: "object" },
    rollbackInfo: { attribute: false, type: "object" },
    refreshData: { attribute: false, type: "boolean", default: false },
    filterQueryJson: { attribute: false, type: "object", default: {} }
  }
})
export default class Operations extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.handleEvent = this.handleEvent.bind(this);
    this.checkPermissions = checkPermissions.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.columns = defaultColumnsState;
    this.setPaginationData = setPaginationData.bind(this);

    this._postRollback = this._postRollback.bind(this);
    this._fetchOperations = this._fetchOperations.bind(this);
    this._postForceFail = this._postForceFail.bind(this);
  }

  /**
   * It will fetch operations from own API endpoint and filtering will be handled by using the same endpoint with parameters.
   * All operations will be fetched from the Resources for now.
   */
  componentDidConnect() {
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
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
  }

  /**
   * Event handler for `filters-changed` event
   *
   * @param {object} data: event object
   */
  _onFilterChange({ detail }) {
    this.setPaginationData(detail, defaultColumnsState);
    this._fetchOperations();
  }

  handleEvent(event) {
    switch (event.type) {
      case ROLLBACK_OPERTION_EVENT:
        this.rollbackInfo = event.detail;
        this._fetchRollbackInformation(event.detail);
        break;
      case FAIL_OPERATION_EVENT:
        this.forceFailData = event.detail;
        break;
      case DIALOG_BUTTON_CLICK_EVENT:
        if (event.detail.selected === CANCEL_BUTTON) {
          this.forceFailData = null;
          this.rollbackData = null;
        } else if (event.detail.selected === FORCE_FAIL_BUTTON) {
          this._postForceFail(this.forceFailData.operationOccurrenceId);
          this.forceFailData = null;
        } else if (event.detail.selected === ROLLBACK_BUTTON) {
          this._postRollback(this.rollbackData.operationOccurrenceId);
          this.rollbackData = null;
        }
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
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

  /**
   * Fetch operations
   *
   * @returns {Promise<void>}
   */
  async _fetchOperations() {
    try {
      const queryParameterAsJson = this.filterQueryJson;

      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      const response = await fetchOperations(queryParameterAsJson);

      this.data = mapOperationsData(response);
      this.subtitle = generateSubtitleByPage(response.page);

      this.requestInterval = setTimeout(this._fetchOperations, SYNC_INTERVAL);
    } catch (error) {
      this.data = {};
      console.error("Error when fetching operations: ", error);
    }
  }

  /**
   * Fetch rollback info
   *
   * @returns {Promise<void>}
   */
  async _fetchRollbackInformation(resource) {
    try {
      const { vnfInstanceId } = resource;
      const { sourcePackageVersion, destinationPackageVersion } = await fetchRollbackInfo({
        resourceId: vnfInstanceId
      });

      const sourceInfo = sourcePackageVersion;
      const targetInfo = destinationPackageVersion;

      this.rollbackInfo.source = sourceInfo;
      this.rollbackInfo.target = targetInfo;
      this.rollbackData = this.rollbackInfo;
    } catch (error) {
      this.rollbackInfo = null;
      console.error("Error when fetching rollback info: ", error);
    }
  }

  /**
   * Post rollback
   *
   * @param {object} vnfLcmOpOccId - vnfLcmOpOccId
   *
   * @returns {Promise<void>}
   */
  async _postRollback(vnfLcmOpOccId) {
    try {
      await postRollback({ vnfLcmOpOccId });

      showNotification("Rollback of operation has started", "", false, 5000);
      this._enableCallback();
    } catch (error) {
      console.info(`Post rollback has failed for ${vnfLcmOpOccId}`);
    } finally {
      this.rollbackData = null;
    }
  }

  /**
   * Post force fail
   *
   * @param {object} vnfLcmOpOccId - vnfLcmOpOccId
   *
   * @returns {Promise<void>}
   */
  async _postForceFail(vnfLcmOpOccId) {
    try {
      await postForceFail({ vnfLcmOpOccId });

      showNotification(FAIL_OPERATION_MESSAGE, "", false, 5000);
      this._enableCallback();
    } catch (error) {
      console.info(`Post force fail has failed for ${vnfLcmOpOccId}`);
    } finally {
      this.forceFailData = null;
    }
  }

  _enableCallback() {
    this._fetchOperations();
  }

  _renderFailOperationDialog() {
    const failOperationDialogue = new DialogModel(
      "Force fail",
      FORCE_FAIL_CONFIRMATION_MESSAGE_SINGLE
    );
    const buttons = [CANCEL_BUTTON, FORCE_FAIL_BUTTON];
    failOperationDialogue.setNextParagraph(" Do you want to continue?");

    failOperationDialogue.setButtonLabels(buttons);
    failOperationDialogue.setWarningButtonIndex(1);

    return html`
      <e-force-fail-dialog
        .dialogModel=${failOperationDialogue}
        @dialog-button-click=${this}
        .data=${this.forceFailData}
      >
      </e-force-fail-dialog>
    `;
  }

  _renderRollbackOperationDialog() {
    const rollbackOperationDialogue = new DialogModel(
      `Rollback ${this.rollbackData.vnfInstanceName}`,
      ROLLBACK_CONFIRMATION_MESSAGE.replace("<RESOURCE>", this.rollbackData.vnfInstanceName)
    );
    const buttons = [CANCEL_BUTTON, ROLLBACK_BUTTON];

    rollbackOperationDialogue.setButtonLabels(buttons);
    rollbackOperationDialogue.setPrimaryButtonIndex(1);
    rollbackOperationDialogue.setNextParagraph(ROLLBACK_WARNING_MESSAGE);

    return html`
      <e-rollback-dialog
        .dialogModel=${rollbackOperationDialogue}
        @dialog-button-click=${this}
        .data=${this.rollbackData}
      >
      </e-rollback-dialog>
    `;
  }

  _renderOperationsPage() {
    const data = this.data.items ? this.data.items : [];
    return html`
      <e-generic-multi-panel
        .data=${data}
        .pageName=${this.pageName}
        .permissions=${this.userInformation.permissions}
        .columns=${this.columns}
        @display-rollback-operation-dialog=${this}
        @display-fail-operation-dialog=${this}
        .availability=${this.appConfiguration.availability}
        .subtitle=${this.subtitle}
        @filters-changed=${this._onFilterChange}
        .pagination=${this.data.page}
      ></e-generic-multi-panel>
      ${this.forceFailData ? this._renderFailOperationDialog() : html``}
      ${this.rollbackData ? this._renderRollbackOperationDialog() : html``}
    `;
  }

  /**
   * Render the <e-operations> app. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      ${this.isValidPermission ? this._renderOperationsPage() : accessDenied()}
    `;
  }
}

/**
 * Register the component as e-operations.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// Operations.register();
