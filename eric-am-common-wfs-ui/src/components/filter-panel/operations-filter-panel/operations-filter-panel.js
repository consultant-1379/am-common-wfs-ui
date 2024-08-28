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
import style from './operations-filter-panel.css';

/**
 * Component OperationsFilterPanel is defined as
 * `<e-operations-filter-panel>`
 *
 * @extends {LitComponent}
 */
export default class OperationsFilterPanel extends LitComponent {
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

  resetForm() {
    const elements = [];

    // resetForm(elements);
  }

  onChange({ type, value: passedValue }, { detail = {} }) {
    const { value, checked } = detail;

    if (type === 'vnfInstanceName') {
      this.formData[type] = value;
    }

    if (type === 'clusterName') {
      this.formData[type] = value;
    }

    if (type === 'vnfProductName') {
      this.formData[type] = value;
    }

    if (type === 'vnfSoftwareVersion') {
      this.formData[type] = value;
    }

    if (type === 'username') {
      this.formData[type] = value;
    }

    if (type === 'lifecycleOperationType' && checked) {
      this.formData[type].push(passedValue);
    }

    if (type === 'lifecycleOperationType' && !checked) {
      this.formData[type] = this.formData[type].filter(
        item => item !== passedValue,
      );
    }

    if (type === 'operationState' && checked) {
      this.formData[type].push(passedValue);
    }

    if (type === 'operationState' && !checked) {
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

    this.bubble('operations-filter:changed', data);
  }

  /**
   * Render the <e-operations-filter-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="filter-form">
        <div class="filter-form--item">
          <label for="name">Resource instance name</label>
          <eui-text-field
            name="vnfInstanceName"
            placeholder="E.g. instance-1"
            .value=${this.formData.vnfInstanceName}
            @input=${this.onChange.bind(this, {
              type: 'vnfInstanceName',
            })}
          ></eui-text-field>
        </div>

        <div class="filter-form--item">
          <label for="name">Cluster</label>
          <eui-text-field
            name="clusterName"
            placeholder="E.g. default"
            .value=${this.formData.clusterName}
            @input=${this.onChange.bind(this, {
              type: 'clusterName',
            })}
          ></eui-text-field>
        </div>

        <div class="filter-form--item">
          <eui-accordion category-title="Operation" open>
            <eui-checkbox
              class="mt-base ml--20"
              name="lifecycleOperationType"
              label="Instantiate"
              ?checked=${this.formData.lifecycleOperationType === 'Instantiate'}
              @change=${this.onChange.bind(this, {
                type: 'lifecycleOperationType',
                value: 'INSTANTIATE',
              })}
              >Instantiate</eui-checkbox
            >
            <eui-checkbox
              class="mt-base ml--20"
              name="lifecycleOperationType"
              label="Change vnfpkg"
              ?checked=${this.formData.lifecycleOperationType ===
              'Change vnfpkg'}
              @change=${this.onChange.bind(this, {
                type: 'lifecycleOperationType',
                value: 'CHANGE_VNFPKG',
              })}
              >Change vnfpkg</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="lifecycleOperationType"
              label="Scale"
              ?checked=${this.formData.lifecycleOperationType === 'Scale'}
              @change=${this.onChange.bind(this, {
                type: 'lifecycleOperationType',
                value: 'SCALE',
              })}
              >Scale</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="lifecycleOperationType"
              label="Terminate"
              ?checked=${this.formData.lifecycleOperationType === 'Terminate'}
              @change=${this.onChange.bind(this, {
                type: 'lifecycleOperationType',
                value: 'TERMINATE',
              })}
              >Terminate</eui-checkbox
            >
          </eui-accordion>
        </div>

        <div class="filter-form--item">
          <eui-accordion category-title="Operation state" open>
            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Starting"
              ?checked=${this.formData.operationState === 'Starting'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'STARTING',
              })}
              >Starting</eui-checkbox
            >
            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Processing"
              ?checked=${this.formData.operationState === 'Processing'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'PROCESSING',
              })}
              >Processing</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Rolling back"
              ?checked=${this.formData.operationState === 'Rolling back'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'ROLLING_BACK',
              })}
              >Rolling back</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Rolled back"
              ?checked=${this.formData.operationState === 'Rolled back'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'ROLLED_BACK',
              })}
              >Rolled back</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Completed"
              ?checked=${this.formData.operationState === 'Completed'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'COMPLETED',
              })}
              >Completed</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Failed"
              ?checked=${this.formData.operationState === 'Failed'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'FAILED',
              })}
              >Failed</eui-checkbox
            >

            <eui-checkbox
              class="mt-base ml--20"
              name="operationState"
              label="Failed temp"
              ?checked=${this.formData.operationState === 'Failed temp'}
              @change=${this.onChange.bind(this, {
                type: 'operationState',
                value: 'FAILED_TEMP',
              })}
              >Failed temp</eui-checkbox
            >
          </eui-accordion>
        </div>

        <div class="filter-form--item">
          <label for="name">Type</label>
          <eui-text-field
            name="vnfProductName"
            placeholder="E.g. spider"
            .value=${this.formData.vnfProductName}
            @input=${this.onChange.bind(this, {
              type: 'vnfProductName',
            })}
          ></eui-text-field>
        </div>

        <div class="filter-form--item">
          <label for="name">Software verstion</label>
          <eui-text-field
            name="vnfSoftwareVersion"
            placeholder="E.g. 1.0.2"
            .value=${this.formData.vnfSoftwareVersion}
            @input=${this.onChange.bind(this, {
              type: 'vnfSoftwareVersion',
            })}
          ></eui-text-field>
        </div>

        <div class="filter-form--item">
          <label for="name">Modified by</label>
          <eui-text-field
            name="username"
            placeholder="E.g. admin"
            .value=${this.formData.username}
            @input=${this.onChange.bind(this, {
              type: 'username',
            })}
          ></eui-text-field>
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
definition('e-operations-filter-panel', {
  style,
  props: {
    formData: {
      attribute: false,
      type: Object,
      default: {
        vnfInstanceName: '',
        clusterName: '',
        lifecycleOperationType: [],
        operationState: [],
        vnfProductName: '',
        vnfSoftwareVersion: '',
        username: '',
      },
    },
  },
})(OperationsFilterPanel);
