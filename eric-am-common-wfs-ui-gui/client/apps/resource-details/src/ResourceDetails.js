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
import "../../../components/resource-details-panel/src/ResourceDetailsPanel";

// models
import { Resource } from "../../../model/resources";

// styles
import style from "./resourceDetails.css";

// helpers
import { fetchResource } from "../../../api/internal";
import { accessDenied, checkPermissions, showNotification } from "../../../utils/CommonUtils";

/**
 * ResourceDetails is defined as
 * `<e-resource-details>`
 *
 * Imperatively create application
 * @example
 * let app = new ResourceDetails();
 *
 * Declaratively create application
 * @example
 * <e-resource-details></e-resource-details>
 *
 * @extends {App}
 */
@definition("e-resource-details", {
  style,
  props: {
    selected: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceDetails extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.checkPermissions = checkPermissions.bind(this);

    this._fetchResource = this._fetchResource.bind(this);
  }

  componentDidConnect() {
    // TODO: After getting the service to get the package details, make a rest call
    // to that service which takes the packageId and returns the package details.
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
    this.checkPermissions(this._enableCallback);
  }

  /**
   * Fetch resource details
   *
   * @returns {Promise<void>}
   */
  async _fetchResource(payload) {
    try {
      const response = await fetchResource(payload);

      this.selected = new Resource(response);
    } catch (error) {
      showNotification("Error", "Request for instance details failed", true, 5000);
      console.error("Error when fetching resource details: ", error);
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
    const resourceId = String(window.location.href.split("?")[1]).replace("id=", "");

    this._fetchResource({ resourceId });
  }

  /**
   * Render the <e-package-details> app. This function is called each time a
   * prop changes.
   */
  _renderResourceDetails() {
    return html`
      <eui-layout-v0-tile tile-title="Details" subtitle=${this.selected.vnfInstanceName}>
        <e-resource-details-panel
          slot="content"
          .permissions=${this.userInformation.permissions}
          .selected=${this.selected}
          .pageStyle=${"divTablePage"}
          .availability=${this.appConfiguration.availability}
        ></e-resource-details-panel>
      </eui-layout-v0-tile>
    `;
  }

  render() {
    return html`
      ${this.isValidPermission ? this._renderResourceDetails() : accessDenied()}
    `;
  }
}

/**
 * Register the component as e-resource-details.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// ResourceDetails.register();
