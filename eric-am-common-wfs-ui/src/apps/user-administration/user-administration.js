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

// common libraries
import { App, html, definition } from '@eui/app';

// styles
import style from './user-administration.css';

// helpers
import { USER_ADMINISTRATION_URL } from './config.js';

/**
 * UserAdministration is defined as
 * `<e-user-administration>`
 *
 * @extends {App}
 */
export default class UserAdministration extends App {
  // The import.meta object exposes context-specific metadata to a JavaScript module.
  get meta() {
    return import.meta;
  }

  didConnect() {
    this.bubble('app:lineage', { metaData: this.metaData });

    try {
      window.open(USER_ADMINISTRATION_URL, 'User Administration').focus();
    } catch (err) {
      console.warn(
        `Failed to open 'User Administration' in a new tab automatically due to: ${err}`,
      );
    }
  }

  /**
   * Render the <e-user-administration> app. This function is called each time a
   * prop changes.
   */
  render() {
    return html` <div>
      ${this.i18n?.WARNING ||
      "If user administration didn't open automatically click"}
      <a
        class="user-administation--link"
        href=${USER_ADMINISTRATION_URL}
        target="User Administration"
        target="_blank"
        rel="noreferrer"
        >${this.i18n?.HERE || 'here'}</a
      >
    </div>`;
  }
}

definition('e-user-administration', {
  style,
})(UserAdministration);

UserAdministration.register();
