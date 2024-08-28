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
 * Component OperationsDetailsPanel is defined as
 * `<e-operations-details-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new OperationsDetailsPanel();
 *
 * Declaratively create component
 * @example
 * <e-operations-details-panel></e-operations-details-panel>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./operationsDetailsPanel.css";
import { NO_OPERATION_SELECTED } from "../../../constants/Messages";

const OPERATION_ATTRIBUTES = {
  vnfInstanceName: "Resource",
  lifecycleOperationType: "Operation",
  operationState: "Event",
  vnfProductName: "Type",
  vnfSoftwareVersion: "Software version",
  stateEnteredTime: "Timestamp"
};

function mapOperationStatusMessage([key, value]) {
  if (value) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">${key}</div>
        <div class="divTableCell" title=${value}>
          ${value}
        </div>
      </div>
    `;
  }

  return null;
}

/**
 * @property {boolean} selected - selected operation
 * @property {object} operationStatusMessage - message related to selected operation
 */

@definition("e-operations-details-panel", {
  style,
  home: "operations-details-panel",
  props: {
    selected: { attribute: true, type: "object", default: {} }
  }
})
export default class OperationsDetailsPanel extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        window.EUI.Router.goto(`resource-details?id=${this.selected.vnfInstanceId}`);
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  renderOperationDetails() {
    return Object.entries(OPERATION_ATTRIBUTES).map(([key, value]) => {
      let displayLabel = this.selected[key];
      const tooltipLabel = this.selected[key];
      if (key === "vnfInstanceName") {
        displayLabel = html`
          <a @click="${this.handleEvent}" href="JavaScript:void(0)"> ${displayLabel}</a>
        `;
      }
      return html`
        <div class="divTableRow">
          <div class="divTableCell">${value}</div>
          <div class="divTableCell" title=${tooltipLabel}>
            ${displayLabel}
          </div>
        </div>
      `;
    });
  }

  _renderOperationStatusMessageBlock() {
    if (!this.selected.operationStatusMessage) {
      return null;
    }

    const renderStatusMessages = Object.entries(this.selected.operationStatusMessage).map(
      mapOperationStatusMessage
    );

    return html`
      <div class="divPanelMsg divPanelBody">
        <div class="divPanelMsgTitle">Message:</div>
          <div class="divPanelMsgContent">
            ${renderStatusMessages}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      ${Object.keys(this.selected).length
        ? html`
            <div class="divPanelBody">
              ${this.renderOperationDetails()}
            </div>
              ${this._renderOperationStatusMessageBlock()}
            </div>
          `
        : html`
            <p>${NO_OPERATION_SELECTED}</p>
          `}
    `;
  }
}

OperationsDetailsPanel.register();
