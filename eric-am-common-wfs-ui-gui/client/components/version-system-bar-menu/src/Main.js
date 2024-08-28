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
import style from "./versionSystemBarMenu.css";

@definition("e-version-system-bar-menu", {
  style,
  home: "version-system-bar-menu"
})
export default class VersionSystemBarMenu extends LitComponent {
  componentDidConnect() {
    this.version = window.localStorage.getItem("version");
  }

  render() {
    return html`
      <div class="version-system-bar-holder">
        v${this.version !== "null" ? this.version : "-unkown"}
      </div>
    `;
  }
}

VersionSystemBarMenu.register();
