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
import YesNoStatus from '../../../statuses/yes-no-status/yes-no-status.js';

// styles
import style from './details-panel-item.css';

/**
 * Component DetailsPanelItem is defined as
 * `<e-details-panel-item>`
 *
 * @extends {LitComponent}
 */
export default class DetailsPanelItem extends LitComponent {
  static get components() {
    return {
      'e-yes-no-status': YesNoStatus,
    };
  }

  /**
   * Render the <e-details-panel-item> component. This function is called each time a
   * prop changes.
   */
  render() {
    const {
      title,
      value,
      component: { type, status },
    } = this;

    return html`<div class="details-panel-item--title has-color-gray">
        ${title}
      </div>

      <div class="details-panel-item--value" .title=${value}>
        ${type === 'text' ? value : ''}
        ${type === 'status' && status === 'YesNoStatus'
          ? html`<e-yes-no-status .status=${value}></e-yes-no-status>`
          : null}
      </div>`;
  }
}

/**
 * @property {String} title - title for head column
 * @property {String} value - content for value column
 * @property {String} component - custom component for value column
 */
definition('e-details-panel-item', {
  style,
  props: {
    title: { attribute: true, type: String },
    value: { attribute: true, type: String },
    component: { attribute: true, type: Object },
  },
})(DetailsPanelItem);
