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
 * Component GenericDialog is defined as
 * `<e-generic-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericDialog();
 *
 * Declaratively create component
 * @example
 * <e-generic-dialog></e-generic-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import { DIALOG_BUTTON_CLICK_EVENT } from "../../../constants/Events";

/**
 * @property {object} dialogModel - message related to selected operation
 */
@definition("e-generic-dialog", {
  home: "generic-dialog",
  props: {
    dialogModel: { attribute: true, type: "object" }
  }
})
export default class GenericDialog extends LitComponent {
  handleClick(buttonLabel) {
    const eventDetail = {};
    eventDetail.selected = buttonLabel;
    eventDetail.dialog = this.dialogModel;
    this.bubble(DIALOG_BUTTON_CLICK_EVENT, eventDetail);
  }

  /**
   * Render the <e-generic-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-dialog label=${this.dialogModel.label} no-cancel="true" show="true">
        <div slot="content">
          <div>${this.dialogModel.content}</div>
          <slot name="sub-content"></slot>
        </div>
        ${this.dialogModel.buttonLabels.map(
          (buttonLabel, index) =>
            html`
              <eui-base-v0-button
                slot="bottom"
                @click=${() => this.handleClick(buttonLabel)}
                ?primary=${index === this.dialogModel.indexOfPrimaryButton}
                ?warning=${index === this.dialogModel.indexOfWarningButton}
                >${buttonLabel}</eui-base-v0-button
              >
            `
        )}
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Register the component as e-generic-dialog.
 * Registration can be done at a later time and with a different name
 */
GenericDialog.register();
