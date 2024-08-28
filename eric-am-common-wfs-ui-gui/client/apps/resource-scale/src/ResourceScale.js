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
import "../../../components/generic-dialog/src/GenericDialog";
import "../../../components/scale-resource-panel/src/ScaleResourcePanel";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";

// styles
import style from "./resourceScale.css";

// helpers
import { fetchResource } from "../../../api/internal";
import { showNotification, checkPermissions } from "../../../utils/CommonUtils";
import { SCALE_RESOURCE_NAME } from "../../../constants/GenericConstants";

/**
 * ResourceScale is defined as
 * `<e-resource-scale>`
 *
 * Imperatively create application
 * @example
 * let app = new ResourceScale();
 *
 * Declaratively create application
 * @example
 * <e-resource-scale></e-resource-scale>
 *
 * @extends {App}
 */
@definition("e-resource-scale", {
  style,
  home: "resource-scale",
  props: {
    resourceId: { attribute: false, type: "string", default: "" },
    scaleData: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceScale extends App {
  constructor() {
    super();

    this.addQuerySelectors();

    this.checkPermissions = checkPermissions.bind(this);
    this._fetchResource = this._fetchResource.bind(this);
  }

  componentDidConnect() {
    this.checkPermissions(this._enableCallback, SCALE_RESOURCE_NAME);
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);

    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(this._enableCallback, SCALE_RESOURCE_NAME);
    }
  }

  /**
   * Fetch resource details
   *
   * @returns {Promise<void>}
   */
  async _fetchResource(payload, onResume = false) {
    try {
      const response = await fetchResource(payload);

      if (onResume) {
        const resourcePanel = document.createElement("e-scale-resource-panel");

        this.scaleData = response;
        resourcePanel.isValidPermission = this.isValidPermission;
        resourcePanel.scaleStatus = this._setScaleStatus();
        resourcePanel.scaleInfo = this._setScaleInfo();
        resourcePanel.vnfInstanceName = this.scaleData.vnfInstanceName;
        resourcePanel.resourceId = this.resourceId;
        this.shadowRoot.appendChild(resourcePanel);
      } else {
        this.scaleData = response;
      }
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
    const { resourceId } = this;

    this._fetchResource({ resourceId });
  }

  onPause() {
    if (this.shadowRoot) {
      const resourcePanel = this.shadowRoot.querySelector("e-scale-resource-panel");

      if (resourcePanel != null) {
        this.shadowRoot.removeChild(resourcePanel);
      }
    }
  }

  onResume() {
    if (this.shadowRoot) {
      const { resourceId } = this;

      this._fetchResource({ resourceId }, true);
    }
  }

  _setScaleStatus() {
    if (Object.keys(this.scaleData).length !== 0) {
      return this.scaleData.instantiatedVnfInfo.scaleStatus;
    }
    return {};
  }

  _setScaleInfo() {
    if (Object.keys(this.scaleData).length !== 0) {
      return this.scaleData.scalingInfo;
    }
    return {};
  }

  /**
   * Render the <e-resource-scale> app. This function is called each time a
   * prop changes.
   */

  _renderUnavailableResourceScale() {
    return html`
      <e-unavailable-page-component title="Resource Scale is not available">
      </e-unavailable-page-component>
    `;
  }

  _renderAvailableResourceScale() {
    return html`
      <e-scale-resource-panel
        .scaleStatus=${this._setScaleStatus()}
        .scaleInfo=${this._setScaleInfo()}
        .resourceId=${this.resourceId}
        .isValidPermission=${this.isValidPermission}
        .vnfInstanceName=${this.scaleData.vnfInstanceName}
        @scale-resource-event=${this}
      ></e-scale-resource-panel>
    `;
  }

  render() {
    return this._renderAvailableResourceScale();
  }
}

/**
 * Register the component as e-resource-scale.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// ResourceScale.register();
