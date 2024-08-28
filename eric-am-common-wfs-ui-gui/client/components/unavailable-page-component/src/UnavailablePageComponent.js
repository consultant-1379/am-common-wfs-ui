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
import { html, LitComponent } from "@eui/lit-component";
import { definition } from "@eui/component";
import style from "./unavailablePageComponent.css";

@definition("e-unavailable-page-component", {
  style,
  props: { title: { attribute: false, type: "string", default: "Page is not available" } }
})
export default class UnavailablePageComponent extends LitComponent {
  render() {
    return html`
      <div class="unavailable-block">
        <p class="unavailable-title">
          <eui-v0-icon name="info"></eui-v0-icon>
          <span>${this.title}</span>
        </p>
        <p class="unavailable-content">
          The onboarding service is currently unavailable or NFVO is enabled.
        </p>
        <p class="unavailable-content">
          All actions have been disabled.
        </p>
      </div>
    `;
  }
}
UnavailablePageComponent.register();
