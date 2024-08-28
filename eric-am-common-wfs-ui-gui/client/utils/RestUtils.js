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
import Axios from "axios";
import { isEmpty, showNotification } from "./CommonUtils";
import {
  COMPONENTS_FETCH_FAILED,
  FAILED_DELETE_PACKAGE,
  FAILED_PACKAGE_ONBOARD,
  FORBIDDEN_ERROR_DESCRIPTION_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  GENERIC_ERROR_DESCRIPTION_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  INSTANTIATE_FAILED,
  UPGRADE_FAILED,
  TERMINATION_FAILED,
  RESOURCES_FETCH_FAILED,
  OPERATIONS_FETCH_FAILED,
  CLUSTERS_FETCH_FAILED,
  CLUSTER_REGISTER_FAILED,
  CLUSTER_DEREGISTER_FAILED,
  PACKAGES_FETCH_FAILED,
  SCALE_FAILED,
  VNF_IDENTIFIER_FAILED,
  ROLLBACK,
  FAILED_FETCH_BACKUP_INFO,
  FAILED_CREATE_BACKUP,
  FAILED_DELETE_BACKUP
} from "../constants/Messages";
import { DialogModel } from "../components/generic-dialog/src/DialogModel";

// Orchestration Service
const ORCHESTRATION_BASE = "/vnflcm/v1";
const ORCHESTRATION_BASE_INTERNAL = "/vnfm/container/api/v1";

// Location Origin
const LOCATION_ORIGIN = window.location.origin;

// ETSI Endpoints
// Vnf Instances
export const VNF_IDENTIFIER = `${ORCHESTRATION_BASE}/vnf_instances`;
export const INSTANTIATE_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/instantiate`;
export const UPGRADE_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/change_vnfpkg`;
export const SYNC_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/sync`;
export const SCALE_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/scale`;
export const ADD_NODE_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/addNode`;
export const HEAL_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/heal`;
export const CLEAN_UP_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/cleanup`;
export const DELETE_NODE_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/deleteNode`;
export const BACKUPS_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/backups`;
export const DELETE_BACKUP_URL = `${VNF_IDENTIFIER}/:vnfInstanceId/backups/:backupName/:scope`;
export const MODIFY_VNF_INFO_URL = `${VNF_IDENTIFIER}/:vnfInstanceId`;
// Lifecycle Operations
export const LCM_OPERATIONS_URL = `${ORCHESTRATION_BASE}/vnf_lcm_op_occs`;
export const LCM_OPERATION_URL = `${LCM_OPERATIONS_URL}/:vnfLcmOpOccId`;
export const FAIL_OPERATION_URL = `${ORCHESTRATION_BASE}/vnf_lcm_op_occs/:vnfLcmOpOccId/fail`;

// Internal Endpoints
// Resources
export const RESOURCES_URL = `${ORCHESTRATION_BASE_INTERNAL}/resources`;
export const RESOURCE_URL = `${RESOURCES_URL}/:vnfInstanceId`;
export const RESOURCE_COMPONENTS_URL = `${RESOURCES_URL}/:vnfInstanceId/pods`;
export const ROLLBACK_INFORMATION_URL = `${RESOURCES_URL}/:resourceId/rollbackInfo`;
export const SCALE_INFO_URL = `${RESOURCES_URL}/:vnfInstanceId/vnfcScaleInfo`;
export const ROLLBACK_RESOURCE_INFORMATION_URL = `${RESOURCES_URL}/:resourceId/downgradeInfo`;
// Operations
export const OPERATIONS_URL = `${ORCHESTRATION_BASE_INTERNAL}/operations`;
// Validate Namespace/Cluster
export const VALIDATE_NAMESPACE_URL = `${ORCHESTRATION_BASE}/validateNamespace/:clusterNameAndNamespace`;

// User Management UI Service
export const USER_ADMINISTRATION_URL = `${LOCATION_ORIGIN}/idm/usermgmt-ui/`;

// Onboarding service
const ONBOARDING_BASE = "/vnfm/onboarding";
export const PACKAGE_URL = `${ONBOARDING_BASE}/api/v2/packages/:packageId`;
export const PACKAGES_URL = `${ONBOARDING_BASE}/api/v2/packages`;
export const PACKAGES_ETSI_URL = `${ONBOARDING_BASE}/api/vnfpkgm/v1/vnf_packages`;
export const PACKAGE_INFORMATION_URL = `${ONBOARDING_BASE}/api/vnfpkgm/v1/vnf_packages/:packageId`;

// Filtering
export const PACKAGE_FILTER_URL = "/vnfm/onboarding/api/v1/filters/packages";
export const OPERATIONS_FILTER_URL = `${ORCHESTRATION_BASE}/filters/vnf_lcm_op_occs`;

// Content Types
export const CONTENT_TYPE_JSON_HEADER = { "content-type": "application/json" };
export const CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER = { "content-type": "multipart/form-data" };
export const CONTENT_TYPE_OCTET_STREAM_HEADER = { "Content-Type": "application/octet-stream" };

export function executeSimpleGetRequest(
  url,
  successCallback,
  errorCallback = () => {},
  queryParameters
) {
  const queryParametersJson = {};
  if (!isEmpty(queryParameters)) {
    queryParametersJson.params = queryParameters;
  }
  Axios.get(url, queryParametersJson)
    .then(response => successCallback(response, url))
    .catch(error => errorCallback(error, url));
}

export function executeSimplePostRequest(
  url,
  body,
  headersParams,
  successCallback = () => {},
  errorCallback = () => {}
) {
  Axios.post(url, body, { headers: headersParams })
    .then(response => successCallback(response))
    .catch(error => errorCallback(error));
}

export function executeSimplePostRequestNoBody(url, headersParams, successCallback, errorCallback) {
  Axios.post(url, { headers: headersParams })
    .then(response => successCallback(response))
    .catch(error => errorCallback(error));
}

export async function executePutRequest(url, body, config, successCallback, errorCallback) {
  await Axios.put(url, body, config)
    .then(response => successCallback(response))
    .catch(error => errorCallback(error));
}

export function executeSimpleDeleteRequest(url, headersParams, successCallback, errorCallback) {
  Axios.delete(url, { headers: headersParams })
    .then(response => successCallback(response))
    .catch(error => errorCallback(error));
}

export function executeSimplePatchRequest(
  url,
  body,
  headersParams,
  successCallback,
  errorCallback
) {
  Axios.patch(url, body, { headers: headersParams })
    .then(response => successCallback(response))
    .catch(error => errorCallback(error));
}

export function getQueryParam(url, parameterName) {
  let queryParameter = {};
  if (url.includes("?")) {
    let queryParamList;
    if (url.includes("&")) {
      queryParamList = url.split("?")[1].split("&");
    } else {
      queryParamList = url.split("?");
    }
    queryParamList.forEach(param => {
      const paramList = param.split("=");
      if (paramList[0] === parameterName) {
        queryParameter = {
          parameter: param,
          parameterValue: paramList[1]
        };
      }
    });
  }
  return queryParameter;
}

export function stripQueryParam(url, queryToStrip) {
  const queryParam = getQueryParam(url, queryToStrip);
  if (url.includes(`${queryParam.parameter}&`)) {
    return url.replace(`${queryParam.parameter}&`, "");
  }
  return url.replace(queryParam.parameter, "").slice(0, -1);
}

export function getCancelToken() {
  return Axios.CancelToken;
}

export function isCancel(error) {
  return Axios.isCancel(error);
}

function _isAddOrDeleteNodeOperation(url) {
  return url.includes("addNode") || url.includes("deleteNode");
}

function _isLCMOperation(url) {
  return url.includes(VNF_IDENTIFIER);
}

function _isBackupGetOrDelete(response) {
  const { url } = response.config;
  const { method } = response.config;
  return (
    url.includes(VNF_IDENTIFIER) &&
    url.includes("backups") &&
    (method === "get" || method === "delete")
  );
}

function _isGetPodsOperation(url, method) {
  return url.includes(RESOURCES_URL) && url.includes("pods") && method === "get";
}

function _isValidateNamespaceOperation(url, method) {
  return url.includes("validateNamespace") && method === "get";
}

function _isGetDowngradeInfoOperation(url) {
  return url.includes(RESOURCES_URL) && url.includes("downgradeInfo");
}

function _getVnfIdentifierTitle(url, method) {
  if (url.includes("change_vnfpkg")) {
    return UPGRADE_FAILED;
  }
  if (url.includes("terminate")) {
    return TERMINATION_FAILED;
  }
  if (url.includes("instantiate")) {
    return INSTANTIATE_FAILED;
  }
  if (url.includes("scale")) {
    return SCALE_FAILED;
  }
  if (method === "delete") {
    return VNF_IDENTIFIER_FAILED;
  }
  return GENERIC_ERROR_MESSAGE;
}

function _getPackageTitle(url, method) {
  if (url.includes("package_content") && method === "put") {
    return FAILED_PACKAGE_ONBOARD;
  }
  if (method === "post") {
    return FAILED_PACKAGE_ONBOARD;
  }
  if (method === "delete") {
    return FAILED_DELETE_PACKAGE;
  }
  return GENERIC_ERROR_MESSAGE;
}

function _getBackupTitle(method) {
  if (method === "get") {
    return FAILED_FETCH_BACKUP_INFO;
  }
  if (method === "post") {
    return FAILED_CREATE_BACKUP;
  }
  if (method === "delete") {
    return FAILED_DELETE_BACKUP;
  }
  return GENERIC_ERROR_MESSAGE;
}

function _getClusterTitle(method) {
  if (method === "get") {
    return CLUSTERS_FETCH_FAILED;
  }
  if (method === "post") {
    return CLUSTER_REGISTER_FAILED;
  }
  if (method === "delete") {
    return CLUSTER_DEREGISTER_FAILED;
  }
  return GENERIC_ERROR_MESSAGE;
}

export function _getRequestTitleFromFailedURI(response) {
  const { url } = response.config;
  const { method } = response.config;
  if (url.includes(PACKAGES_URL) && method === "get") {
    return PACKAGES_FETCH_FAILED;
  }
  if (_isGetPodsOperation(url, method)) {
    return COMPONENTS_FETCH_FAILED;
  }
  if (url.includes("downgradeInfo") && method === "get") {
    return ROLLBACK;
  }
  if (url.includes("scopes") || url.includes("backups")) {
    return _getBackupTitle(method);
  }
  if (url.includes(RESOURCES_URL) && method === "get") {
    return RESOURCES_FETCH_FAILED;
  }
  if (url.includes(LCM_OPERATIONS_URL) && url.includes(OPERATIONS_URL) && method === "get") {
    return OPERATIONS_FETCH_FAILED;
  }
  if (url.includes("/clusterconfigs")) {
    return _getClusterTitle(method);
  }
  if (_isLCMOperation(url)) {
    return _getVnfIdentifierTitle(url, method);
  }
  if (url.includes(PACKAGES_ETSI_URL)) {
    return _getPackageTitle(url, method);
  }

  return GENERIC_ERROR_MESSAGE;
}

export function getErrorMessage(response) {
  if (response) {
    const title = _getRequestTitleFromFailedURI(response);
    if (response.data && !response.data.title && response.data.message) {
      return { title, description: response.data.message };
    }
    if (response.data && response.data.title && response.data.detail) {
      return { title, description: response.data.detail };
    }
    if (response.data && response.data.errorDetails && response.data.errorDetails.length > 0) {
      const descriptions = [];
      response.data.errorDetails.forEach(item => {
        if (item.message) {
          descriptions.push(item.message);
        }
      });
      return { title, description: descriptions.join(", ") };
    }
    const message = response.data.message ? response.data.message : response.statusText;
    return { title, description: message };
  }
  return { title: GENERIC_ERROR_MESSAGE, description: GENERIC_ERROR_DESCRIPTION_MESSAGE };
}

function _showDialog(label, content) {
  const dialog = new DialogModel(label, content);
  dialog.setButtonLabels(["Ok"]);
  dialog.setWarningButtonIndex(1);
  const component = document.createElement("e-generic-dialog");
  component.handleClick = () => {
    document.body.removeChild(component);
  };
  component.style.color = "var(--text, rgb(36,36, 36))";
  component.dialogModel = dialog;
  document.body.appendChild(component);
}

function _handleErrorInAxiosInterceptor(error) {
  // don't notify for some failed /vnflcm/v1/resources/<id>/pods requests
  const { url } = error.response.config;
  if (
    error.response &&
    _isGetPodsOperation(url, error.response.config.method) &&
    (error.response.status === 404 || error.response.status === 409)
  ) {
    return false;
  }
  if (error.response && _isValidateNamespaceOperation(url, error.response.config.method)) {
    return false;
  }
  if (_isGetDowngradeInfoOperation(url)) {
    return false;
  }
  // ignore upgrade lcm because we want to differentiate between Rollback and Upgrade
  if (url.includes(VNF_IDENTIFIER) && url.includes("change_vnfpkg")) {
    return false;
  }
  return true;
}

Axios.interceptors.response.use(
  response => {
    const { data = "" } = response || {};

    // if token expired, do redirect to login page
    if (String(data).includes("IDENTITY AND ACCESS MANAGEMENT")) {
      location.reload(); // eslint-disable-line
    }

    return response;
  },
  error => {
    if (!error.response && Axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!_handleErrorInAxiosInterceptor(error)) {
      return Promise.reject(error);
    }

    const message = getErrorMessage(error.response);

    if (error.response.status === 403) {
      showNotification(FORBIDDEN_ERROR_MESSAGE, FORBIDDEN_ERROR_DESCRIPTION_MESSAGE, true);
    } else if (_isAddOrDeleteNodeOperation(error.response.config.url)) {
      showNotification(message.title, message.description, true, 0);
    } else if (_isBackupGetOrDelete(error.response)) {
      showNotification(message.title, message.description, true);
    } else if (_isLCMOperation(error.response.config.url)) {
      _showDialog(message.title, message.description);
    } else {
      showNotification(message.title, message.description, true);
    }

    return Promise.reject(error);
  }
);

/**
 * Transforms object to form data
 *
 * @param {object} data
 * @returns {FormData}
 */
export function dataToFormParams(data) {
  const params = new FormData();

  Object.entries(data).forEach(([key, value]) => params.append(key, value));

  return params;
}
