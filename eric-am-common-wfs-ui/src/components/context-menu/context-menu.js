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
import { Dropdown, MenuItem } from '@eui/base';

// services
import { storage, STORAGE_KEYS } from '../../services/storage.service';

// styles
import style from './context-menu.css';

/**
 * Component ContextMenu is defined as
 * `<e-context-menu>`
 *
 * @extends {LitComponent}
 */
export default class ContextMenu extends LitComponent {
  constructor() {
    super();

    this._onAction = this._onAction.bind(this);
  }

  static get components() {
    return {
      'eui-dropdown': Dropdown,
      'eui-menu-item': MenuItem,
    };
  }

  _onAction(event) {
    const items = event?.detail?.menuItems || [];

    storage.setItem(STORAGE_KEYS.ACTION_ROW_DATA, JSON.stringify(this.row));
    this.bubble(`context-menu:${items[0]?.value}`, { show: true });
  }

  /**
   * Render the <e-context-menu> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-dropdown
      more
      label=""
      type="single"
      .data=${this.items}
      @eui-dropdown:click=${this._onAction}
    ></eui-dropdown>`;
  }
}

/**
 * @property {Array} items - items for possible context actions
 */
definition('e-context-menu', {
  style,
  props: {
    items: { attribute: true, type: Array, default: [] },
    row: { attribute: true, type: Object },
  },
})(ContextMenu);
