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
import { LitComponent, html } from "@eui/lit-component";
import { querySelectorDeep } from "query-selector-shadow-dom";

// components
import "../../generic-combo-box/src/GenericComboBox";
import "../../generic-text-field/src/GenericTextField";
import "../../generic-table/src/GenericTable";

// styles
import style from "./scaleResourcePanel.css";

// helpers
import {
  showNotification,
  accessDenied,
  removeEmptyOrNullParams,
  isValidTimeoutRange,
  isEmptyString
} from "../../../utils/CommonUtils";
import {
  OPERATION_STARTED_MESSAGE,
  APPLICATION_TIMEOUT,
  INVALID_TIMEOUT_ERR_MSG,
  SCALE_STARTED_NOTIFICATION,
  HELM_NO_HOOKS
} from "../../../constants/Messages";
import { fetchScaleInfo } from "../../../api/internal";
import { postScaleResource } from "../../../api/orchestrator";

/**
 * Component ScaleResourcePanel is defined as
 * `<e-scale-resource-panel>`
 *
 * @property {string} resourceId - instance ID
 * @property {object} scaleAttributes - instantiateOssTopology attributes
 *
 * Imperatively create component
 * @example
 * let component = new ScaleResourcePanel();
 *
 * Declaratively create component
 * @example
 * <e-scale-resource-panel></e-scale-resource-panel>
 *
 * @extends {LitComponent}
 */
@definition("e-scale-resource-panel", {
  style,
  home: "scale-resource-panel",
  props: {
    data: { attribute: true, type: "array", default: [] },
    ScaleDisabled: { attribute: false, type: "boolean", default: true },
    scaleStatus: { attribute: false, type: "object", default: [] },
    scaleInfo: { attribute: false, type: "object", default: {} },
    resourceId: { attribute: false, type: "string", default: "" },
    scaleTypeSelected: { attribute: false, type: "string", default: "SCALE_OUT" },
    comboValue: { attribute: false, type: "string", default: "" },
    stepsToScaleValue: { attribute: false, type: "string" },
    applicationTimeOut: { attribute: false, type: "string", default: "3600" },
    vnfInstanceName: { attribute: false, type: "string", default: "" },
    confirmResourceScale: { attribute: false, type: "boolean", default: false },
    resourceScaleStarted: { attribute: false, type: "boolean", default: false },
    validTimeout: { attribute: false, type: "boolean", default: true },
    isValidPermission: { attribute: false, type: "boolean" },
    isLoading: { attribute: false, type: "boolean", default: false },
    showWarning: { attribute: false, type: "boolean", default: false }
  }
})
export default class ScaleResourcePanel extends LitComponent {
  constructor() {
    super();

    this.handleEvent = this.handleEvent.bind(this);
    this.scaleType = ["scale in", "scale out"];
    this.scalingLevels = ["Minimum", "Maximum", "Current"];
    this.errorMessage = "";
    this.aspectIds = [];
    this.confirmScaleData = [];

    this._fetchScaleInfo = this._fetchScaleInfo.bind(this);
    this._postScaleResource = this._postScaleResource.bind(this);
  }

  componentDidConnect() {
    this.validScaleAspect = false;
    this.invalidSteps = true;
    this.validAppTimeout = true;
    this.helmNoHooks = true;
  }

  /**
   * Fetch scale info
   *
   * @returns {Promise<void>}
   */
  async _fetchScaleInfo() {
    const scaleVnfInfoRequest = {};
    const { aspectId } = this.comboValueObj;

    this.isLoading = true;
    scaleVnfInfoRequest.type = this.scaleTypeSelected;
    scaleVnfInfoRequest.aspectId = aspectId;

    if (this.stepsToScaleValue) {
      scaleVnfInfoRequest.numberOfSteps = this.stepsToScaleValue;
    }

    const queryParams = scaleVnfInfoRequest;

    try {
      const response = await fetchScaleInfo({ resourceId: this.resourceId, params: queryParams });

      this.confirmScaleData = response;
      this.confirmResourceScale = true;
    } catch (error) {
      console.error("Error when fetching scale info: ", error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Post scale request
   *
   * @returns {Promise<void>}
   */
  async _postScaleResource() {
    const scaleVnfRequest = {};
    const { aspectId } = this.comboValueObj;

    scaleVnfRequest.type = this.scaleTypeSelected;
    scaleVnfRequest.aspectId = aspectId;

    if (this.stepsToScaleValue) {
      scaleVnfRequest.numberOfSteps = this.stepsToScaleValue;
    }

    scaleVnfRequest.additionalParams = removeEmptyOrNullParams({}, this.additionalAttributes);

    if (!isEmptyString(this.applicationTimeOut)) {
      scaleVnfRequest.additionalParams.applicationTimeOut = this.applicationTimeOut;
    }
    scaleVnfRequest.additionalParams.helmNoHooks = this.helmNoHooks;

    try {
      await postScaleResource({ data: scaleVnfRequest, resourceId: this.resourceId });

      showNotification(
        `${SCALE_STARTED_NOTIFICATION}`,
        `${OPERATION_STARTED_MESSAGE}`,
        false,
        5000,
        "operations"
      );
    } catch (error) {
      console.error("Error when clean up resource: ", error);
    } finally {
      this.isLoading = false;
    }
  }

  handleEvent(event) {
    switch (event.target.id) {
      case "aspectId-combo-box":
        this.validateDropDownBoxValue(event);
        break;
      case "steps-to-scale":
        this.stepsToScaleValue = event.target.getValue();
        this.validateStepsToScale();
        break;
      case "applicationTimeOut":
        this.applicationTimeOut = event.target.getValue();
        this.validAppTimeout = this._validateTimeout(this.applicationTimeOut, "applicationTimeOut");
        break;
      case "cancel-scale-confirmation":
        this.confirmResourceScale = false;
        break;
      case "scale-confirmation":
        this.handleScaleClick();
        break;
      case "helmNoHooks":
        this.helmNoHooks = event.target.checked;
        break;
      default:
        console.log(`Unexpected event [${event.target.id}] is received.`);
    }
  }

  validateDropDownBoxValue(event) {
    const { value } = event.target;
    const dropDownValueExists = this.data.filter(obj => obj.value === value);

    if (Array.isArray(dropDownValueExists) && dropDownValueExists.length !== 0) {
      this.comboValue = value;
      this.comboValueObj = dropDownValueExists[0] || {};
      this.validScaleAspect = true;
      this.validateStepsToScale();
    } else {
      this.comboValue = "";
      this.comboValueObj = {};
      this.validScaleAspect = false;
    }
  }

  _validateTimeout(timeOut, id) {
    const field = `.${id}.invalidTimeout`;
    const invalidTimeoutSelector = this.shadowRoot.querySelector(field);

    if (timeOut.length === 0 || isValidTimeoutRange(timeOut)) {
      invalidTimeoutSelector.style.display = "none";
      this.validTimeout = true;
      return true;
    }
    invalidTimeoutSelector.style.display = "block";
    this.validTimeout = false;
    return false;
  }

  validateStepsToScale() {
    if (this.stepsToScaleValue === null || this.stepsToScaleValue === "") {
      this.setErrorMessageAndDisplay("", true, "none");
      this.showWarning = this.comboValue !== null;
      this.stepsToScaleValue = 1;
    }

    let errorMessage = "";

    if (this.comboValue === null || this.comboValue === "") {
      this.showWarning = false;
      errorMessage = "Scaling aspect is required";
    } else if (
      this.scaleTypeSelected === "SCALE_OUT" &&
      this._getCurrentScaleLevels() === this._getMaxScaleLevel()
    ) {
      errorMessage =
        "Cannot scale out resource as current scale level is already at its maximum limit";
    } else if (this.scaleTypeSelected === "SCALE_IN" && this._getCurrentScaleLevels() === 0) {
      errorMessage =
        "Cannot scale in resource as current scale level is already at its minimum limit";
    }
    if (errorMessage !== "") {
      this.showWarning = false;
      this.setErrorMessageAndDisplay(errorMessage, false, "block");
      return;
    }

    const num = parseInt(this.stepsToScaleValue, 10);

    if (this.stepsToScaleValue === "0") {
      errorMessage = "Steps to scale cannot be 0";
    } else if (Number.isNaN(num) || num < 1) {
      errorMessage = "Steps to scale is not a valid positive number, please enter a valid number";
    }
    if (errorMessage !== "") {
      this.setErrorMessageAndDisplay(errorMessage, false, "block");
      this.showWarning = false;
      return;
    }

    const compareValue = {};

    if (this.scaleTypeSelected === "SCALE_OUT") {
      compareValue.max = this._getMaxScaleLevel();
      compareValue.min = this._getCurrentScaleLevels();
      if (compareValue.min + num > compareValue.max) {
        errorMessage = `Steps to scale must be less than or equal to ${this._getMaxScaleLevel() -
          this._getCurrentScaleLevels()}`;
      }
    } else {
      compareValue.min = 0;
      compareValue.max = this._getCurrentScaleLevels();
      if (!(compareValue.min <= compareValue.max - num)) {
        errorMessage = `Steps to scale must be less than or equal to ${compareValue.max}`;
      }
    }

    if (errorMessage === "") {
      const scaleInputEl = querySelectorDeep("eui-base-v0-text-field#steps-to-scale") || {};

      this.showWarning = scaleInputEl.value === "";
      this.setErrorMessageAndDisplay("", true, "none");
    } else {
      this.setErrorMessageAndDisplay(errorMessage, false, "block");
      this.showWarning = false;
    }
  }

  setErrorMessageAndDisplay(message, invalidSteps, display) {
    const invalidScaleStepsSelector = this.shadowRoot.querySelector(".invalidScaleSteps");

    this.errorMessage = message;
    this.invalidSteps = invalidSteps;
    invalidScaleStepsSelector.style.display = display;
  }

  handleScaleClick() {
    const details = { resourceId: this.resourceId, scaleAttributes: {} };

    this._postScaleResource(details);
    this.confirmResourceScale = false;
    window.EUI.Router.goto(`resources`);
  }

  renderConfirmationDialog() {
    return html`
      <eui-base-v0-dialog label="Confirm Scale" no-cancel="true" show="true">
        <div slot="content" class="no-scroll">
          ${this._generateDialogContents()}
          <div slot="content" class="confirm-scale-footer">Do you want to continue?</div>
        </div>
        <eui-base-v0-button slot="bottom" id="cancel-scale-confirmation" @click=${this.handleEvent}
          >Cancel</eui-base-v0-button
        >
        <eui-base-v0-button
          slot="bottom"
          id="scale-confirmation"
          primary="true"
          @click=${this.handleEvent}
          >Scale</eui-base-v0-button
        >
      </eui-base-v0-dialog>
    `;
  }

  _generateDialogContents() {
    return html`
      <div class="scale-confirm-dialog-holder">
        <p>${this._createScaleInfoWithTable(this.confirmScaleData)}</p>
      </div>
    `;
  }

  _createScaleInfoWithTable(confirmScaleData) {
    this.scaleConfirmationCols = [
      { title: "VNFC name", attribute: "vnfcName" },
      { title: "Current Replica Count", attribute: "currentCount", width: "25%" },
      { title: "Expected Replica Count", attribute: "expectedCount", width: "25%" }
    ];
    const scaleConfirmationTableData = [];
    confirmScaleData.forEach(scaleInformation => {
      const scaleInformationObject = {};
      scaleInformationObject.vnfcName = scaleInformation.vnfcName;
      scaleInformationObject.currentCount = scaleInformation.currentReplicaCount;
      scaleInformationObject.expectedCount = scaleInformation.expectedReplicaCount;
      scaleConfirmationTableData.push(scaleInformationObject);
    });

    return html`
      <div class="scaleConfirmationTableParent">
        <e-generic-table
          id="scale-information-table"
          compact
          dashed
          tiny
          fixed
          .columns=${this.scaleConfirmationCols}
          .data=${scaleConfirmationTableData}
          fixed-height="200"
        >
        </e-generic-table>
      </div>
    `;
  }

  _createScaleTypeRadioButtons() {
    return html`
      <div class="scale-type-radio-holder">
        <div class="content">
          ${this._generateFileOrFieldsRadioButtons("scale-type", "scale out", this.scaleType)}
        </div>
      </div>
    `;
  }

  _generateFileOrFieldsRadioButtons(name, value, radioTypes) {
    const radioComponents = [];

    radioTypes.forEach(option => {
      const id = option.replace(/\s+/g, "-").toLowerCase();
      radioComponents.push(html`
        <eui-base-v0-radio-button
          class="radio"
          name=${`${name}-${id}`}
          @change=${this.setScaleType.bind(this)}
          group=${name}
          id=${`${name}-${id}`}
          ?checked=${value === option}
          >${option}</eui-base-v0-radio-button
        >
      `);
    });

    return radioComponents;
  }

  _createComboDropdownBox() {
    if (!(Array.isArray(this.data) && this.data.length !== 0)) {
      if (Object.keys(this.scaleInfo).length !== 0) {
        this.data = this.convertToValues();
        this.aspectIds = [...this.data];
      }
    }

    return html`
      <div class="scale-type-combo-holder">
        <div class="content">
          ${this._generateComboBox()}
        </div>
      </div>
    `;
  }

  convertToValues() {
    const result = [];
    const keys = Object.keys(this.scaleInfo);

    keys.forEach(item => {
      if (this.scaleInfo[item].enabled !== false) {
        const { name = "" } = this.scaleInfo[item];
        const aspectName = name[0].toUpperCase() + name.slice(1);

        result.push({
          value: `${aspectName} (${item})`,
          aspectId: item,
          aspectName: name
        });
      }
    });

    return result;
  }

  _createScaleLevels() {
    const scaleLevels = [];

    this.scalingLevels.forEach(option => {
      scaleLevels.push(html`
          <p class="scaling-level-values">
            ${option} level
          <span class=scale-value>
          ${this.comboValue === "" ? "" : this._getScaleLevels(option)}
          </span>
        </div>
      `);
    });

    return scaleLevels;
  }

  _getScaleLevels(option) {
    let value = 0;

    if (option === "Current") {
      value = this._getCurrentScaleLevels();
    } else if (option === "Maximum") {
      value = this._getMaxScaleLevel();
    }

    return value;
  }

  _getCurrentScaleLevels() {
    if (Array.isArray(this.scaleStatus) && this.scaleStatus.length !== 0) {
      const { aspectId } = this.comboValueObj;
      const currentScaleLevel = this.scaleStatus.filter(x => x.aspectId === aspectId);

      if (currentScaleLevel.length > 0) {
        return currentScaleLevel[0].scaleLevel;
      }
    }

    return 0;
  }

  _getMaxScaleLevel() {
    if (this.comboValue === "") {
      return 0;
    }

    if (Object.keys(this.scaleInfo).length !== 0) {
      const { aspectId } = this.comboValueObj;
      const maxScaleLevel = this.scaleInfo[aspectId];

      return maxScaleLevel.max_scale_level;
    }

    return 0;
  }

  _generateComboBox() {
    return html`
      <eui-base-v0-combo-box
        class="combo-box"
        .data=${this.aspectIds}
        id="aspectId-combo-box"
        @click=${this}
        @change=${this}
      ></eui-base-v0-combo-box>
    `;
  }

  _createStepsToScale() {
    const textFieldOptions = [];
    const textField = "Steps to scale";
    const id = textField.replace(/\s+/g, "-").toLowerCase();

    textFieldOptions.push(html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${textField}
        </div>
        <div class="divTableCell">
          ${this._generateTextField(id)}
          <small
            ><span class="errorMessage ${id} invalidScaleSteps"
              ><p>${this.errorMessage}</p></span
            ></small
          >
        </div>
      </div>
    `);
    return textFieldOptions;
  }

  _generateTextField(id) {
    return html`
      <div class="scaling-${id}-textField-fieldValue">
      <e-generic-text-field
          class="step_scale"
          id=${id}
          placeholder=" "
          @input=${event => this.handleEvent(event)}
          value=1
        ></<e-generic-text-field>
      </div>
    `;
  }

  _createTimeouts() {
    const timeouts = [];

    timeouts.push(
      this._createTextField(APPLICATION_TIMEOUT, "applicationTimeOut", this.applicationTimeOut)
    );
    return timeouts;
  }

  _createTextField(label, name, value) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">
          ${label}
        </div>
        <div class="divTableCell">
          <e-generic-text-field
            placeholder=${label}
            name=${name}
            id=${name}
            @input=${event => this.handleEvent(event)}
            value=${value}
          >
          </e-generic-text-field>

          <small
            ><span class="errorMessage ${name} invalidTimeout"
              >${INVALID_TIMEOUT_ERR_MSG}</span
            ></small
          >
        </div>
      </div>
    `;
  }

  _createHelmNoHooksCheckBox(value) {
    return html`
      <div class="divTableRow">
        <div class="divTableCell">Helm hooks</div>
        <div class="divTableCell">
          <eui-base-v0-checkbox
            name="helmNoHooks"
            id="helmNoHooks"
            .checked=${value}
            @change=${event => this.handleEvent(event)}
          >
            ${HELM_NO_HOOKS}
          </eui-base-v0-checkbox>
        </div>
      </div>
    `;
  }

  _generateButtons() {
    const submitLabel = this.isLoading ? "Preparing..." : "Scale";

    return html`
      <div class="scale-form-footer">
        <div class="divTableRow">
          <eui-base-v0-button @click="${this.returnToResources}">Cancel</eui-base-v0-button>
          <eui-base-v0-button
            class="scale-perform-button"
            primary="true"
            ?disabled=${this._ScaleDisabled()}
            @click=${this._fetchScaleInfo}
            >${submitLabel}</eui-base-v0-button
          >
        </div>
      </div>
    `;
  }

  _ScaleDisabled() {
    return !(this.validScaleAspect && this.invalidSteps && this.validAppTimeout) || this.isLoading;
  }

  setScaleType(event) {
    const { value } = event.detail;

    if (value === "scale in" || value === "scale out") {
      this.scaleTypeSelected = value.toUpperCase().replace(" ", "_");
      if (this.validScaleAspect) {
        this.validateStepsToScale();
      }
    }
  }

  returnToResources() {
    window.history.back();
  }

  _renderDynamicScaleLevelWarning() {
    const template = html`
      <div class="mb-10">
        <eui-v0-icon name="triangle-warning" color="#d97833"></eui-v0-icon>
        <span>For empty steps to scale default value will be applied: 1</span>
      </div>
    `;

    return this.showWarning ? template : null;
  }

  _renderScaleResourcePanel() {
    return html`
      <eui-layout-v0-tile tile-title="Scale ${this.vnfInstanceName}">
        <div slot="content">
          ${this._renderDynamicScaleLevelWarning()}
          <div class="divTableBody">
            <div class="divTableRow">
              <div class="divTableCell">
                <p>Scale type</p>
              </div>
              <div class="divTableCell">
                <div class="scale-type-radio-buttons">${this._createScaleTypeRadioButtons()}</div>
              </div>
            </div>
            <div class="divTableRow">
              <div class="divTableCell">
                <p>Scaling aspect *</p>
              </div>
              <div class="divTableCell">
                <div class="scale-type-combo">${this._createComboDropdownBox()}</div>
              </div>
            </div>
            <div class="divTableRow">
              <div class="divTableCell">
                <p class="scaling-level">Scale level</p>
              </div>
              ${this._createScaleLevels()}
            </div>
            ${this._createStepsToScale()} ${this._createTimeouts()}
            ${this._createHelmNoHooksCheckBox(this.helmNoHooks)} ${this._generateButtons()}
          </div>
        </div>
      </eui-layout-v0-tile>
    `;
  }

  /**
   * Render the <e-scale-resource-panel> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      ${this.isValidPermission ? this._renderScaleResourcePanel() : accessDenied()}
      ${this.confirmResourceScale ? this.renderConfirmationDialog() : ``}
    `;
  }
}
/**
 * Register the component as e-scale-resource-panel.
 * Registration can be done at a later time and with a different name
 */
ScaleResourcePanel.register();
