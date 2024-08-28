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
import { App, html } from "@eui/app";
import style from "./userAdministration.css";
import { USER_ADMINISTRATION_URL } from "../../../utils/RestUtils";

@definition("e-user-administration", { style })
export default class UserAdministration extends App {
  componentDidConnect() {
    try {
      window.open(USER_ADMINISTRATION_URL, "User Administration").focus();
    } catch (err) {
      console.warn(
        `Failed to open 'User Administration' in a new tab automatically due to: ${err}`
      );
    }
  }

  render() {
    return html`
      <div>
        If user administration didn't open automatically click
        <a href=${USER_ADMINISTRATION_URL} target="User Administration">here</a>
      </div>
    `;
  }
}
