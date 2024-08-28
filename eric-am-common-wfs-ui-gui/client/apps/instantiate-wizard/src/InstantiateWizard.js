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
 * InstantiateWizard is defined as
 * `<e-instantiate-wizard>`
 *
 * Imperatively create application
 * @example
 * let app = new InstantiateWizard();
 *
 * Declaratively create application
 * @example
 * <e-instantiate-wizard></e-instantiate-wizard>
 *
 * @extends {App}
 */
import { definition } from "@eui/component";
import { App, html } from "@eui/app";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";
import style from "./instantiateWizard.css";
import "../../../components/instantiate-wizard-component/src/InstantiateWizardComponent";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";
import { checkPermissions } from "../../../utils/CommonUtils";
import { INSTANTIATE_RESOURCE_NAME } from "../../../constants/GenericConstants";

@definition("e-instantiate-wizard", {
  style,
  props: {}
})
export default class InstantiateWizard extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.checkPermissions = checkPermissions.bind(this);
  }

  onPause() {
    this.stepData = {};
    if (this.shadowRoot) {
      const wizard = this.shadowRoot.querySelector("e-instantiate-wizard-component");
      if (wizard != null) {
        this.shadowRoot.removeChild(wizard);
      }
    }
  }

  componentDidConnect() {
    this.checkPermissions(() => {}, INSTANTIATE_RESOURCE_NAME);
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;
    const { availability = {} } = this.appConfiguration;
    this.isInstantiateWizardAvailable = availability.packages;
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);
    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(() => {}, INSTANTIATE_RESOURCE_NAME);
    }
  }

  onResume() {
    this.stepData = {};
    if (this.shadowRoot && this.isInstantiateWizardAvailable) {
      const wizard = document.createElement("e-instantiate-wizard-component");
      wizard.isValidPermission = this.isValidPermission;
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

  _renderUnavailableInstantiateWizard() {
    return html`
      <e-unavailable-page-component title="Instantiate Wizard is not available">
      </e-unavailable-page-component>
    `;
  }

  _renderAvailableInstantiateWizard() {
    return html`
      <e-instantiate-wizard-component .isValidPermission=${this.isValidPermission}>
      </e-instantiate-wizard-component>
    `;
  }

  render() {
    return html`
      ${this.isInstantiateWizardAvailable
        ? this._renderAvailableInstantiateWizard()
        : this._renderUnavailableInstantiateWizard()}
    `;
  }
}
