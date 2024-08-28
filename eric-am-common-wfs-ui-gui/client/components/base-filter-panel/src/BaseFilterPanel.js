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
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./baseFilterPanel.css";
import { FILTERING_EVENT } from "../../../utils/FilterUtils";
import "../../generic-combo-box/src/GenericComboBox";
import "../../generic-datepicker/src/GenericDatepicker";
import "../../generic-text-field/src/GenericTextField";

const INVALID_DATE_SELECTION = "Invalid date selection.";
/**
 * This is the base panel for filtering.
 *
 * @property {array} data - data passed from GenericMultiPanel
 */
@definition("e-base-filter-panel", {
  style,
  props: {
    data: { attribute: false, type: "object", default: {} }
  }
})
export default class BaseFilterPanel extends LitComponent {
  constructor(filterClass) {
    super();
    this.filterClass = filterClass;
    this.filterValues = new Map();
  }

  initializeDropdownFilters(dynamicFilters /* filterUrl */) {
    this.filters = dynamicFilters;
    // TODO needs to finalize the REST API end point and data format exactly
    // REST call to fetch dynamic values..in this case values for dropdown boxes
    // Once dynamic values are received filter parameters are populated
    //  executeSimpleGetRequest(
    //   filterUrl,
    //   response => {
    //     this.data = response.data;
    //     this.mapFilters();
    //   },
    //   error => {
    //     this.data = error;
    //   }
    // );
  }

  getFilterValues() {
    return this.filterValues;
  }

  mapFilters() {
    this.filters.forEach(filter => {
      this.filterValues.set(
        filter,
        !Object.keys(this.data).includes(filter)
          ? []
          : this.data[filter].map(x => ({
              value: x
            }))
      );
    });
  }

  validateSelectedDate(fromDate, toDate) {
    let fromDateTime;
    let toDateTime;
    if (fromDate) {
      fromDateTime = new Date(fromDate).getTime();
    }
    if (toDate) {
      toDateTime = new Date(toDate).getTime();
    }
    let validDate = true;
    // when From and To dates selected
    if (fromDateTime && toDateTime) {
      validDate = fromDateTime <= toDateTime;
    }
    const invalidDateSelector = this.shadowRoot.querySelector(".invalidDateSelection");
    if (invalidDateSelector) {
      invalidDateSelector.innerHTML = INVALID_DATE_SELECTION;
      invalidDateSelector.style.display = validDate ? "none" : "block";
    }
    return validDate;
  }

  handleApply(jsonChildElement, jsonChildElementKeys) {
    const invalidDateSelector = this.shadowRoot.querySelector(".invalidDateSelection");
    if (invalidDateSelector && invalidDateSelector.style.display === "block") {
      invalidDateSelector.style.display = "none";
    }
    const selectedFiltersMap = this.buildFilterMap(jsonChildElement, jsonChildElementKeys);
    this.validateSelectedDate(selectedFiltersMap.From, selectedFiltersMap.To);
    this.bubble(FILTERING_EVENT, selectedFiltersMap);
  }

  handleReset() {
    const invalidDateSelector = this.shadowRoot.querySelector(".invalidDateSelection");
    if (invalidDateSelector) {
      invalidDateSelector.style.display = "none";
    }
    const selectedFilters = this.getSelectedFilters();
    if (selectedFilters.length === 0) {
      return;
    }
    selectedFilters.forEach(filterSource => {
      filterSource.reset();
    });
  }

  getSelectedFilters() {
    const cssSelectorForFilter = `.${this.filterClass}`;
    const filterSourceElements = this.shadowRoot.querySelectorAll(cssSelectorForFilter);
    const selectedFilters = [];
    filterSourceElements.forEach(filterSource => {
      if (filterSource.getValue()) {
        selectedFilters.push(filterSource);
      }
    });
    return selectedFilters;
  }

  renderFilterFields(filterFieldsData) {
    return Object.values(filterFieldsData).map(filterFieldData =>
      this.renderFilterField(filterFieldData)
    );
  }

  renderFilterField(filterFieldData) {
    switch (filterFieldData.type) {
      case "text":
        return this.renderTextFieldComponent(filterFieldData.data);
      case "checkbox":
        return this.renderCheckboxComponent(filterFieldData.data);
      case "dropdown":
        return this.renderDropdownComponent(filterFieldData.data);
      default:
        console.log(
          `Encountered unknown filter type: ${filterFieldData.type} : ${filterFieldData.data}`
        );
        return null;
    }
  }

  renderTextFieldComponent(textFieldData) {
    return Object.keys(textFieldData).map(
      key => html`
        <div class="divColumnRow">
          <div class="divColumnCellLabel">${textFieldData[key]}</div>
        </div>
        <div class="divColumnRow">
          <div class="divColumnCellContent">
            <e-generic-text-field
              .data=${this.getFilterValues().get(key)}
              .dataAttribute=${key}
              class=${this.filterClass}
              placeholder=" "
            ></e-generic-text-field>
          </div>
        </div>
      `
    );
  }

  // TODO change text field to combo box after filtering is implemented and remove placeholder
  renderDropdownComponent(dropdownData) {
    return Object.keys(dropdownData).map(
      dropdownElement => html`
        <div class="divColumnRow">
          <div class="divColumnCellLabel">${dropdownData[dropdownElement]}</div>
        </div>
        <div class="divColumnRow">
          <div class="divColumnCellContent">
            <e-generic-text-field
              .data=${this.getFilterValues().get(dropdownElement)}
              .dataAttribute=${dropdownElement}
              class=${this.filterClass}
              placeholder=" "
            ></e-generic-text-field>
          </div>
        </div>
      `
    );
  }

  renderDatePickerComponent(dateLabels, label) {
    return html`
      <div class="divColumnRow">
        <div class="divColumnCellLabel">${label}</div>
      </div>
      <div class="divColumnRow">
        ${dateLabels.map(
          dateLabel => html`
            <div class="divColumnRow">
            <div class="divColumnCellDate">
              <label>${dateLabel}<label>
            </div>
            <e-generic-datepicker
              .dataAttribute="${dateLabel}"
              class=${this.filterClass}
            ></e-generic-datepicker>
          `
        )}
      </div>
    `;
  }

  renderCheckboxComponent(checkboxData) {
    return Object.keys(checkboxData).map(
      checkbox => html`
        <eui-base-v0-accordion category-title=${checkboxData[checkbox].label} open>
          ${checkboxData[checkbox].values.map(
            stateData => html`
              <div class="divColumnRow">
                <div class="divCheckBoxColumnCell">
                  <e-generic-checkbox
                    .data=${stateData}
                    .dataAttribute=${checkbox}
                    class=${this.filterClass}
                  ></e-generic-checkbox>
                </div>
              </div>
            `
          )}
        </eui-base-v0-accordion>
      `
    );
  }

  buildFilterMap(jsonElement, jsonChildElementKeys) {
    const selectedFilters = this.getSelectedFilters();
    let selectedFiltersMap = {};
    selectedFilters.forEach(function addJsonParentKey(filter) {
      if (jsonChildElementKeys && jsonChildElementKeys.includes(filter.dataAttribute)) {
        filter.dataAttribute = `${jsonElement}/${filter.dataAttribute}`;
      }
      if (filter.localName === "e-generic-checkbox") {
        if (!selectedFiltersMap[filter.dataAttribute]) {
          selectedFiltersMap[filter.dataAttribute] = [];
        }
        selectedFiltersMap[filter.dataAttribute].push(filter.data.toUpperCase().replace(/ /g, "_"));
      } else if (filter.localName === "e-generic-datepicker") {
        selectedFiltersMap = { ...selectedFiltersMap, ...filter.getValue() };
      } else {
        selectedFiltersMap[filter.dataAttribute] = filter.getValue();
      }
    });
    return selectedFiltersMap;
  }
}
