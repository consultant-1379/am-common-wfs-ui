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
import { FileInput } from '@eui/base/file-input';
import { TextField } from '@eui/base/text-field';
import { Textarea } from '@eui/base/text-area';
import { Checkbox } from '@eui/base/checkbox';
import { Tooltip } from '@eui/base/tooltip';

// helpers
import { returnExtension, sleep } from '../../../../../helpers/common.helper';

// styles
import style from './update-cluster-form.css';

const IS_DEFAULT_TOOLTIP = 'Make another cluster as default one';
const DEFAULT_FORM_DATA = {
  clusterName: '',
  clusterConfig: {},
  description: '',
  skipSameClusterVerification: false,
  isDefault: false,
};

/**
 * Component UpdateClusterForm is defined as
 * `<e-update-cluster-form>`
 *
 * @extends {LitComponent}
 */
export default class UpdateClusterForm extends LitComponent {
  constructor() {
    super();

    this._onUpdateForm = this._onUpdateForm.bind(this);
  }

  static get components() {
    return {
      'eui-file-input': FileInput,
      'eui-text-field': TextField,
      'eui-textarea': Textarea,
      'eui-checkbox': Checkbox,
      'eui-tooltip': Tooltip,
    };
  }

  get fileInputEl() {
    if (this?.shadowRoot?.querySelector) {
      return this.shadowRoot.querySelector('#fileInput');
    }
    return null;
  }

  get clusterConfigEl() {
    if (this?.shadowRoot?.querySelector) {
      return this.shadowRoot.querySelector('#clusterConfig');
    }
    return null;
  }

  get fileInputPlaceholder() {
    const { name = 'Select file to upload' } = this.formData.clusterConfig;

    return name;
  }

  get isDefault() {
    return Boolean(this?.cluster?.isDefaultBoolean);
  }

  get fileExtension() {
    const { name = '' } = this.formData.clusterConfig;

    return returnExtension(name);
  }

  get hasWrongExtension() {
    return this.fileExtension !== 'config';
  }

  get errorMessage() {
    return this.hasWrongExtension && this.formData.clusterConfig.name ? `` : '';
  }

  didConnect() {
    this.formData = {
      ...DEFAULT_FORM_DATA,
      clusterName: this.cluster.nameWithExtension,
      description: this.cluster.description,
      isDefault: this.isDefault,
    };
  }

  async validateForm() {
    this.validateClusterConfig();

    // workaround for re-render
    await sleep(1);
    return this.isValid();
  }

  isValid() {
    const elemets = [this.fileInputEl];
    const hasError = elemets.some(element => !element.checkValidity());

    return !hasError;
  }

  validateClusterConfig() {
    let { name = '' } = this.formData.clusterConfig;

    name = String(name).toLowerCase();

    if (!name) {
      return this.fileInputEl.setCustomValidity('Cluster config is required');
    }

    if (this.hasWrongExtension) {
      return this.fileInputEl.setCustomValidity(
        `File type ".${this.fileExtension}" not supported, only ".config" files are supported.`,
      );
    }

    this.fileInputEl.setCustomValidity('');
  }

  _onUpdateForm(event) {
    const { type, field } = event.target.dataset;
    let value = null;

    if (type === 'file') {
      [value] = event.target.files;
    }

    if (type === 'checkbox') {
      value = event.target.checked;
    }

    if (type === 'text') {
      value = event.target.value;
    }

    this.formData = {
      ...this.formData,
      [field]: value,
    };

    // validation
    if (type === 'file') {
      this.validateClusterConfig();
    }
  }

  /**
   * Render the <e-update-cluster-form> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<form class="form">
      <div class="form--item required">
        <label for="file">Upload File</label>
        <div class="file-input--wrapper">
          <eui-text-field
            class="file-input"
            id="fileInput"
            placeholder=${this.fileInputPlaceholder}
          >
          </eui-text-field>
          <eui-file-input
            id="clusterConfig"
            class="select-file"
            name="fileInput"
            accept=".config"
            data-type="file"
            data-field="clusterConfig"
            @change=${this._onUpdateForm}
          >
            Select file
          </eui-file-input>
        </div>
      </div>

      <div class="form--item">
        <label for="description">Description</label>
        <eui-textarea
          id="description"
          class="is-fullwidth"
          name="description"
          data-type="text"
          data-field="description"
          placeholder="Enter a description"
          .value=${this.formData.description}
          @input=${this._onUpdateForm}
        ></eui-textarea>
      </div>

      <div class="form--item">
        <eui-checkbox
          id="skipVerification"
          name="skipVerification"
          data-type="checkbox"
          data-field="skipVerification"
          @change=${this._onUpdateForm}
        >
          Skip cluster verification
        </eui-checkbox>
      </div>

      <div class="form--item">${renderIsDefaultCheckboxItem.call(this)}</div>
    </form>`;
  }
}

/**
 * @property {Object} formData - form data
 */
definition('e-update-cluster-form', {
  style,
  props: {
    cluster: { attribute: true, type: Object },
    formData: { attribute: false, type: 'object', default: DEFAULT_FORM_DATA },
  },
})(UpdateClusterForm);

function renderIsDefaultCheckboxItem() {
  if (this.isDefault) {
    return html`
      <eui-tooltip message=${IS_DEFAULT_TOOLTIP} position="top">
        ${renderIsDefaultCheckbox.call(this)}
      </eui-tooltip>
    `;
  }
  return html` ${renderIsDefaultCheckbox.call(this)} `;
}

function renderIsDefaultCheckbox() {
  return html`
    <eui-checkbox
      id="isDefault"
      name="isDefault"
      data-type="checkbox"
      data-field="isDefault"
      ?checked=${this.formData.isDefault}
      ?disabled=${this.isDefault}
      @change=${this._onUpdateForm}
    >
      Is default
    </eui-checkbox>
  `;
}
