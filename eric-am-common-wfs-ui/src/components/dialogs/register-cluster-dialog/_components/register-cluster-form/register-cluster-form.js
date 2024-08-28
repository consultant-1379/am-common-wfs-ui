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
import style from './register-cluster-form.css';

const DEFAULT_FORM_DATA = {
  clusterConfig: {},
  description: '',
  crdNamespace: 'eric-crd-ns',
  isDefault: false,
};

const KUBE_RESERVED_NAMESPACES = [
  'default',
  'kube-system',
  'kube-public',
  'kube-node-lease',
];

/**
 * Component RegisterClusterForm is defined as
 * `<e-register-cluster-form>`
 *
 * @extends {LitComponent}
 */
export default class RegisterClusterForm extends LitComponent {
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

  get crdNamespaceEl() {
    if (this?.shadowRoot?.querySelector) {
      return this.shadowRoot.querySelector('#crdNamespace');
    }
    return null;
  }

  get fileInputPlaceholder() {
    const { name = 'Select file to upload' } = this.formData.clusterConfig;

    return name;
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
    };
  }

  async validateForm() {
    this.validateClusterConfig();
    this.validatecrdNamespace();

    // workaround for re-render
    await sleep(1);
    return this.isValid();
  }

  isValid() {
    const elemets = [this.fileInputEl, this.crdNamespaceEl];
    const hasError = elemets.some(element => !element.checkValidity());

    return !hasError;
  }

  validatecrdNamespace() {
    const { crdNamespace } = this.formData;

    if (KUBE_RESERVED_NAMESPACES.includes(crdNamespace)) {
      return this.crdNamespaceEl.setCustomValidity(
        `Kubernetes reserved namespace: "${crdNamespace}" cannot be used as a CRD namespace.`,
      );
    }

    if (!/^[-a-z0-9]{0,63}$/.test(crdNamespace)) {
      return this.crdNamespaceEl.setCustomValidity(
        "Namespace must not be longer than 63 characters. Must consist of lower case alphanumeric characters or '-' (e.g. 'my-name',  or '123-abc').",
      );
    }

    this.crdNamespaceEl.setCustomValidity('');
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

    if (type === 'text') {
      this.validatecrdNamespace();
    }
  }

  /**
   * Render the <e-register-cluster-form> component. This function is called each time a
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
        <label for="crdNamespace">CRD namespace</label>

        <div class="inputField">
          <eui-text-field
            class="text-input"
            id="crdNamespace"
            data-type="text"
            data-field="crdNamespace"
            placeholder="CRD namespace"
            .value=${this.formData.crdNamespace}
            @change=${this._onUpdateForm}
          >
          </eui-text-field>
        </div>
        <span class="errorMessage invalidCrdNamespace"></span>
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
          id="isDefault"
          name="isDefault"
          data-type="checkbox"
          data-field="isDefault"
          ?checked=${this.formData.isDefault}
          @change=${this._onUpdateForm}
        >
          Is default
        </eui-checkbox>
      </div>
    </form>`;
  }
}

/**
 * @property {Object} formData - form data
 */
definition('e-register-cluster-form', {
  style,
  props: {
    formData: { attribute: false, type: 'object', default: DEFAULT_FORM_DATA },
  },
})(RegisterClusterForm);
