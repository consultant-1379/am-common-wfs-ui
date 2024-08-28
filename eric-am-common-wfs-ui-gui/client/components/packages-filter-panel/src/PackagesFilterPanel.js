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
 * Component PackagesFilterPanel is defined as
 * `<e-packages-filter-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new PackagesFilterPanel();
 *
 * Declaratively create component
 * @example
 * <e-packages-filter-panel></e-packages-filter-panel>
 *
 * @extends {LitComponent}
 */
import "@eui/base";
import { definition } from "@eui/component";
import { html } from "@eui/lit-component";
import "../../generic-checkbox/src/GenericCheckBox";
import BaseFilterPanel from "../../base-filter-panel/src/BaseFilterPanel";
import { PACKAGES_FILTER_CLASS } from "../../../utils/FilterUtils";
import { PACKAGE_FILTER_URL } from "../../../utils/RestUtils";
import style from "./packagesFilterPanel.css";
import { VERSIONS_OF_PACKAGE } from "../../../constants/Messages";
import { NOT_IN_USE, IN_USE } from "../../../constants/GenericConstants";
import { PACKAGE_STATUS_VALUES } from "../../../utils/CommonUtils";

const USAGE_STATE_VALUES = [IN_USE, NOT_IN_USE];

const FILTER_FIELDS = [
  { type: "dropdown", data: { appProductName: "Type" } },
  { type: "dropdown", data: { appSoftwareVersion: "Software version" } },
  { type: "dropdown", data: { descriptorVersion: "Package version" } },
  { type: "dropdown", data: { appProvider: "Provider" } },
  {
    type: "checkbox",
    data: { usageState: { label: "Usage state", values: USAGE_STATE_VALUES } }
  }
];

const PACKAGE_STATUS_FILTERS_FIELD = [
  {
    type: "checkbox",
    data: { onboardingState: { label: "Status", values: PACKAGE_STATUS_VALUES } }
  }
];

/* TODO Add back in once relevant APIs are available for this data
const DATE_LABELS = ["From", "To"];
const ONBOARDED_AT = "Onboarded at";
*/

@definition("e-packages-filter-panel", {
  style,
  home: "packages-filter-panel",
  props: {
    pageName: { attribute: true, type: "string" }
  }
})
export default class PackagesFilterPanel extends BaseFilterPanel {
  constructor() {
    super(PACKAGES_FILTER_CLASS);
    super.initializeDropdownFilters(this.getPackagesPageFilters(), PACKAGE_FILTER_URL);
  }

  componentDidConnect() {
    super.initializeDropdownFilters(this.getPackagesPageFilters(), PACKAGE_FILTER_URL);
    if (this.pageName === VERSIONS_OF_PACKAGE) {
      const url = window.location.href;
      if (url.includes("?")) {
        this.resourceId = url.split("?")[1].replace("id=", "");
      }
    }
  }

  getPackagesPageFilters() {
    const url = window.location.href;
    if (url.includes("#packages")) {
      return FILTER_FIELDS.concat(PACKAGE_STATUS_FILTERS_FIELD);
    }
    return FILTER_FIELDS;
  }

  /* TODO Add back into render function once relevant APIs are available for this information
    ${this.renderDatePickerComponent(DATE_LABELS, ONBOARDED_AT)}
  */
  render() {
    return html`
      <div class="divColumn">
        <div class="divColumnBody">
          ${this.renderFilterFields(this.getPackagesPageFilters())}
          <div class="divColumnRow">
            <div class="divColumnButtonCell">
              <eui-base-v0-button @click="${() => this.handleReset()}"> Reset</eui-base-v0-button>
              <eui-base-v0-button @click="${() => this.handleApply()}" primary
                >Apply</eui-base-v0-button
              >
              <p class="errorMessage invalidDateSelection"></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

PackagesFilterPanel.register();
