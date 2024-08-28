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

// helpers
import { DETAILS_SCHEMA } from '../../../apps/operations/operations.config';

// components
import DetailsPanelItem from '../_components/details-panel-item/details-panel-item.js';

// styles
import style from './operations-details-panel.css';

/**
 * Component OperationsDetailsPanel is defined as
 * `<e-operations-details-panel>`
 *
 * @extends {LitComponent}
 */
export default class OperationsDetailsPanel extends LitComponent {
  static get components() {
    return {
      'e-details-panel-item': DetailsPanelItem,
    };
  }

  get meta() {
    return import.meta;
  }

  get hasDetailsData() {
    return Boolean(this.data?.id);
  }

  get parsedData() {
    if (this.hasDetailsData) {
      return DETAILS_SCHEMA.reduce((acc, item) => {
        const { filed, type, status } = item;
        const title = this.i18n[filed] || filed;
        const value = this.data[filed] || '';

        acc.push({ title, value, component: { type, status } });

        return acc;
      }, []);
    }

    return [];
  }

  /**
   * Render the <e-operations-details-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    const detailsInfo = this.parsedData.map(({ title, value, component }) => {
      return html`<e-details-panel-item
        .title=${title}
        .value=${value}
        .component=${component}
      ></e-details-panel-item>`;
    });
    const noClusterSelected = html`<span>No operaion selected</span>`;

    return this.hasDetailsData ? detailsInfo : noClusterSelected;
  }
}

/**
 * @property {Object} data - model of selected operation
 */
definition('e-operations-details-panel', {
  style,
  props: {
    data: { attribute: true, type: Object },
  },
})(OperationsDetailsPanel);
