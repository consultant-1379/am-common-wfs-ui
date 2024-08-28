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
 * Component ForceFailDialog is defined as
 * `<e-force-fail-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new ForceFailDialog();
 *
 * Declaratively create component
 * @example
 * <e-force-fail-dialog></e-force-fail-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./forceFailDialog.css";

import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";

/**
 * @property {boolean} propOne - show active/inactive state.
 * @property {boolean} propTwo - show active/inactive state.
 */
@definition("e-force-fail-dialog", {
  style,
  home: "force-fail-dialog",
  props: {
    dialogModel: { attribute: true, type: "object", default: {} }
  }
})
export default class ForceFailDialog extends LitComponent {
  handleClick(buttonLabel) {
    const eventDetail = {};
    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
  }

  render() {
    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>
            <p>${this.dialogModel.content}</p>
            <p>${this.dialogModel.nextParagraph}</p>
          </div>
        </div>
        ${this.dialogModel.buttonLabels.map(
          (buttonLabel, index) =>
            html`
              <eui-base-v0-button
                slot="bottom"
                id=${buttonLabel.replace(/\s/, "")}
                @click=${() => this.handleClick(buttonLabel)}
                ?primary=${index === this.dialogModel.indexOfPrimaryButton}
                ?warning=${index === this.dialogModel.indexOfWarningButton}
              >
                ${buttonLabel}
              </eui-base-v0-button>
            `
        )}
      </eui-base-v0-dialog>
    `;
  }
}
/**
 * Register the component as e-force-fail-dialog.
 * Registration can be done at a later time and with a different name
 */
ForceFailDialog.register();
