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
import { LitComponent, html, definition } from '@eui/lit-component';

// components
import ContextMenu from '../../context-menu/context-menu';

// styles
import style from './context-cell.css';

/**
 * Component ContextCell is defined as
 * `<e-context-cell>`
 *
 * @extends {LitComponent}
 */
export default class ContextCell extends LitComponent {
  static get components() {
    return {
      'e-context-menu': ContextMenu,
    };
  }

  get hasContextMenu() {
    return Boolean(this.items.length);
  }

  /**
   * Render the <e-context-cell> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<span>${this.row.name}</span> ${this.hasContextMenu
        ? html`<e-context-menu
            .row=${this.row}
            .items=${this.items}
          ></e-context-menu>`
        : null}`;
  }
}

/**
 * @property {Object} row - selected model
 * @property {Array} items - items for possible context actions
 */
definition('e-context-cell', {
  style,
  props: {
    row: { attribute: true, type: Object },
    items: { attribute: true, type: Array, default: [] },
  },
})(ContextCell);
