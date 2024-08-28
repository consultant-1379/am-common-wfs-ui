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
 * Component ResourceFilterPanel is defined as
 * `<e-resource-filter-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceFilterPanel();
 *
 * Declaratively create component
 * @example
 * <e-resource-filter-panel></e-resource-filter-panel>
 *
 * @extends {LitComponent}
 */
import "@eui/base";
import { definition } from "@eui/component";
import { html } from "@eui/lit-component";
import "../../generic-checkbox/src/GenericCheckBox";
import BaseFilterPanel from "../../base-filter-panel/src/BaseFilterPanel";
import { OPERATION_STATE_VALUES, OPERATION_VALUES } from "../../../utils/CommonUtils";
import style from "./resourceFilterPanel.css";

const FILTER_FIELDS = [
  { type: "text", data: { vnfInstanceName: "Resource instance name" } },
  { type: "dropdown", data: { vnfProductName: "Type" } },
  { type: "dropdown", data: { vnfSoftwareVersion: "Software version" } },
  { type: "dropdown", data: { vnfdVersion: "Package version" } },
  {
    type: "checkbox",
    data: { lifecycleOperationType: { label: "Last operation", values: OPERATION_VALUES } }
  },
  {
    type: "checkbox",
    data: { operationState: { label: "Last operation state", values: OPERATION_STATE_VALUES } }
  },
  { type: "dropdown", data: { clusterName: "Cluster" } }
];

const DATE_LABELS = ["From", "To"];
const LAST_MODIFIED = "Last modified";

@definition("e-resource-filter-panel", {
  style,
  home: "resource-filter-panel"
})
export default class ResourceFilterPanel extends BaseFilterPanel {
  handleApply() {
    super.handleApply("lcmOperationDetails", [
      "operationState",
      "lastStateChanged",
      "lifecycleOperationType"
    ]);
  }

  /**
   * Render the <e-resource-filter-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="divColumn">
        <div class="divColumnBody">
          ${this.renderFilterFields(FILTER_FIELDS)}
          ${this.renderDatePickerComponent(DATE_LABELS, LAST_MODIFIED)}
          <div class="divColumnRow">
            <div class="divColumnButtonCell">
              <eui-base-v0-button @click="${() => this.handleReset()}"> Reset</eui-base-v0-button>
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
 * Register the component as e-resource-filter-panel.
 * Registration can be done at a later time and with a different name
 */
ResourceFilterPanel.register();
