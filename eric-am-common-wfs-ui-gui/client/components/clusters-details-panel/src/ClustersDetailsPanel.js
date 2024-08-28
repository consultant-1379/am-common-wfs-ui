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
 * Component ClustersDetailsPanel is defined as
 * `<e-clusters-details-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new ClustersDetailsPanel();
 *
 * Declaratively create component
 * @example
 * <e-clusters-details-panel></e-clusters-details-panel>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./clustersDetailsPanel.css";
import { NO_CLUSTER_SELECTED } from "../../../constants/Messages";

const CLUSTER_ATTRIBUTES = {
  name: "Cluster name",
  isDefault: "Is default",
  status: "Usage state",
  crdNamespace: "CRD Namespace",
  description: "Description"
};

/**
 * @property {Object} selected - selected cluster
 */

@definition("e-clusters-details-panel", {
  style,
  home: "clusters-details-panel",
  props: {
    selected: { attribute: true, type: "object", default: {} }
  }
})
export default class ClustersDetailsPanel extends LitComponent {
  renderClusterDetails() {
    return Object.entries(CLUSTER_ATTRIBUTES).map(([key, value]) => {
      let displayLabel = this.selected[key];
      const tooltipLabel = this.selected[key];
      if (key === "isDefault" && displayLabel === "Yes") {
        displayLabel = html`
          <e-custom-cell-state .cellValue=${displayLabel}> </e-custom-cell-state>
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

  render() {
    return html`
      ${Object.keys(this.selected).length
        ? html`
            <div class="divPanelBody">
              ${this.renderClusterDetails()}
            </div>
          `
        : html`
            <p>${NO_CLUSTER_SELECTED}</p>
          `}
    `;
  }
}

ClustersDetailsPanel.register();
