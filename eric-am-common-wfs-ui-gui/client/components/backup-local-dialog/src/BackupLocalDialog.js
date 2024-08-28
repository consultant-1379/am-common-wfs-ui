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
 * Component BackupLocalDialog is defined as
 * `<e-backup-local-dialog>`
 *
 * Imperatively create component
 * @example
 * let component = new BackupLocalDialog();
 *
 * Declaratively create component
 * @example
 * <e-backup-local-dialog></e-backup-local-dialog>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./backupLocalDialog.css";
import {
  BACKUP_NAME_LENGTH,
  BACKUP_NAME_INVALID_CHAR,
  BACKUP_NAME_EMPTY
} from "../../../constants/Messages";

@definition("e-backup-local-dialog", {
  style,
  home: "backup-local-dialog",
  props: {
    data: { attribute: false, type: "array", default: [] },
    backupNameInvalid: { attribute: false, type: "boolean", default: false },
    errorMessage: { attribute: false, type: "string", default: BACKUP_NAME_INVALID_CHAR }
  }
})
export default class BackupLocalDialog extends LitComponent {
  /**
   * Render the <e-backup-local-dialog> component. This function is called each time a
   * prop changes.
   */
  constructor() {
    super();
    this.specialCharacters = /[\s`!@#$%^&*()£+=[\]{};:\\|,.<>\\/?~"']/;
  }

  handleEvent(event) {
    if (event.type === "eui-dialog:cancel") {
      this.bubble("cancel-backup", {});
    } else if (event.type === "click") {
      const backupNameField = this.shadowRoot.querySelector(".backupName");
      const name = backupNameField.value.trim();
      if (this._checkIfValidFields(backupNameField)) {
        this.bubble("create-backup", { backupName: name, scope: this.selectedBackupScope });
      }
    } else if (event.type === "change") {
      this.selectedBackupScope = event.detail.value;
    }
  }

  _checkIfValidFields(backupName) {
    let result = true;
    if (backupName.value.length > 250) {
      this.backupNameInvalid = true;
      result = false;
      this.errorMessage = BACKUP_NAME_LENGTH;
    } else if (
      backupName.value !== null &&
      this.selectedBackupScope !== undefined &&
      backupName.value.length !== 0 &&
      !backupName.value.match(this.specialCharacters) &&
      this.selectedBackupScope !== 0
    ) {
      this.backupNameInvalid = false;
    } else if (backupName.value.length === 0) {
      this.backupNameInvalid = true;
      result = false;
      this.errorMessage = BACKUP_NAME_EMPTY;
    } else {
      this.backupNameInvalid = true;
      result = false;
      this.errorMessage = BACKUP_NAME_INVALID_CHAR;
    }

    return result;
  }

  render() {
    return html`
      <eui-base-v0-dialog label="Backup resource" show="true" @eui-dialog:cancel=${this}>
        <div slot="content" class="backup-content">
          <div class="backupScope-label">
            Backup scope*
          </div>
          <e-generic-dropdown
            id="backup-scope"
            class="backupScope"
            .data=${this.data}
            data-type="single"
            width="19.2rem"
            @change=${this}
          >
          </e-generic-dropdown>
          <div class="backupName-label">
            Backup name*
          </div>
          <eui-base-v0-text-field
            @input=${this}
            id="backup-name"
            class="backupName"
            placeholder="Backup name"
            fullwidth="true"
          ></eui-base-v0-text-field>
          <div class="errorMessage">
            ${this.backupNameInvalid
              ? html`
                  <span>${this.errorMessage}</span>
                `
              : html``}
          </div>
        </div>

        <eui-base-v0-button slot="bottom" id="backup" @click=${this} ?primary=${true}
          >Backup</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }
}

/**
 * Register the component as e-backup-local-dialog.
 * Registration can be done at a later time and with a different name
 */
BackupLocalDialog.register();
