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

// styles
import style from './yes-no-status.css';

const STATUSES = Object.freeze({
  Yes: 'Yes',
  No: 'No',
});

/**
 * Component YesNoStatus is defined as
 * `<e-yes-no-status>`
 *
 * @extends {LitComponent}
 */
export default class YesNoStatus extends LitComponent {
  static get components() {
    return {
      'eui-icon': customElements.get('eui-icon'),
    };
  }

  get statusName() {
    return STATUSES[this.status];
  }

  get hasIcon() {
    return this.statusName === STATUSES.Yes;
  }

  /**
   * Render the <e-yes-no-status> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      ${this.hasIcon
        ? html`<eui-icon
            name="check"
            color="green"
            class="has-space-right--small"
          ></eui-icon>`
        : null}
      <span>${this.statusName}</span>
    `;
  }
}

/**
 * @property {String} status - can be Yes or No
 */
definition('e-yes-no-status', {
  style,
  props: {
    status: { attribute: true, type: String },
  },
})(YesNoStatus);
