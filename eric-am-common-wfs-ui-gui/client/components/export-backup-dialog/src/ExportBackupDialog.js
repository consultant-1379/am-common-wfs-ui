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
 * Component ExportBackupDialog is defined as
 * `<e-export-backup-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new ExportBackupDialog();
 *
 * Declaratively create component
 * @example
 * <e-export-backup-dialog></e-export-backup-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./exportBackupDialog.css";

const HTTP_PROTOCOL = "http";
const SFTP_PROTOCOL = "sftp";

@definition("e-export-backup-dialog", {
  style,
  home: "export-backup-dialog",
  props: {
    data: { attribute: false, type: "object", default: {} },
    displayRemoteUrlRequired: { attribute: false, type: "boolean", default: false },
    displayUsernameRequired: { attribute: false, type: "boolean", default: false },
    displayPasswordRequired: { attribute: false, type: "boolean", default: false },
    protocol: { attribute: false, type: "string", default: HTTP_PROTOCOL }
  }
})
export default class ExportBackupDialog extends LitComponent {
  constructor() {
    super();
    this.specialCharacters = /[\s`!@#$%^&*()£+=[\]{};:\\|,.<>\\/?~"']/;
  }

  handleEvent(event) {
    if (event.type === "eui-dialog:cancel") {
      this.bubble("cancel-export-backup", {});
    } else if (event.type === "click") {
      // select data which needs to be sent and send it
      const remoteUrl = this.shadowRoot.querySelector(".exportBackupRemoteURL");
      const userName = this.shadowRoot.querySelector(".exportBackupUsername");
      const password = this.shadowRoot.querySelector(".exportBackupPassword");

      if (this._checkIfValidFields(remoteUrl, userName, password)) {
        this.bubble("confirm-export-backup", {
          remoteUrl,
          userName,
          password,
          backupName: this.data.name,
          scope: this.data.scope,
          protocol: this.protocol
        });
      }
    }
  }

  _checkIfValidFields(remoteUrlField, usernameField, passwordField) {
    this.displayRemoteUrlRequired = remoteUrlField.value.length === 0;

    switch (this.protocol) {
      case HTTP_PROTOCOL:
        this.displayUsernameRequired = false;
        this.displayPasswordRequired = false;
        break;
      case SFTP_PROTOCOL:
        this.displayUsernameRequired = usernameField.value.length === 0;
        this.displayPasswordRequired = passwordField.value.length === 0;
        break;
      default:
        this.displayUsernameRequired = false;
        this.displayPasswordRequired = false;
    }

    return (
      !this.displayPasswordRequired &&
      !this.displayUsernameRequired &&
      !this.displayRemoteUrlRequired
    );
  }

  _renderRequiredFieldMessage(field) {
    return html`
      <div class="errorMessage">
        <span>${field} cannot be empty</span>
      </div>
    `;
  }

  _selectProtocol(event) {
    const { value } = event.target.dataset;
    this.protocol = value;
    this._clearAllTextFields();
    this._checkIfValidFields();
  }

  _clearAllTextFields() {
    this.shadowRoot.querySelector(".exportBackupRemoteURL").value = "";
    this.shadowRoot.querySelector(".exportBackupUsername").value = "";
    this.shadowRoot.querySelector(".exportBackupPassword").value = "";
  }

  /**
   * Render the <e-export-backup-dialog> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <eui-base-v0-dialog
        label="Export to external location"
        show="true"
        @eui-dialog:cancel="${this}"
      >
        <div slot="content" class="export-backup-content">
          <div class="protocol-label">
            Protocol*
          </div>
          <eui-base-v0-dropdown
            id="backupExport-protocol"
            class="exportBackup-dropdown-protocol"
            label=${this.protocol}
            data-type="click"
            @click=${this._selectProtocol.bind(this)}
            width="100%"
          >
            <div menu-item tabindex="0" data-value=${HTTP_PROTOCOL}>http</div>
            <div menu-item tabindex="0" data-value=${SFTP_PROTOCOL}>sftp</div>
          </eui-base-v0-dropdown>
          <div class="remoteURL-label">
            Remote URL*
          </div>
          <eui-base-v0-text-field
            @input=${this}
            id="exportBackup-remoteURL"
            prefix="${this.protocol.concat("://")}"
            class="exportBackupRemoteURL"
            placeholder="Remote URL"
            fullwidth="true"
          ></eui-base-v0-text-field>
          <div class="errorMessage" id="exportBackupErrorMessage-remoteURL">
            ${this.displayRemoteUrlRequired
              ? this._renderRequiredFieldMessage("Remote url")
              : html``}
          </div>

          <div class="export-backup-fields" ?hidden="${this.protocol === HTTP_PROTOCOL}">
            <div class="username-label">
              Username*
            </div>
            <eui-base-v0-text-field
              @input=${this}
              id="exportBackup-username"
              class="exportBackupUsername"
              placeholder="username"
              fullwidth="true"
            ></eui-base-v0-text-field>
            <div class="errorMessage" id="exportBackupErrorMessage-username">
              ${this.displayUsernameRequired
                ? this._renderRequiredFieldMessage("Username")
                : html``}
            </div>

            <div class="password-label">
              Password*
            </div>
            <eui-base-v0-password-field
              @input=${this}
              id="exportBackup-password"
              class="exportBackupPassword"
              placeholder="password"
              fullwidth="true"
            ></eui-base-v0-password-field>
            <div class="errorMessage" id="exportBackupErrorMessage-password">
              ${this.displayPasswordRequired
                ? this._renderRequiredFieldMessage("Password")
                : html``}
            </div>
          </div>
        </div>

        <eui-base-v0-button slot="bottom" id="exportBackup" @click=${this} ?primary=${true}
          >Export</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Register the component as e-export-backup-dialog.
 * Registration can be done at a later time and with a different name
 */
ExportBackupDialog.register();
