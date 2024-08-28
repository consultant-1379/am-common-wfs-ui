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
import { DialogModel } from "../../generic-dialog/src/DialogModel";
import "../../force-fail-dialog/src/ForceFailDialog";
import "../../rollback-dialog/src/RollbackDialog";

// styles
import style from "./resourceOperationsDetails.css";

// helpers
import { sortCol, showNotification } from "../../../utils/CommonUtils";
import {
  CANCEL_BUTTON,
  FORCE_FAIL_BUTTON,
  ROLLBACK_BUTTON,
  FORCE_FAIL_CONFIRMATION_MESSAGE_SINGLE,
  ROLLBACK_CONFIRMATION_MESSAGE,
  FAIL_OPERATION_MESSAGE,
  OPERATION_STARTED_MESSAGE,
  ROLLBACK_WARNING_MESSAGE
} from "../../../constants/Messages";
import {
  ROLLBACK_OPERTION_EVENT,
  FAIL_OPERATION_EVENT,
  DIALOG_BUTTON_CLICK_EVENT,
  REFRESH_OPERATIONS_DATA_EVENT,
  VIEW_MESSAGE_EVENT
} from "../../../constants/Events";
import { postRollback, fetchOperation, postOperationFail } from "../../../api/orchestrator";
import { fetchRollbackInfo } from "../../../api/internal";

/**
 * Component ResourceOperationsDetails is defined as
 * `<e-resource-operations-details>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceOperationsDetails();
 *
 * Declaratively create component
 * @example
 * <e-resource-operations-details></e-resource-operations-details>
 *
 * @property {array} operationsData - data for operations tab.
 * @property {boolean} renderMessageDialog - shows the dialog box
 * @property {boolean} hideOperationMessagePanel - conditional flag to render operation message panel
 * @property {object} operationStatusMessage - message related to selected operation
 *
 * @extends {LitComponent}
 */
@definition("e-resource-operations-details", {
  style,
  home: "resource-operations-details",
  props: {
    operationsData: { attribute: true, type: "object", default: {} },
    renderMessageDialog: { attribute: false, type: "boolean", default: false },
    hideOperationMessagePanel: { attribute: false, type: "boolean", default: true },
    operationStatusMessage: { attribute: false, type: "object", default: {} },
    permissions: { attribute: false, type: "object", default: {} },
    forceFailData: { attribute: false, type: "object" },
    rollbackData: { attribute: false, type: "object" },
    rollbackInfo: { attribute: false, type: "object" },
    pageName: { attribute: true, type: "string" },
    availability: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceOperationsDetails extends LitComponent {
  constructor() {
    super();
    this.operationStatusMessage = {};
    this.selectedLcmOperation = {};
    this.operation = {};
    this.handleEvent = this.handleEvent.bind(this);
    this.operationsCols = [
      { title: "Operation", attribute: "lifecycleOperationType", sortable: true },
      { title: "Event", attribute: "operationState", sortable: true },
      { title: "Type", attribute: "vnfProductName", sortable: true },
      { title: "Software version", attribute: "vnfSoftwareVersion", sortable: true },
      { title: "Timestamp", attribute: "stateEnteredTime", sortable: true },
      { title: "Modified by", attribute: "username", sortable: true }
    ];

    this._postRollback = this._postRollback.bind(this);
    this._fetchOperation = this._fetchOperation.bind(this);
    this._fetchRollbackInformation = this._fetchRollbackInformation.bind(this);
    this._postOperationFail = this._postOperationFail.bind(this);
  }

  componentDidConnect() {
    this.hideOperationMessagePanel = true;
  }

  /**
   * Post rollback
   *
   * @returns {Promise<void>}
   */
  async _postRollback(vnfLcmOpOccId) {
    try {
      await postRollback({ vnfLcmOpOccId });

      showNotification(
        "Rollback of operation has started",
        OPERATION_STARTED_MESSAGE,
        false,
        5000,
        "operations"
      );
      this.bubble(REFRESH_OPERATIONS_DATA_EVENT, { refreshData: true });
    } catch (error) {
      console.info(`Post rollback has failed for ${vnfLcmOpOccId}`);
    } finally {
      this.rollbackData = null;
    }
  }

  /**
   * Fetch operation
   *
   * @returns {Promise<void>}
   */
  async _fetchOperation(vnfLcmOpOccId) {
    try {
      const response = await fetchOperation({ vnfLcmOpOccId });

      this.operationStatusMessage = response.error;
      this.hideOperationMessagePanel = false;
    } catch (error) {
      this.operationStatusMessage = error;
      console.error("Error when fetching operation: ", error);
    }
  }

  /**
   * Fetch rollback info
   *
   * @returns {Promise<void>}
   */
  async _fetchRollbackInformation(resource) {
    try {
      const { instanceId: resourceId } = resource;
      const { sourcePackageVersion, destinationPackageVersion } = await fetchRollbackInfo({
        resourceId
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
   * Post operation fail
   *
   * @returns {Promise<void>}
   */
  async _postOperationFail(vnfLcmOpOccId) {
    try {
      await postOperationFail({ vnfLcmOpOccId });

      showNotification(FAIL_OPERATION_MESSAGE, "", false, 5000);
      this.bubble(REFRESH_OPERATIONS_DATA_EVENT, { refreshData: true });
    } catch (error) {
      console.error("Error when post operation fail: ", error);
    } finally {
      this.forceFailData = null;
    }
  }

  handleEvent(event) {
    switch (event.type) {
      case "row-selected":
        if (event.detail && event.detail.length === 1) {
          [this.operation] = event.detail;
          if (
            this.selectedLcmOperation.operationOccurrenceId !== this.operation.operationOccurrenceId
          ) {
            this.hideOperationMessagePanel = true;
          }
        }
        break;
      case VIEW_MESSAGE_EVENT:
        if (event.detail) {
          [this.selectedLcmOperation] = [event.detail];
          this._fetchOperation(this.selectedLcmOperation.operationOccurrenceId);
        } else {
          this.hideOperationMessagePanel = true;
        }
        break;
      case "eui-dialog:cancel":
        this.renderMessageDialog = false;
        break;
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
          this._postOperationFail(this.forceFailData.operationOccurrenceId);
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

  renderOperationsMessageDialog() {
    const title = `${this.selectedLcmOperation.operationState} ${
      this.selectedLcmOperation.lifecycleOperationType
    }`;
    return html`
      <eui-base-v0-dialog
        @eui-dialog:cancel=${this.handleEvent}
        label=${title}
        ?show=${this.renderMessageDialog}
        fullscreen
      >
        <div class="operationMessageDialog-content" slot="content">
          <div class="operationMessageDialog-date">
            ${this.selectedLcmOperation.stateEnteredTime}<br /><br />
          </div>
          <div class="operationMessageDialog-message">
            ${this.getOperationMessage()}
          </div>
        </div>
      </eui-base-v0-dialog>
    `;
  }

  getOperationMessage() {
    return html`
      ${Object.entries(this.operationStatusMessage).map(([key, value]) =>
        value != null
          ? html`
              ${key} = {<br />${value} <br />}<br />
            `
          : html``
      )}
    `;
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
    rollbackOperationDialogue.setNextParagraph(" Do you want to continue?");

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

  render() {
    return html`
      <div class="customPanel">
        <div class="table-panel">
          <div class="customMainPanelInfo">
            Operation History
            <span class="table-count">(${this.operationsData.length})</span>
          </div>
          <e-generic-table
            id="resource-details-operations-table"
            compact
            dashed
            single-select
            @row-selected=${this.handleEvent}
            @display-rollback-operation-dialog=${this}
            @display-fail-operation-dialog=${this}
            @open-error-message-flyout=${this}
            .columns=${this.operationsCols}
            .data=${this.operationsData}
            .permissions=${this.permissions}
            .availability=${this.availability}
            .pageName=${this.pageName}
            @eui-table:sort=${sortCol}
          ></e-generic-table>
        </div>
        ${!this.hideOperationMessagePanel
          ? html`
              <div class="customRightPanel">
                <div class="customRightPanelInfo">
                  <div
                    class="close-flyout"
                    @click=${() => {
                      this.hideOperationMessagePanel = true;
                    }}
                  >
                    <eui-v0-icon name="cross"></eui-v0-icon>
                  </div>

                  Message
                  ${this.operationStatusMessage &&
                  Object.keys(this.operationStatusMessage).length > 0
                    ? html`
                        <div
                          class="operationMessageDialog-panel"
                          @click=${() => {
                            this.renderMessageDialog = true;
                          }}
                        >
                          <eui-v0-icon name="message-contact-us"></eui-v0-icon>
                          View in dialog
                        </div>
                      `
                    : ``}
                </div>
                ${this.operationStatusMessage && Object.keys(this.operationStatusMessage).length > 0
                  ? html`
                      <div class="customPanelText">${this.getOperationMessage()}</div>
                    `
                  : html`
                      <div class="customPanelText">No Messages</div>
                    `}
              </div>
            `
          : html``}
      </div>
      ${this.renderOperationsMessageDialog()}
      ${this.forceFailData ? this._renderFailOperationDialog() : html``}
      ${this.rollbackData ? this._renderRollbackOperationDialog() : html``}
    `;
  }
}

ResourceOperationsDetails.register();
