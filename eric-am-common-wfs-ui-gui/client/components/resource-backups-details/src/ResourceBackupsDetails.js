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
 * Component ResourceBackupsDetails is defined as
 * `<e-resource-backups-details>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceBackupsDetails();
 *
 * Declaratively create component
 * @example
 * <e-resource-backups-details></e-resource-backups-details>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { html, LitComponent } from "@eui/lit-component";
import style from "./resourceBackupsDetails.css";
import { formatDate, isEmpty, sortCol } from "../../../utils/CommonUtils";
import {
  NO_BACKUPS_FOUND,
  CANCEL_BUTTON,
  DELETE_BACKUP_CONFIRMATION,
  DELETE_BACKUP_CONFIRMATION_SUB_CONTENT,
  DELETE_BUTTON,
  RESOURCE_DETAILS_PAGE_BACKUPS_TAB
} from "../../../constants/Messages";
import { DialogModel } from "../../generic-dialog/src/DialogModel";
import "../../generic-dialog/src/GenericDialog";
import {
  DELETE_BACKUP_EVENT,
  DIALOG_BUTTON_CLICK_EVENT,
  DIALOG_DELETE_BACKUP_EVENT,
  CANCEL_EXPORT_BACKUP_EVENT,
  CONFIRM_EXPORT_BACKUP_EVENT,
  DIALOG_EXPORT_BACKUP_EVENT
} from "../../../constants/Events";
import "../../export-backup-dialog/src/ExportBackupDialog";

/**
 * @property {array} backupsData - data for operations tab.
 */
@definition("e-resource-backups-details", {
  style,
  home: "resource-backups-details",
  props: {
    backupsData: { attribute: true, type: "array", default: [] },
    showBackupDeleteDialog: { attribute: false, type: "boolean", default: false },
    showExportBackupDialog: { attribute: false, type: "boolean", default: false },
    permissions: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceBackupsDetails extends LitComponent {
  constructor() {
    super();
    this.backupsCols = [
      { title: "Name", attribute: "name", sortable: true },
      { title: "Creation Time", attribute: "creationTime", sortable: true },
      { title: "Status", attribute: "status", sortable: true },
      { title: "Backup scope", attribute: "scope", sortable: true }
    ];
  }

  handleEvent(event) {
    switch (event.type) {
      case DIALOG_BUTTON_CLICK_EVENT:
        if (event.detail.selected === CANCEL_BUTTON) {
          this.showBackupDeleteDialog = false;
        } else if (event.detail.selected === DELETE_BUTTON) {
          this.showBackupDeleteDialog = false;
          this.bubble(DELETE_BACKUP_EVENT, this._selectedBackup);
        }
        break;
      case DIALOG_DELETE_BACKUP_EVENT:
        this.showBackupDeleteDialog = true;
        this._selectedBackup = event.detail;
        break;
      case DIALOG_EXPORT_BACKUP_EVENT:
        this.exportBackupData = event.detail;
        this.showExportBackupDialog = true;
        break;
      case CONFIRM_EXPORT_BACKUP_EVENT:
        this.showExportBackupDialog = false;
        break;
      case CANCEL_EXPORT_BACKUP_EVENT:
        this.showExportBackupDialog = false;
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _renderDeleteBackupDialog() {
    const { name } = this._selectedBackup;
    const dialog = new DialogModel(
      "Delete Backup",
      DELETE_BACKUP_CONFIRMATION.replace(":backupName", name)
    );
    const buttons = [CANCEL_BUTTON, DELETE_BUTTON];
    dialog.setButtonLabels(buttons);
    dialog.setWarningButtonIndex(1);
    dialog.setPrimaryButtonIndex(1);
    return html`
      <e-generic-dialog .dialogModel=${dialog} @dialog-button-click=${this}
        ><p class="sub-content" slot="sub-content">
          ${DELETE_BACKUP_CONFIRMATION_SUB_CONTENT}
        </p></e-generic-dialog
      >
    `;
  }

  _renderExportBackupDialog() {
    return html`
      <e-export-backup-dialog
        .data=${this.exportBackupData}
        @confirm-export-backup=${this}
        @cancel-export-backup=${this}
      ></e-export-backup-dialog>
    `;
  }

  _renderBackupsTable() {
    const backups = this.backupsData.map(row => ({
      ...row,
      creationTime: formatDate(row.creationTime)
    }));

    return html`
      <e-generic-table
        id="resource-details-backups-table"
        compact
        dashed
        single-select
        .columns=${this.backupsCols}
        .data=${backups}
        .permissions=${this.permissions}
        .pageName=${RESOURCE_DETAILS_PAGE_BACKUPS_TAB}
        @display-export-backup-dialog=${this}
        @eui-table:sort=${sortCol}
        @display-backup-delete-dialog=${this}
      ></e-generic-table>
      ${this.showBackupDeleteDialog ? this._renderDeleteBackupDialog() : html``}
    `;
  }

  /**
   * Render the <e-resource-backups-details> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="customPanel">
        <div class="customMainPanelInfo">
          Backups
        </div>
        ${this._renderBackupsTable()}
        <p
          class="noDataMessage"
          style=${isEmpty(this.backupsData) ? `display: block` : `display: none`}
        >
          ${NO_BACKUPS_FOUND}
        </p>
      </div>
      ${this.showExportBackupDialog ? this._renderExportBackupDialog() : html``}
    `;
  }
}

/**
 * Register the component as e-resource-backups-details.
 * Registration can be done at a later time and with a different name
 */

ResourceBackupsDetails.register();
