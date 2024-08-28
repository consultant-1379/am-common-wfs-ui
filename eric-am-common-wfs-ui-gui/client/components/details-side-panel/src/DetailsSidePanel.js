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
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";

// conponents
import "@eui/layout";
import "./components/supported-operations-tab/SupportedOperationsTab";

// helpers
import "../../additional-attributes-tab/src/AdditionalAttributesTab";
import { NO_PACKAGE_SELECTED } from "../../../constants/Messages";
import {
  convertValueToStringIfObject,
  formatBackendSinglePackageData
} from "../../../utils/CommonUtils";
import { fetchPackage } from "../../../api/onboarding";

// styles
import style from "./detailsSidePanel.css";

/**
 * Component DetailsSidePanel is defined as
 * `<e-details-side-panel>`
 *
 * @property {object} selected - the selected row in the table.
 * @property {string} pageStyle - css property tag.
 * @property {array} additionalAttributesData - data for additional attributes tab.
 *
 * Imperatively create component
 * @example
 * let component = new DetailsSidePanel();
 *
 * Declaratively create component
 * @example
 * <e-details-side-panel></e-details-side-panel>
 *
 * @extends {LitComponent}
 */
@definition("e-details-side-panel", {
  style,
  props: {
    selected: { attribute: false, type: "object", default: {} },
    pageStyle: { attribute: false, type: "string", default: "" },
    parsedPackageData: { attribute: false, type: "object", default: {} }
  }
})
export default class DetailsSidePanel extends LitComponent {
  constructor() {
    super();

    this._fetchPackage = this._fetchPackage.bind(this);
  }

  componentDidReceiveProps(prev) {
    super.componentDidReceiveProps(prev);

    const { appPkgId: newPackageId } = this.selected || {};
    const { appPkgId: oldPackageId } = prev.selected || {};

    if (newPackageId && newPackageId !== oldPackageId) {
      this._fetchPackage();
    }

    if (!newPackageId) {
      this.parsedPackageData = {};
    }
  }

  /**
   * Fetch information for specific package
   *
   * @returns {void}
   */
  async _fetchPackage() {
    const { appPkgId: packageId } = this.selected;

    try {
      const response = await fetchPackage({ packageId });

      this.parsedPackageData = formatBackendSinglePackageData(response);
      if (this.parsedPackageData.additionalAttributes) {
        this.additionalAttributesData = Object.entries(
          this.parsedPackageData.additionalAttributes
        ).map(([K, V]) => ({ parameter: K, value: convertValueToStringIfObject(V) }));
      } else {
        this.additionalAttributesData = {};
      }
    } catch (error) {}
  }

  updateTabs() {
    const tabs = this.shadowRoot.querySelector("eui-layout-v0-tabs");
    if (tabs != null) {
      tabs.update();
    }
  }

  /*
    TODO Add back in "Onboarded at" column when appropriate information is available from future APIs
  */
  render() {
    const errorInformation =
      this.parsedPackageData.errorDetails &&
      html`
        <div class="divTableRow firstRow" id="onboardingStatus">
          <div class="divTableCellDescTitle">Information</div>
          <div class="divTableCellDesc">
            ${this.parsedPackageData.errorDetails}
          </div>
        </div>
      `;
    return html`
      ${Object.keys(this.parsedPackageData).length
        ? html`
            <eui-layout-v0-tabs>
              <eui-layout-v0-tab id="generalInfo" selected>General information</eui-layout-v0-tab>
              <eui-layout-v0-tab id="additionalAttributes">Additional attributes</eui-layout-v0-tab>
              <eui-layout-v0-tab id="supportedOperations">Supported operations</eui-layout-v0-tab>
              <div slot="content" selected>
                <div class=${this.pageStyle}>
                  <div class="divTableBody">
                    <div class="divTableRow firstRow" id="vnfdId">
                      <div class="divTableCell">VNF descriptor id</div>
                      <div class="divTableCell" title="${this.parsedPackageData.appDescriptorId}">
                        ${this.parsedPackageData.appDescriptorId}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="usageState">
                      <div class="divTableCell">Usage state</div>
                      <div class="divTableCell" title="${this.parsedPackageData.usageState}">
                        ${this.parsedPackageData.usageState}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="appProvider">
                      <div class="divTableCell">Provider</div>
                      <div class="divTableCell" title="${this.parsedPackageData.appProvider}">
                        ${this.parsedPackageData.appProvider}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="type">
                      <div class="divTableCell">Type</div>
                      <div class="divTableCell" title="${this.parsedPackageData.appProductName}">
                        ${this.parsedPackageData.appProductName}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="descriptorVersion">
                      <div class="divTableCell">Package version</div>
                      <div class="divTableCell" title="${this.parsedPackageData.descriptorVersion}">
                        ${this.parsedPackageData.descriptorVersion}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="appSoftwareVersion">
                      <div class="divTableCell">Software version</div>
                      <div
                        class="divTableCell"
                        title="${this.parsedPackageData.appSoftwareVersion}"
                      >
                        ${this.parsedPackageData.appSoftwareVersion}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="packageSecurityOption">
                      <div class="divTableCell">Security option</div>
                      <div
                        class="divTableCell"
                        title="${this.parsedPackageData.packageSecurityOptionString}"
                      >
                        ${this.parsedPackageData.packageSecurityOptionString}
                      </div>
                    </div>
                  </div>
                </div>
                <div class=${this.pageStyle}>
                  <div class="divTableBody">
                    <div class="divTableRow firstRow" id="description">
                      <div class="divTableCellDescTitle">Description</div>
                      <div class="divTableCellDesc">
                        ${this.parsedPackageData.description}
                      </div>
                    </div>
                    <div class="divTableRow firstRow" id="onboardingStatus">
                      <div class="divTableCellDescTitle">Status</div>
                      <div class="divTableCellDesc">
                        <e-custom-cell-state
                          id="onboardingStatusDetails"
                          .cellValue=${this.parsedPackageData.onboardingState}
                        ></e-custom-cell-state>
                      </div>
                    </div>
                    ${errorInformation}
                  </div>
                </div>
              </div>
              <div slot="content">
                <e-additional-attributes-tab
                  .additionalAttributesData=${this.additionalAttributesData}
                ></e-additional-attributes-tab>
              </div>
              <div slot="content">
                <e-supported-operations-tab
                  .packageId=${this.parsedPackageData.appPkgId}
                ></e-supported-operations-tab>
              </div>
            </eui-layout-v0-tabs>
          `
        : html`
            <p>${NO_PACKAGE_SELECTED}</p>
          `}
    `;
  }
}

/**
 * Register the component as e-details-side-panel.
 * Registration can be done at a later time and with a different name
 */
DetailsSidePanel.register();
