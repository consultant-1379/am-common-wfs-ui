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
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./documentationSystemBarMenu.css";

@definition("e-documentation-system-bar-menu", {
  style,
  home: "documentation-system-bar-menu"
})
export default class DocumentationSystemBarMenu extends LitComponent {
  handleEvent() {
    window.open("#documentation", "Documentation").focus();
  }

  render() {
    return html`
      <div class="documentation-system-bar-help-content" @click=${this}>
        <eui-v0-icon
          class="documentation-system-bar-help-icon"
          name="help"
          color="white"
        ></eui-v0-icon>
      </div>
    `;
  }
}

DocumentationSystemBarMenu.register();
