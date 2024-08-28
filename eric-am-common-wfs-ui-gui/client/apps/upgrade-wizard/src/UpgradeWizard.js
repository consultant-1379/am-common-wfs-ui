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
 * UpgradeWizard is defined as
 * `<e-upgrade-wizard>`
 *
 * Imperatively create application
 * @example
 * let app = new UpgradeWizard();
 *
 * Declaratively create application
 * @example
 * <e-upgrade-wizard></e-upgrade-wizard>
 *
 * @extends {App}
 */
import { definition } from "@eui/component";
import { App, html } from "@eui/app";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";
import style from "./upgradeWizard.css";
import "../../../components/upgrade-wizard-component/src/UpgradeWizardComponent";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";
import { getQueryParam, stripQueryParam } from "../../../utils/RestUtils";
import {
  PACKAGE_PARAM_NAME,
  RESOURCE_PARAM_NAME,
  UPGRADE_RESOURCE_NAME
} from "../../../constants/GenericConstants";
import { checkPermissions } from "../../../utils/CommonUtils";

@definition("e-upgrade-wizard", {
  style
})
export default class UpgradeWizard extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.checkPermissions = checkPermissions.bind(this);
  }

  componentDidConnect() {
    let url = window.location.href;
    if (url.includes(PACKAGE_PARAM_NAME)) {
      url = stripQueryParam(url, PACKAGE_PARAM_NAME);
    }
    this.resourceId = getQueryParam(url, RESOURCE_PARAM_NAME).parameterValue;
    this.checkPermissions(() => {}, UPGRADE_RESOURCE_NAME);
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
    const { availability = {} } = this.appConfiguration;
    this.isUpgradeWizardAvailable = availability.packages;
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(() => {}, UPGRADE_RESOURCE_NAME);
    }
  }

  onPause() {
    if (this.shadowRoot) {
      const wizard = this.shadowRoot.querySelector("e-upgrade-wizard-component");
      if (wizard != null) {
        this.shadowRoot.removeChild(wizard);
      }
    }
  }

  onResume() {
    if (this.shadowRoot && this.isUpgradeWizardAvailable) {
      this.resourceId = getQueryParam(window.location.href, RESOURCE_PARAM_NAME).parameterValue;
      const wizard = document.createElement("e-upgrade-wizard-component");
      wizard.isValidPermission = this.isValidPermission;
      wizard.resourceId = this.resourceId;
      this.shadowRoot.appendChild(wizard);
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

  _renderUnavailableUpgradeWizard() {
    return html`
      <e-unavailable-page-component title="Upgrade Wizard is not available">
      </e-unavailable-page-component>
    `;
  }

  _renderAvailableUpgradeWizard() {
    return html`
      <e-upgrade-wizard-component
        .resourceId=${this.resourceId}
        .isValidPermission=${this.isValidPermission}
      >
      </e-upgrade-wizard-component>
    `;
  }

  render() {
    return html`
      ${this.isUpgradeWizardAvailable
        ? this._renderAvailableUpgradeWizard()
        : this._renderUnavailableUpgradeWizard()}
    `;
  }
}
