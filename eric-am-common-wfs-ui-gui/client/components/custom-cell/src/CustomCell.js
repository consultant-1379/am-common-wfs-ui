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
 * Component CustomCell is defined as
 * `<e-custom-cell>`
 *
 * Imperatively create component
 * @example
 * let component = new CustomCell();
 *
 * Declaratively create component
 * @example
 * <e-custom-cell></e-custom-cell>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html, ifNull, ifDefined } from "@eui/lit-component";
import style from "./customCell.css";
import "../../context-menu/src/ContextMenu";
import { generateContextMenuIdValue } from "../../../utils/ContextMenuUtils";
import { WARNING_TOOLTIP_OPERATION_ERROR, PACKAGES_PAGE } from "../../../constants/Messages";

/**
 * @property {boolean} row - row for the cell.
 * @property {boolean} column - column attribute.
 */
@definition("e-custom-cell", {
  style,
  props: {
    row: { attribute: false, type: "object", default: {} },
    column: { attribute: true, type: "string", default: "" },
    permissions: { attribute: false, type: "object", default: {} },
    pageName: { attribute: false, type: "string" },
    hideContextMenu: { attribute: false, type: "boolean" },
    maxWidth: { attribute: true, type: "string" },
    cellValue: { attribute: true, type: "string" },
    cellHref: { attribute: false, type: "string" },
    underlined: { attribute: true, type: "boolean", default: false },
    icon: { attribute: true, type: "object", default: {} },
    availability: { attribute: false, type: "object", default: {} }
  }
})
export default class CustomCell extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event) {
    this.bubble("cell-clicked", event.target);
  }

  _onMouseOverCell = e => {
    const { currentTarget, target } = e;
    if (target.tagName === "A" && this._isTruncated(currentTarget)) {
      target.setAttribute("truncated", "");
    }
  };

  _onMouseLeaveCell = e => {
    const { target } = e;
    if (target.tagName === "A") {
      target.removeAttribute("truncated");
    }
  };

  _isTruncated = element => {
    const { clientWidth, scrollWidth } = element;
    return clientWidth < scrollWidth;
  };

  /**
   * Render the <e-custom-cell> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div
        class="custom-table__cell"
        style=${ifDefined(this.maxWidth ? `max-width: ${this.maxWidth}` : undefined)}
      >
        ${this.renderIcon()}
        <div
          class="custom-table__cell_value"
          title=${this.cellValue || this.row[this.column]}
          column=${this.column}
          @mouseover=${e => this._onMouseOverCell(e)}
          @mouseout=${e => this._onMouseLeaveCell(e)}
        >
          <a
            @click="${this.handleEvent}"
            href=${ifNull(this.cellHref)}
            ?underlined=${this.underlined}
          >
            ${this.cellValue || this.row[this.column]}
          </a>
        </div>
        ${this.hideContextMenu
          ? html``
          : html`
              <e-context-menu
                id=${generateContextMenuIdValue(this.row, this.pageName)}
                class="custom-table__cell_context_menu"
                .rowData=${this.row}
                .permissions=${this.permissions}
                .availability=${this.availability}
                .pageName=${this.pageName}
              ></e-context-menu>
            `}
      </div>
    `;
  }

  /**
   * Render additional warning with tooltip in case if uploaded CNF package has at least one incorrectly defined LCM operation
   *
   * @function renderWarningOperationIcon
   * @returns contents warning.
   */
  renderWarningOperationIcon() {
    const { supportedOperations = [] } = this.row;
    const hasErrorOperation =
      supportedOperations.some(operation => operation.error !== null) &&
      PACKAGES_PAGE === this.pageName;

    return hasErrorOperation
      ? html`
          <eui-base-v0-tooltip
            class="space-left"
            position="top"
            message=${WARNING_TOOLTIP_OPERATION_ERROR}
            ><eui-v0-icon name="triangle-warning" color="#d97833"></eui-v0-icon
          ></eui-base-v0-tooltip>
        `
      : null;
  }

  /**
   * Render additional icon before text
   *
   * @function renderIcon
   * @returns contents warning.
   */
  renderIcon() {
    const { type = "", color = "" } = this.icon;
    const hasIcon = type && color;

    return hasIcon
      ? html`
          <eui-v0-icon class="custom-table__cell_icon" name=${type} color=${color}></eui-v0-icon>
        `
      : null;
  }
}

/**
 * Register the component as e-custom-cell.
 * Registration can be done at a later time and with a different name
 */
CustomCell.register();
