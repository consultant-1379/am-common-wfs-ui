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
import { App, html } from "@eui/app";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";

// components
import "../../../components/resource-rollback-panel/src/ResourceRollbackPanel";
import "../../../components/unavailable-page-component/src/UnavailablePageComponent";

// styles
import style from "./resourceRollback.css";

// helpers
import { getQueryParam, getErrorMessage } from "../../../utils/RestUtils";
import { postChangeResource } from "../../../api/orchestrator";
import {
  ROLLBACK_OPERATION_RESOURCE_NAME,
  RESOURCE_PARAM_NAME
} from "../../../constants/GenericConstants";
import {
  accessDenied,
  showNotification,
  checkPermissions,
  removeEmptyOrNullParams,
  renderErrorDialog
} from "../../../utils/CommonUtils";

import { UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT, ROLLBACK_EVENT } from "../../../constants/Events";
import {
  ROLLBACK_STARTED_NOTIFICATION,
  OPERATION_STARTED_MESSAGE,
  ROLLBACK_FAILED,
  ROLLBACK
} from "../../../constants/Messages";
import { fetchDowngradeInfo, fetchResource } from "../../../api/internal";

/**
 * ResourceRollback is defined as
 * `<e-resource-rollback>`
 *
 * Imperatively create application
 * @example
 * let app = new ResourceRollback();
 *
 * Declaratively create application
 * @example
 * <e-resource-rollback></e-resource-rollback>
 *
 * @extends {App}
 */
@definition("e-resource-rollback", {
  style,
  props: {
    resourceId: { attribute: false, type: "string", default: "" },
    data: { attribute: false, type: "object", default: {} },
    additionalAttributes: { attribute: false, type: "object", default: {} },
    showRollbackNotSupportedDialog: { attribute: false, type: "boolean", default: false },
    showRollbackErrorDialog: { attribute: false, type: "boolean", default: false }
  }
})
export default class ResourceRollback extends App {
  constructor() {
    super();

    this.addQuerySelectors();

    this._fetchDowngradeInfo = this._fetchDowngradeInfo.bind(this);
    this._postChangeResource = this._postChangeResource.bind(this);
  }

  componentDidConnect() {
    const url = window.location.href;

    this.resourceId = getQueryParam(url, RESOURCE_PARAM_NAME).parameterValue;

    checkPermissions.call(this, () => {}, ROLLBACK_OPERATION_RESOURCE_NAME);
    this.appConfiguration = this.storeConnect("appConfiguration").appConfiguration;

    const { availability = {} } = this.appConfiguration;

    this.isPageAvailable = availability.packages;

    if (this.isPageAvailable) {
      this._fetchDowngradeInfo(this.resourceId);
    }
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);

    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      checkPermissions.call(this, () => {}, ROLLBACK_OPERATION_RESOURCE_NAME);
    }
  }

  /**
   * Fetch downgrade info
   *
   * @returns {Promise<void>}
   */
  async _fetchDowngradeInfo(resourceId) {
    this.showRollbackNotSupportedDialog = false;

    try {
      const response = await fetchDowngradeInfo({ resourceId });

      const sourceInfo = response.sourceDowngradePackageInfo;
      const targetInfo = response.targetDowngradePackageInfo;
      const { additionalParameters } = response;
      const rollback = {};

      rollback.sourceDowngradePackageInfo = sourceInfo;
      rollback.targetDowngradePackageInfo = targetInfo;
      rollback.additionalParameters = additionalParameters;

      this.data.rollback = rollback;

      const responseResource = await fetchResource({ resourceId });

      this.data = { ...this.data, ...responseResource };
    } catch (error) {
      this.downgradeData = null;
      this.rollbackErrorLabel = ROLLBACK;

      const errorData = getErrorMessage(error.response);

      this.rollbackErrorMessage = errorData.description;
      this.showRollbackNotSupportedDialog = true;

      console.error("Error when fetching downgrade info: ", error);
    }
  }

  /**
   * Post change resource request
   *
   * @returns {Promise<void>}
   */
  async _postChangeResource() {
    this.showRollbackErrorDialog = false;

    const { instanceId: resourceId } = this.data;
    const { vnfdId } = this.data.rollback.targetDowngradePackageInfo;
    const data = {
      vnfdId,
      additionalParams: this.additionalParams
    };

    try {
      await postChangeResource({ data, resourceId });

      this.data = null;
      showNotification(
        ROLLBACK_STARTED_NOTIFICATION,
        OPERATION_STARTED_MESSAGE,
        false,
        5000,
        "operations"
      );
      window.EUI.Router.goto(`resources`);
    } catch (error) {
      const errorData = getErrorMessage(error.response);

      this.rollbackErrorLabel = ROLLBACK_FAILED;
      this.rollbackErrorMessage = errorData.description;
      this.showRollbackErrorDialog = true;

      console.error("Error when clean up resource: ", error);
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

  onPause() {
    super.onPause();

    this.data = {};
    this.additionalAttributes = {};
    this.additionalParams = {};
    this.showRollbackErrorDialog = false;
  }

  handleEvent(event) {
    switch (event.type) {
      case UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT:
        this.additionalParams = {
          ...removeEmptyOrNullParams(this.additionalAttributes, event.detail)
        };
        break;
      case ROLLBACK_EVENT:
        this._postChangeResource();
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _renderUnavailablePage() {
    return html`
      <e-unavailable-page-component title="Resource Rollback is not available">
      </e-unavailable-page-component>
    `;
  }

  _renderResourceRollbackPanel() {
    if (this.isValidPermission) {
      return html`
        <e-resource-rollback-panel
          @rollback=${this}
          @update-additional-attributes-data=${this}
          .additionalAttributes=${this.additionalAttributes}
          .data=${this.data}
        >
        </e-resource-rollback-panel>
      `;
    }
    return accessDenied();
  }

  _handleRollbackNotSupported() {
    this.showRollbackNotSupportedDialog = false;
    window.EUI.Router.goto(`resources`);
  }

  render() {
    return html`
      ${this.isPageAvailable ? this._renderResourceRollbackPanel() : this._renderUnavailablePage()}
      ${this.showRollbackNotSupportedDialog
        ? renderErrorDialog(
            this.rollbackErrorLabel,
            this.rollbackErrorMessage,
            this._handleRollbackNotSupported
          )
        : html``}
      ${this.showRollbackErrorDialog
        ? renderErrorDialog(this.rollbackErrorLabel, this.rollbackErrorMessage, () => {
            this.showRollbackErrorDialog = false;
          })
        : html``}
    `;
  }
}

/**
 * Register the component as e-resource-rollback.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// ResourceRollback.register();
