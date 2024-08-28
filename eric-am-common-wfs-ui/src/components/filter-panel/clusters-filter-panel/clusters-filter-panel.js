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
import { Accordion, Button, Checkbox, TextField } from '@eui/base';

// helpers
import { resetForm } from '../../../helpers/common.helper';

// styles
import style from './clusters-filter-panel.css';

/**
 * Component ClustersFilterPanel is defined as
 * `<e-clusters-filter-panel>`
 *
 * @extends {LitComponent}
 */
export default class ClustersFilterPanel extends LitComponent {
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onApply = this.onApply.bind(this);
  }

  static get components() {
    return {
      'eui-text-field': TextField,
      'eui-button': Button,
      'eui-accordion': Accordion,
      'eui-checkbox': Checkbox,
    };
  }

  get clusterNameEl() {
    if (this?.shadowRoot?.querySelector) {
      return this?.shadowRoot?.querySelector('[name="name"]');
    }

    return null;
  }

  get clusterStatusEls() {
    if (this?.shadowRoot?.querySelector) {
      return this?.shadowRoot?.querySelectorAll('[name="status"]');
    }

    return null;
  }

  resetForm() {
    const elements = [this.clusterNameEl, ...this.clusterStatusEls];

    resetForm(elements);
  }

  onChange({ type, value: passedValue }, { detail = {} }) {
    const { value, checked } = detail;

    if (type === 'name') {
      this.formData[type] = value;
    }

    if (type === 'status' && checked) {
      this.formData[type].push(passedValue);
    }

    if (type === 'status' && !checked) {
      this.formData[type] = this.formData[type].filter(
        item => item !== passedValue,
      );
    }
  }

  /**
   * Action that will reset filter form
   *
   * @returns {void}
   */
  onReset() {
    this.formData = {
      name: '',
      status: [],
    };

    this.resetForm();
  }

  /**
   * Action that will apply selected filter
   *
   * @returns {void}
   */
  onApply() {
    const data = {
      type: 'filter',
      data: this.formData,
    };

    this.bubble('cluster-filter:changed', data);
  }

  /**
   * Render the <e-clusters-filter-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="filter-form">
        <div class="filter-form--item">
          <label for="name">Cluster name</label>
          <eui-text-field
            name="name"
            placeholder="E.g. default"
            .value=${this.formData.name}
            @input=${this.onChange.bind(this, {
              type: 'name',
            })}
          ></eui-text-field>
        </div>

        <div class="filter-form--item">
          <eui-accordion category-title="Usage state" open>
            <eui-checkbox
              class="mt-base"
              name="status"
              label="In use"
              ?checked=${this.formData.status === 'In use'}
              @change=${this.onChange.bind(this, {
                type: 'status',
                value: 'IN_USE',
              })}
              >In use</eui-checkbox
            >
            <eui-checkbox
              class="mt-base"
              name="status"
              label="Not in use"
              ?checked=${this.formData.status === 'Not in use'}
              @change=${this.onChange.bind(this, {
                type: 'status',
                value: 'NOT_IN_USE',
              })}
              >Not in use</eui-checkbox
            ></eui-accordion
          >
        </div>

        <div class="filter-form--action">
          <eui-button @click=${this.onReset}>Reset</eui-button>
          <eui-button primary @click=${this.onApply}>Apply</eui-button>
        </div>
      </div>
    `;
  }
}

/**
 * @property {Object} formData - form data
 */
definition('e-clusters-filter-panel', {
  style,
  props: {
    formData: {
      attribute: false,
      type: Object,
      default: {
        name: '',
        status: [],
      },
    },
  },
})(ClustersFilterPanel);
