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
import { HEAL_RESOURCE_NAME } from "../../../constants/GenericConstants";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";
import "../../../components/heal-resource-panel/src/HealResourcePanel";
import "../../../components/generic-dialog/src/GenericDialog";

// styles
import style from "./resourceHeal.css";

// helpers
import {
  showNotification,
  checkPermission,
  parseDescriptorModel,
  removeEmptyOrNullParams
} from "../../../utils/CommonUtils";
import { UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT } from "../../../constants/Events";
import { fetchResource } from "../../../api/internal";
import { fetchPackage } from "../../../api/onboarding";

/**
 * ResourceHeal is defined as
 * `<e-resource-heal>`
 *
 * Imperatively create application
 * @example
 * let app = new ResourceHeal();
 *
 * Declaratively create application
 * @example
 * <e-resource-heal></e-resource-heal>
 *
 * @extends {App}
 */
@definition("e-resource-heal", {
  style,
  home: "resource-heal",
  props: {
    resourceId: { attribute: false, type: "string", default: "" },
    healResourceData: { attribute: false, type: "object", default: {} },
    additionalAttributes: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceHeal extends App {
  constructor() {
    super();

    this.addQuerySelectors();

    this._fetchResource = this._fetchResource.bind(this);
    this._fetchPackage = this._fetchPackage.bind(this);
  }

  componentDidConnect() {
    this._checkPermissions();
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;

    const { availability = {} } = this.appConfiguration;

    this.isResourceHealAvailable = availability.packages;

    if (this.isResourceHealAvailable) {
      const { resourceId } = this;

      this._fetchResource({ resourceId });
    }
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);

    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this._checkPermissions();
    }
  }

  /**
   * Fetch resource details
   *
   * @returns {Promise<void>}
   */
  async _fetchResource(payload) {
    try {
      const response = await fetchResource(payload);

      this.healResourceData = null;
      this.healData = response;
      this._fetchPackage(this.healData);
    } catch (error) {
      showNotification("Error", "Request for instance details failed", true, 5000);
      console.error("Error when fetching resource details: ", error);
    }
  }

  /**
   * Fetch package
   *
   * @returns {Promise<void>}
   */
  async _fetchPackage(healData) {
    try {
      const response = await fetchPackage({ packageId: healData.vnfPkgId });

      parseDescriptorModel(this.healData, response.descriptorModel, "heal");
      this.healResourceData = this.healData;
    } catch (error) {
      this.healData = null;
      this.healResourceData = null;
      console.error("Error when fetching package or parsing descriptor: ", error);
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

  handleEvent(event) {
    switch (event.type) {
      case UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT:
        this.additionalAttributes = {
          ...removeEmptyOrNullParams(this.additionalAttributes, event.detail)
        };
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _checkPermissions() {
    this.userInformation = this.storeConnect(["userInformation"]).userInformation;
    this.state.tokenId = this.userInformation.tokenId;
    this.isValidPermission = checkPermission(this.userInformation, HEAL_RESOURCE_NAME);
  }

  onPause() {
    super.onPause();
    this.healResourceData = {};
  }

  _renderUnavailableResourceHeal() {
    return html`
      <e-unavailable-page-component title="Resource Heal is not available">
      </e-unavailable-page-component>
    `;
  }

  _renderAvailableResourceHeal() {
    return html`
      <e-heal-resource-panel
        @heal-resource-event=${this}
        @update-additional-attributes-data=${this}
        .resourceId=${this.resourceId}
        .isValidPermission=${this.isValidPermission}
        .vnfInstanceName=${this.healResourceData.vnfInstanceName}
        .healResourceData=${this.healResourceData}
        .additionalAttributes=${this.additionalAttributes}
      ></e-heal-resource-panel>
    `;
  }

  render() {
    return html`
      ${this.isResourceHealAvailable
        ? this._renderAvailableResourceHeal()
        : this._renderUnavailableResourceHeal()}
    `;
  }
}
/**
 * Register the component as e-resource-heal.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// ResourceHeal.register();
