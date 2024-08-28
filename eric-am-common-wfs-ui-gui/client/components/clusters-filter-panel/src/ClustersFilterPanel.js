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
 * Component ClustersFilterPanel is defined as
 * `<e-clusters-filter-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ClustersFilterPanel();
 *
 * Declaratively create component
 * @example
 * <e-clusters-filter-panel></e-clusters-filter-panel>
 *
 * @extends {LitComponent}
 */
import "@eui/base";
import { definition } from "@eui/component";
import { html } from "@eui/lit-component";

import "../../generic-checkbox/src/GenericCheckBox";
import BaseFilterPanel from "../../base-filter-panel/src/BaseFilterPanel";
import { NOT_IN_USE, IN_USE } from "../../../constants/GenericConstants";
import style from "./clustersFilterPanel.css";

const USAGE_STATE_VALUES = [IN_USE, NOT_IN_USE];

const FILTER_FIELDS = [
  { type: "text", data: { name: "Cluster name" } },
  {
    type: "checkbox",
    data: { status: { label: "Usage state", values: USAGE_STATE_VALUES } }
  }
];

@definition("e-clusters-filter-panel", {
  style,
  home: "clusters-filter-panel"
})
export default class ClustersFilterPanel extends BaseFilterPanel {
  handleApply() {
    super.handleApply(["name", "status"]);
  }

  render() {
    return html`
      <div class="divColumn">
        <div class="divColumnBody">
          ${this.renderFilterFields(FILTER_FIELDS)}
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

ClustersFilterPanel.register();
