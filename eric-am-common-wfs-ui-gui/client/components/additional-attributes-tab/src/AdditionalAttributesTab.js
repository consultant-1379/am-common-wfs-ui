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
 * Component AdditionalAttributesTab is defined as
 * `<e-additional-attributes-tab>`
 *
 * Imperatively create component
 * @example
 * let component = new AdditionalAttributesTab();
 *
 * Declaratively create component
 * @example
 * <e-additional-attributes-tab></e-additional-attributes-tab>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./additionalAttributesTab.css";
import { sortCol, sortNatural, filterData, isPasswordType } from "../../../utils/CommonUtils";
import "../../generic-table/src/GenericTable";
import "../../file-content-dialog/src/FileContentDialog";

/**
 * @property {array} additionalAttributeCols - column headers.
 * @property {array} additionalAttributesData - filtered data.
 * @property {object} filterFunc - object containing filtering function.
 */
@definition("e-additional-attributes-tab", {
  style,
  props: {
    additionalAttributeCols: {
      attribute: false,
      type: "array",
      default: [
        { title: "Parameter", attribute: "parameter", sortable: true },
        { title: "Value", attribute: "value", sortable: true }
      ]
    },
    additionalAttributesData: { attribute: false, type: "array", default: [] },
    filterText: { attribute: false, type: "string", default: "" },
    showFileContentDialog: { attribute: false, type: "boolean", default: false }
  }
})
export default class AdditionalAttributesTab extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidConnect() {
    this.filterAndSortData();
  }

  componentWillDisconnect() {
    this.filterText = "";
  }

  componentDidReceiveProps() {
    this.filterAndSortData();
  }

  filterAndSortData() {
    const columnAttributes = this.additionalAttributeCols.map(col => col.attribute);
    const columnData = this.additionalAttributesData.map(item => {
      return {
        ...item,
        value: isPasswordType(item.parameter) ? "********" : item.value
      };
    });
    const filteredData = filterData(this.filterText, columnData, columnAttributes);

    this.modifiedData = sortNatural(filteredData, this.sortedIsDesc, this.sortedColumnNumber);
  }

  handleEvent(event) {
    switch (event.type) {
      case "input":
        this.filterText = event.target.value;
        break;
      case "eui-table:sort":
        this.sortedColumnNumber = event.detail.column.attribute;
        this.sortedIsDesc = event.detail.sort === "dec";
        sortCol(event);
        break;
      case "additionalAttributesContent-click":
        this.fileDialogContent = event.detail.value;
        this.fileDialogLabel = event.detail.parameter;
        this.showFileContentDialog = true;
        break;
      case "fileContentDialog:cancel":
        this.showFileContentDialog = null;
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _renderFileContentDialog() {
    return html`
      <e-file-content-dialog
        label=${this.fileDialogLabel}
        content=${this.fileDialogContent}
        @fileContentDialog:cancel=${this}
      >
      </e-file-content-dialog>
    `;
  }

  render() {
    return html`
      <div class="additionalAttributesTab">
        <div><span class="heading">Additional Attributes</span> (${this.modifiedData.length})</div>
        <div class="filter">
          <eui-base-v0-text-field
            id="filterSearchArea"
            placeholder=${"Filter by typing..."}
            value=${this.filterText}
            @input="${this.handleEvent}"
            ><eui-v0-icon slot="icon" name="search"></eui-v0-icon>
          </eui-base-v0-text-field>
        </div>
        <div class="table">
          <e-generic-table
            id="additional-attributes-tab-table"
            .columns=${this.additionalAttributeCols}
            .data=${this.modifiedData}
            @eui-table:sort="${this.handleEvent}"
            @additionalAttributesContent-click="${this.handleEvent}"
            attributes-table
          ></e-generic-table>
        </div>
      </div>
      ${this.showFileContentDialog ? this._renderFileContentDialog() : html``}
    `;
  }
}

AdditionalAttributesTab.register();
