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
import "../supported-operations-error-dialog/SupportedOperationsErrorDialog";

// helpers
import { updateColumnState, sortNatural } from "../../../../../utils/CommonUtils";
import { fetchPackageSupportedOperation } from "../../../../../api/onboarding";
import { SUPPORTED_OPERATION, UNSUPPORTED_OPERATION } from "../../../../../constants/Messages";

// const
const defaultColumnsState = [
  { title: "Operation", attribute: "operationName", sortable: true, sort: "asc" },
  { title: "Status", attribute: "error", sortable: true, table: "supported-operations" }
];

/**
 * Component SupportedOperationsTab is defined as
 * `<e-supported-operations-tab>`
 *
 * @property {array} data - full data about table row.
 * @property {array} columns - state for columns.
 * @property {boolean} errorRow - data with error row.
 *
 * Imperatively create component
 * @example
 * let component = new SupportedOperationsTab();
 *
 * Declaratively create component
 * @example
 * <e-supported-operations-tab></e-supported-operations-tab>
 *
 * @extends {LitComponent}
 */
@definition("e-supported-operations-tab", {
  props: {
    cacheData: { attribute: false, type: "object", default: {} },
    columns: { attribute: false, type: "array", default: defaultColumnsState },
    errorRow: { attribute: false, type: "object" },
    packageId: { attribute: true, type: "string" }
  }
})
export default class SupportedOperationsTab extends LitComponent {
  constructor() {
    super();

    this.sortHandler = this.sortHandler.bind(this);
    this.cellHandler = this.cellHandler.bind(this);
    this.closeDialogHandle = this.closeDialogHandle.bind(this);
  }

  componentDidReceiveProps(oldValue) {
    const { packageId } = oldValue;

    if (packageId !== this.packageId && !this.cacheData[this.packageId]) {
      this.fetch();
    }
  }

  get data() {
    return this.cacheData[this.packageId] || [];
  }

  get sortedData() {
    const column = this.columns.find(item => item.sort !== null);
    const isDesc = column.sort === "dec";

    return column ? sortNatural(this.data, isDesc, column.attribute) : this.data;
  }

  get formatedData() {
    return this.sortedData.map(item => ({
      ...item,
      error:
        item.error === null && item.supported
          ? SUPPORTED_OPERATION
          : item.error || UNSUPPORTED_OPERATION
    }));
  }

  /**
   * Handler for sort table
   *
   * @returns {void}
   */
  sortHandler(event) {
    const { detail } = event;

    this.columns = updateColumnState({
      columns: this.columns,
      updatedColumn: detail.column,
      defaultColumnsState
    });
  }

  /**
   * Handler for cell click event
   *
   * @returns {void}
   */
  cellHandler(event) {
    const { detail } = event;

    this.errorRow = detail.row;
  }

  /**
   * Handler for close event
   *
   * @returns {void}
   */
  closeDialogHandle() {
    this.errorRow = null;
  }

  /**
   * Fetch supported operation for specific package
   *
   * @returns {void}
   */
  async fetch() {
    const { packageId } = this;

    try {
      const response = await fetchPackageSupportedOperation({ packageId });

      this.cacheData = {
        ...this.cacheData,
        [packageId]: response
      };
    } catch (error) {}
  }

  render() {
    const shouldShowDialog = Boolean(this.errorRow);

    return html`
      <div class="supported-operations-tab">
        <e-generic-table
          id="supported-operations-tab--table"
          .columns=${this.columns}
          .data=${this.formatedData}
          @eui-table:sort=${this.sortHandler}
          @cell:clicked=${this.cellHandler}
        ></e-generic-table>
        <e-supported-operations-error-dialog
          ?show=${shouldShowDialog}
          .data=${this.errorRow}
          @dialog:closed=${this.closeDialogHandle}
        ></e-supported-operations-error-dialog>
      </div>
    `;
  }
}

/**
 * Register the component as e-sync-dialog.
 * Registration can be done at a later time and with a different name
 */
SupportedOperationsTab.register();
