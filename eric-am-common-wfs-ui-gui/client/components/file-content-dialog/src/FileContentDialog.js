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
 * Component FileContentDialog is defined as
 * `<e-file-content-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new FileContentDialog();
 *
 * Declaratively create component
 * @example
 * <e-file-content-dialog></e-file-content-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./fileContentDialog.css";

/**
 * @property {string} content - content to show in the dialog.
 */
@definition("e-file-content-dialog", {
  style,
  home: "file-content-dialog",
  props: {
    content: { attribute: true, type: "string", default: "" },
    label: { attribute: true, type: "string", default: "" }
  }
})
export default class FileContentDialog extends LitComponent {
  handleEvent() {
    this.bubble("fileContentDialog:cancel", {});
  }

  render() {
    return html`
      <eui-base-v0-dialog .label=${this.label} show="true" @eui-dialog:cancel=${this}>
        <div slot="content">
          <pre class="fileContent"><code>${this.content}</code></pre>
        </div>
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Register the component as e-file-content-dialog.
 * Registration can be done at a later time and with a different name
 */
FileContentDialog.register();
