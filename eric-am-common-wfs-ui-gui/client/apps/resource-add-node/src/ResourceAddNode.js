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
import "../../../components/resource-add-node-panel/src/ResourceAddNodePanel";

// styles
import style from "./resourceAddNode.css";

// helpers
import { fetchResource } from "../../../api/internal";
import { showNotification, checkPermissions } from "../../../utils/CommonUtils";
import { ADD_NODE_RESOURCE_NAME } from "../../../constants/GenericConstants";

/**
 * ResourceAddNode is defined as
 * `<e-resource-add-node>`
 *
 * Imperatively create application
 * @example
 * let app = new ResourceAddNode();
 *
 * Declaratively create application
 * @example
 * <e-resource-add-node></e-resource-add-node>
 *
 * @extends {App}
 */
@definition("e-resource-add-node", {
  style,
  home: "resource-add-node",
  props: {
    resourceId: { attribute: false, type: "string", default: [] },
    addNodeData: { attribute: false, type: "object", default: {} }
  }
})
export default class ResourceAddNode extends App {
  constructor() {
    super();
    this.addQuerySelectors();
    this.checkPermissions = checkPermissions.bind(this);

    this._fetchResource = this._fetchResource.bind(this);
  }

  componentDidConnect() {
    this.checkPermissions(this._enableCallback, ADD_NODE_RESOURCE_NAME);
  }

  componentDidReceiveProps(previous) {
    super.componentDidReceiveProps(previous);

    if (previous.state && previous.state.tokenId !== this.userInformation.tokenId) {
      this.checkPermissions(this._enableCallback, ADD_NODE_RESOURCE_NAME);
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

      this.addNodeData = response;
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

  /**
   * Render the <e-resource-add-node> app. This function is called each time a
   * prop changes.
   */
  render() {
    return html`
      <e-resource-add-node-panel
        @confirm-add-node-event=${this}
        .topologyAttributes=${this.addNodeData.instantiateOssTopology}
        .resourceId=${this.resourceId}
        .isValidPermission=${this.isValidPermission}
        .vnfInstanceName=${this.addNodeData.vnfInstanceName}
      ></e-resource-add-node-panel>
    `;
  }
}

/**
 * Register the component as e-resource-add-node.
 * Registration can be done at a later time and with a different name
 * Uncomment the below line to register the App if used outside the container
 */
// ResourceAddNode.register();
