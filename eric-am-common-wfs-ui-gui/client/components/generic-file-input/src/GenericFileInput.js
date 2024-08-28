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
/**
 * Component GenericFileInput is defined as
 * `<e-generic-file-input>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericFileInput();
 *
 * Declaratively create component
 * @example
 * <e-generic-file-input></e-generic-file-input>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { FileInput } from "@eui/base";
import style from "./genericFileInput.css";

/**
 * @property {Boolean} borderless - if true, file upload button will show no border
 */
@definition("e-generic-file-input", {
  style,
  home: "generic-file-input",
  props: {
    borderless: { attribute: true, type: "boolean" }
  }
})
export default class GenericFileInput extends FileInput {
  componentDidUpgrade() {
    if (this.borderless) {
      this._setIconSize("16px");
    }
  }

  _setIconSize(size) {
    const icon = this.shadowRoot.querySelector("eui-v0-icon");
    icon.setAttribute("size", size);
  }

  readFileContentAsString() {
    const { files } = this;
    if (files.length > 0) {
      return new Promise(resolve => {
        const file = files[0];
        const reader = new window.FileReader();
        reader.fileName = files[0].name;
        reader.onloadend = () => resolve(reader.result);
        reader.readAsText(file);
      });
    }
    return Promise.resolve("");
  }

  reset() {
    const inputElement = this.shadowRoot.querySelector("input[type='file']");
    if (inputElement) {
      inputElement.value = "";
    }
  }
}

GenericFileInput.register();
