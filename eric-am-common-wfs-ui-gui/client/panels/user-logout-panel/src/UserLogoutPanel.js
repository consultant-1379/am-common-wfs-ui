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
import { Panel } from "@eui/panel";
import { html } from "@eui/lit-component";
import "@eui/base";
import "@eui/table";
import style from "./userLogoutPanel.css";
import "../../../components/generic-table/src/GenericTable";
import { isEmpty } from "../../../utils/CommonUtils";

@definition("e-user-logout-panel", { style })
export default class UserLogoutPanel extends Panel {
  constructor() {
    super();
    this._handleLogout = this._handleLogout.bind(this);
    this._handleLocaleChange = this._handleLocaleChange.bind(this);
  }

  _getUserName() {
    if (this.userInformation && this.userInformation.username) {
      return this.userInformation.username;
    }
    return window.localStorage.getItem("username") || "UnknownUser";
  }

  componentDidConnect() {
    this.userInformation = this.storeConnect("userInformation").userInformation;
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
  }

  _handleLogout() {
    window.localStorage.removeItem("username");
    window.location.href = "/logout";
  }

  _handleLocaleChange(e) {
    this.dispatch("UPDATE_LOCALE", { localeId: e.currentTarget.value });
  }

  _getVersionInfo() {
    const columns = [
      { title: "Service", attribute: "name" },
      { title: "Version", attribute: "version", width: "5rem" }
    ];
    const data = [];
    if (this.appConfiguration.dependencies) {
      this.appConfiguration.dependencies.forEach(item => {
        data.push(item);
      });
    }

    return html`
      <e-generic-table tiny .data=${data} .columns=${columns}></e-generic-table>
    `;
  }

  render() {
    const { loc } = window.EUI.Localizer;
    const { SIGN_OUT } = loc;

    return html`
      <link rel="stylesheet" href=${window.containerConfig.sharedCSS} />
      <div class="settings-panel">
        <div class="row">
          <div class="column sm-12 container">
            <div class="profile">
              <eui-v0-icon name="profile" color="white" size="50px"></eui-v0-icon>
              <div class="username">${this._getUserName()}</div>
            </div>
            <div class="system-info">
              <div class="system-info-label">System Information</div>
              <div class="system-info-version">EVNFM Version ${this.appConfiguration.version}</div>
              <div class="system-info-version-list">${this._getVersionInfo()}</div>
              <div
                class="system-info-no-services"
                style=${this.appConfiguration.dependencies === null ||
                isEmpty(this.appConfiguration.dependencies)
                  ? `display: block`
                  : `display: none`}
              >
                ... No services found
              </div>
            </div>
            <div class="bottom">
              <eui-base-v0-button big fullwidth @click=${this._handleLogout}
                >${SIGN_OUT || "Sign Out"}</eui-base-v0-button
              >
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
