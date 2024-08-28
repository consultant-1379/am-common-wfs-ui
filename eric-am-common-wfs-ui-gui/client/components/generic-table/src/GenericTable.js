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
 * Component GenericTable is defined as
 * `<e-generic-table>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericTable();
 *
 * Declaratively create component
 * @example
 * <e-generic-table></e-generic-table>
 *
 * @extends {LitComponent}
 */
import { Table } from "@eui/table";
import { definition } from "@eui/component";
import { html } from "@eui/lit-component";
import style from "./genericTable.css";
import "../../custom-cell/src/CustomCell";
import "../../custom-cell-state/src/CustomCellState";
import {
  RESOURCES_PAGE,
  PACKAGES_PAGE,
  OPERATIONS_PAGE,
  RESOURCE_DETAILS_OPERATIONS_PAGE,
  RESOURCE_DETAILS_PAGE_BACKUPS_TAB,
  CISM_CLUSTERS_PAGE,
  ERROR_INFORMATION,
  SUPPORTED_OPERATION,
  UNSUPPORTED_OPERATION
} from "../../../constants/Messages";
import {
  BACKUP_RESOURCE_NAME,
  PACKAGES_DETAILS_URI,
  RESOURCES_DETAILS_URI,
  CLUSTER_RESOURCE_NAME
} from "../../../constants/GenericConstants";
import { RESOURCE_COMPONENTS_COLUMNS } from "../../../utils/CommonUtils";
import { generateContextMenuIdValue } from "../../../utils/ContextMenuUtils";

/**
 * @property {array} columns - column headings.
 * @property {boolean} pageName - Name of Page.
 */
@definition("e-generic-table", {
  style,
  props: {
    columns: {
      attribute: false,
      type: "array",
      default: []
    },
    sortable: { attribute: false, type: "boolean", default: true },
    dashed: { attribute: true, type: "boolean", default: true },
    compact: { attribute: true, type: "boolean", default: true },
    pageName: { attribute: true, type: "string" },
    permissions: { attribute: false, type: "object", default: {} },
    hideContextMenu: { attribute: false, type: "boolean" },
    attributesTable: { attribute: true, type: "boolean", default: false },
    availability: { attribute: false, type: "object", default: {} }
  }
})
export default class GenericTable extends Table {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event, row) {
    if (row) {
      const cell = event.detail;
      if (cell.hasAttribute("truncated")) {
        this.bubble("additionalAttributesContent-click", row);
      }
    }
  }

  /**
   * Override cell from base class. Called each time a cell should be rendered.
   *
   * @function cell
   * @param {Object} row - Row data.
   * @param {Object} column - Column definition.
   * @returns contents of cell.
   */
  cell(row, column) {
    const idValue = `${generateContextMenuIdValue(row, this.pageName)}`;

    if (
      (column.attribute === "appCompositeName" && this.pageName === PACKAGES_PAGE) ||
      (column.attribute === "vnfInstanceName" && this.pageName === RESOURCES_PAGE)
    ) {
      const cellHref =
        column.attribute === "appCompositeName"
          ? `${PACKAGES_DETAILS_URI}${row.appPkgId}`
          : `${RESOURCES_DETAILS_URI}${row.instanceId}`;

      return html`
        <e-custom-cell
          id=${idValue}
          .row=${row}
          .permissions=${this.permissions}
          .availability=${this.availability}
          .column=${column.attribute}
          .pageName=${this.pageName}
          .cellHref=${cellHref}
          underlined
        ></e-custom-cell>
      `;
    }
    if (column.attribute === "name" && this.pageName === CISM_CLUSTERS_PAGE) {
      return html`
        <e-custom-cell
          id=${idValue}
          @cell-clicked=${this}
          .row=${row}
          .permissions=${this.permissions}
          .hideContextMenu=${!this.permissions[CLUSTER_RESOURCE_NAME]}
          .column=${column.attribute}
          .pageName=${this.pageName}
          .availability=${this.availability}
        ></e-custom-cell>
      `;
    }

    if (column.attribute === "vnfInstanceName" && this.pageName === OPERATIONS_PAGE) {
      let hideMenu = true;
      if (row.operationState === "Failed_temp") {
        hideMenu = false;
      }
      return html`
        <e-custom-cell
          id=${idValue}
          .row=${row}
          .column=${column.attribute}
          .permissions=${this.permissions}
          .pageName=${this.pageName}
          .hideContextMenu=${hideMenu}
          .availability=${this.availability}
          .cellHref=${`${RESOURCES_DETAILS_URI}${row.vnfInstanceId}`}
          underlined
        ></e-custom-cell>
      `;
    }
    if (
      column.attribute === "lifecycleOperationType" &&
      this.pageName === RESOURCE_DETAILS_OPERATIONS_PAGE
    ) {
      let hideMenu = true;
      if (row.operationState === "Failed_temp" || row.error) {
        hideMenu = false;
      }
      return html`
        <e-custom-cell
          id=${idValue}
          .row=${row}
          .column=${column.attribute}
          .permissions=${this.permissions}
          .pageName=${this.pageName}
          .availability=${this.availability}
          .hideContextMenu=${hideMenu}
        ></e-custom-cell>
      `;
    }

    if (column.attribute === "status" && this.pageName === RESOURCE_DETAILS_PAGE_BACKUPS_TAB) {
      return html`
        <e-custom-cell
          id=${idValue}
          .row=${row}
          .column=${column.attribute}
          .pageName=${this.pageName}
          .hideContextMenu=${true}
        ></e-custom-cell>
      `;
    }

    if (
      (column.attribute === "operationState" && this.pageName === RESOURCES_PAGE) ||
      (column.attribute === RESOURCE_COMPONENTS_COLUMNS.state &&
        this.pageName !== CISM_CLUSTERS_PAGE) ||
      (column.attribute === "isDefault" && this.pageName === CISM_CLUSTERS_PAGE)
    ) {
      return html`
        <e-custom-cell-state
          id=${idValue}
          .row=${row}
          .cellValue=${row[column.attribute]}
          .column=${column.attribute}
        ></e-custom-cell-state>
      `;
    }

    if (this.attributesTable && column.attribute === "value") {
      return html`
        <e-custom-cell
          id=${idValue}
          @cell-clicked=${event => this.handleEvent(event, row)}
          .row=${row}
          .column=${column.attribute}
          .pageName=${this.pageName}
          .hideContextMenu=${true}
        ></e-custom-cell>
      `;
    }

    if (this.pageName === RESOURCE_DETAILS_PAGE_BACKUPS_TAB && column.attribute === "name") {
      let isContextMenuHidden = false;
      if (
        !this.permissions[BACKUP_RESOURCE_NAME] ||
        !this.permissions[BACKUP_RESOURCE_NAME].includes("POST") ||
        !this.permissions[BACKUP_RESOURCE_NAME].includes("DELETE")
      ) {
        isContextMenuHidden = true;
      }
      return html`
        <e-custom-cell
          id=${idValue}
          .row=${row}
          .column=${column.attribute}
          .pageName=${this.pageName}
          .hideContextMenu=${isContextMenuHidden}
          .permissions=${this.permissions}
          .availability=${this.availability}
        ></e-custom-cell>
      `;
    }

    if (column.table === "supported-operations") {
      const value = row[column.attribute];
      const iconObj = { type: "triangle-warning", color: "#d97833" };

      return value === SUPPORTED_OPERATION || value === UNSUPPORTED_OPERATION
        ? html`
            <e-custom-cell-state
              id=${idValue}
              .row=${row}
              .cellValue=${value}
              .column=${column.attribute}
            ></e-custom-cell-state>
          `
        : html`
            <e-custom-cell
              underlined
              id=${idValue}
              .row=${row}
              .column=${column.attribute}
              .hideContextMenu=${true}
              .icon=${iconObj}
              .cellValue=${ERROR_INFORMATION}
              @cell-clicked=${event => this.bubble("cell:clicked", { row, cell: event.detail })}
            ></e-custom-cell>
          `;
    }

    if (column.table === "onboardingState") {
      const value = row[column.attribute];
      return html`
        <e-custom-cell-state
          id=${idValue}
          .row=${row}
          .cellValue=${value}
          .column=${column.attribute}
        ></e-custom-cell-state>
      `;
    }

    return html`
      <div
        class="common-cell"
        title=${row[column.attribute]}
        column=${column.attribute}
        id=${idValue}
      >
        ${row[column.attribute]}
      </div>
    `;
  }
}

/**
 * Register the component as e-generic-table.
 * Registration can be done at a later time and with a different name
 */
GenericTable.register();
