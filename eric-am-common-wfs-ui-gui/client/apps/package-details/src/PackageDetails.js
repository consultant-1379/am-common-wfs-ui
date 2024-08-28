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
import "@eui/layout";
import { definition } from "@eui/component";
import { App, html } from "@eui/app";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";

// components
import "../../../components/details-side-panel/src/DetailsSidePanel";

// helpers
import { fetchPackage } from "../../../api/onboarding";
import {
  accessDenied,
  checkPermissions,
  formatBackendSinglePackageData
} from "../../../utils/CommonUtils";

// styles
import style from "./packageDetails.css";

/**
 * PackageDetails is defined as
 * `<e-package-details>`
 *
 * Imperatively create application
 * @example
 * let app = new PackageDetails();
 *
 * Declaratively create application
 * @example
 * <e-package-details></e-package-details>
 *
 * @extends {App}
 */
@definition("e-package-details", {
  style,
  props: {
    response: { attribute: false },
    selected: { attribute: false, type: "object", default: {} }
  }
})
export default class PackageDetails extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.checkPermissions = checkPermissions.bind(this);

    this._fetchPackage = this._fetchPackage.bind(this);
  }

  componentDidConnect() {
    this.checkPermissions(this._enableCallback);
  }

  get packageId() {
    const query = window.location.href.split("?")[1] || "";

    return query.replace("id=", "");
  }

  /**
   * Fetch package details
   *
   * @returns {Promise<void>}
   */
  async _fetchPackage(payload) {
    try {
      const response = await fetchPackage(payload);

      this.selected = formatBackendSinglePackageData(response);
    } catch (error) {
      console.error("Error when fetching product details: ", error);
    }
  }

  addQuerySelectors() {
    window.querySelectorDeep = function qsDeep(htmlIdentifier) {
      return querySelectorDeep(htmlIdentifier);
    };
    window.querySelectorAllDeep = function qsAllDeep(htmlIdentifier) {
      return querySelectorAllDeep(htmlIdentifier);
    };
  }

  _enableCallback() {
    const { packageId } = this;

    this._fetchPackage({ packageId });
  }

  _renderPackageDetails() {
    return html`
      <eui-layout-v0-tile tile-title="Details" subtitle=${this.selected.appCompositeName}>
        <e-details-side-panel
          slot="content"
          .selected=${this.selected}
          .pageStyle=${"divTablePage"}
        ></e-details-side-panel>
      </eui-layout-v0-tile>
    `;
  }

  render() {
    return html`
      ${this.isValidPermission ? this._renderPackageDetails() : accessDenied()}
    `;
  }
}

/**
 * Register the component as e-package-details.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// PackageDetails.register();
