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
 * Component CustomCellState is defined as
 * `<e-custom-cell-state>`
 *
 * Imperatively create component
 * @example
 * let component = new CustomCellState();
 *
 * Declaratively create component
 * @example
 * <e-custom-cell-state></e-custom-cell-state>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import { getStateCustomIcon } from "../../../utils/CommonUtils";
import style from "./customCellState.css";

/**
 * @property {boolean} row - row for the cell.
 * @property {boolean} column - column attribute.
 */
@definition("e-custom-cell-state", {
  style,
  props: {
    row: { attribute: false, type: "object", default: {} },
    column: { attribute: true, type: "string", default: "" },
    cellValue: { attribute: true, type: "string", default: "" }
  }
})
export default class CustomCellState extends LitComponent {
  /**
   * Render the <e-custom-cell-state> component. This function is called each time a
   * prop changes.
   */

  render() {
    const item = getStateCustomIcon(this.cellValue);
    const cellText = html`
      <div class="custom-table__cell_value">
        ${this.cellValue}
      </div>
    `;

    return html`
      <div class="custom-table__cell">
        <div class="custom-table__cell_contents" title=${this.cellValue}>
          ${item} ${cellText}
        </div>
      </div>
    `;
  }
}

/**
 * Register the component as e-custom-cell-state.
 * Registration can be done at a later time and with a different name
 */
CustomCellState.register();
