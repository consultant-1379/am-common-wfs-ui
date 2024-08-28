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
 * Component ResourceBackupsList is defined as
 * `<e-resource-backups-list>`
 *
 * Imperatively create component
 * @example
 * let component = new ResourceBackupsList();
 *
 * Declaratively create component
 * @example
 * <e-resource-backups-list></e-resource-backups-list>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { html, LitComponent } from "@eui/lit-component";
import style from "./resourceBackupsList.css";
import { formatDate, isEmpty } from "../../../utils/CommonUtils";
import { NO_BACKUPS_FOUND } from "../../../constants/Messages";

/**
 * @property {array} backupsData - backups name and creation timestamp
 */
@definition("e-resource-backups-list", {
  style,
  home: "resource-backups-list",
  props: {
    backupsData: { attribute: false, type: "array", default: [] }
  }
})
export default class ResourceBackupsList extends LitComponent {
  _renderBackupsData() {
    return this.backupsData.map(
      row => html`
        <li>
          <div class="timestamp">${formatDate(row.creationTime)}</div>
          <div class="name">${row.name}</div>
        </li>
      `
    );
  }

  /**
   * Render the <e-resource-backups-list> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <div class="timeline">
        <ul>
          ${this._renderBackupsData()}
        </ul>
      </div>
      <p
        class="noDataMessage"
        style=${isEmpty(this.backupsData) ? `display: block` : `display: none`}
      >
        ${NO_BACKUPS_FOUND}
      </p>
    `;
  }
}

/**
 * Register the component as e-resource-backups-list.
 * Registration can be done at a later time and with a different name
 */
ResourceBackupsList.register();
