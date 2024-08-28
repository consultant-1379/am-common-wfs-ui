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
 * Component OperationsFilterPanel is defined as
 * `<e-operations-filter-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new OperationsFilterPanel();
 *
 * Declaratively create component
 * @example
 * <e-operations-filter-panel></e-operations-filter-panel>
 *
 * @extends {LitComponent}
 */
import "@eui/base";
import { definition } from "@eui/component";
import { html } from "@eui/lit-component";
import "../../generic-checkbox/src/GenericCheckBox";
import BaseFilterPanel from "../../base-filter-panel/src/BaseFilterPanel";
import { OPERATIONS_FILTER_CLASS } from "../../../utils/FilterUtils";
import { OPERATIONS_FILTER_URL } from "../../../utils/RestUtils";
import { OPERATION_STATE_VALUES, OPERATION_VALUES } from "../../../utils/CommonUtils";
import style from "./operationsFilterPanel.css";

const FILTER_FIELDS = [
  { type: "text", data: { vnfInstanceName: "Resource instance name" } },
  { type: "dropdown", data: { clusterName: "Cluster" } },
  {
    type: "checkbox",
    data: { lifecycleOperationType: { label: "Operation", values: OPERATION_VALUES } }
  },
  {
    type: "checkbox",
    data: { operationState: { label: "Operation state", values: OPERATION_STATE_VALUES } }
  },
  { type: "dropdown", data: { vnfProductName: "Type" } },
  { type: "dropdown", data: { vnfSoftwareVersion: "Software version" } },
  { type: "text", data: { username: "Modified by" } }
];

const DATE_LABELS = ["From", "To"];
const TIMESTAMP = "Timestamp";

@definition("e-operations-filter-panel", {
  style,
  home: "operations-filter-panel"
})
export default class OperationsFilterPanel extends BaseFilterPanel {
  constructor() {
    super(OPERATIONS_FILTER_CLASS);
    super.initializeDropdownFilters(FILTER_FIELDS, OPERATIONS_FILTER_URL);
  }

  componentDidConnect() {
    super.initializeDropdownFilters(FILTER_FIELDS, OPERATIONS_FILTER_URL);
  }

  handleApply() {
    super.handleApply(["operationState", "stateEnteredTime", "lifecycleOperationType"]);
  }

  /**
   * Render the <e-packages-filter-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="divColumn">
        <div class="divColumnBody">
          ${this.renderFilterFields(FILTER_FIELDS)}
          ${this.renderDatePickerComponent(DATE_LABELS, TIMESTAMP)}
          <div class="divColumnRow">
            <div class="divColumnButtonCell">
              <eui-base-v0-button @click="${() => this.handleReset()}">Reset</eui-base-v0-button>
              <eui-base-v0-button @click="${() => this.handleApply()}" primary
                >Apply</eui-base-v0-button
              >
              <p class="errorMessage invalidDateSelection"></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Register the component as e-operations-filter-panel.
 * Registration can be done at a later time and with a different name
 */
OperationsFilterPanel.register();
