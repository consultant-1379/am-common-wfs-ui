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
import { Checkbox } from '@eui/base';

// styles
import style from './filter-panel-checkbox.css';

/**
 * Component FilterPanelCheckbox is defined as
 * `<e-filter-panel-checkbox>`
 *
 * @extends {LitComponent}
 */
export default class FilterPanelCheckbox extends LitComponent {
  static get components() {
    return {
      ...super.components, // if extending
      // register components here
    };
  }

  /**
   * Render the <e-filter-panel-checkbox> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-checkbox
      class="mt-base"
      name="status"
      label="In use"
      ?checked=${this.formData.status === 'In use'}
      @change=${this.onChange}
      >In use</eui-checkbox
    >`;
  }
}

/**
 * @property {Boolean} propOne - show active/inactive state.
 * @property {String} propTwo - shows the "Hello World" string.
 */
definition('e-filter-panel-checkbox', {
  style,
  props: {
    label: { attribute: true, type: String },
    class: { attribute: true, type: String, default: '' },
    value: { attribute: true, type: String, default: '' },
    checked: { attribute: true, type: Boolean, default: false },
  },
})(FilterPanelCheckbox);
